import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SocialLinks } from "@/components/social-links";
import { portfolioPieces } from "@/data/portfolio";
import { Reveal } from "@/components/reveal";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title: "Portfolio | Ankara Couture by Mau | Nova Nancy" },
      {
        name: "description",
        content:
          "Browse Nova Nancy's Ankara portfolio for Ghanaian women, bridal gowns, tailored suits, kaftans and evening couture, each with fabric and fitting details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Portfolio | Ankara Couture by Mau" },
      {
        property: "og:description",
        content: "Bespoke Ankara pieces made in Kasoa, Ghana, view each design up close.",
      },
    ],
  }),
  component: PortfolioIndex,
});

const CATEGORIES = [
  "All",
  "Evening Couture",
  "Bespoke Bridal",
  "Corporate Tailoring",
  "Traditional Wear",
  "Statement Pieces",
  "Everyday Luxe",
];

export function PortfolioIndex() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPieces = useMemo(() => {
    if (selectedCategory === "All") return portfolioPieces;
    return portfolioPieces.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border bg-beige px-6 py-16 md:px-10 md:py-20">
        <div className="container mx-auto">
          <span className="eyebrow">Atelier Collection</span>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] md:text-6xl">
            Ankara, cut for the <span className="italic">Ghanaian woman</span>.
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground md:text-lg">
            Every piece below was drawn, cut and fitted by Mau in the Kasoa atelier. Select any
            design to request it with your own fabric, measurements, and custom styling.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-10 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors rounded-none border ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-accent hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="container mx-auto px-6 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPieces.map((piece, i) => (
            <Reveal key={piece.slug} delay={i * 0.05}>
              <div className="group flex flex-col justify-between h-full border border-border/80 bg-background transition-shadow hover:shadow-md">
                <div>
                  <Link
                    to="/portfolio/$slug"
                    params={{ slug: piece.slug }}
                    className="block aspect-[4/5] overflow-hidden bg-beige relative"
                  >
                    <img
                      src={piece.image}
                      alt={`${piece.title}: ${piece.summary}`}
                      loading="lazy"
                      width={1024}
                      height={1280}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-ink/80 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase tracking-widest text-cream">
                      {piece.category}
                    </div>
                  </Link>

                  <div className="p-6">
                    <h2 className="font-serif text-2xl group-hover:text-accent transition-colors">
                      <Link to="/portfolio/$slug" params={{ slug: piece.slug }}>
                        {piece.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {piece.summary}
                    </p>

                    <div className="mt-4 pt-4 border-t border-border/60">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                        Customizable options:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Custom Measurements",
                          "Neckline / Sleeves",
                          "Fabric Choice",
                          "Length",
                        ].map((opt) => (
                          <span
                            key={opt}
                            className="inline-block bg-secondary px-2 py-0.5 text-[9px] uppercase tracking-wider text-secondary-foreground"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center gap-2">
                  <Link
                    to="/custom-order"
                    search={{ design: piece.title }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary px-4 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-accent text-center"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Request This Design
                  </Link>
                  <Link
                    to="/portfolio/$slug"
                    params={{ slug: piece.slug }}
                    className="border border-border p-3 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="View details"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-beige px-6 py-16 text-center md:px-10">
        <h2 className="font-serif text-3xl md:text-4xl">
          Have a unique idea or <span className="italic">reference photo</span>?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Upload any sketch, Pinterest board, or Instagram inspiration to have Mau craft your
          bespoke piece.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/custom-order"
            className="bg-primary px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-accent"
          >
            Design Your Outfit
          </Link>
          <WhatsAppButton variant="outline" label="WhatsApp Mau" />
        </div>
        <div className="mt-8 flex justify-center">
          <SocialLinks variant="circle" />
        </div>
      </section>

      <WhatsAppButton variant="fab" />
    </div>
  );
}
