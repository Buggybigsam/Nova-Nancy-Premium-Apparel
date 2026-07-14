import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import type { ShopifyProduct } from "@/lib/shopify";

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

  return (
    <div className="group flex flex-col">
      <Link to="/product/$handle" params={{ handle: p.handle }} className="block overflow-hidden bg-secondary/20">
        <div className="aspect-[3/4] w-full">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || p.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        <Link to="/product/$handle" params={{ handle: p.handle }}>
          <h3 className="font-serif text-lg">{p.title}</h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{formatPrice(price.amount, price.currencyCode)}</p>
        <Button onClick={handleAdd} disabled={isLoading || !variant} className="mt-4" variant="outline">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Bag"}
        </Button>
      </div>
    </div>
  );
}

export function formatPrice(amount: string | number, currency: string) {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}
