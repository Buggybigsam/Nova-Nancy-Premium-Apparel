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

const LOCAL_STORAGE_KEY = "nova_nancy_custom_orders";
let inMemoryStore: StoredCustomOrder[] = [];

function readStore(): StoredCustomOrder[] {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredCustomOrder[]) : [];
    } catch (err) {
      console.warn("[custom-orders.storage] Failed to read localStorage:", err);
      return inMemoryStore;
    }
  }
  return inMemoryStore;
}

function writeStore(orders: StoredCustomOrder[]): void {
  inMemoryStore = orders;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.warn("[custom-orders.storage] Failed to write localStorage:", err);
    }
  }
}

export function saveLocalOrder(order: StoredCustomOrder): StoredCustomOrder {
  const orders = readStore();
  const index = orders.findIndex((o) => o.id === order.id || o.order_number === order.order_number);
  if (index >= 0) {
    orders[index] = { ...orders[index], ...order, updated_at: new Date().toISOString() };
  } else {
    orders.unshift(order);
  }
  writeStore(orders);
  return order;
}

export function getLocalOrderById(id: string): StoredCustomOrder | null {
  const orders = readStore();
  return orders.find((o) => o.id === id) ?? null;
}

export function getLocalOrderByNumber(orderNumber: string): StoredCustomOrder | null {
  const orders = readStore();
  const normalized = orderNumber.trim().toUpperCase();
  return orders.find((o) => o.order_number.toUpperCase() === normalized) ?? null;
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
