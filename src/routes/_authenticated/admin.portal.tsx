import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { DashboardShell, StatCard, StatusPill } from "@/components/dashboard/shell";
import {
  getAdminPortalState,
  unlockAdminPortal,
  lockAdminPortal,
  getAdminOverview,
} from "@/lib/admin-portal.functions";
import { toast } from "sonner";
import { KeyRound, Lock, RefreshCw, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/portal")({
  head: () => ({
    meta: [
      { title: "Admin Portal | Nova Nancy" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Private studio control room for users, orders and revenue.",
      },
      { property: "og:title", content: "Admin Portal | Nova Nancy" },
      {
        property: "og:description",
        content: "Private studio control room for users, orders and revenue.",
      },
    ],
  }),
  component: AdminPortal,
});

type Overview = Awaited<ReturnType<typeof getAdminOverview>>;

const money = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c || "USD" }).format(n || 0);
const when = (v?: string | null) => (v ? new Date(v).toLocaleDateString() : "N/A");

function AdminPortal() {
  const stateFn = useServerFn(getAdminPortalState);
  const unlockFn = useServerFn(unlockAdminPortal);
  const lockFn = useServerFn(lockAdminPortal);
  const overviewFn = useServerFn(getAdminOverview);

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<Overview | null>(null);
  const [tab, setTab] = useState<"users" | "commissions" | "studio" | "messages">("users");
  const [q, setQ] = useState("");

  async function load() {
    try {
      setData(await overviewFn({ data: undefined } as never));
    } catch {
      setUnlocked(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const s = await stateFn({ data: undefined } as never);
        setIsAdmin(s.isAdmin);
        setUnlocked(s.unlocked);
        if (s.unlocked) await load();
      } finally {
        setChecking(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await unlockFn({ data: { code } });
      if (!res.ok) return toast.error("That code is not correct");
      setUnlocked(true);
      setCode("");
      await load();
      toast.success("Portal unlocked");
    } catch {
      toast.error("Could not unlock the portal");
    } finally {
      setBusy(false);
    }
  }

  async function lock() {
    await lockFn({ data: undefined } as never);
    setUnlocked(false);
    setData(null);
  }

  if (checking) {
    return (
      <DashboardShell title="Admin Portal">
        <p className="text-sm text-muted-foreground">Checking your access…</p>
      </DashboardShell>
    );
  }

  if (!isAdmin) {
    return (
      <DashboardShell title="Admin Portal">
        <div className="border border-border bg-background p-10">
          <p className="font-serif text-2xl">This portal is reserved</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account does not have studio privileges.
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (!unlocked) {
    return (
      <DashboardShell title="Admin Portal">
        <div className="mx-auto max-w-md border border-border bg-background p-10">
          <KeyRound className="h-6 w-6 text-accent" />
          <h2 className="mt-4 font-serif text-2xl">Enter your secret code</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You are signed in as the studio owner. Enter your private code to open the control room.
          </p>
          <form onSubmit={submitCode} className="mt-6 space-y-3">
            <input
              type="password"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Secret code"
              className="w-full border border-input bg-background px-4 py-3 text-sm tracking-[0.2em]"
              required
            />
            <button
              disabled={busy}
              className="w-full bg-primary px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Checking…" : "Unlock portal"}
            </button>
          </form>
        </div>
      </DashboardShell>
    );
  }

  const s = data?.stats;
  const term = q.trim().toLowerCase();
  const users = (data?.users ?? []).filter(
    (u) =>
      !term ||
      (u.fullName ?? "").toLowerCase().includes(term) ||
      (u.email ?? "").toLowerCase().includes(term) ||
      (u.phone ?? "").toLowerCase().includes(term),
  );
  const commissions = (data?.customOrders ?? []).filter(
    (o) =>
      !term ||
      o.order_number.toLowerCase().includes(term) ||
      o.full_name.toLowerCase().includes(term) ||
      o.email.toLowerCase().includes(term),
  );

  const cell = "p-4 text-sm align-top";
  const head = "p-4 text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground";

  return (
    <DashboardShell title="Admin Portal">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search people or orders"
            className="w-72 border border-input bg-background py-2.5 pl-9 pr-3 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 border border-input px-4 py-2.5 text-xs hover:bg-secondary"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            onClick={lock}
            className="flex items-center gap-2 border border-input px-4 py-2.5 text-xs hover:bg-secondary"
          >
            <Lock className="h-3.5 w-3.5" /> Lock portal
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="People"
          value={s?.totalUsers ?? 0}
          hint={`${s?.newUsers30d ?? 0} joined in 30 days`}
        />
        <StatCard
          label="Commissions"
          value={s?.totalCustomOrders ?? 0}
          hint={`${s?.openCustomOrders ?? 0} still open`}
        />
        <StatCard
          label="Quoted value"
          value={money(s?.quotedValue ?? 0)}
          hint={`${money(s?.collected ?? 0)} collected`}
        />
        <StatCard
          label="Unpaid orders"
          value={s?.unpaidOrders ?? 0}
          hint={`${s?.messages ?? 0} recent messages`}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["users", `People (${data?.users.length ?? 0})`],
            ["commissions", `Commissions (${data?.customOrders.length ?? 0})`],
            ["studio", `Studio orders (${data?.orders.length ?? 0})`],
            ["messages", `Messages (${data?.messages.length ?? 0})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] ${
              tab === key ? "bg-ink text-cream" : "border border-input hover:bg-secondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto border border-border bg-background">
        {tab === "users" && (
          <table className="w-full min-w-[720px]">
            <thead className="border-b border-border">
              <tr>
                <th className={head}>Member</th>
                <th className={head}>Contact</th>
                <th className={head}>Roles</th>
                <th className={head}>Joined</th>
                <th className={head}>Last sign in</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/60 last:border-0">
                  <td className={cell}>
                    <div className="font-medium">{u.fullName ?? "Unnamed"}</div>
                    <div className="text-xs text-muted-foreground">{u.id.slice(0, 8)}</div>
                  </td>
                  <td className={cell}>
                    <div>{u.email ?? "No email"}</div>
                    <div className="text-xs text-muted-foreground">{u.phone ?? "No phone"}</div>
                  </td>
                  <td className={cell}>{u.roles.join(", ")}</td>
                  <td className={cell}>{when(u.createdAt)}</td>
                  <td className={cell}>{when(u.lastSignIn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "commissions" && (
          <table className="w-full min-w-[820px]">
            <thead className="border-b border-border">
              <tr>
                <th className={head}>Reference</th>
                <th className={head}>Client</th>
                <th className={head}>Piece</th>
                <th className={head}>Status</th>
                <th className={head}>Payment</th>
                <th className={head}>Price</th>
                <th className={head}>Placed</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0">
                  <td className={cell}>{o.order_number}</td>
                  <td className={cell}>
                    <div>{o.full_name}</div>
                    <div className="text-xs text-muted-foreground">{o.email}</div>
                    <div className="text-xs text-muted-foreground">{o.phone}</div>
                  </td>
                  <td className={cell}>{o.clothing_type ?? "N/A"}</td>
                  <td className={cell}>
                    <StatusPill status={o.status} />
                  </td>
                  <td className={cell}>
                    <StatusPill status={o.payment_status} />
                  </td>
                  <td className={cell}>
                    {o.price ? money(Number(o.price), o.currency) : "Not quoted"}
                  </td>
                  <td className={cell}>{when(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "studio" && (
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-border">
              <tr>
                <th className={head}>Title</th>
                <th className={head}>Status</th>
                <th className={head}>Progress</th>
                <th className={head}>Budget</th>
                <th className={head}>Created</th>
              </tr>
            </thead>
            <tbody>
              {(data?.orders ?? []).map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0">
                  <td className={cell}>{o.title}</td>
                  <td className={cell}>
                    <StatusPill status={o.status} />
                  </td>
                  <td className={cell}>{o.progress_percent}%</td>
                  <td className={cell}>{o.budget ? money(Number(o.budget)) : "N/A"}</td>
                  <td className={cell}>{when(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "messages" && (
          <div className="divide-y divide-border/60">
            {(data?.messages ?? []).map((m) => (
              <div key={m.id} className="p-5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{m.sender}</span>
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm">{m.body}</p>
              </div>
            ))}
            {!data?.messages.length && (
              <p className="p-6 text-sm text-muted-foreground">No messages yet.</p>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
