import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  addLineToShopifyCart,
  createShopifyCart,
  fetchCart,
  removeLineFromShopifyCart,
  updateShopifyCartLine,
  type CartItemInput,
  type ShopifyProduct,
} from "@/lib/shopify";

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existing = items.find((i) => i.variantId === item.variantId);
        set({ isLoading: true });

        try {
          if (!cartId) {
            if (existing) {
              const newQty = existing.quantity + item.quantity;
              set({
                items: get().items.map((i) =>
                  i.variantId === item.variantId ? { ...i, quantity: newQty } : i,
                ),
              });
            } else {
              const input: CartItemInput = { ...item, lineId: null };
              let result = null;
              try {
                result = await createShopifyCart(input);
              } catch {
                // local fallback
              }
              if (result) {
                set({
                  cartId: result.cartId,
                  checkoutUrl: result.checkoutUrl,
                  items: [{ ...item, lineId: result.lineId }],
                });
              } else {
                set({
                  items: [...get().items, { ...item, lineId: `local_${crypto.randomUUID()}` }],
                });
              }
            }
          } else if (existing) {
            const newQty = existing.quantity + item.quantity;
            set({
              items: get().items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: newQty } : i,
              ),
            });
            if (existing.lineId && !existing.lineId.startsWith("local_")) {
              try {
                const result = await updateShopifyCartLine(cartId, existing.lineId, newQty);
                if (result.cartNotFound) clearCart();
              } catch (e) {
                console.warn("[Cart] Shopify line update skipped:", e);
              }
            }
          } else {
            const input: CartItemInput = { ...item, lineId: null };
            let result = null;
            try {
              result = await addLineToShopifyCart(cartId, input);
            } catch {
              // fallback
            }
            if (result?.success) {
              set({ items: [...get().items, { ...item, lineId: result.lineId ?? null }] });
            } else {
              set({
                items: [...get().items, { ...item, lineId: `local_${crypto.randomUUID()}` }],
              });
            }
          }
        } catch (e) {
          console.error("Failed to add item:", e);
          if (!existing) {
            set({
              items: [...get().items, { ...item, lineId: `local_${crypto.randomUUID()}` }],
            });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item) return;

        set({
          items: items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        });

        if (cartId && item.lineId && !item.lineId.startsWith("local_")) {
          set({ isSyncing: true });
          try {
            const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
            if (result.cartNotFound) clearCart();
          } catch (e) {
            console.warn("[Cart] Shopify quantity update skipped:", e);
          } finally {
            set({ isSyncing: false });
          }
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        const next = items.filter((i) => i.variantId !== variantId);
        if (next.length === 0) clearCart();
        else set({ items: next });

        if (cartId && item?.lineId && !item.lineId.startsWith("local_")) {
          set({ isSyncing: true });
          try {
            const result = await removeLineFromShopifyCart(cartId, item.lineId);
            if (result.cartNotFound) clearCart();
          } catch (e) {
            console.warn("[Cart] Shopify remove skipped:", e);
          } finally {
            set({ isSyncing: false });
          }
        }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
      getCheckoutUrl: () => get().checkoutUrl,

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const data = await fetchCart(cartId);
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) clearCart();
        } catch (e) {
          console.error("Failed to sync cart:", e);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "shopify-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
      }),
    },
  ),
);
