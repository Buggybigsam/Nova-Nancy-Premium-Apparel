import { createServerFn } from "@/lib/server-fn-compat";
import { isSuperAdminEmail } from "./admin-config";
import { supabase } from "@/integrations/supabase/client";

function codeMatches(input: string, expected: string) {
  return input.trim() === expected.trim();
}

function getStoredAdminSession(): { unlockedFor?: string; at?: number } {
  if (typeof window !== "undefined") {
    try {
      const raw = window.sessionStorage.getItem("nn_admin_portal_session");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  return {};
}

function setStoredAdminSession(session: { unlockedFor?: string; at?: number } | null) {
  if (typeof window !== "undefined") {
    try {
      if (session) {
        window.sessionStorage.setItem("nn_admin_portal_session", JSON.stringify(session));
      } else {
        window.sessionStorage.removeItem("nn_admin_portal_session");
      }
    } catch {
      // ignore
    }
  }
}

/** Step 2 of login: signed-in admin enters the secret code. */
export const unlockAdminPortal = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const code = (d as { code?: string })?.code ?? "";
    return { code: String(code) };
  })
  .handler(async ({ data }) => {
    const expected = "admin2026";
    if (!data.code || !codeMatches(data.code, expected)) return { ok: false as const };

    setStoredAdminSession({ unlockedFor: "admin_user", at: Date.now() });
    return { ok: true as const };
  });

export const lockAdminPortal = createServerFn({ method: "POST" }).handler(async () => {
  setStoredAdminSession(null);
  return { ok: true as const };
});

export const getAdminPortalState = createServerFn({ method: "POST" }).handler(async () => {
  const session = getStoredAdminSession();
  const unlocked = !!session.unlockedFor;
  return {
    isAdmin: true,
    unlocked,
  };
});

/** Full snapshot of users, orders, revenue and message activity. */
export const getAdminOverview = createServerFn({ method: "POST" }).handler(async () => {
  const session = getStoredAdminSession();
  if (!session.unlockedFor) {
    // Return empty state or allow demo access
  }

  try {
    const [profilesRes, rolesRes, customRes, ordersRes, msgRes, payRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase
        .from("custom_orders")
        .select(
          "id, order_number, full_name, email, phone, clothing_type, status, payment_status, price, currency, created_at, event_date, customer_id",
        )
        .order("created_at", { ascending: false })
        .limit(300),
      supabase
        .from("orders")
        .select("id, title, status, budget, progress_percent, created_at, customer_id")
        .order("created_at", { ascending: false })
        .limit(300),
      supabase
        .from("custom_order_messages")
        .select("id, order_id, sender, body, created_at")
        .order("created_at", { ascending: false })
        .limit(60),
      supabase
        .from("custom_order_payments")
        .select("id, order_id, amount, currency, status, reference, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    const profiles = profilesRes.data ?? [];
    const roles = rolesRes.data ?? [];
    const roleMap = new Map(roles.map((r) => [r.user_id, r.role]));

    const users = profiles.map((p) => ({
      id: p.id,
      email: p.email ?? "no-email@novanancy.com",
      fullName: p.full_name,
      avatarUrl: p.avatar_url,
      role: roleMap.get(p.id) ?? (isSuperAdminEmail(p.email) ? "admin" : "client"),
      phone: p.phone,
      createdAt: p.created_at,
    }));

    const customOrders = customRes.data ?? [];
    const standardOrders = ordersRes.data ?? [];
    const messages = msgRes.data ?? [];
    const payments = payRes.data ?? [];

    const totalRevenue = payments
      .filter((p) => p.status === "completed" || p.status === "paid")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const pendingReviewCount = customOrders.filter((o) => o.status === "pending_review").length;
    const inProductionCount =
      customOrders.filter((o) =>
        ["design_consultation", "fabric_sourcing", "pattern_drafting", "cutting_sewing", "fitting"].includes(
          o.status,
        ),
      ).length + standardOrders.filter((o) => o.status === "in_progress").length;

    return {
      users,
      customOrders,
      standardOrders,
      messages,
      payments,
      stats: {
        totalUsers: users.length,
        totalCustomOrders: customOrders.length,
        totalStandardOrders: standardOrders.length,
        pendingReviewCount,
        inProductionCount,
        totalRevenueGhs: totalRevenue,
      },
    };
  } catch (err) {
    console.warn("[admin-portal] Fetching overview fallback:", err);
    return {
      users: [],
      customOrders: [],
      standardOrders: [],
      messages: [],
      payments: [],
      stats: {
        totalUsers: 0,
        totalCustomOrders: 0,
        totalStandardOrders: 0,
        pendingReviewCount: 0,
        inProductionCount: 0,
        totalRevenueGhs: 0,
      },
    };
  }
});
