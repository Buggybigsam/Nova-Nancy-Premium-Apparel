import { Link } from "@tanstack/react-router";
import { Loader2, MessageCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import type { ShopifyProduct } from "@/lib/shopify";
import { WHATSAPP_NUMBER } from "@/components/whatsapp-button";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const p = product.node;
  const image = p.images?.edges?.[0]?.node;
  const variant = p.variants?.edges?.[0]?.node;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const price = p.priceRange.minVariantPrice;

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${p.title} added to bag`, { position: "top-center" });
  };

  const whatsappInquireUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Mau, I am interested in the ${p.title} (${price.currencyCode} ${price.amount}) from the Nova Nancy Collection. Could you share more details regarding sizing and availability?`,
  )}`;

  return (
    <div className="group flex flex-col border border-border/70 bg-card transition-shadow duration-500 hover:shadow-xl">
      <Link
        to="/product/$handle"
        params={{ handle: p.handle }}
        className="relative block aspect-[4/5] overflow-hidden bg-beige"
      >
        {image ? (
          <img
            src={image.url}
            alt={image.altText || p.title}
            loading="lazy"
            width={800}
            height={1000}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
            Collection Piece
          </div>
        )}
        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-medium text-foreground">
          Atelier Collection
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Link to="/product/$handle" params={{ handle: p.handle }}>
          <h3 className="font-serif text-xl group-hover:text-accent transition-colors">{p.title}</h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-lg font-medium text-foreground">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({formatGhs(price.amount)})
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {p.description}
        </p>

        <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-border/60">
          <button
            onClick={handleAdd}
            disabled={isLoading || !variant}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary py-3 text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
              </>
            )}
          </button>

          <a
            href={whatsappInquireUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 border border-border py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground hover:border-[#25D366] hover:text-[#25D366] transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Inquire on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export function formatPrice(amount: string | number, currency: string) {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export function formatGhs(usdAmount: string | number) {
  const n = typeof usdAmount === "string" ? parseFloat(usdAmount) : usdAmount;
  // Estimated exchange rate 1 USD ~ 15 GHS
  const ghs = Math.round(n * 15);
  return `~GH₵ ${ghs.toLocaleString()}`;
}
