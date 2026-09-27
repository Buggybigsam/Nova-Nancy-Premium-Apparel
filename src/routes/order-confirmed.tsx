import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { CheckCircle2, MessageCircle, Mail, Download, ArrowRight, Sparkles, Clock, Check, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { getBespokeOrderForWhatsApp } from "@/lib/custom-orders.functions";
import { MAU_WHATSAPP_NUMBER } from "@/lib/bespoke-whatsapp";

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (s: Record<string, unknown>) => ({
    ref: typeof s["ref"] === "string" ? s["ref"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Bespoke Request Confirmed | Nova Nancy Atelier" },
      {
        name: "description",
        content:
          "Your bespoke custom order has been received by Nova Nancy Atelier and transmitted to the designer.",
      },
      { property: "og:title", content: "Bespoke Request Confirmed | Nova Nancy" },
      { property: "og:description", content: "Your bespoke order has reached Nova Nancy Atelier." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirmed,
});

function Confirmed() {
  const { ref } = useSearch({ from: "/order-confirmed" });
  const fetchOrder = useServerFn(getBespokeOrderForWhatsApp);

  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    fullName: string;
    clothingType: string | null;
    selectedDesign: string | null;
    whatsappUrl: string;
    whatsappMessage: string;
    createdAt: string;
  } | null>(null);

  const [savedWaUrl, setSavedWaUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && ref) {
      const cached = sessionStorage.getItem(`order_wa_${ref}`);
      if (cached) setSavedWaUrl(cached);
    }
  }, [ref]);

  useEffect(() => {
    if (!ref) return;
    fetchOrder({ data: { orderNumber: ref } })
      .then((data) => {
        if (data) setOrderData(data);
      })
      .catch((err) => {
        console.warn("[order-confirmed] Could not load order details:", err);
      });
  }, [ref, fetchOrder]);

  const submitted = orderData?.createdAt
    ? new Date(orderData.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const defaultWaText = encodeURIComponent(
    `Hello Mau, I have just submitted bespoke commission ${ref} on the Nova Nancy website. I would like to finalize my fitting and consultation details with you.`
  );
  const waLink = orderData?.whatsappUrl || savedWaUrl || `https://wa.me/${MAU_WHATSAPP_NUMBER}?text=${defaultWaText}`;

  function downloadSummary() {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Nova Nancy - ${ref}</title></head>
<body style="font-family:Georgia,serif;padding:40px;color:#111;max-width:700px;margin:0 auto;line-height:1.6;">
  <div style="text-align:center;border-bottom:2px solid #cbb479;padding-bottom:20px;margin-bottom:30px;">
    <h1 style="letter-spacing:.25em;font-size:22px;margin:0;">NOVA NANCY ATELIER</h1>
    <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#666;">Haute Couture · Kasoa, Ghana</p>
  </div>
  <h2>Bespoke Commission Reference: ${ref}</h2>
  ${orderData?.fullName ? `<p><strong>Client:</strong> ${orderData.fullName}</p>` : ""}
  ${orderData?.clothingType ? `<p><strong>Garment:</strong> ${orderData.clothingType}</p>` : ""}
  ${orderData?.selectedDesign ? `<p><strong>Design:</strong> ${orderData.selectedDesign}</p>` : ""}
  <p><strong>Submitted:</strong> ${submitted}</p>
  <p><strong>Status:</strong> Transmitted to Designer via Email & WhatsApp</p>
  <p><strong>Designer Email:</strong> vikponunancy1234@gmail.com</p>
  <p><strong>Artisan WhatsApp:</strong> +233 55 050 1177</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;" />
  <p style="font-size:12px;color:#666;">Mau will review your measurements and reach out within 24-48 hours. Track your status anytime at /track.</p>
</body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `nova-nancy-${ref}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-beige">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-20 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 border border-accent/30 text-accent">
          <CheckCircle2 className="h-9 w-9 text-accent" />
        </div>

        <span className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-accent font-semibold bg-accent/10 border border-accent/20">
          <Sparkles className="h-3 w-3" /> Commission Transmitted
        </span>

        <h1 className="mt-3 font-serif text-3xl md:text-5xl">
          Order Successfully Dispatched
        </h1>
        <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground leading-relaxed">
          Your bespoke commission has been recorded and routed through both official channels.
        </p>

        {/* Dual Delivery Highlights */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 text-left">
          {/* Email Confirmation Card */}
          <div className="border border-border bg-background p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9c7b2c]">
                <Mail className="h-4 w-4" />
                <span>1. Delivered to Designer Email</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                All measurements, fabric preferences, uploaded reference sketches, and event timelines have been sent directly to:
              </p>
              <div className="mt-3 font-mono text-xs bg-secondary/60 p-2.5 border border-border text-foreground font-semibold">
                vikponunancy1234@gmail.com
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#25D366] font-medium">
              <Check className="h-3.5 w-3.5" /> Sent via SendGrid
            </div>
          </div>

          {/* WhatsApp Direct Dispatch Card */}
          <div className="border border-[#25D366]/40 bg-[#25D366]/5 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#25D366]">
                <MessageCircle className="h-4 w-4" />
                <span>2. Direct WhatsApp to Mau</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Your order is pre-formatted for Artisan Mau's personal WhatsApp (<span className="text-foreground font-medium">+233 55 050 1177</span>) so you can discuss your fitting in real time.
              </p>
              <div className="mt-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 px-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#20ba59] transition-all shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="h-4 w-4 fill-current" />
                  <span>Send to Mau on WhatsApp</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            <div className="mt-3 text-[10px] text-muted-foreground text-center">
              1-tap direct chat with Mau in Kasoa
            </div>
          </div>
        </div>

        {/* Order Details Dossier */}
        <div className="mt-8 border border-border bg-background p-6 md:p-8 text-left shadow-sm">
          <div className="flex flex-wrap items-center justify-between border-b border-border pb-4 gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Order Reference</span>
              <div className="font-serif text-2xl md:text-3xl text-foreground font-bold">{ref}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Submission Date</span>
              <div className="text-sm font-medium text-foreground">{submitted}</div>
            </div>
          </div>

          <dl className="mt-6 grid gap-5 sm:grid-cols-2 text-sm">
            {orderData?.fullName && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Client Name</dt>
                <dd className="mt-1 font-semibold text-foreground">{orderData.fullName}</dd>
              </div>
            )}
            {orderData?.clothingType && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Garment Type</dt>
                <dd className="mt-1 font-semibold text-foreground">{orderData.clothingType}</dd>
              </div>
            )}
            {orderData?.selectedDesign && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Selected Design</dt>
                <dd className="mt-1 font-semibold text-foreground">{orderData.selectedDesign}</dd>
              </div>
            )}
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Studio Status</dt>
              <dd className="mt-1 font-medium text-accent">Pending Atelier Review & Quotation</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Expected Response</dt>
              <dd className="mt-1 text-muted-foreground">Within 24 hours via WhatsApp or Email</dd>
            </div>
          </dl>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadSummary}
                className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] hover:bg-secondary transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Summary HTML
              </button>
              <Link
                to="/track"
                search={{ ref }}
                className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-accent transition-colors"
              >
                Track Live
              </Link>
            </div>

            <a
              href={`mailto:vikponunancy1234@gmail.com?subject=${encodeURIComponent(`Nova Nancy Bespoke Commission [${ref}]`)}`}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors"
            >
              <Mail className="h-3.5 w-3.5" /> Email Nancy directly
            </a>
          </div>
        </div>

        {/* Support Note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Need immediate assistance? Call or WhatsApp Mau at <strong>+233 55 050 1177</strong>.</span>
        </div>
      </main>
    </div>
  );
}
