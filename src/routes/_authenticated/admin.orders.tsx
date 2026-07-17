import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { DashboardShell } from "@/components/dashboard/shell";
import { listShopifyOrders, type AdminOrder } from "@/lib/shopify-admin.functions";
import { RefreshCw, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({ meta: [{ title: "Admin · Orders — Nova Nancy" }] }),
  component: AdminOrders,
});

const FIN_OPTS = [
  { v: "any", l: "All payment" },
  { v: "paid", l: "Paid" },
  { v: "pending", l: "Pending" },
  { v: "authorized", l: "Authorized" },
  { v: "partially_paid", l: "Partially paid" },
  { v: "refunded", l: "Refunded" },
  { v: "partially_refunded", l: "Partially refunded" },
  { v: "voided", l: "Voided" },
];

const FUL_OPTS = [
  { v: "any", l: "All fulfillment" },
  { v: "unfulfilled", l: "Unfulfilled" },
  { v: "partial", l: "Partial" },
  { v: "fulfilled", l: "Fulfilled" },
  { v: "shipped", l: "Shipped" },
  { v: "unshipped", l: "Unshipped" },
];

function StatusPill({ label, tone }: { label: string | null; tone: "green" | "amber" | "red" | "gray" }) {
  if (!label) return <span className="text-xs text-muted-foreground">—</span>;
  const cls = {
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-neutral-200 text-neutral-700",
  }[tone];
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${cls}`}>
      {label.replace(/_/g, " ")}
    </span>
  );
}

function financialTone(s: string | null): "green" | "amber" | "red" | "gray" {
  if (!s) return "gray";
  const v = s.toLowerCase();
  if (v.includes("paid") && !v.includes("partially") && !v.includes("refunded")) return "green";
  if (v === "refunded" || v === "voided") return "red";
  if (v.includes("pending") || v.includes("authorized") || v.includes("partially")) return "amber";
  return "gray";
}
function fulfillmentTone(s: string | null): "green" | "amber" | "red" | "gray" {
  if (!s) return "gray";
  const v = s.toLowerCase();
  if (v === "fulfilled" || v === "shipped") return "green";
  if (v === "partial") return "amber";
  if (v === "unfulfilled" || v === "unshipped") return "red";
  return "gray";
}

function AdminOrders() {
  const fn = useServerFn(listShopifyOrders);
  const [financialStatus, setFinancialStatus] = useState("any");
  const [fulfillmentStatus, setFulfillmentStatus] = useState("any");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isFetching, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-shopify-orders", financialStatus, fulfillmentStatus, search],
    queryFn: () => fn({ data: { financialStatus, fulfillmentStatus, search: search || undefined } }),
  });

  const orders = (data ?? []) as AdminOrder[];

  const totals = useMemo(() => {
    const sum = orders.reduce((a, o) => a + Number(o.totalPrice || 0), 0);
    return { count: orders.length, sum, currency: orders[0]?.currencyCode ?? "USD" };
  }, [orders]);

  const fmt = (amount: number | string, currency: string) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(amount));

  return (
    <DashboardShell title="Orders">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-border/60 bg-background p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Orders</div>
            <div className="mt-1 font-serif text-2xl">{totals.count}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Revenue (shown)</div>
            <div className="mt-1 font-serif text-2xl">{fmt(totals.sum, totals.currency)}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Unfulfilled</div>
            <div className="mt-1 font-serif text-2xl">
              {orders.filter((o) => (o.displayFulfillmentStatus ?? "").toLowerCase().includes("unfulfilled")).length}
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Pending payment</div>
            <div className="mt-1 font-serif text-2xl">
              {orders.filter((o) => (o.displayFinancialStatus ?? "").toLowerCase().includes("pending")).length}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-background p-3">
          <form
            className="relative flex-1 min-w-[220px]"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchInput.trim());
            }}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="Search: name, email, #1001, sku:..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          <select
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={financialStatus}
            onChange={(e) => setFinancialStatus(e.target.value)}
          >
            {FIN_OPTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
          <select
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={fulfillmentStatus}
            onChange={(e) => setFulfillmentStatus(e.target.value)}
          >
            {FUL_OPTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border/60 bg-background">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Fulfillment</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Loading orders…</td></tr>
              )}
              {error && !isLoading && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-red-600">{(error as Error).message}</td></tr>
              )}
              {!isLoading && !error && orders.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No orders match these filters.</td></tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3 font-medium">{o.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div>{o.customerName ?? "—"}</div>
                    {o.customerEmail && <div className="text-xs text-muted-foreground">{o.customerEmail}</div>}
                  </td>
                  <td className="px-4 py-3"><StatusPill label={o.displayFinancialStatus} tone={financialTone(o.displayFinancialStatus)} /></td>
                  <td className="px-4 py-3"><StatusPill label={o.displayFulfillmentStatus} tone={fulfillmentTone(o.displayFulfillmentStatus)} /></td>
                  <td className="px-4 py-3 text-right font-medium">{fmt(o.totalPrice, o.currencyCode)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
