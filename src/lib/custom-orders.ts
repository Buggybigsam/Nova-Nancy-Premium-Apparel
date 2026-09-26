export const ORDER_STATUSES = [
  "order_received",
  "under_review",
  "measurements_verified",
  "design_consultation",
  "price_quotation",
  "awaiting_client_approval",
  "payment_pending",
  "payment_confirmed",
  "production_started",
  "fitting",
  "adjustments_required",
  "completed",
  "ready_for_delivery",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ["unpaid", "deposit_paid", "paid", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export function statusLabel(s: string) {
  return s
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const ORDER_TYPES = [
  { value: "existing_design", label: "Existing Nova Nancy design" },
  { value: "custom_design", label: "Custom design from scratch" },
  { value: "recreate_reference", label: "Recreate a reference outfit" },
  { value: "modification", label: "Modification of an existing design" },
] as const;

export const CLOTHING_TYPES = [
  "Dress",
  "Shirt",
  "Blouse",
  "Skirt",
  "Trousers",
  "Suit",
  "Kaftan",
  "Traditional Wear",
  "Bridal Wear",
  "Other",
];

export const FABRIC_OPTIONS = [
  { value: "client_provides", label: "I will provide the fabric" },
  { value: "nova_provides", label: "Nova Nancy sources the fabric" },
  { value: "undecided", label: "Not decided yet" },
];

export const CUSTOMIZATION_OPTIONS = [
  "Change neckline",
  "Change sleeve style",
  "Change length",
  "Change fabric",
  "Change color",
  "Change fitting",
  "Add embroidery",
  "Add beads",
  "Add accessories",
  "Other",
];

export const EVENT_TYPES = [
  "Casual use",
  "Birthday",
  "Wedding",
  "Engagement",
  "Graduation",
  "Party",
  "Church",
  "Corporate event",
  "Photoshoot",
  "Other",
];

export const MEASUREMENT_GROUPS: {
  group: string;
  fields: { key: string; label: string; hint?: string }[];
}[] = [
  {
    group: "Upper body",
    fields: [
      {
        key: "shoulder",
        label: "Shoulder width",
        hint: "Across the back, shoulder point to shoulder point",
      },
      { key: "bust", label: "Bust / Chest", hint: "Fullest part of the bust, tape level" },
      { key: "waist", label: "Waist", hint: "Narrowest part of the torso" },
      { key: "armhole", label: "Armhole", hint: "Around the top of the arm and shoulder" },
      { key: "sleeve", label: "Sleeve length", hint: "Shoulder point to desired sleeve end" },
      { key: "bicep", label: "Bicep", hint: "Fullest part of the upper arm" },
      { key: "wrist", label: "Wrist", hint: "Around the wrist bone" },
    ],
  },
  {
    group: "Lower body",
    fields: [
      { key: "hip", label: "Hip", hint: "Fullest part of the hips" },
      { key: "thigh", label: "Thigh" },
      { key: "knee", label: "Knee" },
      { key: "calf", label: "Calf" },
      { key: "ankle", label: "Ankle" },
    ],
  },
  {
    group: "Lengths",
    fields: [
      { key: "full_length", label: "Full length" },
      { key: "top_length", label: "Top length" },
      { key: "dress_length", label: "Dress length" },
      { key: "skirt_length", label: "Skirt length" },
      { key: "trouser_length", label: "Trouser length" },
      { key: "inseam", label: "Inseam" },
    ],
  },
];

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_FILES = 12;

export const FILE_KINDS = [
  "Front view",
  "Back view",
  "Side view",
  "Fabric reference",
  "Sketch",
  "Inspiration",
  "Measurement chart",
  "Other document",
];

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Statuses in the order they normally progress, used for the tracking timeline. */
export const TIMELINE: OrderStatus[] = [
  "order_received",
  "under_review",
  "price_quotation",
  "payment_confirmed",
  "production_started",
  "fitting",
  "completed",
  "delivered",
];
