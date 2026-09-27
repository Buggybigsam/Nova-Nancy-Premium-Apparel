import jsPDF from "jspdf";
import html2canvasPro from "html2canvas-pro";
import { toPng } from "html-to-image";
import { MAU_WHATSAPP_NUMBER } from "@/lib/bespoke-whatsapp";
import type { StoredCustomOrder } from "@/lib/custom-orders.storage";
import { toast } from "sonner";

/**
 * Creates a pristine vector PDF directly with jsPDF as an ultra-reliable,
 * zero-dependency fallback that never fails even if DOM/canvas parsing errors occur.
 */
export function generateVectorOrderPdf(order: Partial<StoredCustomOrder>): Blob {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm
  let y = 15;

  // 1. Header Banner (#121212)
  doc.setFillColor(18, 18, 18);
  doc.rect(margin, y, contentWidth, 24, "F");

  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("NOVA", margin + contentWidth / 2 - 14, y + 11, { align: "right" });

  doc.setFont("times", "italic");
  doc.setTextColor(203, 180, 121); // #cbb479 gold
  doc.text("NANCY", margin + contentWidth / 2 - 10, y + 11, { align: "left" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(163, 156, 145);
  doc.text("ATELIER HAUTE COUTURE · KASOA, GHANA", margin + contentWidth / 2, y + 18, { align: "center" });

  y += 24;

  // 2. Alert / Ref Bar (#fcf9f2 with #cbb479 bottom border)
  doc.setFillColor(252, 249, 242);
  doc.rect(margin, y, contentWidth, 16, "F");

  // Gold accent line
  doc.setDrawColor(203, 180, 121);
  doc.setLineWidth(0.75);
  doc.line(margin, y + 16, margin + contentWidth, y + 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(156, 123, 44); // #9c7b2c
  doc.text("✦ NEW BESPOKE COMMISSION RECEIVED", margin + 6, y + 6);

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 17);
  doc.text(`Order Ref: ${order.order_number || "NN-PENDING"}`, margin + 6, y + 12);

  const submitted = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(119, 119, 119);
  doc.text(submitted, margin + contentWidth - 6, y + 9, { align: "right" });

  y += 22;

  // Helper for section headings
  function renderSectionHeader(title: string, symbol: string) {
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(17, 17, 17);
    doc.text(`${symbol}  ${title}`, margin + 4, y);

    doc.setDrawColor(229, 224, 216);
    doc.setLineWidth(0.4);
    doc.line(margin + 4, y + 2.5, margin + contentWidth - 4, y + 2.5);
    y += 7;
  }

  // Helper for table rows
  function renderTableRow(label: string, value: string, valueColor: [number, number, number] = [17, 17, 17], isBold = true) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(102, 102, 102);
    doc.text(label, margin + 6, y);

    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(...valueColor);
    doc.text(value, margin + 60, y);

    doc.setDrawColor(243, 238, 231);
    doc.setLineWidth(0.2);
    doc.line(margin + 6, y + 2, margin + contentWidth - 6, y + 2);
    y += 6.5;
  }

  // Section 1: Client Information
  renderSectionHeader("Client Information", "■");
  renderTableRow("Full Name:", order.full_name || "N/A", [17, 17, 17], true);
  renderTableRow("Email:", order.email || "N/A", [156, 123, 44], false);
  renderTableRow("Phone Number:", order.phone || "N/A", [17, 17, 17], true);
  renderTableRow("WhatsApp:", (order.whatsapp || order.phone || "None") + " ↗", [22, 163, 74], true);
  renderTableRow("Preferred Contact:", (order.preferred_contact || "WhatsApp").toUpperCase(), [17, 17, 17], true);
  renderTableRow("Delivery / Fitting Address:", order.delivery_address || "Kasoa Atelier", [17, 17, 17], false);

  y += 5;

  // Section 2: Garment & Silhouette Details
  renderSectionHeader("Garment & Silhouette Details", "■");
  renderTableRow("Order Type:", order.order_type || "existing_design", [17, 17, 17], true);
  renderTableRow("Clothing Type:", order.clothing_type || "Dress", [17, 17, 17], true);
  renderTableRow("Design Reference:", order.selected_design || "Original Bespoke Design", [17, 17, 17], false);
  renderTableRow("Fabric Preference:", order.fabric_preference || "nova_provides", [17, 17, 17], true);
  if (order.color) {
    renderTableRow("Colour:", `${order.color} ${order.color_notes ? `(${order.color_notes})` : ""}`, [17, 17, 17], false);
  }
  const customStr = order.customizations && order.customizations.length > 0
    ? order.customizations.join(", ")
    : "No specific modifications selected";
  renderTableRow("Customizations:", customStr, [102, 102, 102], false);

  y += 5;

  // Section 3: Body Measurements
  renderSectionHeader("Body Measurements", "■");
  if (order.needs_measurement_help) {
    doc.setFillColor(252, 249, 242);
    doc.rect(margin + 6, y, contentWidth - 12, 10, "F");
    doc.setDrawColor(203, 180, 121);
    doc.setLineWidth(0.3);
    doc.rect(margin + 6, y, contentWidth - 12, 10, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(133, 100, 4);
    doc.text("Fitting Appointment Requested:", margin + 9, y + 6);
    doc.setFont("helvetica", "normal");
    doc.text("Client requested in-person measurement appointment with Mau at Kasoa Atelier.", margin + 55, y + 6);
    y += 14;
  } else if (order.measurements && Object.keys(order.measurements).length > 0) {
    const unit = order.measurement_unit || "in";
    const entries = Object.entries(order.measurements).filter(([_, v]) => v !== undefined && v !== "");
    for (const [k, v] of entries) {
      const label = k.replace(/([A-Z])/g, " $1").trim() + ":";
      renderTableRow(label.charAt(0).toUpperCase() + label.slice(1), `${v} ${unit}`);
    }
    y += 3;
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(119, 119, 119);
    doc.text("Measurements to be taken during personal atelier studio consultation.", margin + 6, y);
    y += 7;
  }

  y += 3;

  // Section 4: Event & Timeline
  renderSectionHeader("Event & Timeline", "■");
  renderTableRow("Occasion:", order.event_type || "Private Bespoke Fitting", [17, 17, 17], false);
  renderTableRow("Needed By Date:", order.required_date || "To be scheduled", [17, 17, 17], true);
  renderTableRow("Production Urgency:", (order.urgency || "Standard (3-4 weeks)").toUpperCase(), [17, 17, 17], true);

  if (order.description) {
    y += 4;
    renderSectionHeader("Client Vision & Notes", "■");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(68, 68, 68);
    const splitNotes = doc.splitTextToSize(order.description, contentWidth - 12);
    doc.text(splitNotes, margin + 6, y);
    y += splitNotes.length * 4.5 + 4;
  }

  // Footer (#f7f5f0)
  const footerY = 278;
  doc.setDrawColor(226, 221, 213);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY, margin + contentWidth, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(136, 136, 136);
  doc.text("Nova Nancy Atelier Studio Management System · Bespoke Order Dossier", margin + contentWidth / 2, footerY + 5, { align: "center" });
  doc.text("Atelier WhatsApp: +233 55 050 1177 · Kasoa, Ghana", margin + contentWidth / 2, footerY + 9, { align: "center" });

  return doc.output("blob");
}

/**
 * Converts a DOM element into a high-resolution PDF Blob.
 * 1. Attempts html2canvas-pro (with full modern CSS & oklch support).
 * 2. Falls back to html-to-image (browser native SVG renderer).
 * 3. Falls back to generateVectorOrderPdf (pure jsPDF vector rendering).
 */
export async function renderElementToPdfBlob(
  element: HTMLElement,
  fallbackOrder?: Partial<StoredCustomOrder>
): Promise<Blob> {
  // Strategy 1: html2canvas-pro (supports modern CSS & oklch color spaces)
  try {
    const canvas = await html2canvasPro(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf.output("blob");
  } catch (errPro) {
    console.warn("[bespoke-pdf] html2canvas-pro failed, trying html-to-image fallback:", errPro);
  }

  // Strategy 2: html-to-image (native browser rasterizer)
  try {
    const imgData = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const img = new Image();
    img.src = imgData;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const imgHeight = (img.height * pageWidth) / img.width;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);

    return pdf.output("blob");
  } catch (errImg) {
    console.warn("[bespoke-pdf] html-to-image failed, falling back to pure vector jsPDF:", errImg);
  }

  // Strategy 3: Guaranteed vector jsPDF generation
  return generateVectorOrderPdf(fallbackOrder || {});
}

/**
 * Generates and triggers download of the order PDF.
 */
export async function downloadOrderPdf(
  element: HTMLElement,
  orderNumber: string,
  fallbackOrder?: Partial<StoredCustomOrder>
): Promise<Blob> {
  const blob = await renderElementToPdfBlob(element, fallbackOrder || { order_number: orderNumber });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Nova-Nancy-Bespoke-Order-${orderNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return blob;
}

/**
 * Sends the order PDF directly to Mau's WhatsApp:
 * 1. On mobile: Uses Web Share API with the real PDF file attached directly into WhatsApp.
 * 2. On desktop/fallback: Downloads the PDF file and opens WhatsApp chat with Mau pre-loaded with order details and link.
 */
export async function shareOrderPdfToWhatsApp(
  element: HTMLElement,
  orderNumber: string,
  clientName: string,
  dossierUrl: string,
  fallbackOrder?: Partial<StoredCustomOrder>
): Promise<void> {
  toast.loading("Preparing order PDF for WhatsApp...", { id: "pdf-share" });

  try {
    const blob = await renderElementToPdfBlob(
      element,
      fallbackOrder || { order_number: orderNumber, full_name: clientName }
    );
    const fileName = `Nova-Nancy-Order-${orderNumber}.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });

    // Download a local copy for the user's convenience immediately
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);

    // If mobile Web Share with files is supported, invoke share sheet
    if (
      typeof navigator !== "undefined" &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      toast.dismiss("pdf-share");
      try {
        await navigator.share({
          title: `Nova Nancy Bespoke Order - ${orderNumber}`,
          text: `✨ *Nova Nancy Atelier Bespoke Order PDF* ✨\nOrder Ref: *${orderNumber}*\nClient: *${clientName}*\n\nPlease find attached the official order PDF dossier for artisan Mau:`,
          files: [file],
        });
        toast.success("PDF shared successfully!");
        return;
      } catch (shareErr: any) {
        // If user cancelled the share dialog, do not show error
        if (shareErr.name === "AbortError") {
          toast.info("Share sheet dismissed. Your PDF is saved in your downloads.");
          return;
        }
        console.warn("[bespoke-pdf] Native share failed, opening WhatsApp link:", shareErr);
      }
    }

    toast.dismiss("pdf-share");
    toast.success("PDF saved! Opening WhatsApp with Mau...");

    // Open WhatsApp with pre-filled message including link to the PDF dossier
    const msg = encodeURIComponent(
      `✨ *NEW BESPOKE COMMISSION - NOVA NANCY ATELIER* ✨\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Order Ref:* ${orderNumber}\n` +
      `*Client:* ${clientName}\n\n` +
      `📄 *Official Order PDF Dossier:* ${dossierUrl}\n` +
      `*(I have downloaded the order PDF and am attaching it here)*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_Hello Mau, please review my bespoke commission PDF and advise on fitting!_`
    );

    window.open(`https://wa.me/${MAU_WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  } catch (err) {
    toast.dismiss("pdf-share");
    console.error("[bespoke-pdf] Unexpected error:", err);
    toast.error("Opening WhatsApp directly with your order details.");
    window.open(
      `https://wa.me/${MAU_WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hello Mau, here is my bespoke commission reference: ${orderNumber}`
      )}`,
      "_blank"
    );
  }
}
