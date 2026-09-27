import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useRef } from "react";
import { getBespokeOrderForWhatsApp } from "@/lib/custom-orders.functions";
import { BespokeOrderDossier } from "@/components/bespoke-order-dossier";
import { downloadOrderPdf } from "@/lib/bespoke-pdf";
import { MAU_WHATSAPP_NUMBER, generateBespokeWhatsAppMessage } from "@/lib/bespoke-whatsapp";
import { decodeOrderData, encodeOrderData } from "@/lib/bespoke-order-codec";
import { MessageCircle, Download, Printer, ArrowLeft, Loader2 } from "lucide-react";
import type { StoredCustomOrder } from "@/lib/custom-orders.storage";
import { toast } from "sonner";

export const Route = createFileRoute("/order-dossier")({
  validateSearch: (s: Record<string, unknown>) => ({
    ref: typeof s["ref"] === "string" ? s["ref"] : "",
    d: typeof s["d"] === "string" ? s["d"] : undefined,
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
  const { ref, d } = useSearch({ from: "/order-dossier" });
  const fetchOrder = useServerFn(getBespokeOrderForWhatsApp);
  const dossierRef = useRef<HTMLDivElement>(null);

  const [order, setOrder] = useState<StoredCustomOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    let resolved: StoredCustomOrder | null = null;

    // 1. Immediately decode from URL payload if present
    if (d) {
      resolved = decodeOrderData(d);
      if (resolved) {
        setOrder(resolved);
        setLoading(false);
        try {
          const jsonStr = JSON.stringify(resolved);
          sessionStorage.setItem(`bespoke_order_${resolved.order_number}`, jsonStr);
          localStorage.setItem(`bespoke_order_${resolved.order_number}`, jsonStr);
        } catch (_) {}
      }
    }

    // 2. Check local/session browser storage
    if (!resolved && ref && typeof window !== "undefined") {
      try {
        const stored =
          sessionStorage.getItem(`bespoke_order_${ref}`) ||
          localStorage.getItem(`bespoke_order_${ref}`) ||
          sessionStorage.getItem("bespoke_order_latest");
        if (stored) {
          resolved = JSON.parse(stored) as StoredCustomOrder;
          setOrder(resolved);
          setLoading(false);
        }
      } catch (_) {}
    }

    // 3. Query server in parallel to fetch from DB / memory
    if (ref) {
      fetchOrder({ data: { orderNumber: ref, dataPayload: d } })
        .then((res) => {
          if (res && res.order && (res.order as any).full_name) {
            setOrder(res.order as StoredCustomOrder);
          }
        })
        .catch((err) => {
          console.warn("[order-dossier] Server fetch error:", err);
        })
        .finally(() => setLoading(false));
    } else if (!resolved) {
      setLoading(false);
    }
  }, [ref, d, fetchOrder]);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://nova-stitch-studio.vercel.app";
  const activeOrder = order || { order_number: ref || "NN-PENDING" };
  const encodedPayload = d || (order ? encodeOrderData(order) : "");
  const dossierUrl = `${origin}/order-dossier?ref=${encodeURIComponent(activeOrder.order_number || ref)}${encodedPayload ? `&d=${encodedPayload}` : ""}`;

  const defaultWaText = encodeURIComponent(
    generateBespokeWhatsAppMessage(activeOrder, origin)
  );

  const waLink = `https://wa.me/${MAU_WHATSAPP_NUMBER}?text=${defaultWaText}`;

  async function handleDownloadPdf() {
    if (!dossierRef.current || !activeOrder) return;
    setGeneratingPdf(true);
    try {
      await downloadOrderPdf(dossierRef.current, activeOrder.order_number || ref, activeOrder);
      toast.success("Order PDF downloaded successfully!");
    } finally {
      setGeneratingPdf(false);
    }
  }

  function handleShareWhatsApp() {
    if (dossierRef.current && activeOrder) {
      downloadOrderPdf(dossierRef.current, activeOrder.order_number || ref, activeOrder);
      toast.success("Order PDF downloaded! You can now attach it in your chat with Mau.", {
        duration: 6000,
      });
    }
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
          search={{ ref, d: encodedPayload || undefined }}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#cbb479] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#20ba59] transition-all shadow-sm cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5 fill-current" />
            <span>Send PDF on WhatsApp</span>
          </a>

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
