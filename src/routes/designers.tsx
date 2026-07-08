import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { Star } from "lucide-react";

export const Route = createFileRoute("/designers")({
  head: () => ({
    meta: [
      { title: "Our Designers — Nova Nancy Atelier" },
      { name: "description", content: "Meet the couture designers and tailors of Nova Nancy — Milan-trained masters ready to craft your bespoke wardrobe." },
      { property: "og:title", content: "Nova Nancy Designers" },
      { property: "og:description", content: "Discover our roster of couture designers and book a consultation." },
    ],
  }),
  component: DesignersPage,
});

function DesignersPage() {
  const [designers, setDesigners] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("designers").select("*, profiles(full_name, avatar_url, bio)").eq("is_approved", true).then(({ data }) => setDesigners(data ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border bg-beige py-20">
        <div className="container mx-auto px-6 md:px-10">
          <span className="eyebrow">Our Designers</span>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            Ateliers with a<br /><span className="italic">unique signature.</span>
          </h1>
        </div>
      </section>
      <section className="container mx-auto px-6 py-16 md:px-10">
        {designers.length === 0 ? (
          <div className="border border-dashed border-border bg-beige/40 p-16 text-center">
            <h3 className="font-serif text-2xl">Directory opens soon</h3>
            <p className="mt-2 text-sm text-muted-foreground">Our designer roster will appear here once ateliers are approved.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {designers.map((d) => (
              <Link key={d.id} to="/designers/$id" params={{ id: d.id }} className="group border border-border bg-background transition-colors hover:border-accent">
                <div className="aspect-[4/5] overflow-hidden bg-beige">
                  {d.portfolio_images?.[0] ? (
                    <img src={d.portfolio_images[0]} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt={d.profiles?.full_name} />
                  ) : d.profiles?.avatar_url ? (
                    <img src={d.profiles.avatar_url} className="h-full w-full object-cover" alt="" />
                  ) : <div className="h-full w-full bg-gradient-to-br from-beige to-gold-soft" />}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl">{d.profiles?.full_name}</h3>
                    <div className="flex items-center gap-1 text-xs"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{d.rating}</div>
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.25em] text-accent">{d.headline}</div>
                  <div className="mt-3 text-sm text-muted-foreground">{d.specialties?.join(" · ")}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
