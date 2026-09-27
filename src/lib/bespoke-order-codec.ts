import type { StoredCustomOrder } from "@/lib/custom-orders.storage";

/**
 * Compact representation of an order for URL-safe transport.
 * Allows the full dossier to be shared in WhatsApp links or QR codes
 * and displayed on any device without requiring a database lookup.
 */
interface CompactOrderPayload {
  ref: string;
  name: string;
  email: string;
  phone: string;
  wa?: string | null;
  contact?: string;
  addr?: string | null;
  type?: string;
  garment?: string | null;
  design?: string | null;
  fabric?: string | null;
  col?: string | null;
  col_notes?: string | null;
  cust?: string[];
  desc?: string | null;
  special?: string | null;
  event?: string | null;
  req_date?: string | null;
  urgency?: string | null;
  unit?: string;
  m?: Record<string, string>;
  help?: boolean;
  date?: string;
}

/**
 * Converts a StoredCustomOrder into a compact JSON-serializable object.
 */
export function toCompactOrder(order: Partial<StoredCustomOrder>): CompactOrderPayload {
  return {
    ref: order.order_number || "",
    name: order.full_name || "",
    email: order.email || "",
    phone: order.phone || "",
    wa: order.whatsapp || undefined,
    contact: order.preferred_contact || "whatsapp",
    addr: order.delivery_address || undefined,
    type: order.order_type || "custom_design",
    garment: order.clothing_type || undefined,
    design: order.selected_design || undefined,
    fabric: order.fabric_preference || undefined,
    col: order.color || undefined,
    col_notes: order.color_notes || undefined,
    cust: order.customizations && order.customizations.length > 0 ? order.customizations : undefined,
    desc: order.description || undefined,
    special: order.special_instructions || undefined,
    event: order.event_type || undefined,
    req_date: order.required_date || undefined,
    urgency: order.urgency || undefined,
    unit: order.measurement_unit || "inches",
    m: order.measurements && Object.keys(order.measurements).length > 0 ? order.measurements : undefined,
    help: order.needs_measurement_help || undefined,
    date: order.created_at || new Date().toISOString(),
  };
}

/**
 * Reconstructs a full StoredCustomOrder from a CompactOrderPayload.
 */
export function fromCompactOrder(c: CompactOrderPayload): StoredCustomOrder {
  return {
    id: `ord-${c.ref || crypto.randomUUID()}`,
    order_number: c.ref || "NN-PENDING",
    full_name: c.name || "Client",
    email: c.email || "",
    phone: c.phone || "",
    whatsapp: c.wa || c.phone || null,
    preferred_contact: c.contact || "whatsapp",
    delivery_address: c.addr || null,
    order_type: c.type || "custom_design",
    selected_design: c.design || null,
    clothing_type: c.garment || null,
    fabric_preference: c.fabric || null,
    color: c.col || null,
    color_notes: c.col_notes || null,
    customizations: c.cust || [],
    description: c.desc || null,
    special_instructions: c.special || null,
    event_type: c.event || null,
    event_date: null,
    required_date: c.req_date || null,
    urgency: c.urgency || null,
    measurement_unit: c.unit || "inches",
    measurements: c.m || {},
    needs_measurement_help: Boolean(c.help),
    status: "pending_review",
    payment_status: "unpaid",
    price: null,
    currency: "GHS",
    created_at: c.date || new Date().toISOString(),
    updated_at: c.date || new Date().toISOString(),
    files: [],
    messages: [],
  };
}

/**
 * Encodes order details into a URL-safe base64 string.
 * Works uniformly in Node.js, Vercel Serverless, and all modern browsers.
 */
export function encodeOrderData(order: Partial<StoredCustomOrder>): string {
  try {
    const compact = toCompactOrder(order);
    const json = JSON.stringify(compact);

    if (typeof Buffer !== "undefined") {
      return Buffer.from(json, "utf8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    if (typeof window !== "undefined" && typeof window.btoa === "function") {
      const utf8Bytes = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      );
      return window
        .btoa(utf8Bytes)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }
  } catch (err) {
    console.warn("[bespoke-order-codec] encodeOrderData failed:", err);
  }
  return "";
}

/**
 * Decodes a URL-safe base64 string back into a StoredCustomOrder.
 */
export function decodeOrderData(encoded: string): StoredCustomOrder | null {
  if (!encoded || typeof encoded !== "string") return null;
  try {
    // Restore base64 standard padding and chars
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    let json = "";
    if (typeof Buffer !== "undefined") {
      json = Buffer.from(base64, "base64").toString("utf8");
    } else if (typeof window !== "undefined" && typeof window.atob === "function") {
      const binary = window.atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      json = new TextDecoder().decode(bytes);
    }

    if (json) {
      const parsed = JSON.parse(json) as CompactOrderPayload;
      if (parsed && typeof parsed === "object" && (parsed.ref || parsed.name)) {
        return fromCompactOrder(parsed);
      }
    }
  } catch (err) {
    console.warn("[bespoke-order-codec] decodeOrderData failed:", err);
  }
  return null;
}
