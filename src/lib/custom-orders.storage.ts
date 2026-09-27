import fs from "node:fs";
import path from "node:path";

export interface StoredCustomOrder {
  id: string;
  order_number: string;
  customer_id?: string | null;
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string | null;
  preferred_contact: string;
  delivery_address?: string | null;
  order_type: string;
  selected_design?: string | null;
  clothing_type?: string | null;
  fabric_preference?: string | null;
  color?: string | null;
  color_notes?: string | null;
  customizations: string[];
  description?: string | null;
  special_instructions?: string | null;
  event_type?: string | null;
  event_date?: string | null;
  required_date?: string | null;
  urgency?: string | null;
  measurement_unit: string;
  measurements: Record<string, string>;
  needs_measurement_help: boolean;
  status: string;
  payment_status: string;
  price?: number | null;
  currency: string;
  internal_notes?: string | null;
  expected_completion?: string | null;
  created_at: string;
  updated_at: string;
  files?: Array<{
    id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    storage_path: string;
    kind?: string | null;
    uploaded_at: string;
  }>;
  messages?: Array<{
    id: string;
    order_id: string;
    sender: string;
    body: string;
    created_at: string;
  }>;
}

import os from "node:os";

const STORE_PATH = path.join(process.cwd(), "src", "data", "custom-orders.store.json");
const TMP_STORE_PATH = path.join(os.tmpdir(), "nova-custom-orders.store.json");

// In-memory cache that persists across warm serverless requests
const memoryOrders = new Map<string, StoredCustomOrder>();

function readStore(): StoredCustomOrder[] {
  const merged = new Map<string, StoredCustomOrder>();

  // 1. Read bundled default JSON if available
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf8");
      const list = JSON.parse(raw) as StoredCustomOrder[];
      for (const item of list) {
        if (item.order_number) merged.set(item.order_number.toUpperCase(), item);
      }
    }
  } catch (_) {}

  // 2. Read writable /tmp directory if available
  try {
    if (fs.existsSync(TMP_STORE_PATH)) {
      const raw = fs.readFileSync(TMP_STORE_PATH, "utf8");
      const list = JSON.parse(raw) as StoredCustomOrder[];
      for (const item of list) {
        if (item.order_number) merged.set(item.order_number.toUpperCase(), item);
      }
    }
  } catch (_) {}

  // 3. Merge in-memory orders (most up-to-date)
  for (const [key, item] of memoryOrders.entries()) {
    merged.set(key, item);
  }

  return Array.from(merged.values());
}

function writeStore(orders: StoredCustomOrder[]): void {
  // Always update in-memory cache
  for (const o of orders) {
    if (o.order_number) memoryOrders.set(o.order_number.toUpperCase(), o);
    if (o.id) memoryOrders.set(o.id.toUpperCase(), o);
  }

  // Attempt writing to /tmp (always writable in AWS/Vercel serverless)
  try {
    fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(orders, null, 2), "utf8");
  } catch (_) {}

  // Attempt writing to process.cwd() (works locally)
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(orders, null, 2), "utf8");
  } catch (_) {}
}

export function saveLocalOrder(order: StoredCustomOrder): StoredCustomOrder {
  if (order.order_number) memoryOrders.set(order.order_number.toUpperCase(), order);
  if (order.id) memoryOrders.set(order.id.toUpperCase(), order);

  const orders = readStore();
  const index = orders.findIndex((o) => o.id === order.id || o.order_number.toUpperCase() === order.order_number.toUpperCase());
  if (index >= 0) {
    orders[index] = { ...orders[index], ...order, updated_at: new Date().toISOString() };
  } else {
    orders.unshift(order);
  }
  writeStore(orders);
  return order;
}

export function getLocalOrderById(id: string): StoredCustomOrder | null {
  const norm = id.trim().toUpperCase();
  if (memoryOrders.has(norm)) return memoryOrders.get(norm)!;
  const orders = readStore();
  return orders.find((o) => o.id.toUpperCase() === norm) ?? null;
}

export function getLocalOrderByNumber(orderNumber: string): StoredCustomOrder | null {
  const norm = orderNumber.trim().toUpperCase();
  if (memoryOrders.has(norm)) return memoryOrders.get(norm)!;
  const orders = readStore();
  return orders.find((o) => o.order_number.toUpperCase() === norm) ?? null;
}

export function listLocalOrders(): StoredCustomOrder[] {
  return readStore();
}

export function updateLocalOrder(
  id: string,
  patch: Partial<StoredCustomOrder>,
): StoredCustomOrder | null {
  const orders = readStore();
  const index = orders.findIndex((o) => o.id === id);
  if (index < 0) return null;
  const updated = {
    ...orders[index],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  orders[index] = updated;
  writeStore(orders);
  return updated;
}

export function addLocalMessage(orderId: string, sender: string, body: string) {
  const orders = readStore();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index < 0) return null;
  const msg = {
    id: crypto.randomUUID(),
    order_id: orderId,
    sender,
    body,
    created_at: new Date().toISOString(),
  };
  orders[index].messages = [...(orders[index].messages || []), msg];
  writeStore(orders);
  return msg;
}
