import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/dashboard/shell";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/orders/new")({
  head: () => ({ meta: [{ title: "New order | Nova Nancy" }] }),
  component: NewOrder,
});

function NewOrder() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", service_id: "", designer_id: "", notes: "", budget: "", deadline: "", bust: "", waist: "", hips: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("services").select("*").eq("is_active", true).then(({ data }) => setServices(data ?? []));
    supabase.from("designers").select("id, headline, profiles(full_name)").eq("is_approved", true).then(({ data }) => setDesigners(data ?? []));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from("orders").insert({
      customer_id: user.id,
      service_id: form.service_id || null,
      designer_id: form.designer_id || null,
      title: form.title,
      notes: form.notes,
      budget: form.budget ? Number(form.budget) : null,
      deadline: form.deadline || null,
      measurements: { bust: form.bust, waist: form.waist, hips: form.hips },
    }).select().single();
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Order submitted");
    nav({ to: "/orders/$id", params: { id: data.id } });
  }

  const inputCls = "w-full border border-input bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none";
  const labelCls = "mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground";

  return (
    <DashboardShell title="New Order">
      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6 border border-border bg-background p-8">
        <div>
          <label className={labelCls}>Piece title</label>
          <input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Silk evening gown" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className={labelCls}>Service</label>
            <select className={inputCls} value={form.service_id} onChange={(e) => setForm({ ...form, service_id: e.target.value })}>
              <option value="">Select…</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Designer</label>
            <select className={inputCls} value={form.designer_id} onChange={(e) => setForm({ ...form, designer_id: e.target.value })}>
              <option value="">Auto-assign</option>
              {designers.map((d) => <option key={d.id} value={d.id}>{d.profiles?.full_name ?? d.headline}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Design notes</label>
          <textarea rows={4} className={inputCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <div><label className={labelCls}>Bust (in)</label><input className={inputCls} value={form.bust} onChange={(e) => setForm({ ...form, bust: e.target.value })} /></div>
          <div><label className={labelCls}>Waist (in)</label><input className={inputCls} value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} /></div>
          <div><label className={labelCls}>Hips (in)</label><input className={inputCls} value={form.hips} onChange={(e) => setForm({ ...form, hips: e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div><label className={labelCls}>Budget (USD)</label><input type="number" className={inputCls} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></div>
          <div><label className={labelCls}>Deadline</label><input type="date" className={inputCls} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
        </div>
        <button disabled={loading} className="flex items-center gap-2 bg-primary px-8 py-3.5 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Submit order
        </button>
      </form>
    </DashboardShell>
  );
}
