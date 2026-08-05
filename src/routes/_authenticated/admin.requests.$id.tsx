import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { DashboardShell } from "@/components/dashboard/shell";
import {
  adminGetCustomOrder,
  adminUpdateCustomOrder,
  adminAddOrderMessage,
} from "@/lib/custom-orders.functions";
import { ORDER_STATUSES, PAYMENT_STATUSES, statusLabel, formatFileSize } from "@/lib/custom-orders";
import { ArrowLeft, FileText, Save, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/requests/$id")({
  head: () => ({
    meta: [
      { title: "Admin · Request Detail | Nova Nancy" },
      { name: "description", content: "Full commission brief: files, measurements, notes and client messaging." },
    ],
  }),
  component: RequestDetail,
});

function Field({ label, value }: { label: string; value: any }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{Array.isArray(value) ? value.join(", ") : String(value)}</div>
    </div>
  );
}

function RequestDetail() {
  const { id } = Route.useParams();
  const get = useServerFn(adminGetCustomOrder);
  const update = useServerFn(adminUpdateCustomOrder);
  const addMessage = useServerFn(adminAddOrderMessage);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-custom-order", id],
    queryFn: () => get({ data: { id } }),
  });

  const order: any = data?.order;
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [price, setPrice] = useState("");
  const [expected, setExpected] = useState("");
  const [notes, setNotes] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!order) return;
    setStatus(order.status);
    setPaymentStatus(order.payment_status);
    setPrice(order.price != null ? String(order.price) : "");
    setExpected(order.expected_completion ?? "");
    setNotes(order.internal_notes ?? "");
  }, [order?.id, order?.updated_at]);

  const save = useMutation({
    mutationFn: () =>
      update({
        data: {
          id,
          status,
          paymentStatus,
          price: price === "" ? null : Number(price),
          internalNotes: notes,
          expectedCompletion: expected || null,
        },
      }),
    onSuccess: () => {
      toast.success("Request updated");
      refetch();
    },
    onError: (e: any) => toast.error(e.message ?? "Could not update"),
  });

  const send = useMutation({
    mutationFn: () => addMessage({ data: { orderId: id, body: body.trim() } }),
    onSuccess: () => {
      setBody("");
      toast.success("Message sent to client");
      refetch();
    },
    onError: (e: any) => toast.error(e.message ?? "Could not send"),
  });

  return (
    <DashboardShell title={order ? order.order_number : "Request"}>
      <Link to="/admin/requests" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to requests
      </Link>

      {isLoading && <div className="text-muted-foreground">Loading request…</div>}
      {error && <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{(error as Error).message}</div>}

      {order && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="border border-border bg-background p-6">
              <h2 className="font-serif text-2xl">Client & brief</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Name" value={order.full_name} />
                <Field label="Email" value={order.email} />
                <Field label="Phone" value={order.phone} />
                <Field label="WhatsApp" value={order.whatsapp} />
                <Field label="Preferred contact" value={order.preferred_contact} />
                <Field label="Delivery address" value={order.delivery_address} />
                <Field label="Order type" value={String(order.order_type).replace(/_/g, " ")} />
                <Field label="Selected design" value={order.selected_design} />
                <Field label="Garment" value={order.clothing_type} />
                <Field label="Fabric" value={order.fabric_preference} />
                <Field label="Colour" value={order.color} />
                <Field label="Colour notes" value={order.color_notes} />
                <Field label="Customizations" value={order.customizations} />
                <Field label="Event" value={order.event_type} />
                <Field label="Event date" value={order.event_date} />
                <Field label="Required by" value={order.required_date} />
                <Field label="Urgency" value={order.urgency} />
              </div>
              {order.description && (
                <div className="mt-5">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Description</div>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{order.description}</p>
                </div>
              )}
              {order.special_instructions && (
                <div className="mt-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Special instructions</div>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{order.special_instructions}</p>
                </div>
              )}
            </section>

            <section className="border border-border bg-background p-6">
              <h2 className="font-serif text-2xl">Reference files</h2>
              {data.files.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No files uploaded with this request.</p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {data.files.map((f: any) => (
                    <a key={f.id} href={f.url ?? "#"} target="_blank" rel="noreferrer" className="group block border border-border">
                      <div className="flex aspect-square items-center justify-center overflow-hidden bg-secondary">
                        {f.url && String(f.file_type).startsWith("image/") ? (
                          <img src={f.url} alt={f.file_name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <FileText className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-2">
                        <div className="truncate text-xs">{f.file_name}</div>
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {f.kind ? `${f.kind} · ` : ""}{f.file_size ? formatFileSize(Number(f.file_size)) : ""}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </section>

            <section className="border border-border bg-background p-6">
              <h2 className="font-serif text-2xl">Measurements</h2>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Unit: {order.measurement_unit}
                {order.needs_measurement_help ? " · client requested a fitting" : ""}
              </p>
              {Object.keys(order.measurements ?? {}).length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No measurements submitted.</p>
              ) : (
                <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                  {Object.entries(order.measurements as Record<string, string>).map(([k, v]) => (
                    <div key={k} className="border border-border/60 p-3">
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{k.replace(/_/g, " ")}</dt>
                      <dd className="mt-1 font-serif text-lg">{v} {order.measurement_unit === "cm" ? "cm" : "in"}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>

            <section className="border border-border bg-background p-6">
              <h2 className="font-serif text-2xl">Client messages</h2>
              <div className="mt-4 space-y-3">
                {data.messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
                {data.messages.map((m: any) => (
                  <div key={m.id} className={`max-w-[80%] p-3 text-sm ${m.sender === "admin" ? "ml-auto bg-ink text-cream" : "bg-secondary"}`}>
                    <div className="whitespace-pre-wrap">{m.body}</div>
                    <div className="mt-1 text-[10px] opacity-70">
                      {m.sender} · {new Date(m.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (body.trim()) send.mutate();
                }}
              >
                <textarea
                  className="min-h-[70px] flex-1 border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="Write an update for the client…"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={send.isPending || !body.trim()}
                  className="inline-flex items-center gap-2 self-end bg-primary px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent disabled:opacity-50"
                >
                  <Send className="h-4 w-4" /> Send
                </button>
              </form>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
            <div className="border border-border bg-background p-6">
              <h2 className="font-serif text-xl">Manage</h2>
              <label className="mt-4 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Status</label>
              <select className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
              </select>

              <label className="mt-4 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Payment</label>
              <select className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>

              <label className="mt-4 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Quoted price ({order.currency})</label>
              <input type="number" min="0" step="0.01" className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm" value={price} onChange={(e) => setPrice(e.target.value)} />

              <label className="mt-4 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Expected completion</label>
              <input type="date" className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm" value={expected} onChange={(e) => setExpected(e.target.value)} />

              <label className="mt-4 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Internal notes</label>
              <textarea className="mt-1 min-h-[110px] w-full border border-border bg-background p-3 text-sm" placeholder="Private notes, not visible to the client" value={notes} onChange={(e) => setNotes(e.target.value)} />

              <button
                onClick={() => save.mutate()}
                disabled={save.isPending}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {save.isPending ? "Saving…" : "Save changes"}
              </button>
            </div>

            <div className="border border-border bg-background p-6 text-sm text-muted-foreground">
              <div>Submitted {new Date(order.created_at).toLocaleString()}</div>
              <div>Last updated {new Date(order.updated_at).toLocaleString()}</div>
            </div>
          </aside>
        </div>
      )}
    </DashboardShell>
  );
}
