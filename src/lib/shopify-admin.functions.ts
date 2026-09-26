import { createServerFn } from "@/lib/server-fn-compat";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isSuperAdminEmail } from "./admin-config";
import { z } from "zod";

const API_VERSION = "2025-07";

export interface AdminOrder {
  id: string;
  name: string;
  createdAt: string;
  displayFinancialStatus: string | null;
  displayFulfillmentStatus: string | null;
  totalPrice: string;
  currencyCode: string;
  customerName: string | null;
  customerEmail: string | null;
  itemCount: number;
}

const ORDERS_QUERY = `
  query Orders($first: Int!, $query: String) {
    orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          currentTotalPriceSet { shopMoney { amount currencyCode } }
          customer { firstName lastName email }
          lineItems(first: 1) { edges { node { id } } }
          subtotalLineItemsQuantity
        }
      }
    }
  }
`;

const inputSchema = z.object({
  financialStatus: z.string().optional(),
  fulfillmentStatus: z.string().optional(),
  search: z.string().optional(),
});

export const listShopifyOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data, context }): Promise<AdminOrder[]> => {
    // authz: admin only
    const email = (context.claims as { email?: string })?.email?.toLowerCase() ?? null;
    const isEmailAdmin = isSuperAdminEmail(email);
    if (!isEmailAdmin) {
      const { data: roleRow, error: roleErr } = await context.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId)
        .eq("role", "admin")
        .maybeSingle();
      if (roleErr) throw new Error(roleErr.message);
      if (!roleRow) throw new Error("Forbidden");
    }

    const domain = process.env.SHOPIFY_STORE_DOMAIN || "1zmtq4-2i.myshopify.com";
    const token = process.env.SHOPIFY_ACCESS_TOKEN;
    if (!token) throw new Error("Shopify admin token not configured");

    const filters: string[] = [];
    if (data.financialStatus && data.financialStatus !== "any") {
      filters.push(`financial_status:${data.financialStatus}`);
    }
    if (data.fulfillmentStatus && data.fulfillmentStatus !== "any") {
      filters.push(`fulfillment_status:${data.fulfillmentStatus}`);
    }
    if (data.search) filters.push(data.search);
    const query = filters.join(" ") || undefined;

    const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query: ORDERS_QUERY,
        variables: { first: 100, query },
      }),
    });
    if (!res.ok) throw new Error(`Shopify Admin HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors)
      throw new Error((json.errors as { message: string }[]).map((e) => e.message).join(", "));

    const edges = json.data?.orders?.edges ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return edges.map((e: { node: any }): AdminOrder => {
      const n = e.node;
      const cust = n.customer;
      const fullName = cust ? [cust.firstName, cust.lastName].filter(Boolean).join(" ") : null;
      return {
        id: n.id,
        name: n.name,
        createdAt: n.createdAt,
        displayFinancialStatus: n.displayFinancialStatus,
        displayFulfillmentStatus: n.displayFulfillmentStatus,
        totalPrice: n.currentTotalPriceSet?.shopMoney?.amount ?? "0",
        currencyCode: n.currentTotalPriceSet?.shopMoney?.currencyCode ?? "USD",
        customerName: fullName || null,
        customerEmail: cust?.email ?? null,
        itemCount: n.subtotalLineItemsQuantity ?? 0,
      };
    });
  });
