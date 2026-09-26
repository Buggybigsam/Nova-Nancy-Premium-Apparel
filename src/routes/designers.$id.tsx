import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { Star } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import founder from "@/assets/founder.jpg";

export const Route = createFileRoute("/designers/$id")({
  head: () => ({ meta: [{ title: "Designer | Nova Nancy" }] }),
  component: DesignerDetail,
});

function DesignerDetail() {
  const { id } = Route.useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [d, setD] = useState<any>(null);
  useEffect(() => {
    supabase
      .from("designers")
      .select("*, profiles(full_name, avatar_url, bio)")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => setD(data));
  }, [id]);

  if (!d)
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="p-16 text-center">Loading…</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto grid grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:px-10">
        <div className="aspect-[3/4] overflow-hidden bg-beige">
          <img
            src={d.portfolio_images?.[0] || d.profiles?.avatar_url || founder}
            className="h-full w-full object-cover"
            alt={d.profiles?.full_name ?? "Designer"}
          />
        </div>
        <div>
          <span className="eyebrow">{d.headline}</span>
          <h1 className="mt-4 font-serif text-5xl">{d.profiles?.full_name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {d.rating} · {d.years_experience} yrs
          </div>
          <p className="mt-6 text-muted-foreground">
            {d.profiles?.bio ?? "A dedicated craftsman shaping bespoke pieces at Nova Nancy."}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {d.specialties?.map((s: string) => (
              <span
                key={s}
                className="border border-border px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/custom-order"
              className="bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent"
            >
              Commission a piece
            </Link>
            <Link
              to="/appointments"
              className="border border-input px-6 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-secondary"
            >
              Book fitting
            </Link>
            <WhatsAppButton variant="outline" label="Chat on WhatsApp" className="rounded-none" />
          </div>
        </div>
      </section>
      {d.portfolio_images?.length > 1 && (
        <section className="container mx-auto px-6 pb-16 md:px-10">
          <h2 className="mb-6 font-serif text-3xl">Portfolio</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {d.portfolio_images.map((src: string, i: number) => (
              <div key={i} className="aspect-square overflow-hidden bg-beige">
                <img src={src} className="h-full w-full object-cover" alt="" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
