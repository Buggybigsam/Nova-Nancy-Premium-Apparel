/** Resolves whether the current caller is an admin, plus their email claim. */
export async function resolveAccess(context: {
  supabase: { rpc: (fn: never, args: never) => PromiseLike<{ data: unknown }> };
  userId: string;
  claims: unknown;
}) {
  const { data: isAdmin } = await context.supabase.rpc("has_role" as never, {
    _user_id: context.userId,
    _role: "admin",
  } as never);
  const email = (context.claims as { email?: string })?.email?.toLowerCase() ?? null;
  return { isAdmin: !!isAdmin, email };
}
