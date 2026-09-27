import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { MAU_WHATSAPP_NUMBER } from "@/lib/bespoke-whatsapp";
import { toast } from "sonner";

/**
 * Converts a DOM element into a high-resolution PDF Blob.
 */
export async function renderElementToPdfBlob(element: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(element, {
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
}

/**
 * Generates and triggers download of the order PDF.
 */
export async function downloadOrderPdf(element: HTMLElement, orderNumber: string): Promise<Blob> {
  const blob = await renderElementToPdfBlob(element);
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
 * 2. On desktop/fallback: Downloads the PDF file and opens WhatsApp chat with Mau pre-loaded with the order summary and link.
 */
export async function shareOrderPdfToWhatsApp(
  element: HTMLElement,
  orderNumber: string,
  clientName: string,
  dossierUrl: string
): Promise<void> {
  toast.loading("Preparing order PDF for WhatsApp...", { id: "pdf-share" });

  try {
    const blob = await renderElementToPdfBlob(element);
    const fileName = `Nova-Nancy-Order-${orderNumber}.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });

    // Check if the browser supports sharing files natively (Mobile Safari, Mobile Chrome)
    if (
      typeof navigator !== "undefined" &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      toast.dismiss("pdf-share");
      await navigator.share({
        title: `Nova Nancy Bespoke Order - ${orderNumber}`,
        text: `✨ *Nova Nancy Atelier Bespoke Order PDF* ✨\nOrder Ref: *${orderNumber}*\nClient: *${clientName}*\n\nPlease find the attached official order PDF dossier for artisan Mau:`,
        files: [file],
      });
      toast.success("PDF shared to WhatsApp successfully!");
      return;
    }

    // Fallback for desktop / standard browsers:
    // 1. Download the PDF file to user device
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);

    toast.dismiss("pdf-share");
    toast.success("PDF downloaded! Opening WhatsApp with Mau...");

    // 2. Open WhatsApp with pre-filled message including link to the PDF dossier
    const msg = encodeURIComponent(
      `✨ *NEW BESPOKE COMMISSION - NOVA NANCY ATELIER* ✨\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Order Ref:* ${orderNumber}\n` +
      `*Client:* ${clientName}\n\n` +
      `📄 *Official Order PDF Dossier:* ${dossierUrl}\n` +
      `*(I have downloaded the PDF and am attaching it here to this chat)*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_Hello Mau, please review my bespoke commission PDF and advise on fitting!_`
    );

    window.open(`https://wa.me/${MAU_WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  } catch (err) {
    toast.dismiss("pdf-share");
    console.error("[bespoke-pdf] Share error:", err);
    toast.error("Could not generate PDF. Opening WhatsApp with order summary instead.");
    window.open(`https://wa.me/${MAU_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello Mau, here is my bespoke order ref: ${orderNumber}`)}`, "_blank");
  }
}
