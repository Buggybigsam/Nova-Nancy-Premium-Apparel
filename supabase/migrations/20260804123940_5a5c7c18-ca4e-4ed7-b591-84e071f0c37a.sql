-- Status enum
CREATE TYPE public.custom_order_status AS ENUM (
  'order_received','under_review','measurements_verified','design_consultation',
  'price_quotation','awaiting_client_approval','payment_pending','payment_confirmed',
  'production_started','fitting','adjustments_required','completed',
  'ready_for_delivery','delivered','cancelled'
);

CREATE TYPE public.custom_payment_status AS ENUM ('unpaid','deposit_paid','paid','refunded');

CREATE SEQUENCE public.custom_order_seq START 1;

CREATE TABLE public.custom_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  preferred_contact text NOT NULL DEFAULT 'whatsapp',
  delivery_address text,
  order_type text NOT NULL DEFAULT 'custom_design',
  selected_design text,
  clothing_type text,
  fabric_preference text,
  color text,
  color_notes text,
  customizations text[] NOT NULL DEFAULT '{}',
  description text,
  special_instructions text,
  event_type text,
  event_date date,
  required_date date,
  urgency text,
  measurement_unit text NOT NULL DEFAULT 'inches',
  measurements jsonb NOT NULL DEFAULT '{}'::jsonb,
  needs_measurement_help boolean NOT NULL DEFAULT false,
  status public.custom_order_status NOT NULL DEFAULT 'order_received',
  payment_status public.custom_payment_status NOT NULL DEFAULT 'unpaid',
  price numeric,
  currency text NOT NULL DEFAULT 'GHS',
  internal_notes text,
  expected_completion date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX custom_orders_customer_idx ON public.custom_orders(customer_id);
CREATE INDEX custom_orders_status_idx ON public.custom_orders(status);
CREATE INDEX custom_orders_email_idx ON public.custom_orders(lower(email));

CREATE TABLE public.custom_order_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.custom_orders(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text,
  file_size bigint,
  storage_path text NOT NULL,
  kind text,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX custom_order_files_order_idx ON public.custom_order_files(order_id);

CREATE TABLE public.custom_order_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.custom_orders(id) ON DELETE CASCADE,
  sender text NOT NULL DEFAULT 'admin',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX custom_order_messages_order_idx ON public.custom_order_messages(order_id);

CREATE TABLE public.custom_order_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.custom_orders(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'GHS',
  payment_method text,
  payment_status public.custom_payment_status NOT NULL DEFAULT 'unpaid',
  transaction_reference text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX custom_order_payments_order_idx ON public.custom_order_payments(order_id);

-- Order number generation
CREATE OR REPLACE FUNCTION public.set_custom_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'NN-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('public.custom_order_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_custom_orders_number
BEFORE INSERT ON public.custom_orders
FOR EACH ROW EXECUTE FUNCTION public.set_custom_order_number();

CREATE TRIGGER trg_custom_orders_updated
BEFORE UPDATE ON public.custom_orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.custom_orders TO authenticated;
GRANT ALL ON public.custom_orders TO service_role;
GRANT SELECT, INSERT ON public.custom_order_files TO authenticated;
GRANT ALL ON public.custom_order_files TO service_role;
GRANT SELECT, INSERT ON public.custom_order_messages TO authenticated;
GRANT ALL ON public.custom_order_messages TO service_role;
GRANT SELECT ON public.custom_order_payments TO authenticated;
GRANT ALL ON public.custom_order_payments TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.custom_order_seq TO service_role;

ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_order_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_order_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage custom orders" ON public.custom_orders
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers view own custom orders" ON public.custom_orders
FOR SELECT TO authenticated USING (customer_id = auth.uid());

CREATE POLICY "Admins manage custom order files" ON public.custom_order_files
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers view own custom order files" ON public.custom_order_files
FOR SELECT TO authenticated
USING (order_id IN (SELECT id FROM public.custom_orders WHERE customer_id = auth.uid()));

CREATE POLICY "Admins manage custom order messages" ON public.custom_order_messages
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers view own custom order messages" ON public.custom_order_messages
FOR SELECT TO authenticated
USING (order_id IN (SELECT id FROM public.custom_orders WHERE customer_id = auth.uid()));

CREATE POLICY "Customers send own custom order messages" ON public.custom_order_messages
FOR INSERT TO authenticated
WITH CHECK (sender = 'client' AND order_id IN (SELECT id FROM public.custom_orders WHERE customer_id = auth.uid()));

CREATE POLICY "Admins manage custom order payments" ON public.custom_order_payments
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers view own custom order payments" ON public.custom_order_payments
FOR SELECT TO authenticated
USING (order_id IN (SELECT id FROM public.custom_orders WHERE customer_id = auth.uid()));

-- Storage: admins can read all intake files, customers read their own order's files
CREATE POLICY "Admins read intake files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'design-uploads' AND public.has_role(auth.uid(), 'admin'));
