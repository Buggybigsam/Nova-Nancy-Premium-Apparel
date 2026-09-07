CREATE TABLE public.styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  tag text,
  description text,
  storage_path text NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.styles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.styles TO authenticated;
GRANT ALL ON public.styles TO service_role;

ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published styles"
ON public.styles FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert styles"
ON public.styles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update styles"
ON public.styles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete styles"
ON public.styles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read style images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'styles');

CREATE POLICY "Admins upload style images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'styles' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update style images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'styles' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete style images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'styles' AND public.has_role(auth.uid(), 'admin'));
