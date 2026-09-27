import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/shop/product-card";
import { PRODUCTS_QUERY, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { ATELIER_PRODUCTS } from "@/data/shop-products";
import { MessageCircle, Sparkles } from "lucide-react";
import { WHATSAPP_URL } from "@/components/whatsapp-button";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Boutique Collections | Nova Nancy Atelier" },
      {
        name: "description",
        content:
          "Explore and acquire signature ready-to-wear and bespoke collection pieces from Nova Nancy Atelier, hand-crafted by Mau.",
      },
      { property: "og:title", content: "Boutique Collections | Nova Nancy Atelier" },
      {
        property: "og:description",
        content: "Luxury bespoke and ready-to-wear collections from Nova Nancy.",
      },
    ],
  }),
  component: ShopPage,
  errorComponent: ShopError,
  notFoundComponent: () => <div className="p-10 text-center">Not found</div>,
});

const SHOP_CATEGORIES = [
  "All Collections",
  "Bridal Couture",
  "Tailored Suits",
  "Gala & Evening",
  "Traditional Luxury",
];

function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Collections");

  const { data: products } = useQuery({
    queryKey: ["shopify-products"],
    initialData: ATELIER_PRODUCTS,
    queryFn: async () => {
      try {
        const res = await storefrontApiRequest(PRODUCTS_QUERY, { first: 24, query: null });
        const items = (res?.data?.products?.edges as ShopifyProduct[]) || [];
        if (items.length > 0) return items;
      } catch (e) {
        // Fallback to ATELIER_PRODUCTS
      }
      return ATELIER_PRODUCTS;
    },
  });

  const filteredProducts = useMemo(() => {
    const list = products || ATELIER_PRODUCTS;
    if (selectedCategory === "All Collections") return list;
    return list.filter((p) => {
      const tags = p.node.tags || [];
      const title = p.node.title.toLowerCase();
      const desc = p.node.description.toLowerCase();

      if (selectedCategory === "Bridal Couture") {
        return (
          tags.includes("Bridal Couture") ||
          title.includes("bridal") ||
          title.includes("empress") ||
          desc.includes("bridal") ||
          desc.includes("wedding") ||
          desc.includes("bride")
        );
      }
      if (selectedCategory === "Tailored Suits") {
        return (
          tags.includes("Tailored Suits") ||
          title.includes("suit") ||
          title.includes("tailor") ||
          title.includes("sheath") ||
          title.includes("robe") ||
          title.includes("boubou") ||
          desc.includes("tailor") ||
          desc.includes("suit")
        );
      }
      if (selectedCategory === "Gala & Evening") {
        return (
          tags.includes("Gala & Evening") ||
          title.includes("gala") ||
          title.includes("gown") ||
          title.includes("evening") ||
          desc.includes("gala") ||
          desc.includes("evening") ||
          desc.includes("red carpet")
        );
      }
      if (selectedCategory === "Traditional Luxury") {
        return (
          tags.includes("Traditional Luxury") ||
          title.includes("heritage") ||
          title.includes("ankara") ||
          title.includes("kente") ||
          title.includes("boubou") ||
          desc.includes("kente") ||
          desc.includes("ankara") ||
          desc.includes("traditional")
        );
      }
      return true;
    });
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Header */}
      <section className="border-b border-border bg-beige px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow block">Nova Nancy Atelier Collections</span>
          <h1 className="mt-4 font-serif text-4xl leading-[1.05] md:text-6xl">
            The Atelier <span className="italic">Boutique</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base leading-relaxed">
            Signature silhouettes and limited-run pieces from Mau's seasonal collections. Every
            garment is cut from rare textiles and finished by hand with custom fit options.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {SHOP_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors border ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-accent hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-8 flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b border-border/60 pb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Displaying {filteredProducts.length} collection pieces
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#25D366] hover:underline"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Inquire with Mau on WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => (
            <ProductCard key={p.node.id} product={p} />
          ))}
        </div>

        {/* Custom Order Banner */}
        <div className="mt-20 border border-border bg-beige p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="eyebrow block mb-2">Bespoke Couture</span>
            <h3 className="font-serif text-3xl">Want a piece made exclusively for you?</h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Provide your exact body measurements and inspiration photos, or consult with Mau for a
              one-of-a-kind gown, suit, or traditional bridal ensemble.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              to="/custom-order"
              className="inline-flex items-center gap-2 bg-primary px-6 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" /> Design Your Outfit
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#25D366] text-[#25D366] px-6 py-4 text-[10px] font-medium uppercase tracking-[0.25em] hover:bg-[#25D366] hover:text-white transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
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
