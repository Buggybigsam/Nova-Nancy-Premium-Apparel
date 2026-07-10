
-- 1) Restrict profiles SELECT to authenticated users only; expose safe designer fields via a public view.
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE OR REPLACE VIEW public.public_designer_profiles
WITH (security_invoker = true) AS
SELECT p.id, p.full_name, p.avatar_url, p.bio
FROM public.profiles p
WHERE EXISTS (
  SELECT 1 FROM public.designers d
  WHERE d.profile_id = p.id AND d.is_approved = true
);

GRANT SELECT ON public.public_designer_profiles TO anon, authenticated;

-- Allow the view (running as invoker) to read approved designer profiles for anonymous visitors.
CREATE POLICY "Anon can view approved designer profiles"
ON public.profiles
FOR SELECT
TO anon
USING (EXISTS (
  SELECT 1 FROM public.designers d
  WHERE d.profile_id = profiles.id AND d.is_approved = true
));

-- 2) Convert has_role to SECURITY INVOKER so signed-in users cannot escalate via RPC.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
