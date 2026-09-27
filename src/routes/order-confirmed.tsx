import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { CheckCircle2, MessageCircle, Download, ArrowRight, Sparkles, Clock, Copy, Check, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { getBespokeOrderForWhatsApp } from "@/lib/custom-orders.functions";
import { MAU_WHATSAPP_NUMBER } from "@/lib/bespoke-whatsapp";
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
  const [copied, setCopied] = useState(false);

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

  function handleCopyMessage() {
    if (orderData?.whatsappMessage) {
      navigator.clipboard.writeText(orderData.whatsappMessage);
      setCopied(true);
      toast.success("Order message copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  }

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
  <p><strong>Artisan WhatsApp:</strong> +233 55 050 1177</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;" />
  <p style="font-size:12px;color:#666;">Mau will review your measurements and guide you through production. Track your status anytime at /track.</p>
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
              Tap the button below to open WhatsApp with your full commission dossier pre-loaded. Mau will review your measurements and give you an immediate personal response.
            </p>

            <div className="mt-5">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 px-6 text-sm uppercase tracking-[0.2em] font-bold hover:bg-[#20ba59] transition-all shadow-md hover:shadow-xl group"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                <span>Send Order to Mau on WhatsApp</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Message Preview Box */}
          {orderData?.whatsappMessage && (
            <div className="mt-2 border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Pre-Loaded WhatsApp Message Preview
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
              <div className="max-h-40 overflow-y-auto bg-secondary/50 p-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap border border-border">
                {orderData.whatsappMessage}
              </div>
            </div>
          )}
        </div>

        {/* Order Details Dossier */}
        <div className="mt-8 border border-border bg-background p-6 md:p-8 text-left shadow-sm">
          <div className="flex flex-wrap items-center justify-between border-b border-border pb-4 gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Order Reference</span>
              <div className="font-serif text-2xl text-foreground font-bold">{ref}</div>
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
              <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Studio Channel</dt>
              <dd className="mt-1 font-medium text-[#25D366] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#25D366]" />
                WhatsApp Direct (+233 55 050 1177)
              </dd>
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
              href="tel:+233550501177"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors"
            >
              <Phone className="h-3.5 w-3.5" /> Call Mau directly
            </a>
          </div>
        </div>

        {/* Support Note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Mau is typically available on WhatsApp between 8:00 AM and 8:00 PM GMT.</span>
        </div>
      </main>
    </div>
  );
}
