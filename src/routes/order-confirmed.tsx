import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { WHATSAPP_NUMBER } from "@/components/whatsapp-button";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (s: Record<string, unknown>) => ({
    ref: typeof s["ref"] === "string" ? s["ref"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Request received | Nova Nancy" },
      {
        name: "description",
        content:
          "Your bespoke request has reached Nova Nancy. Keep your reference number to track progress.",
      },
      { property: "og:title", content: "Request received | Nova Nancy" },
      { property: "og:description", content: "Your bespoke request has reached Nova Nancy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirmed,
});

function Confirmed() {
  const { ref } = useSearch({ from: "/order-confirmed" });
  const submitted = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Nova Nancy, I just submitted custom order ${ref}. I would like to continue the conversation here.`,
  )}`;

  function downloadSummary() {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${ref}</title></head>
<body style="font-family:Georgia,serif;padding:40px;color:#111">
<h1 style="letter-spacing:.2em;font-size:18px">NOVA NANCY</h1>
<h2>Custom order ${ref}</h2>
<p>Submitted: ${submitted}</p>
<p>Status: Order received</p>
<p>Expected response time: within 24 to 48 hours.</p>
<p>Track your order at /track using this reference and the email or phone you provided.</p>
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
      <main className="mx-auto max-w-2xl px-5 py-16 text-center md:px-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
        <h1 className="mt-6 font-serif text-4xl">
          Your custom fashion request has been successfully submitted.
        </h1>
        <div className="mt-8 border border-border bg-background p-8 text-left">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Order number
              </dt>
              <dd className="mt-1 font-serif text-2xl">{ref}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Submitted
              </dt>
              <dd className="mt-1">{submitted}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Current status
              </dt>
              <dd className="mt-1">Order received</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Expected response
              </dt>
              <dd className="mt-1">Within 24 to 48 hours</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-muted-foreground">
            Keep this reference. You can track progress at any time with your reference and the
            email or phone number you gave us.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={downloadSummary}
              className="border border-border px-5 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-secondary"
            >
              Download summary
            </button>
            <Link
              to="/track"
              search={{ ref }}
              className="bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent"
            >
              Track this order
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] px-5 py-3 text-[11px] uppercase tracking-[0.25em] text-white hover:bg-[#20ba59] transition-colors"
            >
              Continue on WhatsApp
            </a>
            <a
              href={`mailto:vikponunancy1234@gmail.com?subject=${encodeURIComponent(`Nova Nancy Custom Order ${ref}`)}`}
              className="border border-border px-5 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-secondary transition-colors"
            >
              Email Designer
            </a>
          </div>
          <div className="mt-6 flex items-center gap-2 rounded border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-xs text-foreground">
            <span className="h-2 w-2 rounded-full bg-[#25D366] shrink-0" />
            <span>All measurements and bespoke design details have been transmitted directly to the designer's email (<strong>vikponunancy1234@gmail.com</strong>) for immediate review.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
