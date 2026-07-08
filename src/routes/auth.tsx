import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Nova Nancy Atelier" },
      { name: "description", content: "Sign in or create your Nova Nancy account to book fittings and track custom orders." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Welcome to Nova Nancy — your account is ready.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-beige">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-ink lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-accent/40" />
          <div className="relative flex h-full flex-col justify-between p-12 text-cream">
            <Link to="/" className="font-serif text-2xl">
              NOVA <span className="italic font-normal">NANCY</span>
            </Link>
            <div>
              <span className="eyebrow">Atelier Access</span>
              <h1 className="mt-6 font-serif text-5xl leading-tight">
                Every stitch,<br /><span className="italic">yours to follow.</span>
              </h1>
              <p className="mt-6 max-w-md text-sm text-cream/70">
                Book fittings, upload references, message your designer, and watch each piece take shape — all in one place.
              </p>
            </div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-cream/50">
              Established 2015 · Lagos · Milan
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-16 lg:px-16">
          <div className="w-full max-w-md">
            <span className="eyebrow">{mode === "signin" ? "Sign in" : "Create account"}</span>
            <h2 className="mt-4 font-serif text-4xl">
              {mode === "signin" ? "Welcome back" : "Join the atelier"}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Continue tracking your custom pieces and appointments."
                : "Create your Nova Nancy account to begin your bespoke journey."}
            </p>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-3 border border-input bg-background px-6 py-3.5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              <div className="hairline flex-1" />
              or
              <div className="hairline flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Full name
                  </label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-input bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
                    placeholder="Ada Chukwuma"
                  />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-input bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  Password
                </label>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-input bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
                  placeholder="At least 8 characters"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-accent disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "New to Nova Nancy?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-accent underline-offset-4 hover:underline"
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
