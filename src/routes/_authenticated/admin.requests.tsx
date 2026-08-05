import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { DashboardShell, EmptyState } from "@/components/dashboard/shell";
import { adminListCustomOrders } from "@/lib/custom-orders.functions";
import { ORDER_STATUSES, CLOTHING_TYPES, statusLabel } from "@/lib/custom-orders";
import { RefreshCw, Search, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/requests")({
  head: () => ({
    meta: [
      { title: "Admin · Commission Requests | Nova Nancy" },
      { name: "description", content: "Review, filter and progress bespoke commission requests." },
    ],
  }),
  component: AdminRequests,
});

function pill(status: string) {
  if (status === "cancelled") return "bg-red-100 text-red-800";
  if (status === "delivered" || status === "completed") return "bg-emerald-100 text-emerald-800";
  if (status.includes("payment")) return "bg-amber-100 text-amber-900";
  return "bg-neutral-200 text-neutral-700";
}

function AdminRequests() {
  const list = useServerFn(adminListCustomOrders);
  const [status, setStatus] = useState("any");
  const [category, setCategory] = useState("any");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["admin-custom-orders", status, category, from, to, search],
    queryFn: () =>
      list({
        data: {
          status,
          category,
          from: from || undefined,
          to: to || undefined,
          search: search || undefined,
        },
      }),
  });

  const rows = data ?? [];
  const stats = useMemo(() => {
    const open = rows.filter((r: any) => !["delivered", "cancelled", "completed"].includes(r.status)).length;
    const unpaid = rows.filter((r: any) => r.payment_status === "unpaid").length;
    const value = rows.reduce((a: number, r: any) => a + Number(r.price ?? 0), 0);
    return { total: rows.length, open, unpaid, value };
  }, [rows]);

  return (
    <DashboardShell title="Commission Requests">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { l: "Requests", v: stats.total },
            { l: "In progress", v: stats.open },
            { l: "Unpaid", v: stats.unpaid },
            { l: "Quoted value", v: `GHS ${stats.value.toLocaleString()}` },
          ].map((s) => (
            <div key={s.l} className="border border-border bg-background p-5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.l}</div>
              <div className="mt-2 font-serif text-3xl">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border border-border bg-background p-3">
          <form
            className="relative min-w-[220px] flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchInput.trim());
            }}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="Search reference, name, email or phone"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          <select className="border border-border bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="any">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{statusLabel(s)}</option>
            ))}
          </select>
          <select className="border border-border bg-background px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="any">All categories</option>
            {CLOTHING_TYPES.map((c: any) => {
              const v = typeof c === "string" ? c : c.value ?? c.label;
              const l = typeof c === "string" ? c : c.label ?? c.value;
              return <option key={v} value={v}>{l}</option>;
            })}
          </select>
          <input type="date" className="border border-border bg-background px-3 py-2 text-sm" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" className="border border-border bg-background px-3 py-2 text-sm" value={to} onChange={(e) => setTo(e.target.value)} />
          <button onClick={() => refetch()} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm hover:bg-secondary">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {error && <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{(error as Error).message}</div>}

        {!isLoading && !error && rows.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No requests found" description="Nothing matches these filters yet. Adjust the search or date range." />
        ) : (
          <div className="overflow-x-auto border border-border bg-background">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Garment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Needed</th>
                  <th className="px-4 py-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Loading requests…</td></tr>
                )}
                {rows.map((o: any) => (
                  <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/40">
                    <td className="px-4 py-3 font-medium">
                      <Link to="/admin/requests/$id" params={{ id: o.id }} className="underline-offset-4 hover:underline">
                        {o.order_number}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{o.full_name}</div>
                      <div className="text-xs text-muted-foreground">{o.email}</div>
                    </td>
                    <td className="px-4 py-3">{o.clothing_type ?? "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${pill(o.status)}`}>
                        {statusLabel(o.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">{String(o.payment_status).replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.required_date ?? "Flexible"}</td>
                    <td className="px-4 py-3 text-right">{o.price ? `${o.currency} ${Number(o.price).toLocaleString()}` : "To quote"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
