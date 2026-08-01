import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Ruler,
  Scissors,
  Gem,
  Star,
  Quote,
  MessageCircle,
} from "lucide-react";
import { WhatsAppButton, WHATSAPP_URL } from "@/components/whatsapp-button";

import heroCouture from "@/assets/hero-couture.jpg";
import fabricSamples from "@/assets/fabric-samples.jpg";
import designSketch from "@/assets/design-sketch.jpg";
import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import collection3 from "@/assets/collection-3.jpg";
import collection4 from "@/assets/collection-4.jpg";
import founder from "@/assets/founder.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        property: "og:image",
        content:
          "https://id-preview--eceb11c5-b804-400f-9fd6-4927df1fbeb9.lovable.app/og-image.jpg",
      },
    ],
  }),
  component: LandingPage,
});

const collections = [
  { title: "Lumière Tailoring", tag: "Corporate", image: collection1 },
  { title: "Ivoire Bridal", tag: "Wedding", image: collection2 },
  { title: "Héritage", tag: "Traditional", image: collection3 },
  { title: "Noir Series", tag: "Men's Formal", image: collection4 },
];

const services = [
  {
    icon: Ruler,
    title: "Bespoke Measurements",
    desc: "In-atelier or in-home measurement service, digitally archived for every future order.",
  },
  {
    icon: Scissors,
    title: "Custom Tailoring",
    desc: "Bring your inspiration. We translate sketches and references into a garment built for you.",
  },
  {
    icon: Gem,
    title: "Couture Bridal",
    desc: "One-of-a-kind bridal masterpieces designed around your story, silhouette, and season.",
  },
  {
    icon: Sparkles,
    title: "AI Style Concierge",
    desc: "Guided fabric, palette, and silhouette suggestions from your inspiration board.",
  },
];

const testimonials = [
  {
    quote:
      "The most considered fitting I've ever experienced. Nova Nancy translated a mood board into a gown I'll wear for the rest of my life.",
    name: "Amara Okonkwo",
    role: "Bride, Autumn Wedding",
  },
  {
    quote:
      "The corporate wardrobe they built for me commands every room. Precision-cut, and the fabric feels like it was chosen for my skin.",
    name: "Marcus Chen",
    role: "Managing Partner",
  },
  {
    quote:
      "Six weeks from sketch to first fitting, tracked stitch by stitch on my phone. This is what luxury service should feel like.",
    name: "Elena Rossi",
    role: "Creative Director",
  },
];

const trackerStages = [
  { label: "Measurements", state: "done" as const },
  { label: "Fabric Sourcing", state: "done" as const },
  { label: "Sewing & Draping", state: "active" as const },
  { label: "Quality Check", state: "upcoming" as const },
  { label: "Delivery", state: "upcoming" as const },
];

const galleryImages = [
  collection2,
  collection3,
  collection1,
  fabricSamples,
  collection4,
  designSketch,
  heroCouture,
  collection3,
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Marquee />
      <Collections />
      <Services />
      <OrderTracker />
      <AIConcierge />
      <About />
      <WhyUs />
      <Testimonials />
      <Gallery />
      <Contact />
      <Newsletter />
      <Footer />
      <WhatsAppButton variant="fab" />
    </div>
  );
}

/* ---------- Nav ---------- */
import { SiteHeader } from "@/components/site-header";
function Nav() {
  return <SiteHeader />;
}


/* ---------- Hero ---------- */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-beige">
      <div className="container mx-auto grid grid-cols-12 items-center gap-8 px-6 py-20 md:px-10 md:py-28">
        <div className="col-span-12 z-10 animate-fade-up md:col-span-6">
          <span className="eyebrow mb-6 block">Haute Couture 2026</span>
          <h1 className="mb-8 font-serif text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
            Define Your
            <br />
            <span className="italic font-normal">Signature.</span>
          </h1>
          <p className="mb-10 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Bespoke tailoring that marries ancestral craftsmanship with modern silhouettes.
            Sketched, measured, and stitched exclusively for you.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-primary-foreground transition-colors duration-500 hover:bg-accent md:px-10 md:py-5"
            >
              Book Your Style
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#collections"
              className="border-b border-foreground pb-1 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors hover:border-accent hover:text-accent"
            >
              View collections
            </a>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="relative">
            <img
              src={heroCouture}
              alt="Model in a structural gold and black couture gown"
              width={1200}
              height={1600}
              className="aspect-[3/4] w-full object-cover ring-1 ring-foreground/5"
            />
            <div className="absolute -bottom-6 -left-6 hidden bg-background px-6 py-4 ring-1 ring-foreground/10 md:block">
              <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                Collection Nº 08
              </div>
              <div className="font-serif text-lg italic">Midnight Gilt</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Marquee strip ---------- */
function Marquee() {
  const items = [
    "Bespoke Bridal",
    "Corporate Tailoring",
    "Traditional Wear",
    "Bespoke Bridal",
    "Corporate Tailoring",
    "Traditional Wear",
  ];
  return (
    <div className="overflow-hidden border-y border-border bg-background py-5">
      <div className="flex animate-[marquee_28s_linear_infinite] gap-16 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="font-serif text-2xl italic text-muted-foreground md:text-3xl"
          >
            {item} <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

/* ---------- Collections ---------- */
function Collections() {
  return (
    <section id="collections" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow mb-4 block">Featured Collections</span>
            <h2 className="max-w-xl font-serif text-4xl md:text-5xl">
              This season's <span className="italic">edit</span>.
            </h2>
          </div>
          <a
            href="#"
            className="border-b border-foreground/30 pb-1 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors hover:border-accent hover:text-accent"
          >
            Browse the archive
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c, i) => (
            <a
              key={c.title}
              href="#"
              className="group block"
              style={{ transform: i % 2 === 1 ? "translateY(2rem)" : undefined }}
            >
              <div className="mb-4 overflow-hidden bg-muted">
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-serif text-lg">{c.title}</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {c.tag}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
function Services() {
  return (
    <section id="services" className="bg-beige px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="eyebrow mb-4 block">Services</span>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              Every service, <span className="italic">personal</span>.
            </h2>
          </div>
          <p className="text-muted-foreground md:col-span-6 md:col-start-7 md:text-lg">
            From the first mood board to the final fitting, every step is guided by hand — and
            supported by a private client dashboard so you can track your creation stitch by
            stitch.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden bg-border sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.title}
              className="group bg-beige p-8 transition-colors duration-500 hover:bg-primary hover:text-primary-foreground"
            >
              <s.icon className="mb-8 h-6 w-6 text-accent transition-transform group-hover:-translate-y-1" />
              <h3 className="mb-3 font-serif text-2xl">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-primary-foreground/70">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Order Tracker ---------- */
function OrderTracker() {
  return (
    <section className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow mb-3 block">Live Order Tracking</span>
            <h2 className="font-serif text-4xl md:text-5xl">Track your creation.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Order NN-88291 · Midnight Silk Gala Gown
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-shimmer" />
            In Production
          </span>
        </div>

        <div className="relative py-12">
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" />
          <div
            className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-accent"
            style={{ width: "45%" }}
          />
          <div className="relative flex justify-between gap-2">
            {trackerStages.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-4 bg-background px-2">
                {s.state === "active" ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent bg-background ring-8 ring-background">
                    <div className="h-2.5 w-2.5 animate-shimmer rounded-full bg-accent" />
                  </div>
                ) : (
                  <div
                    className={`h-4 w-4 rounded-full ${
                      s.state === "done" ? "bg-foreground" : "bg-border"
                    }`}
                  />
                )}
                <span
                  className={`text-center text-[9px] font-semibold uppercase tracking-[0.15em] sm:text-[10px] ${
                    s.state === "active"
                      ? "text-accent"
                      : s.state === "upcoming"
                      ? "text-muted-foreground"
                      : ""
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- AI Concierge (dark) ---------- */
function AIConcierge() {
  return (
    <section className="bg-primary px-6 py-24 text-primary-foreground md:px-10 md:py-32">
      <div className="container mx-auto grid items-center gap-16 md:grid-cols-2 md:gap-24">
        <div className="space-y-10">
          <span className="eyebrow block">AI Fashion Assistant</span>
          <h2 className="font-serif text-4xl leading-tight md:text-6xl">
            The AI Design <span className="italic">Concierge</span>.
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6">
              <h3 className="eyebrow mb-2">Fabric Suggestion</h3>
              <p className="text-sm text-primary-foreground/70">
                Based on your uploaded sketch, we recommend 4-ply Crepe de Chine for optimal
                drape and quiet sheen.
              </p>
            </div>
            <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6">
              <h3 className="eyebrow mb-2">Timeline Estimate</h3>
              <p className="text-sm text-primary-foreground/70">
                Intricate beadwork detected. Estimated completion: 14 business days from
                measurement.
              </p>
            </div>
          </div>
          <button className="group inline-flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/20 font-serif text-xl transition-colors group-hover:border-accent group-hover:text-accent">
              →
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em]">Consult the concierge</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
            src={fabricSamples}
            alt="Silk fabric samples"
            loading="lazy"
            width={800}
            height={800}
            className="aspect-square w-full object-cover"
          />
          <img
            src={designSketch}
            alt="Fashion sketch"
            loading="lazy"
            width={800}
            height={800}
            className="mt-12 aspect-square w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- About ---------- */
function About() {
  return (
    <section id="about" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <img
            src={founder}
            alt="Mau, the designer behind Nova Nancy Atelier"
            loading="lazy"
            width={900}
            height={1100}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <span className="eyebrow mb-4 block">Meet the Designer</span>
          <h2 className="mb-8 font-serif text-4xl leading-tight md:text-5xl">
            One designer. <span className="italic">Every stitch, personally.</span>
          </h2>
          <p className="mb-6 text-muted-foreground md:text-lg">
            Nova Nancy is the private atelier of <span className="text-foreground">Mau</span> — a
            single designer who takes each commission from first sketch to final fitting. No
            production line, no hand-offs: you speak to the person cutting your cloth.
          </p>
          <p className="mb-8 text-muted-foreground md:text-lg">
            Follow the studio day to day — fittings, fabric runs, and behind-the-scenes cuts — on
            Instagram <span className="text-foreground">@mau_real91</span> and Snapchat{" "}
            <span className="text-foreground">mau.real</span>.
          </p>
          <SocialLinks variant="circle" includeWhatsApp />
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">

            <div>
              <div className="font-serif text-3xl md:text-4xl">120+</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Hours per garment
              </div>
            </div>
            <div>
              <div className="font-serif text-3xl md:text-4xl">18</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Master tailors
              </div>
            </div>
            <div>
              <div className="font-serif text-3xl md:text-4xl">∞</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Tailoring guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Why Us ---------- */
function WhyUs() {
  const points = [
    { n: "01", title: "Hand-cut by master tailors", desc: "Every panel drafted from your measurements — no digital pattern reused." },
    { n: "02", title: "Fabric sourced ethically", desc: "Silk from Como, wool from Yorkshire, cotton from Egypt. Traceable to the mill." },
    { n: "03", title: "Live progress transparency", desc: "Ten production stages, notifications at every hand-off, photos on demand." },
    { n: "04", title: "Lifetime alteration promise", desc: "Bodies change. Your garments should too — free alterations, always." },
  ];
  return (
    <section className="bg-beige px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <span className="eyebrow mb-4 block">Why Nova Nancy</span>
          <h2 className="font-serif text-4xl md:text-5xl">
            The details others <span className="italic">skip</span>.
          </h2>
        </div>
        <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
          {points.map((p) => (
            <div key={p.n} className="group border-t border-foreground/20 pt-8">
              <div className="mb-6 flex items-baseline justify-between">
                <span className="font-serif text-xl italic text-accent">{p.n}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
              </div>
              <h3 className="mb-3 font-serif text-2xl">{p.title}</h3>
              <p className="text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */
function Testimonials() {
  return (
    <section className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <span className="eyebrow mb-4 block">Client Voices</span>
          <h2 className="font-serif text-4xl md:text-5xl">
            Worn with <span className="italic">reverence</span>.
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="flex h-full flex-col justify-between border border-border bg-card p-8 transition-shadow duration-500 hover:shadow-2xl"
            >
              <div>
                <Quote className="h-6 w-6 text-accent" strokeWidth={1.5} />
                <blockquote className="mt-6 font-serif text-lg italic leading-relaxed">
                  "{t.quote}"
                </blockquote>
              </div>
              <figcaption className="mt-8 border-t border-border pt-6">
                <div className="font-medium">{t.name}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {t.role}
                </div>
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3 w-3 fill-accent text-accent" />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Gallery ---------- */
function Gallery() {
  return (
    <section className="bg-beige px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow mb-3 block">@novanancy on Instagram</span>
            <h2 className="font-serif text-4xl md:text-5xl">From the atelier floor.</h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors hover:text-accent"
          >
            <Instagram className="h-4 w-4" /> Follow us
          </a>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3">
          {galleryImages.map((img, i) => (
            <a key={i} href="#" className="group relative block overflow-hidden">
              <img
                src={img}
                alt="Nova Nancy atelier moment"
                loading="lazy"
                width={600}
                height={600}
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-primary/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-primary-foreground" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
function Contact() {
  return (
    <section id="contact" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2">
        <div>
          <span className="eyebrow mb-4 block">Visit the Atelier</span>
          <h2 className="mb-8 font-serif text-4xl md:text-5xl">
            Come for a <span className="italic">fitting</span>.
          </h2>
          <p className="mb-10 max-w-md text-muted-foreground">
            Private appointments, weekdays 10:00–19:00. Virtual consultations available for
            clients outside the city.
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 text-accent" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Atelier
                </div>
                <div className="mt-1">Kasoa, Walantu Street, Ghana</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="mt-1 h-5 w-5 text-accent" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Concierge
                </div>
                <div className="mt-1">studio@novanancy.com</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 text-accent" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Private line
                </div>
                <div className="mt-1">+233 (0) 55 050 1177</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MessageCircle className="mt-1 h-5 w-5 text-[#25D366]" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  WhatsApp
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-foreground underline decoration-[#25D366] underline-offset-4 transition-colors hover:text-[#25D366]"
                >
                  Message the designer
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <WhatsAppButton variant="inline" label="Chat on WhatsApp" />
            <a
              href="tel:+233550501177"
              className="border border-border px-5 py-3 text-[10px] font-medium uppercase tracking-[0.25em] transition-colors hover:border-accent hover:text-accent"
            >
              Call now
            </a>
          </div>
        </div>

        <div className="overflow-hidden border border-border bg-beige">
          <iframe
            title="Nova Nancy Atelier location"
            src="https://www.google.com/maps?q=Kasoa,Walantu+Street,Ghana&output=embed"
            className="h-full min-h-[400px] w-full grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Newsletter ---------- */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="border-y border-border bg-beige px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <span className="eyebrow mb-3 block">The Dossier</span>
          <h2 className="font-serif text-3xl md:text-4xl">
            Seasonal collections, delivered <span className="italic">quietly</span>.
          </h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setSubmitted(true);
          }}
          className="flex items-end gap-3 border-b border-foreground/30 pb-3"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors hover:text-accent"
          >
            {submitted ? "Joined ✦" : "Join"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="bg-primary px-6 py-20 text-primary-foreground/60 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="mb-6 font-serif text-2xl font-bold uppercase tracking-tight text-primary-foreground">
            Nova <span className="italic font-normal">Nancy</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed">
            Architects of individual style. We believe every garment should tell a story,
            meticulously woven into every stitch.
          </p>
          <div className="mt-8 flex gap-4">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground transition-colors hover:border-[#25D366] hover:text-[#25D366]"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="mb-6 text-[10px] uppercase tracking-[0.25em] text-primary-foreground">
            Atelier
          </h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#collections" className="hover:text-accent">Collections</a></li>
            <li><a href="#services" className="hover:text-accent">Custom Tailoring</a></li>
            <li><a href="#about" className="hover:text-accent">Our Story</a></li>
            <li><a href="#contact" className="hover:text-accent">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 text-[10px] uppercase tracking-[0.25em] text-primary-foreground">
            Client
          </h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-accent">Sign in</a></li>
            <li><a href="#" className="hover:text-accent">Book appointment</a></li>
            <li><a href="#" className="hover:text-accent">Track order</a></li>
            <li><a href="#" className="hover:text-accent">FAQs</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-20 flex max-w-7xl flex-col justify-between gap-3 border-t border-primary-foreground/10 pt-8 text-[10px] uppercase tracking-[0.25em] sm:flex-row">
        <span>© 2026 Nova Nancy Atelier</span>
        <span>Designed for the exceptional</span>
      </div>
    </footer>
  );
}
