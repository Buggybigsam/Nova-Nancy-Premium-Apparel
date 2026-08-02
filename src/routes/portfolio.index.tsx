import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SocialLinks } from "@/components/social-links";
import { portfolioPieces } from "@/data/portfolio";

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title: "Portfolio — Ankara Couture by Mau | Nova Nancy" },
      {
        name: "description",
        content:
          "Browse Nova Nancy's Ankara portfolio for Ghanaian women — bridal gowns, tailored suits, kaftans and evening couture, each with fabric and fitting details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Portfolio — Ankara Couture by Mau" },
      {
        property: "og:description",
        content: "Bespoke Ankara pieces made in Kasoa, Ghana — view each design up close.",
      },
    ],
  }),
  component: PortfolioIndex,
});

function PortfolioIndex() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-beige px-6 py-16 md:px-10 md:py-20">
        <div className="container mx-auto">
          <span className="eyebrow">Portfolio</span>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] md:text-6xl">
            Ankara, cut for the <span className="italic">Ghanaian woman</span>.
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground md:text-lg">
            Every piece below was drawn, cut and fitted by Mau in the Kasoa atelier. Open a design to
            see the fabric, the fitting timeline, and how it comes together.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioPieces.map((piece) => (
            <Link
              key={piece.slug}
              to="/portfolio/$slug"
              params={{ slug: piece.slug }}
              className="group block"
            >
              <div className="aspect-[4/5] overflow-hidden bg-beige">
                <img
                  src={piece.image}
                  alt={`${piece.title} — ${piece.summary}`}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent">
                  {piece.category}
                </div>
                <h2 className="mt-2 font-serif text-2xl">{piece.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{piece.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-beige px-6 py-16 text-center md:px-10">
        <h2 className="font-serif text-3xl md:text-4xl">
          Seen something you <span className="italic">love</span>?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Any design here can be re-cut in your fabric and your measurements.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/orders/new"
            className="bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-accent"
          >
            Commission a piece
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
