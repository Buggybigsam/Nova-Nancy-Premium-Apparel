import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useUserRoles } from "@/hooks/use-auth";
import { DashboardShell, EmptyState } from "@/components/dashboard/shell";
import { Calendar as CalIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments | Nova Nancy" },
      { name: "description", content: "Fittings and consultations booked with the Nova Nancy studio." },
      { property: "og:title", content: "Appointments | Nova Nancy" },
      { property: "og:description", content: "Fittings and consultations booked with the Nova Nancy studio." },
    ],
  }),
  component: AppointmentsPage,
});

type Client = { id: string; full_name: string | null };

function AppointmentsPage() {
  const { user } = useAuth();
  const { primary } = useUserRoles(user?.id);
  const isAdmin = primary === "admin";
  const [appts, setAppts] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({
    customer_id: "",
    appointment_date: "",
    time_slot: "10:00",
    type: "consultation",
    notes: "",
  });

  async function refresh() {
    if (!user) return;
    let q = supabase
      .from("appointments")
      .select("*, profiles:customer_id(full_name)")
      .order("appointment_date", { ascending: true });
    if (!isAdmin) q = q.eq("customer_id", user.id);
    const { data } = await q;
    setAppts(data ?? []);
  }

  useEffect(() => {
    refresh();
    if (isAdmin) {
      supabase
        .from("profiles")
        .select("id, full_name")
        .order("created_at", { ascending: false })
        .then(({ data }) => setClients((data ?? []) as Client[]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, primary]);

  async function book(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const customerId = isAdmin ? form.customer_id : user.id;
    if (!customerId) return toast.error("Choose a client first");
    const { error } = await supabase.from("appointments").insert({
      customer_id: customerId,
      designer_id: null,
      appointment_date: form.appointment_date,
      time_slot: form.time_slot,
      type: form.type as any,
      notes: form.notes,
      status: isAdmin ? ("confirmed" as any) : undefined,
    });
    if (error) return toast.error(error.message);
    toast.success(isAdmin ? "Appointment set with your client" : "Appointment booked");
    setForm({ ...form, appointment_date: "", notes: "" });
    refresh();
  }

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("appointments").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  }

  const inputCls = "w-full border border-input bg-background px-4 py-3 text-sm";
  const labelCls = "mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground";
  const showForm = isAdmin || primary === "customer";

  return (
    <DashboardShell title="Appointments">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {showForm && (
          <form onSubmit={book} className="space-y-4 border border-border bg-background p-6">
            <h3 className="font-serif text-xl">{isAdmin ? "Set an appointment with a client" : "Book a fitting"}</h3>
            {isAdmin && (
              <div>
                <label className={labelCls}>Client</label>
                <select
                  required
                  className={inputCls}
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                >
                  <option value="">Choose a client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name ?? c.id.slice(0, 8)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={labelCls}>Date</label>
              <input
                required
                type="date"
                className={inputCls}
                value={form.appointment_date}
                onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Time</label>
              <select className={inputCls} value={form.time_slot} onChange={(e) => setForm({ ...form, time_slot: e.target.value })}>
                {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="consultation">Consultation</option>
                <option value="fitting">Fitting</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            <textarea
              placeholder="Notes"
              className={inputCls}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <button className="w-full bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent">
              {isAdmin ? "Schedule" : "Reserve"}
            </button>
          </form>
        )}

        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
          <h3 className="mb-4 font-serif text-xl">Calendar</h3>
          {appts.length === 0 ? (
            <EmptyState icon={CalIcon} title="No appointments" description="Fittings will appear here." />
          ) : (
            <div className="space-y-3">
              {appts.map((a) => (
                <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 border border-border bg-background p-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-accent">{a.type}</div>
                    <div className="mt-1 font-serif text-lg">
                      {a.appointment_date} · {a.time_slot}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isAdmin ? `Client: ${a.profiles?.full_name ?? "Unnamed"}` : "With the Nova Nancy studio"}
                    </div>
                    {a.notes && <div className="mt-1 text-xs text-muted-foreground">{a.notes}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{a.status}</span>
                    {isAdmin && (
                      <select
                        className="border border-input bg-background px-2 py-1.5 text-xs"
                        value={a.status}
                        onChange={(e) => setStatus(a.id, e.target.value)}
                      >
                        {["scheduled", "confirmed", "completed", "cancelled"].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
