import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useRef } from "react";
import { getBespokeOrderForWhatsApp } from "@/lib/custom-orders.functions";
import { BespokeOrderDossier } from "@/components/bespoke-order-dossier";
import { downloadOrderPdf, shareOrderPdfToWhatsApp } from "@/lib/bespoke-pdf";
import { MessageCircle, Download, Printer, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import type { StoredCustomOrder } from "@/lib/custom-orders.storage";

export const Route = createFileRoute("/order-dossier")({
  validateSearch: (s: Record<string, unknown>) => ({
    ref: typeof s["ref"] === "string" ? s["ref"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Bespoke Order Dossier PDF | Nova Nancy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderDossierPage,
});

function OrderDossierPage() {
  const { ref } = useSearch({ from: "/order-dossier" });
  const fetchOrder = useServerFn(getBespokeOrderForWhatsApp);
  const dossierRef = useRef<HTMLDivElement>(null);

  const [order, setOrder] = useState<StoredCustomOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }
    fetchOrder({ data: { orderNumber: ref } })
      .then((res) => {
        if (res && res.order) {
          setOrder(res.order as StoredCustomOrder);
        }
      })
      .catch((err) => {
        console.warn("[order-dossier] Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [ref, fetchOrder]);

  async function handleDownloadPdf() {
    if (!dossierRef.current || !ref) return;
    setGeneratingPdf(true);
    try {
      await downloadOrderPdf(dossierRef.current, ref);
    } finally {
      setGeneratingPdf(false);
    }
  }

  async function handleShareWhatsApp() {
    if (!dossierRef.current || !ref) return;
    const clientName = order?.full_name || "Valued Client";
    const dossierUrl = typeof window !== "undefined" ? window.location.href : `https://novanancy.com/order-dossier?ref=${ref}`;
    await shareOrderPdfToWhatsApp(dossierRef.current, ref, clientName, dossierUrl);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
        <div className="flex items-center gap-3 text-sm text-[#555]">
          <Loader2 className="h-5 w-5 animate-spin text-[#9c7b2c]" />
          <span>Generating bespoke order dossier...</span>
        </div>
      </div>
    );
  }

  if (!order && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f5f0] p-6 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#111]">Order Not Found</h1>
        <p className="mt-2 text-sm text-[#666]">
          We could not locate bespoke order reference <strong>{ref || "N/A"}</strong>.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 bg-[#121212] text-white px-5 py-2.5 text-xs uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Atelier
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ede8e1] py-6 sm:py-10 px-3 sm:px-6">
      {/* Floating Action Toolbar (Hidden during Print) */}
      <div className="max-w-[680px] mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#121212] text-white p-3.5 shadow-md print:hidden">
        <Link
          to="/order-confirmed"
          search={{ ref }}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#cbb479] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#20ba59] transition-all shadow-sm"
          >
            <MessageCircle className="h-3.5 w-3.5 fill-current" />
            <span>Send PDF on WhatsApp</span>
          </button>

          <button
            type="button"
            disabled={generatingPdf}
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 bg-[#2b2b2b] text-white px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] hover:bg-[#3d3d3d] transition-colors border border-[#444]"
          >
            {generatingPdf ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-white text-[#111] px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] hover:bg-[#eee] transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* The Printable Dossier Container */}
      <div className="print:m-0 print:p-0">
        <BespokeOrderDossier
          ref={dossierRef}
          order={order || { order_number: ref }}
        />
      </div>
    </div>
  );
}
