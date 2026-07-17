import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { PRODUCT_BY_HANDLE_QUERY, storefrontApiRequest } from "@/lib/shopify";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/components/shop/product-card";
import { Loader2, Minus, Plus, Lock, Truck, Receipt, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
  errorComponent: ProductError,
  notFoundComponent: () => <div className="p-10 text-center">Not found</div>,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["shopify-product", handle],
    queryFn: async () => {
      const res = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
      return res?.data?.product;
    },
  });

  const variants = data?.variants?.edges || [];
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedVariantId && variants[0]?.node?.id) setSelectedVariantId(variants[0].node.id);
  }, [variants, selectedVariantId]);

  const selectedVariant = useMemo(
    () => variants.find((v: { node: { id: string } }) => v.node.id === selectedVariantId)?.node || variants[0]?.node,
    [variants, selectedVariantId],
  );

  const addItem = useCartStore((s) => s.addItem);
  const isLoadingCart = useCartStore((s) => s.isLoading);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = async () => {
    if (!data || !selectedVariant) return;
    await addItem({
      product: { node: data },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success(`${data.title} added to bag`, { position: "top-center" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="font-serif text-3xl">Piece not found</p>
          <Link to="/shop" className="mt-6 inline-block text-xs uppercase tracking-[0.25em] hover:text-accent">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const image = data.images?.edges?.[0]?.node;
  const price = selectedVariant?.price || data.priceRange.minVariantPrice;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <div className="aspect-[3/4] w-full overflow-hidden bg-secondary/20">
          {image && <img src={image.url} alt={image.altText || data.title} className="h-full w-full object-cover" />}
        </div>
        <div className="flex flex-col justify-center">
          <span className="eyebrow">Nova Nancy</span>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">{data.title}</h1>
          <p className="mt-4 text-lg">{formatPrice(price.amount, price.currencyCode)}</p>
          {data.description && <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{data.description}</p>}

          {variants.length > 1 && (
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Variant</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((v: { node: { id: string; title: string; availableForSale: boolean } }) => (
                  <button
                    key={v.node.id}
                    onClick={() => setSelectedVariantId(v.node.id)}
                    disabled={!v.node.availableForSale}
                    className={`border px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                      selectedVariantId === v.node.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-accent"
                    } disabled:opacity-40`}
                  >
                    {v.node.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleAdd}
            disabled={isLoadingCart || !selectedVariant?.availableForSale}
            size="lg"
            className="mt-8"
          >
            {isLoadingCart ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : selectedVariant?.availableForSale ? (
              "Add to Bag"
            ) : (
              "Sold Out"
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}

function ProductError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="p-10 text-center">
      <p className="font-serif text-2xl">Couldn't load this piece</p>
      <button
        className="mt-4 bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground"
        onClick={() => {
          router.invalidate();
          reset();
        }}
      >
        Try again
      </button>
    </div>
  );
}
