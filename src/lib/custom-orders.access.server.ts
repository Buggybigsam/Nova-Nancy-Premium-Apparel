import { isSuperAdminEmail } from "./admin-config";

/** Resolves whether the current caller is an admin, plus their email claim. */
export async function resolveAccess(context: {
  supabase: { rpc: (fn: never, args: never) => PromiseLike<{ data: unknown }> };
  userId: string;
  claims: unknown;
}) {
  const email = (context.claims as { email?: string })?.email?.toLowerCase() ?? null;
  if (isSuperAdminEmail(email)) {
    return { isAdmin: true, email };
  }

  try {
    const { data: isAdmin } = await context.supabase.rpc(
      "has_role" as never,
      {
        _user_id: context.userId,
        _role: "admin",
      } as never,
    );
    return { isAdmin: !!isAdmin, email };
  } catch {
    return { isAdmin: false, email };
  }
}
