import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import {
  CheckCircle2,
  MessageCircle,
  Download,
  ArrowRight,
  Sparkles,
  Clock,
  Copy,
  Check,
  Phone,
  FileText,
  ExternalLink,
  Printer,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getBespokeOrderForWhatsApp } from "@/lib/custom-orders.functions";
import { MAU_WHATSAPP_NUMBER } from "@/lib/bespoke-whatsapp";
import { BespokeOrderDossier } from "@/components/bespoke-order-dossier";
import { downloadOrderPdf, shareOrderPdfToWhatsApp } from "@/lib/bespoke-pdf";
import type { StoredCustomOrder } from "@/lib/custom-orders.storage";
import { toast } from "sonner";

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
          "Your bespoke custom order is ready to send to artisan Mau on WhatsApp.",
      },
      { property: "og:title", content: "Bespoke Request Confirmed | Nova Nancy" },
      { property: "og:description", content: "Connect with artisan Mau on WhatsApp for your custom fashion commission." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirmed,
});

function Confirmed() {
  const { ref } = useSearch({ from: "/order-confirmed" });
  const fetchOrder = useServerFn(getBespokeOrderForWhatsApp);
  const dossierRef = useRef<HTMLDivElement>(null);

  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    fullName: string;
    clothingType: string | null;
    selectedDesign: string | null;
    whatsappUrl: string;
    whatsappMessage: string;
    createdAt: string;
    order?: StoredCustomOrder;
  } | null>(null);

  const [savedWaUrl, setSavedWaUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [sharingPdf, setSharingPdf] = useState(false);

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
        if (data) setOrderData(data as any);
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

  const origin = typeof window !== "undefined" ? window.location.origin : "https://novanancy.com";
  const dossierUrl = `${origin}/order-dossier?ref=${ref}`;

  const defaultWaText = encodeURIComponent(
    `✨ *NEW BESPOKE COMMISSION - NOVA NANCY ATELIER* ✨\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `*Order Ref:* ${ref}\n` +
    (orderData?.fullName ? `*Client:* ${orderData.fullName}\n` : "") +
    (orderData?.clothingType ? `*Garment:* ${orderData.clothingType}\n` : "") +
    (orderData?.selectedDesign ? `*Design:* ${orderData.selectedDesign}\n` : "") +
    (orderData?.order?.delivery_address ? `*Fitting Location:* ${orderData.order.delivery_address}\n` : "") +
    (orderData?.order?.event_type ? `*Occasion:* ${orderData.order.event_type}\n` : "") +
    (orderData?.order?.required_date ? `*Needed By:* ${orderData.order.required_date}\n` : "") +
    `\n` +
    `📄 *Official Order PDF Dossier:* ${dossierUrl}\n` +
    `*(I have downloaded my official order PDF to share with you in this chat)*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `_Hello Mau, please review my bespoke commission PDF and advise on fitting!_`
  );

  const waLink = `https://wa.me/${MAU_WHATSAPP_NUMBER}?text=${defaultWaText}`;

  function handleCopyMessage() {
    if (orderData?.whatsappMessage) {
      navigator.clipboard.writeText(orderData.whatsappMessage);
      setCopied(true);
      toast.success("Order message copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handlePrimaryButtonClick() {
    if (dossierRef.current && ref) {
      downloadOrderPdf(dossierRef.current, ref, orderData?.order);
      toast.success("Order PDF downloaded! You can now attach it in your WhatsApp chat with Mau.", {
        duration: 6000,
      });
    }
  }

  async function handleDownloadPdf() {
    if (!dossierRef.current || !ref) return;
    setDownloadingPdf(true);
    try {
      await downloadOrderPdf(dossierRef.current, ref, orderData?.order);
      toast.success("Order PDF downloaded successfully!");
    } catch (e) {
      console.error("PDF generation failed:", e);
      toast.error("Could not generate PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  }

  return (
    <div className="min-h-screen bg-beige">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-20 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366]">
          <CheckCircle2 className="h-9 w-9 text-[#25D366]" />
        </div>

        <span className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#25D366] font-semibold bg-[#25D366]/10 border border-[#25D366]/20">
          <Sparkles className="h-3 w-3" /> Bespoke Order Ready
        </span>

        <h1 className="mt-3 font-serif text-3xl md:text-5xl">
          Connect with Mau on WhatsApp
        </h1>
        <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground leading-relaxed">
          Your bespoke commission details, body measurements, and styling requests have been compiled and are ready to send directly to Artisan Mau's personal WhatsApp.
        </p>

        {/* Hero WhatsApp Action Card */}
        <div className="mt-8 border-2 border-[#25D366] bg-background p-6 md:p-8 text-left shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#25D366]">
                <MessageCircle className="h-4 w-4 fill-current" />
                <span>Designer's Personal WhatsApp</span>
              </div>
              <div className="mt-1 font-serif text-2xl text-foreground font-bold">
                Mau · Nova Nancy Atelier
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Kasoa Studio · Ghana (+233 55 050 1177)
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Order Ref</span>
              <div className="font-mono text-lg font-bold text-accent">{ref}</div>
            </div>
          </div>

          <div className="py-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Click below to download your official order PDF dossier and open WhatsApp directly with designer Mau to share your commission:
            </p>

            <div className="mt-5 space-y-3">
              {/* Direct Unblockable Link to WhatsApp with Synchronous PDF Download */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePrimaryButtonClick}
                className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 px-6 text-sm uppercase tracking-[0.2em] font-bold hover:bg-[#20ba59] transition-all shadow-md hover:shadow-xl group cursor-pointer"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                <span>Send PDF Order to Designer on WhatsApp</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              {/* Informative Guidance Banner */}
              <div className="flex items-start gap-2.5 rounded bg-[#25D366]/10 border border-[#25D366]/20 p-3 text-xs text-foreground/80">
                <span className="text-base leading-none">💡</span>
                <p className="leading-relaxed">
                  <strong>Easy sharing:</strong> Clicking above downloads your <strong>Order PDF Dossier</strong> and opens WhatsApp directly to Mau's chat (<strong>+233 55 050 1177</strong>). Simply tap the attachment icon (📎 or +) in WhatsApp to attach the downloaded PDF file!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  disabled={downloadingPdf}
                  onClick={handleDownloadPdf}
                  className="flex items-center justify-center gap-2 border border-border bg-secondary/60 hover:bg-secondary py-3 px-4 text-xs uppercase tracking-[0.15em] font-medium transition-colors"
                >
                  {downloadingPdf ? (
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  ) : (
                    <Download className="h-4 w-4 text-accent" />
                  )}
                  <span>Download PDF Dossier</span>
                </button>

                <Link
                  to="/order-dossier"
                  search={{ ref }}
                  target="_blank"
                  className="flex items-center justify-center gap-2 border border-border bg-secondary/60 hover:bg-secondary py-3 px-4 text-xs uppercase tracking-[0.15em] font-medium transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-accent" />
                  <span>Fullscreen & Print PDF</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Message Preview Box */}
          {orderData?.whatsappMessage && (
            <div className="mt-2 border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  WhatsApp Accompanying Text Preview
                </span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-accent hover:underline"
                >
                  {copied ? <Check className="h-3 w-3 text-[#25D366]" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copied" : "Copy text"}</span>
                </button>
              </div>
              <div className="max-h-36 overflow-y-auto bg-secondary/40 p-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap border border-border">
                {orderData.whatsappMessage}
              </div>
            </div>
          )}
        </div>

        {/* Live Bespoke Order Dossier Preview (Rendered & Used for PDF export) */}
        <div className="mt-12 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              <h2 className="font-serif text-xl font-bold text-foreground">
                Official Bespoke Order Dossier
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 text-accent hover:underline font-medium"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save PDF</span>
              </button>
              <span className="text-muted-foreground">·</span>
              <Link
                to="/order-dossier"
                search={{ ref }}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-accent hover:underline font-medium"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open in Tab</span>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden shadow-md border border-border bg-white p-2 sm:p-4">
            <BespokeOrderDossier
              ref={dossierRef}
              order={
                orderData?.order || {
                  order_number: ref,
                  full_name: orderData?.fullName,
                  clothing_type: orderData?.clothingType,
                  selected_design: orderData?.selectedDesign,
                  created_at: orderData?.createdAt,
                }
              }
              submittedDate={submitted}
            />
          </div>
        </div>

        {/* Support Note & Direct Call */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Mau is active on WhatsApp 8:00 AM – 8:00 PM GMT.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/track"
              search={{ ref }}
              className="text-accent hover:underline font-medium uppercase tracking-[0.1em]"
            >
              Track Status →
            </Link>
            <a
              href="tel:+233550501177"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+233 55 050 1177</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
