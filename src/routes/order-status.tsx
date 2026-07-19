import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { SiteHeader } from "@/components/site-header";
import { lookupOrder, type OrderLookupResult } from "@/lib/order-lookup.functions";
import { CheckCircle2, Circle, Package, Truck, CreditCard, MapPin, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const searchSchema = z.object({
  order: z.string().optional(),
  email: z.string().optional(),
});

export const Route = createFileRoute("/order-status")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Nova Nancy" },
      { name: "description", content: "Look up your Nova Nancy order to view payment status, fulfillment, and shipping updates." },
      { property: "og:title", content: "Track Your Order — Nova Nancy" },
      { property: "og:description", content: "Check payment, fulfillment, and delivery progress for your Nova Nancy order." },
    ],
  }),
  validateSearch: (s) => searchSchema.parse(s),
  component: OrderStatusPage,
});

function money(amount: string, currency: string) {
  const n = Number(amount);
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

function payTone(status: string | null) {
  switch ((status ?? "").toUpperCase()) {
    case "PAID": return "bg-emerald-100 text-emerald-900";
    case "PARTIALLY_PAID": return "bg-amber-100 text-amber-900";
    case "PENDING": return "bg-amber-100 text-amber-900";
    case "REFUNDED":
    case "PARTIALLY_REFUNDED": return "bg-blue-100 text-blue-900";
    case "VOIDED": return "bg-muted text-foreground";
    default: return "bg-muted text-foreground";
  }
}

function fulTone(status: string | null) {
  switch ((status ?? "").toUpperCase()) {
    case "FULFILLED": return "bg-emerald-100 text-emerald-900";
    case "PARTIALLY_FULFILLED":
    case "IN_PROGRESS": return "bg-amber-100 text-amber-900";
    case "SCHEDULED":
    case "ON_HOLD": return "bg-blue-100 text-blue-900";
    case "UNFULFILLED": return "bg-muted text-foreground";
    default: return "bg-muted text-foreground";
  }
}

function Pill({ label, tone }: { label: string; tone: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ${tone}`}>
      {label.replace(/_/g, " ")}
    </span>
  );
}

function OrderStatusPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const lookup = useServerFn(lookupOrder);
  const [orderNumber, setOrderNumber] = useState(search.order ?? "");
  const [email, setEmail] = useState(search.email ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderLookupResult | null | undefined>(undefined);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) return;
    setLoading(true);
    try {
      const data = await lookup({ data: { orderNumber, email } });
      setResult(data);
      navigate({ to: "/order-status", search: { order: orderNumber, email }, replace: true });
      if (!data) toast.error("No matching order found. Check your order number and email.");
    } catch (err: any) {
      toast.error(err?.message ?? "Lookup failed");
      setResult(undefined);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-beige">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-[0.35em] text-accent">Order Tracking</span>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">Track your order</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Enter your order number and the email used at checkout to see live payment, fulfillment, and shipping details.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mx-auto mt-10 grid max-w-2xl gap-4 border border-border bg-background p-6 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Order #</label>
            <input
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="1001"
              className="w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-accent disabled:opacity-60"
          >
            {loading ? "Searching…" : "Track"}
          </button>
        </form>

        {result === null && (
          <div className="mx-auto mt-10 max-w-2xl border border-dashed border-border bg-background/60 p-10 text-center">
            <Package className="mx-auto mb-3 h-8 w-8 text-accent" />
            <h3 className="font-serif text-2xl">No order found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Double-check the order number (e.g. <span className="font-mono">1001</span>) and the email address you used at checkout.
            </p>
          </div>
        )}

        {result && <OrderDetails order={result} />}
      </main>
    </div>
  );
}

function OrderDetails({ order }: { order: OrderLookupResult }) {
  const steps = [
    { key: "placed", label: "Order placed", done: true, date: order.createdAt },
    {
      key: "paid",
      label: "Payment confirmed",
      done: (order.financialStatus ?? "").toUpperCase() === "PAID",
      date: (order.financialStatus ?? "").toUpperCase() === "PAID" ? order.processedAt : null,
    },
    {
      key: "fulfilled",
      label: "In production / packed",
      done: ["FULFILLED", "PARTIALLY_FULFILLED", "IN_PROGRESS"].includes((order.fulfillmentStatus ?? "").toUpperCase()),
      date: order.fulfillments[0]?.createdAt ?? null,
    },
    {
      key: "shipped",
      label: "Shipped",
      done: order.fulfillments.some((f) => f.trackingNumbers.length > 0),
      date: order.fulfillments.find((f) => f.trackingNumbers.length > 0)?.createdAt ?? null,
    },
    {
      key: "delivered",
      label: "Delivered",
      done: (order.fulfillmentStatus ?? "").toUpperCase() === "FULFILLED" && !!order.fulfillments.every((f) => f.status === "SUCCESS"),
      date: null,
    },
  ];

  return (
    <div className="mt-12 space-y-6">
      <div className="border border-border bg-background p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Order</div>
            <h2 className="mt-1 font-serif text-3xl">{order.name}</h2>
            <div className="mt-2 text-xs text-muted-foreground">
              Placed {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Pill label={`Payment: ${order.financialStatus ?? "unknown"}`} tone={payTone(order.financialStatus)} />
            <Pill label={`Fulfillment: ${order.fulfillmentStatus ?? "unfulfilled"}`} tone={fulTone(order.fulfillmentStatus)} />
            {order.cancelledAt && <Pill label="Cancelled" tone="bg-red-100 text-red-900" />}
          </div>
        </div>

        {order.statusUrl && (
          <a
            href={order.statusUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-accent hover:underline"
          >
            View official status page <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <div className="border border-border bg-background p-6 md:p-8">
        <h3 className="mb-6 font-serif text-xl">Progress</h3>
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={s.key} className="flex items-start gap-3">
              {s.done ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 text-muted-foreground" />
              )}
              <div className="flex-1">
                <div className={`text-sm ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</div>
                {s.date && <div className="text-xs text-muted-foreground">{new Date(s.date).toLocaleString()}</div>}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Step {i + 1}</div>
            </li>
          ))}
        </ol>
      </div>

      {order.fulfillments.length > 0 && (
        <div className="border border-border bg-background p-6 md:p-8">
          <h3 className="mb-4 flex items-center gap-2 font-serif text-xl">
            <Truck className="h-5 w-5 text-accent" /> Shipments
          </h3>
          <div className="space-y-4">
            {order.fulfillments.map((f) => (
              <div key={f.id} className="border border-border/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm">
                    <span className="font-medium">{f.trackingCompany ?? "Shipment"}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Pill label={f.status ?? "processing"} tone={fulTone(f.status)} />
                </div>
                {f.trackingNumbers.length > 0 && (
                  <div className="mt-3 space-y-1 text-sm">
                    {f.trackingNumbers.map((n, idx) => (
                      <div key={n + idx}>
                        Tracking:{" "}
                        {f.trackingUrls[idx] ? (
                          <a href={f.trackingUrls[idx]} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                            {n}
                          </a>
                        ) : (
                          <span className="font-mono">{n}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {f.estimatedDeliveryAt && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Estimated delivery {new Date(f.estimatedDeliveryAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border border-border bg-background p-6 md:p-8">
          <h3 className="mb-4 flex items-center gap-2 font-serif text-xl">
            <Package className="h-5 w-5 text-accent" /> Items
          </h3>
          <ul className="divide-y divide-border/60">
            {order.lineItems.map((li) => (
              <li key={li.id} className="flex items-center gap-4 py-3">
                {li.image ? (
                  <img src={li.image} alt={li.title} className="h-14 w-14 object-cover" />
                ) : (
                  <div className="h-14 w-14 bg-muted" />
                )}
                <div className="flex-1">
                  <div className="text-sm">{li.title}</div>
                  {li.variantTitle && li.variantTitle !== "Default Title" && (
                    <div className="text-xs text-muted-foreground">{li.variantTitle}</div>
                  )}
                </div>
                <div className="text-right text-sm">
                  <div>×{li.quantity}</div>
                  <div className="text-xs text-muted-foreground">{money(li.price, order.currencyCode)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="border border-border bg-background p-6 md:p-8">
            <h3 className="mb-4 flex items-center gap-2 font-serif text-xl">
              <CreditCard className="h-5 w-5 text-accent" /> Payment summary
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{money(order.subtotalPrice, order.currencyCode)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{money(order.totalShipping, order.currencyCode)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd>{money(order.totalTax, order.currencyCode)}</dd></div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 font-serif text-lg"><dt>Total</dt><dd>{money(order.totalPrice, order.currencyCode)}</dd></div>
            </dl>
          </div>

          {order.shippingAddress && (
            <div className="border border-border bg-background p-6 md:p-8">
              <h3 className="mb-4 flex items-center gap-2 font-serif text-xl">
                <MapPin className="h-5 w-5 text-accent" /> Shipping to
              </h3>
              <div className="text-sm leading-relaxed text-muted-foreground">
                {order.shippingAddress.name && <div className="text-foreground">{order.shippingAddress.name}</div>}
                {order.shippingAddress.address1 && <div>{order.shippingAddress.address1}</div>}
                {order.shippingAddress.address2 && <div>{order.shippingAddress.address2}</div>}
                <div>
                  {[order.shippingAddress.city, order.shippingAddress.province, order.shippingAddress.zip].filter(Boolean).join(", ")}
                </div>
                {order.shippingAddress.country && <div>{order.shippingAddress.country}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
