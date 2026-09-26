import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useUser, useClerk } from "@clerk/tanstack-react-start";
import { isSuperAdminEmail } from "@/lib/admin-config";

export type AppRole = "customer" | "designer" | "admin";

export type UnifiedUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export function useAuth() {
  const { isLoaded: clerkLoaded, isSignedIn: clerkSignedIn, user: clerkUser } = useUser();
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [supabaseLoading, setSupabaseLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSupabaseSession(s);
      setSupabaseUser(s?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSupabaseSession(data.session);
      setSupabaseUser(data.session?.user ?? null);
      setSupabaseLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loading = !clerkLoaded || (supabaseLoading && !clerkSignedIn);

  let unifiedUser: (User | UnifiedUser) | null = null;

  if (clerkSignedIn && clerkUser) {
    unifiedUser = {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
      user_metadata: {
        full_name: clerkUser.fullName ?? clerkUser.firstName ?? "",
        avatar_url: clerkUser.imageUrl ?? "",
      },
    };
  } else if (supabaseUser) {
    unifiedUser = supabaseUser;
  }

  return {
    session: supabaseSession,
    user: unifiedUser,
    loading: !clerkLoaded,
    clerkUser,
  };
}

export function useUserRoles(userId?: string) {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const isEmailAdmin = isSuperAdminEmail(user?.email);

  useEffect(() => {
    if (!userId) {
      setRoles(isEmailAdmin ? ["admin"] : []);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    Promise.resolve(supabase.from("user_roles").select("role").eq("user_id", userId))
      .then(({ data }) => {
        if (!active) return;
        const fetchedRoles = (data ?? []).map((r) => r.role as AppRole);
        if (isEmailAdmin && !fetchedRoles.includes("admin")) {
          fetchedRoles.push("admin");
        }
        setRoles(fetchedRoles.length > 0 ? fetchedRoles : ["customer"]);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setRoles(isEmailAdmin ? ["admin"] : ["customer"]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId, isEmailAdmin]);

  const effectiveRoles =
    isEmailAdmin && !roles.includes("admin") ? (["admin", ...roles] as AppRole[]) : roles;
  const primary: AppRole = effectiveRoles.includes("admin")
    ? "admin"
    : effectiveRoles.includes("designer")
      ? "designer"
      : "customer";
  return { roles: effectiveRoles, primary, loading };
}

export async function signOutAndRedirect() {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error(e);
  }
  window.location.href = "/";
}
