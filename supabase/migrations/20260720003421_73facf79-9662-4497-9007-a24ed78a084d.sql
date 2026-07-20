
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Order participants can view each other profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    LEFT JOIN public.designers d ON d.id = o.designer_id
    WHERE
      (o.customer_id = auth.uid() AND d.profile_id = profiles.id)
      OR (d.profile_id = auth.uid() AND o.customer_id = profiles.id)
  )
);
