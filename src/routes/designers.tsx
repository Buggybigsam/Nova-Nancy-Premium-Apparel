import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, Star } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SocialLinks, SnapchatIcon, INSTAGRAM_URL, SNAPCHAT_URL, PHONE_DISPLAY, PHONE_RAW } from "@/components/social-links";
import founder from "@/assets/founder.jpg";
import { portfolioPieces } from "@/data/portfolio";
import { Reveal, Float } from "@/components/reveal";

export const Route = createFileRoute("/designers")({
  head: () => ({
    meta: [
      { title: "Mau | The Designer Behind Nova Nancy" },
      {
        name: "description",
        content:
          "Meet Mau, the sole designer behind Nova Nancy Atelier in Kasoa, Ghana. Bespoke bridal, tailoring and traditional wear, follow mau_real91 on Instagram.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Mau | The Designer Behind Nova Nancy" },
      {
        property: "og:description",
        content: "One designer, every stitch. Bespoke couture from Kasoa, Ghana.",
      },
    ],
  }),
  component: DesignerPage,
});

const specialties = [
  "Bespoke Bridal",
  "Corporate Tailoring",
  "Traditional Wear",
  "Evening Couture",
];

function DesignerPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-beige">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24">
          <div className="order-2 md:order-1">
            <span className="eyebrow">The Designer</span>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl">
              Mau<span className="text-accent">.</span>
              <br />
              <span className="italic font-normal">One pair of hands.</span>
            </h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-accent text-accent" />
              Kasoa, Walantu Street · Ghana
            </div>
            <p className="mt-6 max-w-md text-muted-foreground md:text-lg">
              Nova Nancy is not a house of many names. Every commission, from the first sketch to
              the last hand finished hem, is drawn, cut, and fitted by Mau. That is the whole
              promise: your garment is never passed along.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {specialties.map((s) => (
                <span
                  key={s}
                  className="border border-border px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/custom-order"
                className="bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-accent"
              >
                Commission a piece
              </Link>
              <Link
                to="/appointments"
                className="border border-input px-6 py-3 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-secondary"
              >
                Book fitting
              </Link>
              <WhatsAppButton variant="outline" label="WhatsApp" />
            </div>
            <div className="mt-8 border-t border-border pt-6">
              <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Reach Mau directly
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
                >
                  <Instagram className="h-4 w-4 text-accent" /> mau_real91
                </a>
                <a
                  href={SNAPCHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
                >
                  <SnapchatIcon className="h-4 w-4 text-accent" /> mau.real91
                </a>
              </div>
            </div>
          </div>
          <Float className="order-1 md:order-2">
            <img
              src={founder}
              alt="Mau, designer and founder of Nova Nancy Atelier"
              className="aspect-[4/5] w-full object-cover ring-1 ring-foreground/5"
            />
          </Float>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 md:px-10 md:py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Selected Work</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              Pieces from the <span className="italic">atelier</span>.
            </h2>
          </div>
          <SocialLinks variant="circle" includeWhatsApp />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {portfolioPieces.map((piece) => (
            <Link
              key={piece.slug}
              to="/portfolio/$slug"
              params={{ slug: piece.slug }}
              className="group block"
            >
              <div className="aspect-[4/5] overflow-hidden bg-beige border border-border/40">
                <img
                  src={piece.image}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  alt={`${piece.title}: ${piece.summary}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-3">
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent">
                  {piece.category}
                </div>
                <h3 className="mt-1 font-serif text-lg">{piece.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/portfolio"
            className="inline-block border border-input px-6 py-3 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-secondary"
          >
            View full portfolio
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-beige px-6 py-16 text-center md:px-10">
        <h2 className="font-serif text-3xl md:text-4xl">
          Start a conversation with <span className="italic">Mau</span>.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Send a reference, a sketch, or just an idea. Reach Mau directly on WhatsApp, Instagram, Snapchat, TikTok, or phone.
        </p>
        <div className="mt-8 flex justify-center">
          <SocialLinks variant="circle" includeWhatsApp />
        </div>
        <div className="mt-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Call or WhatsApp: <a href={`tel:${PHONE_RAW}`} className="text-foreground hover:text-accent underline underline-offset-4">{PHONE_DISPLAY}</a>
        </div>
      </section>

      <WhatsAppButton variant="fab" />
    </div>
  );
}
