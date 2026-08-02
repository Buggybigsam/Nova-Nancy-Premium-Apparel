import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/shop/product-card";
import { PRODUCTS_QUERY, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop | Nova Nancy Atelier" },
      { name: "description", content: "Shop ready to wear and signature pieces from Nova Nancy's couture atelier." },
      { property: "og:title", content: "Shop | Nova Nancy Atelier" },
      { property: "og:description", content: "Ready to wear and signature pieces from Nova Nancy." },
    ],
  }),
  component: ShopPage,
  errorComponent: ShopError,
  notFoundComponent: () => <div className="p-10 text-center">Not found</div>,
});

function ShopPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["shopify-products"],
    queryFn: async () => {
      const res = await storefrontApiRequest(PRODUCTS_QUERY, { first: 24, query: null });
      return (res?.data?.products?.edges as ShopifyProduct[]) || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">The Boutique</span>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl">Shop the Atelier</h1>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            Signature ready to wear pieces, crafted in house. Every order supports our couture atelier.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center">
            <p className="font-serif text-2xl">No pieces yet</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Your Shopify catalogue is empty. Tell the assistant what you'd like to sell, product name, description,
              price, and it will be added to your store.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ShopError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center p-10 text-center">
      <div>
        <p className="font-serif text-2xl">We couldn't load the shop</p>
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
    </div>
  );
}
