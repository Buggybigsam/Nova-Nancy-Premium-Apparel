import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API_VERSION = "2025-07";

export interface OrderLookupResult {
  id: string;
  name: string;
  createdAt: string;
  processedAt: string | null;
  email: string | null;
  currencyCode: string;
  totalPrice: string;
  subtotalPrice: string;
  totalShipping: string;
  totalTax: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  cancelledAt: string | null;
  statusUrl: string | null;
  shippingAddress: {
    name: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
  } | null;
  lineItems: Array<{
    id: string;
    title: string;
    variantTitle: string | null;
    quantity: number;
    image: string | null;
    price: string;
  }>;
  fulfillments: Array<{
    id: string;
    status: string | null;
    createdAt: string;
    trackingCompany: string | null;
    trackingNumbers: string[];
    trackingUrls: string[];
    estimatedDeliveryAt: string | null;
  }>;
}

const ORDER_QUERY = `
  query LookupOrder($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        node {
          id
          name
          createdAt
          processedAt
          email
          cancelledAt
          displayFinancialStatus
          displayFulfillmentStatus
          statusPageUrl
          currentTotalPriceSet { shopMoney { amount currencyCode } }
          currentSubtotalPriceSet { shopMoney { amount currencyCode } }
          totalShippingPriceSet { shopMoney { amount currencyCode } }
          currentTotalTaxSet { shopMoney { amount currencyCode } }
          shippingAddress {
            name address1 address2 city province country zip
          }
          lineItems(first: 50) {
            edges {
              node {
                id title quantity
                variant { title image { url } }
                originalUnitPriceSet { shopMoney { amount } }
              }
            }
          }
          fulfillments(first: 20) {
            id status createdAt
            trackingInfo { company number url }
            estimatedDeliveryAt
          }
        }
      }
    }
  }
`;

const inputSchema = z.object({
  orderNumber: z.string().min(1).max(32),
  email: z.string().email().max(254),
});

export const lookupOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<OrderLookupResult | null> => {
    const domain = process.env.SHOPIFY_STORE_DOMAIN || "1zmtq4-2i.myshopify.com";
    const token = process.env.SHOPIFY_ACCESS_TOKEN;
    if (!token) throw new Error("Shopify not configured");

    const name = data.orderNumber.trim().replace(/^#/, "");
    const email = data.email.trim().toLowerCase();
    const query = `name:${name} email:${email}`;

    const res = await fetch(
      `https://${domain}/admin/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token,
        },
        body: JSON.stringify({ query: ORDER_QUERY, variables: { query } }),
      },
    );
    if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors.map((e: any) => e.message).join(", "));

    const node = json.data?.orders?.edges?.[0]?.node;
    if (!node) return null;

    // Extra guard: ensure the email actually matches (Shopify search is fuzzy)
    if (node.email && node.email.toLowerCase() !== email) return null;

    return {
      id: node.id,
      name: node.name,
      createdAt: node.createdAt,
      processedAt: node.processedAt,
      email: node.email,
      cancelledAt: node.cancelledAt,
      financialStatus: node.displayFinancialStatus,
      fulfillmentStatus: node.displayFulfillmentStatus,
      statusUrl: node.statusPageUrl,
      currencyCode: node.currentTotalPriceSet?.shopMoney?.currencyCode ?? "USD",
      totalPrice: node.currentTotalPriceSet?.shopMoney?.amount ?? "0",
      subtotalPrice: node.currentSubtotalPriceSet?.shopMoney?.amount ?? "0",
      totalShipping: node.totalShippingPriceSet?.shopMoney?.amount ?? "0",
      totalTax: node.currentTotalTaxSet?.shopMoney?.amount ?? "0",
      shippingAddress: node.shippingAddress
        ? {
            name: node.shippingAddress.name,
            address1: node.shippingAddress.address1,
            address2: node.shippingAddress.address2,
            city: node.shippingAddress.city,
            province: node.shippingAddress.province,
            country: node.shippingAddress.country,
            zip: node.shippingAddress.zip,
          }
        : null,
      lineItems: (node.lineItems?.edges ?? []).map((e: any) => ({
        id: e.node.id,
        title: e.node.title,
        variantTitle: e.node.variant?.title ?? null,
        quantity: e.node.quantity,
        image: e.node.variant?.image?.url ?? null,
        price: e.node.originalUnitPriceSet?.shopMoney?.amount ?? "0",
      })),
      fulfillments: (node.fulfillments ?? []).map((f: any) => ({
        id: f.id,
        status: f.status,
        createdAt: f.createdAt,
        trackingCompany: f.trackingInfo?.[0]?.company ?? null,
        trackingNumbers: (f.trackingInfo ?? []).map((t: any) => t.number).filter(Boolean),
        trackingUrls: (f.trackingInfo ?? []).map((t: any) => t.url).filter(Boolean),
        estimatedDeliveryAt: f.estimatedDeliveryAt ?? null,
      })),
    };
  });
