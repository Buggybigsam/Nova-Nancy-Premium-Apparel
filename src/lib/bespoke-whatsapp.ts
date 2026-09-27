import type { StoredCustomOrder } from "@/lib/custom-orders.storage";

export const MAU_WHATSAPP_NUMBER = "233550501177";

/**
 * Generates an executive, luxury WhatsApp message containing all
 * specifications of the bespoke commission for Artisan Mau.
 */
export function generateBespokeWhatsAppMessage(order: Partial<StoredCustomOrder>): string {
  const parts: string[] = [
    `✨ *NEW BESPOKE COMMISSION - NOVA NANCY ATELIER* ✨`,
    `━━━━━━━━━━━━━━━━━━━━`,
    order.order_number ? `*Order Ref:* ${order.order_number}` : "",
    order.full_name ? `*Client:* ${order.full_name}` : "",
    order.phone ? `*Phone:* ${order.phone}` : "",
    order.whatsapp && order.whatsapp !== order.phone ? `*WhatsApp:* ${order.whatsapp}` : "",
    order.email ? `*Email:* ${order.email}` : "",
    order.delivery_address ? `*Location:* ${order.delivery_address}` : "",
    ``,
    `👗 *GARMENT SPECIFICATIONS:*`,
    order.clothing_type ? `• *Garment Type:* ${order.clothing_type}` : `• *Garment:* Custom Couture`,
    order.selected_design ? `• *Design Reference:* ${order.selected_design}` : "",
    order.fabric_preference ? `• *Fabric:* ${order.fabric_preference}` : "",
    order.color ? `• *Color:* ${order.color}${order.color_notes ? ` (${order.color_notes})` : ""}` : "",
    order.customizations && order.customizations.length > 0
      ? `• *Customizations:* ${order.customizations.join(", ")}`
      : "",
    order.description ? `• *Vision:* ${order.description}` : "",
    order.special_instructions ? `• *Special Instructions:* ${order.special_instructions}` : "",
    ``,
    `📐 *MEASUREMENTS:*`,
    order.needs_measurement_help
      ? `• Client requested measurement fitting assistance with Mau in studio`
      : order.measurements && Object.keys(order.measurements).length > 0
      ? Object.entries(order.measurements)
          .filter(([_, v]) => Boolean(v))
          .map(([k, v]) => `• ${k.replace(/([A-Z])/g, " $1")}: ${v} ${order.measurement_unit || "in"}`)
          .join("\n")
      : `• To be measured during fitting consultation`,
    ``,
    `📅 *TIMELINE & OCCASION:*`,
    order.event_type ? `• *Occasion:* ${order.event_type}` : "",
    order.required_date ? `• *Needed By:* ${order.required_date}` : "",
    order.urgency ? `• *Urgency:* ${order.urgency}` : "",
    order.files && order.files.length > 0 ? `📎 *Reference Images:* ${order.files.length} attached` : "",
    ``,
    order.order_number
      ? `📄 *Official Order PDF Dossier:* https://novanancy.com/order-dossier?ref=${order.order_number}`
      : "",
    `*(I have downloaded my official order PDF to share with you in this chat)*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `_Hello Mau, please review my bespoke commission PDF and advise on fitting!_`,
  ].filter((p) => p !== "");

  return parts.join("\n");
}

/**
 * Creates the direct wa.me link with encoded order specifications.
 */
export function getBespokeWhatsAppUrl(order: Partial<StoredCustomOrder>): string {
  const msg = generateBespokeWhatsAppMessage(order);
  return `https://wa.me/${MAU_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
