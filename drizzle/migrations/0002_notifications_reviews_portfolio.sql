-- 1. NOTIFICATIONS -----------------------------------------------------
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'general',
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user ON public.notifications (user_id, created_at DESC);

GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON public.notifications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.notify_user(_user_id uuid, _kind text, _title text, _body text, _link text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _user_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.notifications (user_id, kind, title, body, link)
  VALUES (_user_id, _kind, _title, _body, _link);
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_admins(_kind text, _title text, _body text, _link text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, kind, title, body, link)
  SELECT ur.user_id, _kind, _title, _body, _link
  FROM public.user_roles ur
  JOIN public.profiles p ON p.id = ur.user_id
  WHERE ur.role = 'admin';
END;
$$;

-- new custom order -> notify admins
CREATE OR REPLACE FUNCTION public.on_custom_order_created()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.notify_admins('order', 'New commission request',
    NEW.full_name || ' submitted ' || NEW.order_number, '/admin/requests/' || NEW.id::text);
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_custom_order_created AFTER INSERT ON public.custom_orders
  FOR EACH ROW EXECUTE FUNCTION public.on_custom_order_created();

-- status / payment change -> notify client
CREATE OR REPLACE FUNCTION public.on_custom_order_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL AND (NEW.status IS DISTINCT FROM OLD.status
      OR NEW.payment_status IS DISTINCT FROM OLD.payment_status) THEN
    PERFORM public.notify_user(NEW.customer_id, 'order',
      'Update on ' || NEW.order_number,
      'Status: ' || replace(NEW.status::text, '_', ' ') || ' · Payment: ' || replace(NEW.payment_status::text, '_', ' '),
      '/track');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_custom_order_status_change AFTER UPDATE ON public.custom_orders
  FOR EACH ROW EXECUTE FUNCTION public.on_custom_order_status_change();

-- new message -> notify the other side
CREATE OR REPLACE FUNCTION public.on_custom_order_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cust uuid; _num text;
BEGIN
  SELECT customer_id, order_number INTO _cust, _num FROM public.custom_orders WHERE id = NEW.order_id;
  IF NEW.sender = 'admin' THEN
    PERFORM public.notify_user(_cust, 'message', 'Message from the atelier', left(NEW.body, 140), '/messages');
  ELSE
    PERFORM public.notify_admins('message', 'New client message on ' || COALESCE(_num, ''), left(NEW.body, 140),
      '/admin/requests/' || NEW.order_id::text);
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_custom_order_message AFTER INSERT ON public.custom_order_messages
  FOR EACH ROW EXECUTE FUNCTION public.on_custom_order_message();

-- appointment created / changed -> notify client
CREATE OR REPLACE FUNCTION public.on_appointment_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_user(NEW.customer_id, 'appointment', 'Appointment scheduled',
      initcap(NEW.type::text) || ' on ' || to_char(NEW.appointment_date, 'DD Mon YYYY') || ' at ' || NEW.time_slot,
      '/appointments');
    PERFORM public.notify_admins('appointment', 'New appointment booked',
      initcap(NEW.type::text) || ' on ' || to_char(NEW.appointment_date, 'DD Mon YYYY') || ' at ' || NEW.time_slot,
      '/appointments');
  ELSIF NEW.status IS DISTINCT FROM OLD.status OR NEW.appointment_date IS DISTINCT FROM OLD.appointment_date
      OR NEW.time_slot IS DISTINCT FROM OLD.time_slot THEN
    PERFORM public.notify_user(NEW.customer_id, 'appointment', 'Appointment updated',
      initcap(NEW.type::text) || ' on ' || to_char(NEW.appointment_date, 'DD Mon YYYY') || ' at ' || NEW.time_slot
      || ' · ' || NEW.status::text, '/appointments');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_appointment_change AFTER INSERT OR UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.on_appointment_change();

-- 2. REVIEWS ------------------------------------------------------------
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  location text,
  rating integer NOT NULL DEFAULT 5,
  body text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5)
);
CREATE INDEX idx_reviews_approved ON public.reviews (is_approved, created_at DESC);

GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved reviews" ON public.reviews
  FOR SELECT TO anon, authenticated USING (is_approved = true);
CREATE POLICY "Users read own reviews" ON public.reviews
  FOR SELECT TO authenticated USING (auth.uid() = customer_id);
CREATE POLICY "Admins read all reviews" ON public.reviews
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users write own review" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id AND is_approved = false);
CREATE POLICY "Admins manage reviews" ON public.reviews
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete reviews" ON public.reviews
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 3. PORTFOLIO ITEMS ----------------------------------------------------
CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text,
  summary text,
  description text,
  storage_path text NOT NULL,
  details jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_portfolio_published ON public.portfolio_items (is_published, sort_order);

GRANT SELECT ON public.portfolio_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT ALL ON public.portfolio_items TO service_role;

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published portfolio" ON public.portfolio_items
  FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admins view all portfolio" ON public.portfolio_items
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert portfolio" ON public.portfolio_items
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update portfolio" ON public.portfolio_items
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete portfolio" ON public.portfolio_items
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
