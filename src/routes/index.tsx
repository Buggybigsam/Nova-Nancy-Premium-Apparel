import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Instagram,
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
import {
  SocialLinks,
  SnapchatIcon,
  TikTokIcon,
  INSTAGRAM_URL,
  SNAPCHAT_URL,
  TIKTOK_URL,
  INSTAGRAM_HANDLE,
  SNAPCHAT_HANDLE,
  TIKTOK_HANDLE,
  PHONE_DISPLAY,
  PHONE_RAW,
} from "@/components/social-links";

import heroCouture from "@/assets/hero-couture.jpg";
import fabricSamples from "@/assets/fabric-samples.jpg";
import designSketch from "@/assets/design-sketch.jpg";
import collectionRoyalCorset from "@/assets/collection-royal-corset.jpg";
import collectionCrimsonKente from "@/assets/collection-crimson-kente.jpg";
import collectionEmeraldLeaf from "@/assets/collection-emerald-leaf.jpg";
import collectionAnkaraMini from "@/assets/collection-ankara-mini.jpg";
import collectionGreenFlair from "@/assets/collection-green-flair.jpg";
import collectionKenteMermaid from "@/assets/collection-kente-mermaid.jpg";
import collectionEmeraldStripe from "@/assets/collection-emerald-stripe.jpg";
import collectionSunsetCoral from "@/assets/collection-sunset-coral.jpg";
import collectionFanHighLow from "@/assets/collection-fan-highlow.jpg";
import { Reveal } from "@/components/reveal";
import { HeroOrbit, StitchDivider, ScrollCue } from "@/components/lottie";
import founder from "@/assets/founder.jpg";
import { SiteHeader } from "@/components/site-header";

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
  { title: "Golden Kente Leaf Peplum Gown", tag: "Imperial Ashanti Couture", image: collectionKenteMermaid },
  { title: "Sunset Coral Beaded Corset Gown", tag: "Haute Couture Gala", image: collectionSunsetCoral },
  { title: "Royal Blue Beaded Gown", tag: "Gala Couture", image: collectionRoyalCorset },
  { title: "Crimson Kente Empress", tag: "Ceremonial & Bridal", image: collectionCrimsonKente },
  { title: "Emerald & Gilt Striped Sheath", tag: "Structured Tailoring", image: collectionEmeraldStripe },
  { title: "Onyx & Gold Fan Flounce Gown", tag: "Architectural Ankara", image: collectionFanHighLow },
  { title: "Emerald Starburst Corset", tag: "Botanical Wax", image: collectionEmeraldLeaf },
  { title: "Royal Ankara Bow Mini", tag: "Cosmopolitan Luxury", image: collectionAnkaraMini },
  { title: "Verdant Cape Flounce Dress", tag: "Artisanal Silhouette", image: collectionGreenFlair },
  { title: "Heritage Ankara Corset", tag: "Signature Corsetry", image: fabricSamples },
  { title: "Imperial Boubou Robe", tag: "Ceremonial Regalia", image: designSketch },
  { title: "Midnight Gilt Gala Gown", tag: "Haute Couture Nº 08", image: heroCouture },
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
    desc: "One of a kind bridal masterpieces designed around your story, silhouette, and season.",
  },
  {
    icon: Sparkles,
    title: "Ceremonial & Evening",
    desc: "Red carpet, galas, and bespoke African luxury crafted with hand-beaded lace and silk.",
  },
];

const testimonials = [
  {
    quote:
      "The wedding gown Mau crafted for me was sheer poetry. From our first conversation in the studio to the final hand-stitched lace, it was flawless.",
    name: "Nana Akua B.",
    role: "Bespoke Bride, Accra",
  },
  {
    quote:
      "The cut of the double-breasted suit commands every room. Mau understands drape, movement, and true bespoke tailoring.",
    name: "Kofi Mensah",
    role: "Private Client, London & Accra",
  },
  {
    quote:
      "From the first sketch to the final hand-stitched hem, Mau's artistry is extraordinary. It feels like wearing fine art.",
    name: "Stephanie Darko",
    role: "Gala Commission",
  },
];

const galleryImages = [
  collectionKenteMermaid,
  collectionSunsetCoral,
  collectionRoyalCorset,
  collectionCrimsonKente,
  collectionEmeraldStripe,
  collectionFanHighLow,
  collectionEmeraldLeaf,
  collectionAnkaraMini,
  collectionGreenFlair,
  fabricSamples,
  designSketch,
  heroCouture,
];

function LandingPage() {
  useEffect(() => {
    // If the visitor opens the site without a specific anchor, guarantee the view starts at the top
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <Marquee />
      <Reveal>
        <Collections />
      </Reveal>
      <StitchDivider />
      <Reveal>
        <Services />
      </Reveal>
      <StitchDivider />
      <Reveal>
        <BespokeCraft />
      </Reveal>
      <StitchDivider />
      <Reveal>
        <PrivateFittingBooking />
      </Reveal>
      <StitchDivider />
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <WhyUs />
      </Reveal>
      <StitchDivider />
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <Gallery />
      </Reveal>
      <StitchDivider />
      <Reveal>
        <Contact />
      </Reveal>
      <Reveal>
        <Newsletter />
      </Reveal>
      <Footer />
      <WhatsAppButton variant="fab" />
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-beige">
      <HeroOrbit className="pointer-events-none absolute -right-24 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 opacity-60 md:block" />
      <div className="relative container mx-auto grid grid-cols-12 items-center gap-8 px-6 py-20 md:px-10 md:py-28">
        <div className="col-span-12 z-10 animate-fade-up md:col-span-6">
          <span className="eyebrow mb-6 block">Haute Couture 2026</span>
          <h1 className="mb-8 font-serif text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
            Define Your
            <br />
            <span className="italic font-normal">Signature.</span>
          </h1>
          <p className="mb-10 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Bespoke tailoring that marries ancestral craftsmanship with modern silhouettes.
            Sketched, measured, and stitched exclusively for you by Mau.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#booking"
              className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-primary-foreground transition-colors duration-500 hover:bg-accent md:px-10 md:py-5"
            >
              Book Private Fitting
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <Link
              to="/shop"
              className="border-b border-foreground pb-1 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors hover:border-accent hover:text-accent"
            >
              Explore Boutique
            </Link>
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
      <div className="relative flex justify-center pb-8">
        <ScrollCue className="h-16 w-10" />
      </div>
    </section>
  );
}

/* ---------- Marquee strip ---------- */
function Marquee() {
  const items = [
    "Bespoke Bridal",
    "Corporate Tailoring",
    "Traditional Luxury",
    "Gala Silhouettes",
    "Bespoke Bridal",
    "Corporate Tailoring",
    "Traditional Luxury",
  ];
  return (
    <div className="overflow-hidden border-y border-border bg-background py-5">
      <div className="flex animate-[marquee_28s_linear_infinite] gap-16 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="font-serif text-2xl italic text-muted-foreground md:text-3xl">
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
          <Link
            to="/shop"
            className="border-b border-foreground/30 pb-1 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors hover:border-accent hover:text-accent"
          >
            Browse all pieces
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.title}
              to="/shop"
              className="group block"
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
            </Link>
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
            From the first mood board to the final fitting, every garment is drafted, cut, and
            hand-finished by Mau in our private atelier.
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

/* ---------- Bespoke Craft / The Journey ---------- */
function BespokeCraft() {
  const steps = [
    {
      num: "01",
      title: "Consultation & Silhouette",
      desc: "Discuss your event, personal aesthetics, drape preferences, and silhouette inspiration directly with Mau.",
    },
    {
      num: "02",
      title: "Anatomical Blueprint",
      desc: "Detailed body measurements taken at our Kasoa atelier or via our guided remote fitting protocol.",
    },
    {
      num: "03",
      title: "Textile Architecture",
      desc: "Curating rare silks, Italian wools, rich brocades, and genuine Ghanaian woven textiles.",
    },
    {
      num: "04",
      title: "The Muslin Toile",
      desc: "A prototype garment sculpted on your body to balance movement, poise, and posture before final cuts.",
    },
    {
      num: "05",
      title: "Hand-Stitched Execution",
      desc: "Every seam, lining, and embellishment completed by hand by Mau. An heirloom piece made only for you.",
    },
  ];

  return (
    <section className="bg-beige px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <span className="eyebrow mb-4 block">The Bespoke Method</span>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">
            From raw silk to <span className="italic">perfection</span>.
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            A bespoke garment is never rushed. Each piece takes between 80 to 140 hours of focused
            artisan craftsmanship from Mau.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <div key={s.num} className="border-t border-foreground/20 pt-6">
              <span className="font-serif text-2xl italic text-accent">{s.num}</span>
              <h3 className="mt-4 font-serif text-xl">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Private Fitting Booking ---------- */
function PrivateFittingBooking() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "In-Atelier Fitting (Kasoa)",
    interest: "Bridal & Evening Gown",
    preferredDate: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappBookingUrl = `https://wa.me/233550501177?text=${encodeURIComponent(
    `Hello Mau, I would like to book a private fitting consultation.\n\nName: ${formData.name || "Client"}\nPhone: ${formData.phone || "Not specified"}\nType: ${formData.type}\nGarment: ${formData.interest}\nPreferred Date: ${formData.preferredDate || "Earliest available"}\nNotes: ${formData.note || "None"}`,
  )}`;

  return (
    <section id="booking" className="bg-primary px-6 py-24 text-primary-foreground md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <span className="eyebrow block text-accent">Private Consultation</span>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
            Book your <span className="italic">fitting</span>.
          </h2>
          <p className="text-primary-foreground/75 text-base md:text-lg leading-relaxed">
            Every garment begins with a conversation. Meet with designer Mau at our private
            Kasoa atelier or schedule a worldwide virtual consultation.
          </p>
          <div className="space-y-4 pt-4 border-t border-primary-foreground/15 text-sm">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>Direct, unhurried 1-on-1 time with the designer</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>Full fabric sample examination & moodboard review</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>Digital measurement archiving for all future pieces</span>
            </div>
          </div>
          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href="https://wa.me/233550501177?text=Hello%20Mau,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20private%20fitting."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white hover:bg-[#128C7E] transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Book Directly via WhatsApp
            </a>
            <Link
              to="/custom-order"
              className="inline-flex items-center gap-2 border border-primary-foreground/30 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground hover:border-accent hover:text-accent transition-colors"
            >
              Design Outfit Online →
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 bg-background text-foreground p-8 md:p-12 border border-border shadow-2xl">
          {submitted ? (
            <div className="text-center py-10 space-y-5 animate-fade-in">
              <span className="eyebrow block text-accent">Appointment Request Received</span>
              <h3 className="font-serif text-3xl">Thank you, {formData.name || "Client"}.</h3>
              <p className="max-w-md mx-auto text-sm text-muted-foreground leading-relaxed">
                Mau will review your request and confirm your appointment time within 24 hours.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={whatsappBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white hover:bg-[#128C7E]"
                >
                  <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp Now
                </a>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="border border-border px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.25em] hover:border-accent hover:text-accent"
                >
                  New Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-border/80 pb-4">
                <span className="eyebrow text-muted-foreground block mb-1">Appointment Schedule</span>
                <h3 className="font-serif text-2xl">Request Private Consultation</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Nana Ama Agyeman"
                    className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+233 55 000 0000"
                    className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                    Consultation Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
                  >
                    <option value="In-Atelier Fitting (Kasoa)">In-Atelier Fitting (Kasoa, Ghana)</option>
                    <option value="Virtual Consultation (Worldwide)">Virtual Consultation (Worldwide)</option>
                    <option value="In-Home Private VIP Fitting">In-Home Private VIP Fitting</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                    Garment Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
                  >
                    <option value="Bridal & Evening Gown">Bridal & Evening Gown</option>
                    <option value="Bespoke Tailoring & Suit">Bespoke Tailoring & Suit</option>
                    <option value="Traditional & Ceremonial (Kente)">Traditional & Ceremonial (Kente)</option>
                    <option value="Corporate Wardrobe">Corporate Wardrobe</option>
                    <option value="Ready-to-Wear Custom Fit">Ready-to-Wear Custom Fit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@domain.com"
                    className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                  Notes / Inspiration (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Share details regarding your event, date, or specific silhouette inspirations..."
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-primary px-8 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent transition-colors"
                >
                  Send Appointment Request
                </button>
                <a
                  href={whatsappBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto border border-[#25D366] text-[#25D366] px-6 py-4 text-[10px] font-medium uppercase tracking-[0.25em] flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  <MessageCircle className="h-4 w-4" /> Send directly via WhatsApp
                </a>
              </div>
            </form>
          )}
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
            Nova Nancy is the private atelier of <span className="text-foreground">Mau</span>, a
            single designer who takes each commission from first sketch to final fitting. No
            production line, no handovers: you speak to the person cutting your cloth.
          </p>
          <p className="mb-8 text-muted-foreground md:text-lg">
            Follow the studio day to day, fittings, fabric runs, and behind the scenes cuts, on
            Instagram <span className="text-foreground">mau_real91</span>, Snapchat{" "}
            <span className="text-foreground">mau.real91</span>, and TikTok{" "}
            <span className="text-foreground">@{TIKTOK_HANDLE}</span>.
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
              <div className="font-serif text-3xl md:text-4xl">1</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Designer, start to finish
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
    {
      n: "01",
      title: "Hand cut by master tailors",
      desc: "Every panel drafted from your measurements, no digital pattern reused.",
    },
    {
      n: "02",
      title: "Fabric sourced ethically",
      desc: "Silk from Como, wool from Yorkshire, cotton from Egypt. Traceable to the mill.",
    },
    {
      n: "03",
      title: "Direct designer dialogue",
      desc: "Direct communication with Mau throughout each fitting stage, with updates and photos.",
    },
    {
      n: "04",
      title: "Lifetime alteration promise",
      desc: "Bodies change. Your garments should too: free alterations on custom pieces.",
    },
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
            <span className="eyebrow mb-3 block">@{TIKTOK_HANDLE} on TikTok · @mau_real91 on Instagram</span>
            <h2 className="font-serif text-4xl md:text-5xl">
              Pieces from the <span className="italic">atelier</span>.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors hover:text-accent"
            >
              <TikTokIcon className="h-4 w-4" /> Watch on TikTok
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors hover:text-accent"
            >
              <Instagram className="h-4 w-4" /> Follow Mau
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3">
          {galleryImages.map((img, i) => (
            <a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden"
            >
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
  const contactChannels = [
    {
      title: "Phone Call",
      handle: PHONE_DISPLAY,
      desc: "Speak directly with the atelier during studio hours",
      href: `tel:${PHONE_RAW}`,
      label: "Call Now",
      icon: Phone,
      color: "text-foreground",
    },
    {
      title: "WhatsApp",
      handle: "+233 55 050 1177",
      desc: "Instant fittings, sketches, fabrics & quotation inquiries",
      href: WHATSAPP_URL,
      label: "Message Mau",
      icon: MessageCircle,
      color: "text-[#25D366]",
    },
    {
      title: "Instagram",
      handle: `@${INSTAGRAM_HANDLE}`,
      desc: "Daily atelier fittings, lookbooks, and behind the scenes",
      href: INSTAGRAM_URL,
      label: "Follow & DM",
      icon: Instagram,
      color: "text-accent",
    },
    {
      title: "Snapchat",
      handle: `@${SNAPCHAT_HANDLE}`,
      desc: "Live atelier stories, fabric hauls, and client fittings",
      href: SNAPCHAT_URL,
      label: "Add on Snapchat",
      icon: SnapchatIcon,
      color: "text-accent",
    },
    {
      title: "TikTok",
      handle: `@${TIKTOK_HANDLE}`,
      desc: "Couture draping, runway reveals, and tailoring process videos",
      href: TIKTOK_URL,
      label: "Watch on TikTok",
      icon: TikTokIcon,
      color: "text-foreground",
    },
  ];

  return (
    <section id="contact" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <span className="eyebrow mb-4 block">Connect with Mau</span>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">
            Get in touch <span className="italic">directly</span>.
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Nova Nancy is an intimate, private studio. Reach Mau personally across any of her direct
            channels for appointments, bespoke commissions, and ready-to-wear inquiries.
          </p>
        </div>

        {/* 5 Prominent Contact Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-16">
          {contactChannels.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith("tel:") ? undefined : "_blank"}
                rel={c.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
                className="group flex flex-col justify-between border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Icon className={`h-6 w-6 ${c.color}`} />
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </div>
                  <div className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {c.title}
                  </div>
                  <div className="mt-1 font-serif text-lg font-medium text-foreground">
                    {c.handle}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {c.desc}
                  </p>
                </div>
                <div className="mt-6 border-t border-border/60 pt-4 text-[10px] uppercase tracking-[0.2em] font-medium text-accent">
                  {c.label} →
                </div>
              </a>
            );
          })}
        </div>

        {/* Atelier Location & Studio Details */}
        <div className="grid gap-12 lg:grid-cols-12 items-center border border-border bg-beige p-8 md:p-12">
          <div className="lg:col-span-6 space-y-6">
            <span className="eyebrow block">Private Atelier</span>
            <h3 className="font-serif text-3xl md:text-4xl">Visit the Studio</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Appointments are held by appointment at our Walantu Street studio in Kasoa, Ghana.
              In-home VIP fittings and global virtual sessions are available upon request.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 text-accent shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Address
                  </div>
                  <div className="text-sm font-medium mt-0.5">Kasoa, Walantu Street, Ghana</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-5 w-5 text-accent shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Email Concierge
                  </div>
                  <div className="text-sm font-medium mt-0.5">studio@novanancy.com</div>
                </div>
              </div>
            </div>
            <div className="pt-4 flex flex-wrap gap-3">
              <WhatsAppButton variant="inline" label="Chat on WhatsApp" />
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border bg-background px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
              >
                Instagram @{INSTAGRAM_HANDLE}
              </a>
              <a
                href={SNAPCHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border bg-background px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
              >
                Snapchat @{SNAPCHAT_HANDLE}
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border bg-background px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
              >
                TikTok @{TIKTOK_HANDLE}
              </a>
              <a
                href={`tel:${PHONE_RAW}`}
                className="border border-border bg-background px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
              >
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 overflow-hidden border border-border h-[320px] md:h-[380px]">
            <iframe
              title="Nova Nancy Atelier location"
              src="https://www.google.com/maps?q=Kasoa,Walantu+Street,Ghana&output=embed"
              className="h-full w-full grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
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
            The private atelier of Mau: one designer, one client at a time. Every garment cut,
            fitted, and finished by hand.
          </p>
          <div className="mt-8">
            <SocialLinks variant="dark" includeWhatsApp />
          </div>
          <div className="mt-4 text-[10px] uppercase tracking-[0.25em]">
            IG mau_real91 · Snap mau.real91 · TikTok @mau.real91 · Tel +233 (0) 55 050 1177
          </div>
        </div>
        <div>
          <h4 className="mb-6 text-[10px] uppercase tracking-[0.25em] text-primary-foreground">
            Atelier
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/shop" className="hover:text-accent">
                Collections & Boutique
              </Link>
            </li>
            <li>
              <Link to="/custom-order" className="hover:text-accent">
                Bespoke Tailoring
              </Link>
            </li>
            <li>
              <Link to="/designers" className="hover:text-accent">
                Meet Mau
              </Link>
            </li>
            <li>
              <a href="#contact" className="hover:text-accent">
                Visit Atelier
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 text-[10px] uppercase tracking-[0.25em] text-primary-foreground">
            Client Concierge
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#booking" className="hover:text-accent">
                Book Private Fitting
              </a>
            </li>
            <li>
              <Link to="/custom-order" className="hover:text-accent">
                Design Your Garment
              </Link>
            </li>
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#25D366]"
              >
                WhatsApp Atelier
              </a>
            </li>
            <li>
              <Link to="/admin/requests" className="text-primary-foreground/30 hover:text-accent text-xs">
                Atelier Staff Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-20 flex max-w-7xl flex-col justify-between gap-3 border-t border-primary-foreground/10 pt-8 text-[10px] uppercase tracking-[0.25em] sm:flex-row">
        <span>© 2026 Nova Nancy Atelier · Kasoa, Ghana</span>
        <span>Designed for the exceptional</span>
      </div>
    </footer>
  );
}
