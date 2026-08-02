import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useUserRoles } from "@/hooks/use-auth";
import { DashboardShell, EmptyState } from "@/components/dashboard/shell";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/messages")({
  head: () => ({ meta: [{ title: "Messages | Nova Nancy" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const { user } = useAuth();
  const { primary } = useUserRoles(user?.id);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    let q = supabase.from("orders").select("id, title, status").order("updated_at", { ascending: false });
    if (primary === "customer") q = q.eq("customer_id", user.id);
    q.then(({ data }) => setOrders(data ?? []));
  }, [user, primary]);

  return (
    <DashboardShell title="Messages">
      {orders.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No conversations yet" description="Messages are grouped by order. Start an order to chat with your designer." />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} to="/orders/$id" params={{ id: o.id }} className="block border border-border bg-background p-5 hover:border-accent">
              <div className="font-serif text-lg">{o.title}</div>
              <div className="text-xs text-muted-foreground">Open conversation →</div>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
