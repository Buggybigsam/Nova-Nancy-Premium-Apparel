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
  return {
    session: null,
    user: null,
    loading: false,
    clerkUser: null,
  };
}

export function useUserRoles(_userId?: string) {
  return {
    roles: ["customer" as AppRole],
    primary: "customer" as AppRole,
    loading: false,
  };
}

export async function signOutAndRedirect() {
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
