import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Scissors, PackageSearch, Sparkles } from "lucide-react";
import { WHATSAPP_URL } from "@/components/whatsapp-button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Atelier Concierge | Nova Nancy Atelier" },
      {
        name: "description",
        content:
          "Connect directly with Nova Nancy Atelier. No account needed — book bespoke fittings, track orders, or design your couture garment.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left Atelier Showcase */}
        <div className="relative hidden overflow-hidden bg-primary lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/30" />
          <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
            <Link to="/" className="font-serif text-2xl font-bold">
              NOVA <span className="italic font-normal">NANCY</span>
            </Link>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                Private Atelier
              </span>
              <h1 className="mt-6 font-serif text-5xl leading-tight">
                Every stitch,
                <br />
                <span className="italic">crafted exclusively for you.</span>
              </h1>
              <p className="mt-6 max-w-md text-sm text-primary-foreground/70 leading-relaxed">
                No sign-in or password required. Seamlessly book bespoke fittings, consult directly with Mau via WhatsApp, and customize your pieces.
              </p>
            </div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-primary-foreground/50">
              Couture Atelier · Accra & Global
            </div>
          </div>
        </div>

        {/* Right Direct Options */}
        <div className="flex flex-col items-center justify-center px-6 py-16 lg:px-16">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                Direct Atelier Services
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold">How May We Assist You?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Select an atelier service below to proceed immediately.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                to="/custom-order"
                className="group flex items-center gap-4 border border-border p-5 transition-all duration-300 hover:border-primary hover:bg-secondary/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Scissors className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Design Your Outfit</div>
                  <div className="text-xs text-muted-foreground">Submit measurements & custom bespoke references</div>
                </div>
              </Link>

              <Link
                to="/shop"
                className="group flex items-center gap-4 border border-border p-5 transition-all duration-300 hover:border-primary hover:bg-secondary/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Shop the Boutique</div>
                  <div className="text-xs text-muted-foreground">Browse ready-to-wear haute couture collections</div>
                </div>
              </Link>

              <Link
                to="/track"
                className="group flex items-center gap-4 border border-border p-5 transition-all duration-300 hover:border-primary hover:bg-secondary/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <PackageSearch className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Track Custom Order</div>
                  <div className="text-xs text-muted-foreground">Instant status updates with your reference code</div>
                </div>
              </Link>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 border border-border p-5 transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366]/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Chat Directly with Mau</div>
                  <div className="text-xs text-muted-foreground">Direct WhatsApp consultation with our lead designer</div>
                </div>
              </a>
            </div>

            <div className="text-center pt-4">
              <Link
                to="/"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
