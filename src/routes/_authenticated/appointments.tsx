import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useUserRoles } from "@/hooks/use-auth";
import { DashboardShell, EmptyState } from "@/components/dashboard/shell";
import { Calendar as CalIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/appointments")({
  head: () => ({ meta: [{ title: "Appointments | Nova Nancy" }] }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const { user } = useAuth();
  const { primary } = useUserRoles(user?.id);
  const [appts, setAppts] = useState<any[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  const [form, setForm] = useState({ designer_id: "", appointment_date: "", time_slot: "10:00", type: "consultation", notes: "" });

  async function refresh() {
    if (!user) return;
    let q = supabase.from("appointments").select("*, designers(profiles(full_name))").order("appointment_date", { ascending: true });
    if (primary === "customer") q = q.eq("customer_id", user.id);
    const { data } = await q; setAppts(data ?? []);
  }
  useEffect(() => { refresh(); supabase.from("designers").select("id, profiles(full_name)").eq("is_approved", true).then(({ data }) => setDesigners(data ?? [])); }, [user, primary]);

  async function book(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("appointments").insert({
      customer_id: user.id,
      designer_id: form.designer_id || null,
      appointment_date: form.appointment_date,
      time_slot: form.time_slot,
      type: form.type as any,
      notes: form.notes,
    });
    if (error) return toast.error(error.message);
    toast.success("Appointment booked");
    setForm({ ...form, appointment_date: "", notes: "" });
    refresh();
  }

  const inputCls = "w-full border border-input bg-background px-4 py-3 text-sm";
  const labelCls = "mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground";

  return (
    <DashboardShell title="Appointments">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {primary === "customer" && (
          <form onSubmit={book} className="border border-border bg-background p-6 space-y-4">
            <h3 className="font-serif text-xl">Book a fitting</h3>
            <div><label className={labelCls}>Designer</label>
              <select className={inputCls} value={form.designer_id} onChange={(e) => setForm({ ...form, designer_id: e.target.value })}>
                <option value="">Any available</option>
                {designers.map((d) => <option key={d.id} value={d.id}>{d.profiles?.full_name}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Date</label><input required type="date" className={inputCls} value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} /></div>
            <div><label className={labelCls}>Time</label>
              <select className={inputCls} value={form.time_slot} onChange={(e) => setForm({ ...form, time_slot: e.target.value })}>
                {["09:00","10:00","11:00","13:00","14:00","15:00","16:00"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Type</label>
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="consultation">Consultation</option>
                <option value="fitting">Fitting</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            <textarea placeholder="Notes" className={inputCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <button className="w-full bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent">Reserve</button>
          </form>
        )}

        <div className={primary === "customer" ? "lg:col-span-2" : "lg:col-span-3"}>
          <h3 className="mb-4 font-serif text-xl">Calendar</h3>
          {appts.length === 0 ? <EmptyState icon={CalIcon} title="No appointments" description="Fittings will appear here." /> : (
            <div className="space-y-3">
              {appts.map((a) => (
                <div key={a.id} className="flex items-center justify-between border border-border bg-background p-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-accent">{a.type}</div>
                    <div className="mt-1 font-serif text-lg">{a.appointment_date} · {a.time_slot}</div>
                    <div className="text-xs text-muted-foreground">Designer: {a.designers?.profiles?.full_name ?? "Any"}</div>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{a.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
