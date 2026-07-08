
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('customer', 'designer', 'admin');
CREATE TYPE public.order_status AS ENUM ('pending', 'accepted', 'in_progress', 'ready_for_fitting', 'completed', 'cancelled');
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled');
CREATE TYPE public.appointment_type AS ENUM ('consultation', 'fitting', 'delivery');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SIGNUP TRIGGER ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ DESIGNERS ============
CREATE TABLE public.designers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  headline TEXT,
  specialties TEXT[] DEFAULT '{}',
  years_experience INT DEFAULT 0,
  hourly_rate NUMERIC(10,2),
  rating NUMERIC(3,2) DEFAULT 5.0,
  portfolio_images TEXT[] DEFAULT '{}',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.designers TO anon;
GRANT SELECT, INSERT, UPDATE ON public.designers TO authenticated;
GRANT ALL ON public.designers TO service_role;
ALTER TABLE public.designers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved designers viewable by all"
  ON public.designers FOR SELECT USING (is_approved = true);
CREATE POLICY "Designer views own record"
  ON public.designers FOR SELECT TO authenticated USING (profile_id = auth.uid());
CREATE POLICY "Designer creates own record"
  ON public.designers FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Designer updates own record"
  ON public.designers FOR UPDATE TO authenticated USING (profile_id = auth.uid());
CREATE POLICY "Admins manage designers"
  ON public.designers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SERVICES ============
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  base_price NUMERIC(10,2),
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active services viewable by all"
  ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage services"
  ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ ORDERS ============
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  designer_id UUID REFERENCES public.designers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  notes TEXT,
  measurements JSONB DEFAULT '{}'::jsonb,
  budget NUMERIC(10,2),
  deadline DATE,
  status public.order_status NOT NULL DEFAULT 'pending',
  progress_percent INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customer views own orders"
  ON public.orders FOR SELECT TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Customer creates own orders"
  ON public.orders FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Customer updates own orders"
  ON public.orders FOR UPDATE TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Designer views assigned orders"
  ON public.orders FOR SELECT TO authenticated
  USING (designer_id IN (SELECT id FROM public.designers WHERE profile_id = auth.uid()));
CREATE POLICY "Designer updates assigned orders"
  ON public.orders FOR UPDATE TO authenticated
  USING (designer_id IN (SELECT id FROM public.designers WHERE profile_id = auth.uid()));
CREATE POLICY "Admins manage orders"
  ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ ORDER UPDATES ============
CREATE TABLE public.order_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  note TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_updates TO authenticated;
GRANT ALL ON public.order_updates TO service_role;
ALTER TABLE public.order_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants view updates"
  ON public.order_updates FOR SELECT TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.orders WHERE customer_id = auth.uid()
      UNION
      SELECT o.id FROM public.orders o JOIN public.designers d ON o.designer_id = d.id WHERE d.profile_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Order participants add updates"
  ON public.order_updates FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND (
      order_id IN (
        SELECT id FROM public.orders WHERE customer_id = auth.uid()
        UNION
        SELECT o.id FROM public.orders o JOIN public.designers d ON o.designer_id = d.id WHERE d.profile_id = auth.uid()
      ) OR public.has_role(auth.uid(), 'admin')
    )
  );

-- ============ APPOINTMENTS ============
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  designer_id UUID REFERENCES public.designers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  type public.appointment_type NOT NULL DEFAULT 'consultation',
  status public.appointment_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customer manages own appointments"
  ON public.appointments FOR ALL TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Designer views own appointments"
  ON public.appointments FOR SELECT TO authenticated
  USING (designer_id IN (SELECT id FROM public.designers WHERE profile_id = auth.uid()));
CREATE POLICY "Designer updates own appointments"
  ON public.appointments FOR UPDATE TO authenticated
  USING (designer_id IN (SELECT id FROM public.designers WHERE profile_id = auth.uid()));
CREATE POLICY "Admins manage appointments"
  ON public.appointments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ MESSAGES ============
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants read messages"
  ON public.messages FOR SELECT TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.orders WHERE customer_id = auth.uid()
      UNION
      SELECT o.id FROM public.orders o JOIN public.designers d ON o.designer_id = d.id WHERE d.profile_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Order participants send messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    order_id IN (
      SELECT id FROM public.orders WHERE customer_id = auth.uid()
      UNION
      SELECT o.id FROM public.orders o JOIN public.designers d ON o.designer_id = d.id WHERE d.profile_id = auth.uid()
    )
  );

-- ============ DESIGN UPLOADS ============
CREATE TABLE public.design_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.design_uploads TO authenticated;
GRANT ALL ON public.design_uploads TO service_role;
ALTER TABLE public.design_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customer manages own uploads"
  ON public.design_uploads FOR ALL TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Assigned designer views uploads"
  ON public.design_uploads FOR SELECT TO authenticated
  USING (
    order_id IN (
      SELECT o.id FROM public.orders o JOIN public.designers d ON o.designer_id = d.id WHERE d.profile_id = auth.uid()
    )
  );

-- ============ UPDATED_AT TRIGGERS ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SEED SERVICES ============
INSERT INTO public.services (title, slug, category, description, base_price, image_url) VALUES
  ('Bespoke Bridal Gown', 'bespoke-bridal', 'Bridal', 'Fully custom bridal gown crafted from consultation to final fitting.', 2500, null),
  ('Signature Suit', 'signature-suit', 'Tailoring', 'Made-to-measure suit with hand-finished details.', 1200, null),
  ('Evening Couture', 'evening-couture', 'Couture', 'One-of-a-kind evening dress designed to your vision.', 1800, null),
  ('Corporate Uniform Program', 'corporate-uniforms', 'Corporate', 'End-to-end uniform design for teams and hospitality brands.', 450, null),
  ('Traditional Ceremonial Wear', 'ceremonial', 'Heritage', 'Custom heritage garments with modern silhouettes.', 900, null),
  ('AI Style Consultation', 'ai-consultation', 'Consulting', 'Personalised styling powered by our AI concierge and senior designers.', 120, null);
