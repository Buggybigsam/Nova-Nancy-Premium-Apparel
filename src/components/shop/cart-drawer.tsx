import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } =
    useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "USD";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setIsOpen(false);
    } else {
      const summary = items
        .map(
          (i) =>
            `• ${i.quantity}x ${i.product.node.title} (${i.variantTitle}) - ${formatPrice(parseFloat(i.price.amount) * i.quantity, i.price.currencyCode)}`,
        )
        .join("\n");
      const totalStr = formatPrice(totalPrice, currency);
      const text = encodeURIComponent(
        `Hello Nova Nancy Atelier, I would like to order the following ready-to-wear items:\n\n${summary}\n\nTotal: ${totalStr}\n\nPlease confirm availability and delivery arrangements.`,
      );
      window.open(`https://wa.me/233550501177?text=${text}`, "_blank");
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Your Bag</SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? "Your bag is empty."
              : `${totalItems} item${totalItems !== 1 ? "s" : ""} reserved.`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col pt-6">
          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No pieces added yet.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                <div className="space-y-4">
                  {items.map((item) => {
                    const img = item.product.node.images?.edges?.[0]?.node;
                    return (
                      <div
                        key={item.variantId}
                        className="flex gap-4 border-b border-border/60 pb-4"
                      >
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-secondary/20">
                          {img && (
                            <img
                              src={img.url}
                              alt={img.altText || item.product.node.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-serif text-base">
                            {item.product.node.title}
                          </h4>
                          {item.selectedOptions.length > 0 && (
                            <p className="text-xs uppercase tracking-widest text-muted-foreground">
                              {item.selectedOptions.map((o) => o.value).join(" • ")}
                            </p>
                          )}
                          <p className="mt-1 text-sm font-medium">
                            {formatPrice(
                              parseFloat(item.price.amount) * item.quantity,
                              item.price.currencyCode,
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeItem(item.variantId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-4 border-t border-border/60 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-serif text-2xl">{formatPrice(totalPrice, currency)}</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Taxes & shipping calculated at checkout
                </p>
                <Button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isLoading || isSyncing}
                  className="w-full"
                  size="lg"
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Checkout
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}
