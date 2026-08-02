import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, useUserRoles } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell, StatCard, EmptyState, StatusPill, ProgressBar } from "@/components/dashboard/shell";
import { Sparkles, Calendar, ShoppingBag, Users, Scissors } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard | Nova Nancy" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { primary, loading: rolesLoading } = useUserRoles(user?.id);
  if (rolesLoading || !user) return <div className="min-h-screen bg-beige p-10">Loading atelier…</div>;

  if (primary === "admin") return <AdminOverview />;
  if (primary === "designer") return <DesignerOverview userId={user.id} />;
  return <CustomerOverview userId={user.id} />;
}

/* ---------------- Customer ---------------- */
function CustomerOverview({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [appts, setAppts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("orders").select("*").eq("customer_id", userId).order("created_at", { ascending: false }).then(({ data }) => setOrders(data ?? []));
    supabase.from("appointments").select("*").eq("customer_id", userId).order("appointment_date", { ascending: true }).then(({ data }) => setAppts(data ?? []));
  }, [userId]);

  const active = orders.filter((o) => !["completed", "cancelled"].includes(o.status));

  return (
    <DashboardShell title="Your Atelier">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard label="Active Orders" value={active.length} hint="In production" />
        <StatCard label="Upcoming Fittings" value={appts.filter(a => a.status !== "cancelled").length} />
        <StatCard label="Completed Pieces" value={orders.filter(o => o.status === "completed").length} />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Live Order Tracking</h2>
          <Link to="/orders" className="text-[11px] uppercase tracking-[0.25em] text-accent hover:underline">View all</Link>
        </div>
        {orders.length === 0 ? (
          <EmptyState icon={Scissors} title="No orders yet" description="Book your first bespoke piece with one of our designers."
            action={<Link to="/orders/new" className="bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent">Start an order</Link>} />
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((o) => (
              <Link key={o.id} to="/orders/$id" params={{ id: o.id }} className="block border border-border bg-background p-6 transition-colors hover:border-accent">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">#{o.id.slice(0, 8)}</div>
                    <div className="mt-1 font-serif text-xl">{o.title}</div>
                  </div>
                  <StatusPill status={o.status} />
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span><span>{o.progress_percent}%</span>
                  </div>
                  <ProgressBar value={o.progress_percent} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="border border-border bg-background p-6">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /><h3 className="font-serif text-xl">Style Concierge</h3></div>
          <p className="mt-2 text-sm text-muted-foreground">Explore designers curated for your vision.</p>
          <Link to="/designers" className="mt-4 inline-block text-[11px] uppercase tracking-[0.25em] text-accent hover:underline">Meet the designer →</Link>
        </div>
        <div className="border border-border bg-background p-6">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /><h3 className="font-serif text-xl">Next Fitting</h3></div>
          {appts[0] ? (
            <div className="mt-2 text-sm">{appts[0].appointment_date} · {appts[0].time_slot}</div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">No upcoming fittings.</p>
          )}
          <Link to="/appointments" className="mt-4 inline-block text-[11px] uppercase tracking-[0.25em] text-accent hover:underline">Manage →</Link>
        </div>
      </section>
    </DashboardShell>
  );
}

/* ---------------- Designer ---------------- */
function DesignerOverview({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [designer, setDesigner] = useState<any>(null);

  useEffect(() => {
    supabase.from("designers").select("*").eq("profile_id", userId).maybeSingle().then(({ data }) => setDesigner(data));
  }, [userId]);

  useEffect(() => {
    if (!designer) return;
    supabase.from("orders").select("*").eq("designer_id", designer.id).order("created_at", { ascending: false }).then(({ data }) => setOrders(data ?? []));
  }, [designer]);

  const active = orders.filter((o) => !["completed", "cancelled"].includes(o.status));

  return (
    <DashboardShell title="Designer Studio">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard label="Active Commissions" value={active.length} />
        <StatCard label="Completed" value={orders.filter(o => o.status === "completed").length} />
        <StatCard label="Rating" value={designer?.rating ?? "5.0"} hint="Average across clients" />
      </div>

      {!designer && (
        <div className="mt-10 border border-dashed border-accent bg-background p-6">
          <h3 className="font-serif text-xl">Complete your designer profile</h3>
          <p className="mt-1 text-sm text-muted-foreground">Publish specialties, portfolio, and rate to appear in Nova Nancy's designer directory.</p>
          <Link to="/atelier" className="mt-4 inline-block bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent">Set up atelier →</Link>
        </div>
      )}

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl">Incoming Commissions</h2>
        {orders.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No commissions yet" description="Once customers book you, they'll appear here." />
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Link key={o.id} to="/orders/$id" params={{ id: o.id }} className="block border border-border bg-background p-5 hover:border-accent">
                <div className="flex items-center justify-between">
                  <div className="font-serif text-lg">{o.title}</div>
                  <StatusPill status={o.status} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Deadline: {o.deadline ?? "flexible"}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

/* ---------------- Admin ---------------- */
function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, orders: 0, designers: 0 });
  const [statusData, setStatusData] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [u, o, d] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("*"),
        supabase.from("designers").select("id", { count: "exact", head: true }),
      ]);
      setStats({ users: u.count ?? 0, orders: (o.data ?? []).length, designers: d.count ?? 0 });

      const counts: Record<string, number> = {};
      (o.data ?? []).forEach((r: any) => { counts[r.status] = (counts[r.status] ?? 0) + 1; });
      setStatusData(Object.entries(counts).map(([name, value]) => ({ name, value })));

      const months: Record<string, number> = {};
      (o.data ?? []).forEach((r: any) => {
        const k = new Date(r.created_at).toLocaleString("en", { month: "short" });
        months[k] = (months[k] ?? 0) + 1;
      });
      setMonthly(Object.entries(months).map(([month, orders]) => ({ month, orders })));
    })();
  }, []);

  const COLORS = ["#C5A059", "#121212", "#8B7355", "#D4B577", "#5C4A2E", "#E5D3A8"];

  return (
    <DashboardShell title="Atelier Command">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard label="Members" value={stats.users} />
        <StatCard label="Total Orders" value={stats.orders} />
        <StatCard label="Designers" value={stats.designers} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-border bg-background p-6">
          <h3 className="mb-4 font-serif text-xl">Orders by month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#C5A059" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="border border-border bg-background p-6">
          <h3 className="mb-4 font-serif text-xl">Status distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardShell>
  );
}
