import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createHash, timingSafeEqual } from "node:crypto";

type PortalSession = { unlockedFor?: string; at?: number };

const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "nn-admin-portal",
    maxAge: SESSION_MAX_AGE,
    // The app is often viewed inside an iframe (editor preview), where a "lax"
    // cookie is treated as third party and never sent back. "none" + secure keeps it working.
    cookie: { httpOnly: true, secure: true, sameSite: "none" as const, path: "/" },
  };
}

function codeMatches(input: string, expected: string) {
  const a = createHash("sha256").update(input.trim(), "utf8").digest();
  const b = createHash("sha256").update(expected.trim(), "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (!isAdmin) throw new Error("Forbidden");
}

/** Step 2 of login: signed-in admin enters the secret code. */
export const unlockAdminPortal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { code: string }) => ({ code: String(d?.code ?? "") }))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const expected = process.env["ADMIN_PORTAL_CODE"];
    if (!expected) throw new Error("Admin portal code is not configured");
    if (!data.code || !codeMatches(data.code, expected)) return { ok: false as const };

    const session = await useSession<PortalSession>(sessionConfig());
    await session.update({ unlockedFor: context.userId, at: Date.now() });
    return { ok: true as const };
  });

export const lockAdminPortal = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<PortalSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const getAdminPortalState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    const session = await useSession<PortalSession>(sessionConfig());
    return {
      isAdmin: !!isAdmin,
      unlocked: !!isAdmin && session.data.unlockedFor === context.userId,
    };
  });

/** Full snapshot of users, orders, revenue and message activity. */
export const getAdminOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const session = await useSession<PortalSession>(sessionConfig());
    if (session.data.unlockedFor !== context.userId) throw new Error("Locked");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: authUsers }, profilesRes, rolesRes, customRes, ordersRes, msgRes, payRes] =
      await Promise.all([
        supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 }),
        supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false }),
        supabaseAdmin.from("user_roles").select("user_id, role"),
        supabaseAdmin
          .from("custom_orders")
          .select(
            "id, order_number, full_name, email, phone, clothing_type, status, payment_status, price, currency, created_at, event_date, customer_id",
          )
          .order("created_at", { ascending: false })
          .limit(300),
        supabaseAdmin
          .from("orders")
          .select("id, title, status, budget, progress_percent, created_at, customer_id")
          .order("created_at", { ascending: false })
          .limit(300),
        supabaseAdmin
          .from("custom_order_messages")
          .select("id, order_id, sender, body, created_at")
          .order("created_at", { ascending: false })
          .limit(60),
        supabaseAdmin.from("custom_order_payments").select("amount, currency, payment_status, paid_at"),
      ]);

    const emails = new Map<string, { email: string | null; lastSignIn: string | null; createdAt: string }>();
    for (const u of authUsers?.users ?? []) {
      emails.set(u.id, {
        email: u.email ?? null,
        lastSignIn: u.last_sign_in_at ?? null,
        createdAt: u.created_at,
      });
    }
    const rolesByUser = new Map<string, string[]>();
    for (const r of rolesRes.data ?? []) {
      rolesByUser.set(r.user_id, [...(rolesByUser.get(r.user_id) ?? []), r.role as string]);
    }

    const users = (profilesRes.data ?? []).map((p) => ({
      id: p.id,
      fullName: p.full_name,
      phone: p.phone,
      createdAt: p.created_at,
      email: emails.get(p.id)?.email ?? null,
      lastSignIn: emails.get(p.id)?.lastSignIn ?? null,
      roles: rolesByUser.get(p.id) ?? ["customer"],
    }));

    const customOrders = customRes.data ?? [];
    const orders = ordersRes.data ?? [];
    const payments = payRes.data ?? [];

    const quoted = customOrders.reduce((s, o) => s + Number(o.price ?? 0), 0);
    const collected = payments
      .filter((p) => p.payment_status === "paid" || p.payment_status === "deposit_paid")
      .reduce((s, p) => s + Number(p.amount ?? 0), 0);

    const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const stats = {
      totalUsers: users.length,
      newUsers30d: users.filter((u) => new Date(u.createdAt).getTime() > since).length,
      admins: users.filter((u) => u.roles.includes("admin")).length,
      totalCustomOrders: customOrders.length,
      openCustomOrders: customOrders.filter(
        (o) => o.status !== "delivered" && o.status !== "completed" && o.status !== "cancelled",
      ).length,
      unpaidOrders: customOrders.filter((o) => o.payment_status === "unpaid").length,
      totalStudioOrders: orders.length,
      quotedValue: quoted,
      collected,
      messages: msgRes.data?.length ?? 0,
    };

    return {
      stats,
      users,
      customOrders,
      orders,
      messages: msgRes.data ?? [],
    };
  });
