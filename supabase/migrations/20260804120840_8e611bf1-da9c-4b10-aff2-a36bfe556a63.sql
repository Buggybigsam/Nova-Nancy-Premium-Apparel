GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.design_uploads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_updates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.designers TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

GRANT SELECT ON public.services TO anon;
GRANT SELECT ON public.designers TO anon;
GRANT SELECT ON public.profiles TO anon;

GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.design_uploads TO service_role;
GRANT ALL ON public.appointments TO service_role;
GRANT ALL ON public.messages TO service_role;
GRANT ALL ON public.order_updates TO service_role;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.services TO service_role;
GRANT ALL ON public.designers TO service_role;
GRANT ALL ON public.user_roles TO service_role;