import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SocialLinks } from "@/components/social-links";
import { getPortfolioPiece, portfolioPieces, type PortfolioPiece } from "@/data/portfolio";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const piece = getPortfolioPiece(params.slug);
    if (!piece) throw notFound();
    return { piece };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Design not found — Nova Nancy" }, { name: "robots", content: "noindex" }],
      };
    }
    const { piece } = loaderData;
    const title = `${piece.title} — Nova Nancy Portfolio`;
    return {
      meta: [
        { title },
        { name: "description", content: piece.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:title", content: title },
        { property: "og:description", content: piece.summary },
      ],
    };
  },
  notFoundComponent: PieceNotFound,
  component: PortfolioDetail,
});

function PieceNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-6 py-24 text-center md:px-10">
        <h1 className="font-serif text-4xl">That design isn't in the portfolio.</h1>
        <Link
          to="/portfolio"
          className="mt-8 inline-block bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent"
        >
          View all designs
        </Link>
      </div>
    </div>
  );
}

function PortfolioDetail() {
  const { piece } = Route.useLoaderData() as { piece: PortfolioPiece };
  const others = portfolioPieces.filter((p) => p.slug !== piece.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="container mx-auto grid grid-cols-1 gap-12 px-6 py-12 md:grid-cols-2 md:px-10 md:py-16">
        <div className="aspect-[4/5] overflow-hidden bg-beige">
          <img
            src={piece.image}
            alt={`${piece.title} — ${piece.summary}`}
            width={1024}
            height={1280}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <Link
            to="/portfolio"
            className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-accent"
          >
            ← Portfolio
          </Link>
          <div className="mt-6 text-[10px] uppercase tracking-[0.25em] text-accent">
            {piece.category}
          </div>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{piece.title}</h1>
          <p className="mt-5 text-muted-foreground md:text-lg">{piece.description}</p>

          <dl className="mt-8 divide-y divide-border border-y border-border">
            {piece.details.map((d) => (
              <div key={d.label} className="flex justify-between gap-6 py-3">
                <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {d.label}
                </dt>
                <dd className="text-right text-sm">{d.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/orders/new"
              className="bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-accent"
            >
              Commission this design
            </Link>
            <Link
              to="/appointments"
              className="border border-input px-6 py-3 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-secondary"
            >
              Book fitting
            </Link>
            <WhatsAppButton variant="outline" label="Ask about this piece" />
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Follow the atelier
            </div>
            <SocialLinks variant="row" className="gap-1" />
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 md:px-10">
        <div className="container mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl">
            More from the <span className="italic">atelier</span>.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {others.map((p) => (
              <Link key={p.slug} to="/portfolio/$slug" params={{ slug: p.slug }} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-beige">
                  <img
                    src={p.image}
                    alt={`${p.title} — ${p.summary}`}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 font-serif text-xl">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <WhatsAppButton variant="fab" />
    </div>
  );
}
