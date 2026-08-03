import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useUserRoles } from "@/hooks/use-auth";
import { DashboardShell, StatusPill, ProgressBar } from "@/components/dashboard/shell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/orders/$id")({
  head: () => ({ meta: [{ title: "Order | Nova Nancy" }] }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { primary } = useUserRoles(user?.id);
  const [order, setOrder] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [refs, setRefs] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const [update, setUpdate] = useState({ stage: "", note: "", progress: 0 });

  async function refresh() {
    const [{ data: o }, { data: u }, { data: m }, { data: d }] = await Promise.all([
      supabase.from("orders").select("*, services(title), designers(profiles(full_name))").eq("id", id).maybeSingle(),
      supabase.from("order_updates").select("*").eq("order_id", id).order("created_at", { ascending: false }),
      supabase.from("messages").select("*, profiles(full_name)").eq("order_id", id).order("created_at", { ascending: true }),
      supabase.from("design_uploads").select("image_url").eq("order_id", id).order("created_at"),
    ]);
    setOrder(o); setUpdates(u ?? []); setMessages(m ?? []);
    const paths = (d ?? []).map((r) => r.image_url).filter(Boolean);
    if (paths.length) {
      const { data: signed } = await supabase.storage.from("design-uploads").createSignedUrls(paths, 3600);
      setRefs((signed ?? []).map((s) => s.signedUrl).filter(Boolean) as string[]);
    } else setRefs([]);
    if (o) setUpdate((s) => ({ ...s, progress: o.progress_percent }));
  }

  useEffect(() => { refresh(); }, [id]);

  useEffect(() => {
    const ch = supabase.channel(`order-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `order_id=eq.${id}` }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !msg.trim()) return;
    const { error } = await supabase.from("messages").insert({ order_id: id, sender_id: user.id, body: msg });
    if (error) return toast.error(error.message);
    setMsg(""); refresh();
  }

  async function postUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const { error: e1 } = await supabase.from("order_updates").insert({ order_id: id, author_id: user.id, stage: update.stage, note: update.note });
    if (e1) return toast.error(e1.message);
    await supabase.from("orders").update({ progress_percent: Number(update.progress) }).eq("id", id);
    toast.success("Update posted"); setUpdate({ stage: "", note: "", progress: Number(update.progress) }); refresh();
  }

  if (!order) return <DashboardShell title="Order"><div>Loading…</div></DashboardShell>;

  const canUpdate = primary === "designer" || primary === "admin";

  return (
    <DashboardShell title={order.title}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border bg-background p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">#{order.id.slice(0,8)}</div>
                <h2 className="mt-1 font-serif text-3xl">{order.title}</h2>
                <div className="mt-2 text-sm text-muted-foreground">{order.services?.title} · Designer: {order.designers?.profiles?.full_name ?? "unassigned"}</div>
              </div>
              <StatusPill status={order.status} />
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Progress</span><span>{order.progress_percent}%</span></div>
              <ProgressBar value={order.progress_percent} />
            </div>
            {order.notes && <p className="mt-6 text-sm text-muted-foreground">{order.notes}</p>}
          </div>

          {refs.length > 0 && (
            <div className="border border-border bg-background p-6">
              <h3 className="mb-4 font-serif text-xl">Reference images</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {refs.map((src, i) => (
                  <a key={src} href={src} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden border border-border">
                    <img src={src} alt={`Reference ${i + 1}`} className="h-full w-full object-cover transition-transform hover:scale-105" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {order.measurements && Object.values(order.measurements).some((v) => v) && (
            <div className="border border-border bg-background p-6">
              <h3 className="mb-4 font-serif text-xl">Measurements</h3>
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Object.entries(order.measurements as Record<string, string>)
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{k.replace(/_/g, " ")}</dt>
                      <dd className="mt-1 font-serif text-lg">{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}

          <div className="border border-border bg-background p-6">
            <h3 className="mb-4 font-serif text-xl">Timeline</h3>
            {updates.length === 0 ? <p className="text-sm text-muted-foreground">No updates yet.</p> : (
              <ol className="space-y-4 border-l border-border pl-6">
                {updates.map((u) => (
                  <li key={u.id} className="relative">
                    <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-accent" />
                    <div className="text-[10px] uppercase tracking-[0.25em] text-accent">{u.stage}</div>
                    <div className="mt-1 text-sm">{u.note}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleString()}</div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {canUpdate && (
            <form onSubmit={postUpdate} className="border border-border bg-background p-6 space-y-4">
              <h3 className="font-serif text-xl">Post progress update</h3>
              <input required placeholder="Stage (e.g. Pattern cut)" value={update.stage} onChange={(e) => setUpdate({ ...update, stage: e.target.value })} className="w-full border border-input bg-background px-4 py-3 text-sm" />
              <textarea placeholder="Notes" value={update.note} onChange={(e) => setUpdate({ ...update, note: e.target.value })} className="w-full border border-input bg-background px-4 py-3 text-sm" />
              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Progress {update.progress}%</label>
                <input type="range" min={0} max={100} value={update.progress} onChange={(e) => setUpdate({ ...update, progress: Number(e.target.value) })} className="w-full" />
              </div>
              <button className="bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent">Post update</button>
            </form>
          )}
        </div>

        <div className="border border-border bg-background p-6 flex flex-col">
          <h3 className="mb-4 font-serif text-xl">Messages</h3>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-96">
            {messages.length === 0 ? <p className="text-sm text-muted-foreground">Start the conversation.</p> : messages.map((m) => (
              <div key={m.id} className={`p-3 text-sm ${m.sender_id === user?.id ? "bg-secondary" : "bg-beige"}`}>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{m.profiles?.full_name ?? "You"}</div>
                <div className="mt-1">{m.body}</div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="mt-4 flex gap-2">
            <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message" className="flex-1 border border-input bg-background px-3 py-2 text-sm" />
            <button className="bg-primary px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-primary-foreground">Send</button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
