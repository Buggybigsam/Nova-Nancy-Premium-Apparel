import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { KeyRound, Scissors, MessageCircle, Users, ShoppingBag, ClipboardList, LayoutDashboard } from "lucide-react";
import { useAuth, useUserRoles } from "@/hooks/use-auth";

export const Route = createFileRoute("/studio-access")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Studio Access | Nova Nancy" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Private studio entrance for Nova Nancy." },
      { property: "og:title", content: "Studio Access | Nova Nancy" },
      { property: "og:description", content: "Private studio entrance for Nova Nancy." },
    ],
  }),
  component: StudioAccessPage,
});

const LINKS = [
  { to: "/admin/requests", label: "Commission requests", icon: Scissors, desc: "Briefs, files, measurements, client messaging" },
  { to: "/messages", label: "Messages", icon: MessageCircle, desc: "Conversations grouped by order" },
  { to: "/admin/orders", label: "Shop orders", icon: ShoppingBag, desc: "Payments and fulfilment" },
  { to: "/admin/users", label: "Users and roles", icon: Users, desc: "Accounts and access" },
  { to: "/admin/services", label: "Services", icon: ClipboardList, desc: "Catalogue of offerings" },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Studio overview" },
] as const;

function StudioAccessPage() {
  const { user, loading } = useAuth();
  const { primary, loading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const busy = loading || (!!user && rolesLoading);

  return (
    <main className="min-h-screen bg-background px-6 py-24">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center gap-3 text-accent">
          <KeyRound className="h-5 w-5" />
          <span className="text-xs uppercase tracking-[0.35em]">Private entrance</span>
        </div>
        <h1 className="mt-4 font-serif text-4xl">Studio Access</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Direct entry to the studio workspace. This page is unlisted and hidden from the public navigation.
        </p>

        {busy ? (
          <p className="mt-12 text-sm text-muted-foreground">Checking your access…</p>
        ) : primary !== "admin" ? (
          <div className="mt-12 border border-border bg-card p-8">
            <p className="font-serif text-xl">This entrance is reserved</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account does not have studio privileges.
            </p>
            <Link to="/dashboard" className="mt-6 inline-block text-sm text-accent underline underline-offset-4">
              Go to your dashboard
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group border border-border bg-card p-6 transition-colors hover:border-accent"
              >
                <l.icon className="h-5 w-5 text-accent" />
                <div className="mt-4 font-serif text-lg">{l.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{l.desc}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
