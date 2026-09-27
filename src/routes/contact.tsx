import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton, WHATSAPP_URL } from "@/components/whatsapp-button";
import {
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  SNAPCHAT_URL,
  SNAPCHAT_HANDLE,
  TIKTOK_URL,
  TIKTOK_HANDLE,
  PHONE_DISPLAY,
  PHONE_RAW,
  SnapchatIcon,
  TikTokIcon,
} from "@/components/social-links";
import { Instagram, Phone, MessageCircle, MapPin, Clock, ShieldCheck, Sparkles, ArrowUpRight } from "lucide-react";
import founder from "@/assets/founder.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Mau | Nova Nancy Atelier" },
      {
        name: "description",
        content:
          "Reach Mau directly on WhatsApp, TikTok (@mau.real91), Instagram (@mau_real91), Snapchat (mau.real91), or phone. Book bespoke bridal, tailoring, and traditional Ghanaian couture consultations.",
      },
      { property: "og:title", content: "Contact Mau | Nova Nancy Atelier" },
      {
        property: "og:description",
        content:
          "One artisan, every stitch. Reach Mau on WhatsApp, TikTok, Instagram, Snapchat, and phone.",
      },
    ],
  }),
  component: ContactPage,
});

const contactMethods = [
  {
    name: "WhatsApp",
    handle: PHONE_DISPLAY,
    detail: "Fastest response for bridal orders, fitting requests, and fabric advice.",
    actionText: "Chat on WhatsApp",
    url: WHATSAPP_URL,
    icon: MessageCircle,
    badge: "Instant Reach",
    accentBorder: "hover:border-[#25D366]/60",
    badgeColor: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30",
  },
  {
    name: "TikTok",
    handle: `@${TIKTOK_HANDLE}`,
    detail: "Watch behind-the-scenes draping, cutting techniques, fitting reveals & runway pieces.",
    actionText: "Watch on TikTok",
    url: TIKTOK_URL,
    icon: TikTokIcon,
    badge: "Videos & Reveals",
    accentBorder: "hover:border-foreground/60",
    badgeColor: "bg-foreground/10 text-foreground border-foreground/30",
  },
  {
    name: "Instagram",
    handle: `@${INSTAGRAM_HANDLE}`,
    detail: "Explore daily atelier stories, finished client commissions, and editorial lookbooks.",
    actionText: "Follow on Instagram",
    url: INSTAGRAM_URL,
    icon: Instagram,
    badge: "Lookbook & Stories",
    accentBorder: "hover:border-accent/60",
    badgeColor: "bg-accent/10 text-accent border-accent/30",
  },
  {
    name: "Snapchat",
    handle: SNAPCHAT_HANDLE,
    detail: "Real-time fabric sourcing, in-progress embroidery, and direct designer snaps.",
    actionText: "Add on Snapchat",
    url: SNAPCHAT_URL,
    icon: SnapchatIcon,
    badge: "Atelier Snaps",
    accentBorder: "hover:border-[#FFFC00]/60",
    badgeColor: "bg-[#FFFC00]/10 text-[#000000] dark:text-[#FFFC00] border-[#FFFC00]/30",
  },
  {
    name: "Telephone",
    handle: PHONE_DISPLAY,
    detail: "Direct phone line to the atelier for time-sensitive consultations and client calls.",
    actionText: "Call Atelier Directly",
    url: `tel:${PHONE_RAW}`,
    icon: Phone,
    badge: "Direct Line",
    accentBorder: "hover:border-primary/60",
    badgeColor: "bg-primary/10 text-primary border-primary/30",
  },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero Header */}
      <section className="border-b border-border bg-beige px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="eyebrow block">Artisan Direct Contact</span>
          <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
            Reach <span className="italic">Mau</span> directly.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Every garment at Nova Nancy is personally envisioned, cut, and hand-finished by Mau.
            Connect directly through any of our official channels below to discuss custom bespoke commissions, bridal fittings, or traditional couture.
          </p>
        </div>
      </section>

      {/* Main Social & Contact Channels */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-border/60 pb-6">
          <div>
            <span className="eyebrow block mb-1">Official Channels</span>
            <h2 className="font-serif text-2xl md:text-3xl">Connect on Social Media & Direct Lines</h2>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Personal replies from Mau
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contactMethods.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.name}
                href={c.url}
                target={c.url.startsWith("tel:") ? "_self" : "_blank"}
                rel={c.url.startsWith("tel:") ? undefined : "noopener noreferrer"}
                className={`group flex flex-col justify-between border border-border bg-card p-8 transition-all duration-300 hover:shadow-lg ${c.accentBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5 text-foreground transition-colors group-hover:text-accent" />
                    </div>
                    <span className={`border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                      {c.name}
                    </div>
                    <h3 className="mt-1 font-serif text-xl sm:text-2xl font-medium tracking-tight">
                      {c.handle}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {c.detail}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors group-hover:text-accent">
                  <span>{c.actionText}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            );
          })}

          {/* Atelier Consultation Info Card */}
          <div className="flex flex-col justify-between border border-border/80 bg-beige p-8">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <span className="border border-border bg-background px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  By Appointment
                </span>
              </div>

              <div className="mt-6">
                <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  In-Studio Fitting
                </div>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl font-medium tracking-tight">
                  Kasoa Atelier
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Greater Accra & Central Region, Ghana. Private one-on-one appointments for fabric selection and precision measurement.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>Mon – Sat: 9:00 AM – 6:00 PM GMT</span>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-border/50 pt-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-accent hover:underline"
              >
                Schedule Atelier Visit <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Direct Artisan Note */}
        <div className="mt-16 border border-border bg-card p-8 md:p-12">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
            <div className="flex items-center gap-6 md:col-span-2">
              <img
                src={founder}
                alt="Mau, Artisan & Designer"
                className="h-20 w-20 md:h-24 md:w-24 shrink-0 rounded-full object-cover ring-2 ring-accent/30"
              />
              <div>
                <span className="eyebrow block">Personal Guarantee</span>
                <h3 className="mt-1 font-serif text-2xl md:text-3xl">
                  One artisan, every stitch.
                </h3>
                <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                  "When you reach out, you are talking directly with me — not an assistant. I personally answer your questions, advise on silhouettes, source your fabrics, and cut every pattern." — <strong>Mau</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white hover:bg-[#20ba59] transition-colors w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" /> Message on WhatsApp
              </a>
              <Link
                to="/custom-order"
                className="inline-flex items-center justify-center gap-2 border border-primary px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.25em] text-primary hover:bg-primary hover:text-primary-foreground transition-colors w-full sm:w-auto"
              >
                <Sparkles className="h-3.5 w-3.5" /> Book Fitting / Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton variant="fab" />
    </div>
  );
}
