import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, useUserRoles } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell, EmptyState, StatusPill, ProgressBar } from "@/components/dashboard/shell";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({ meta: [{ title: "Orders | Nova Nancy" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const { user } = useAuth();
  const { primary } = useUserRoles(user?.id);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      let query = supabase.from("orders").select("*, services(title), designers(profile_id, profiles(full_name))").order("created_at", { ascending: false });
      if (primary === "customer") query = query.eq("customer_id", user.id);
      const { data } = await query;
      setOrders(data ?? []);
      setLoading(false);
    })();
  }, [user, primary]);

  return (
    <DashboardShell title="Orders">
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 animate-pulse bg-muted" />)}</div>
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" description={primary === "customer" ? "Book your first bespoke piece." : "No commissions have been assigned."}
          action={primary === "customer" && <Link to="/orders/new" className="bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground">New order</Link>} />
      ) : (
        <div className="border border-border bg-background">
          <table className="w-full">
            <thead className="border-b border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Progress</th>
                <th className="p-4 text-left">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/50">
                  <td className="p-4">
                    <Link to="/orders/$id" params={{ id: o.id }} className="font-serif text-lg hover:text-accent">{o.title}</Link>
                    <div className="text-xs text-muted-foreground">#{o.id.slice(0,8)}</div>
                  </td>
                  <td className="p-4 text-sm">{o.services?.title ?? "N/A"}</td>
                  <td className="p-4"><StatusPill status={o.status} /></td>
                  <td className="p-4 w-48"><ProgressBar value={o.progress_percent} /><div className="mt-1 text-xs text-muted-foreground">{o.progress_percent}%</div></td>
                  <td className="p-4 text-sm">{o.deadline ?? "Flexible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
