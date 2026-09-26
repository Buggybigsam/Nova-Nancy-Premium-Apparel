import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@/lib/server-fn-compat";
import { SiteHeader } from "@/components/site-header";
import { trackCustomOrder } from "@/lib/custom-orders.functions";
import { TIMELINE, statusLabel } from "@/lib/custom-orders";
import { Loader2, Search, Check } from "lucide-react";

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>) =>
    ({ ref: typeof s["ref"] === "string" ? s["ref"] : undefined }) as { ref?: string },
  head: () => ({
    meta: [
      { title: "Track your custom order | Nova Nancy" },
      {
        name: "description",
        content:
          "Enter your Nova Nancy reference number and contact detail to see the current status of your bespoke garment.",
      },
      { property: "og:title", content: "Track your custom order | Nova Nancy" },
      {
        property: "og:description",
        content: "Follow your bespoke garment from request to delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackPage,
});

type Result = Awaited<ReturnType<typeof trackCustomOrder>>;

function TrackPage() {
  const { ref } = useSearch({ from: "/track" });
  const track = useServerFn(trackCustomOrder);
  const [orderNumber, setOrderNumber] = useState(ref ?? "");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setResult(await track({ data: { orderNumber, contact } }));
    } catch (err) {
      setResult(null);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const currentIndex = result ? TIMELINE.indexOf(result.status as never) : -1;

  return (
    <div className="min-h-screen bg-beige">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14 md:px-8">
        <span className="eyebrow">Order tracking</span>
        <h1 className="mt-2 font-serif text-4xl">Track your custom request</h1>
        <form
          onSubmit={lookup}
          className="mt-8 grid gap-4 border border-border bg-background p-6 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input
            className="border border-input bg-background px-4 py-3 text-sm"
            placeholder="NN-2026-000123"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />
          <input
            className="border border-input bg-background px-4 py-3 text-sm"
            placeholder="Email or phone on the order"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}{" "}
            Track
          </button>
        </form>

        {error && (
          <p className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <div className="border border-border bg-background p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-serif text-2xl">{result.orderNumber}</div>
                  <div className="text-sm text-muted-foreground">{result.fullName}</div>
                </div>
                <span className="bg-ink px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-cream">
                  {statusLabel(result.status)}
                </span>
              </div>
              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Payment
                  </dt>
                  <dd>{statusLabel(result.paymentStatus)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Quotation
                  </dt>
                  <dd>{result.price ? `${result.currency} ${result.price}` : "Pending"}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Needed by
                  </dt>
                  <dd>{result.requiredDate ?? "Not set"}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Piece
                  </dt>
                  <dd>{result.selectedDesign ?? result.clothingType ?? "Custom design"}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Files attached
                  </dt>
                  <dd>{result.fileCount}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Expected completion
                  </dt>
                  <dd>{result.expectedCompletion ?? "To be confirmed"}</dd>
                </div>
              </dl>
            </div>

            <div className="border border-border bg-background p-6">
              <h2 className="mb-5 text-[11px] uppercase tracking-[0.25em] text-accent">Progress</h2>
              <ol className="space-y-4">
                {TIMELINE.map((s, i) => {
                  const done = currentIndex >= i && currentIndex !== -1;
                  return (
                    <li key={s} className="flex items-center gap-3 text-sm">
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${done ? "border-accent bg-accent text-cream" : "border-border"}`}
                      >
                        {done && <Check className="h-3 w-3" />}
                      </span>
                      <span className={done ? "" : "text-muted-foreground"}>{statusLabel(s)}</span>
                    </li>
                  );
                })}
              </ol>
              {currentIndex === -1 && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Current stage: {statusLabel(result.status)}
                </p>
              )}
            </div>

            {result.messages.length > 0 && (
              <div className="border border-border bg-background p-6">
                <h2 className="mb-4 text-[11px] uppercase tracking-[0.25em] text-accent">
                  Messages from Nova Nancy
                </h2>
                <ul className="space-y-4">
                  {result.messages.map((m) => (
                    <li key={m.id} className="border-l-2 border-accent pl-4 text-sm">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {m.sender} · {new Date(m.created_at).toLocaleString()}
                      </div>
                      <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
