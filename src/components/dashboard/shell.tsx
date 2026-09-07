import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth, useUserRoles, signOutAndRedirect, type AppRole } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  MessageCircle,
  Users,
  Settings,
  Scissors,
  LogOut,
  Sparkles,
  UserRound,
  ClipboardList,
  Palette,
  KeyRound,
} from "lucide-react";
import type { ReactNode } from "react";

type NavItem = { to: string; label: string; icon: any; roles?: AppRole[] };

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/appointments", label: "Appointments", icon: Calendar },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/designers", label: "Find a Designer", icon: Sparkles, roles: ["customer"] },
  { to: "/atelier", label: "My Atelier", icon: Palette, roles: ["designer"] },
  { to: "/admin/portal", label: "Admin Portal", icon: KeyRound, roles: ["admin"] },
  { to: "/admin/users", label: "Users", icon: Users, roles: ["admin"] },
  { to: "/admin/requests", label: "Requests", icon: Scissors, roles: ["admin"] },
  { to: "/admin/styles", label: "Homepage Styles", icon: Palette, roles: ["admin"] },
  { to: "/admin/services", label: "Services", icon: ClipboardList, roles: ["admin"] },
  { to: "/profile", label: "Profile", icon: UserRound, roles: ["customer", "designer"] },
];

export function DashboardShell({ children, title }: { children: ReactNode; title: string }) {
  const { user } = useAuth();
  const { primary, roles } = useUserRoles(user?.id);
  const loc = useLocation();
  const navigate = useNavigate();

  const items = NAV.filter((i) => !i.roles || i.roles.some((r) => roles.includes(r)) || i.roles.includes(primary));

  return (
    <div className="min-h-screen bg-beige">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="border-r border-border/60 bg-background">
          <div className="flex h-full flex-col">
            <div className="border-b border-border/60 px-6 py-6">
              <Link to="/" className="font-serif text-lg">
                NOVA <span className="italic font-normal">NANCY</span>
              </Link>
              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-accent">
                {primary} portal
              </div>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {items.map((item) => {
                const active = loc.pathname === item.to || loc.pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to as any}
                    className={`flex items-center gap-3 rounded-sm px-4 py-2.5 text-sm transition-colors ${
                      active ? "bg-ink text-cream" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border/60 p-4">
              <div className="mb-3 truncate text-xs text-muted-foreground">{user?.email}</div>
              <button
                onClick={() => signOutAndRedirect()}
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="min-h-screen">
          <header className="flex items-center justify-between border-b border-border/60 bg-background px-10 py-6">
            <div>
              <span className="eyebrow">Atelier</span>
              <h1 className="mt-1 font-serif text-3xl">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/orders/new"
                className="bg-primary px-5 py-3 text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent"
              >
                + New Order
              </Link>
            </div>
          </header>
          <div className="px-10 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-border bg-background p-6">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      <div className="mt-3 font-serif text-4xl">{value}</div>
      {hint && <div className="mt-2 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon = Scissors, title, description, action }: { icon?: any; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border bg-background/60 px-6 py-20 text-center">
      <Icon className="mb-4 h-10 w-10 text-accent" />
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-muted text-foreground",
    accepted: "bg-blue-100 text-blue-800",
    in_progress: "bg-amber-100 text-amber-900",
    ready_for_fitting: "bg-purple-100 text-purple-900",
    completed: "bg-emerald-100 text-emerald-900",
    cancelled: "bg-red-100 text-red-900",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] ${colors[status] ?? "bg-muted"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden bg-muted">
      <div className="h-full bg-accent transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
