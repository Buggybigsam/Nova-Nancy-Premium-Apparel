import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "1zmtq4-2i.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "668244bbb45f28926d1d6938328611df";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description:
        "Your Shopify store needs an active billing plan. Visit admin.shopify.com to upgrade.",
    });
    return;
  }

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  if (data.errors) {
    throw new Error(
      `Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }
  return data;
}

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 5) { edges { node { url altText } } }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                availableForSale
                selectedOptions { name value }
              }
            }
          }
          options { name values }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 8) { edges { node { url altText } } }
      variants(first: 30) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
            availableForSale
            selectedOptions { name value }
          }
        }
      }
      options { name values }
    }
  }
`;

// Cart mutations
const CART_QUERY = `query cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;

const CART_CREATE = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { id lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } } }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } userErrors { field message } }
  }
`;

const CART_LINES_REMOVE = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } userErrors { field message } }
  }
`;

export interface CartItemInput {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
  lineId: string | null;
}

function formatCheckoutUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("channel", "online_store");
    return u.toString();
  } catch {
    return url;
  }
}

type UserError = { field: string[] | null; message: string };
function isCartNotFound(errors: UserError[]): boolean {
  return errors.some(
    (e) =>
      e.message.toLowerCase().includes("cart not found") ||
      e.message.toLowerCase().includes("does not exist"),
  );
}

export async function createShopifyCart(item: CartItemInput) {
  const data = await storefrontApiRequest(CART_CREATE, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });
  const errors = data?.data?.cartCreate?.userErrors || [];
  if (errors.length) {
    console.error("Cart creation failed:", errors);
    return null;
  }
  const cart = data?.data?.cartCreate?.cart;
  const lineId = cart?.lines?.edges?.[0]?.node?.id;
  if (!cart?.checkoutUrl || !lineId) return null;
  return {
    cartId: cart.id as string,
    checkoutUrl: formatCheckoutUrl(cart.checkoutUrl),
    lineId: lineId as string,
  };
}

export async function addLineToShopifyCart(cartId: string, item: CartItemInput) {
  const data = await storefrontApiRequest(CART_LINES_ADD, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });
  const errors: UserError[] = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFound(errors)) return { success: false, cartNotFound: true };
  if (errors.length) return { success: false };
  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find(
    (l: { node: { merchandise: { id: string } } }) => l.node.merchandise.id === item.variantId,
  );
  return { success: true, lineId: newLine?.node?.id as string | undefined };
}

export async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await storefrontApiRequest(CART_LINES_UPDATE, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  const errors: UserError[] = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFound(errors)) return { success: false, cartNotFound: true };
  return { success: errors.length === 0 };
}

export async function removeLineFromShopifyCart(cartId: string, lineId: string) {
  const data = await storefrontApiRequest(CART_LINES_REMOVE, { cartId, lineIds: [lineId] });
  const errors: UserError[] = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFound(errors)) return { success: false, cartNotFound: true };
  return { success: errors.length === 0 };
}

export async function fetchCart(cartId: string) {
  return storefrontApiRequest(CART_QUERY, { id: cartId });
}
