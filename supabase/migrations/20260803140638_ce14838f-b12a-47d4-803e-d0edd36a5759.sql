CREATE POLICY "Users manage own design files" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'design-uploads' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'design-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Designers and admins read design files" ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'design-uploads' AND (
    public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.design_uploads du
      JOIN public.orders o ON o.id = du.order_id
      JOIN public.designers d ON d.id = o.designer_id
      WHERE d.profile_id = auth.uid() AND du.image_url = storage.objects.name
    )
  )
);