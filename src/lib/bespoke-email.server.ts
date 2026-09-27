import type { StoredCustomOrder } from "@/lib/custom-orders.storage";
import fs from "node:fs";
import path from "node:path";

/**
 * Designer recipient email address.
 * Primary: vikponunancy1234@gmail.com
 * Can be overridden via DESIGNER_EMAIL or ADMIN_EMAIL in environment variables.
 */
export const DESIGNER_EMAIL =
  process.env.DESIGNER_EMAIL?.trim() ||
  process.env.ADMIN_EMAIL?.trim() ||
  "vikponunancy1234@gmail.com";

export interface SendBespokeEmailResult {
  success: boolean;
  recipient: string;
  provider: "sendgrid" | "resend" | "smtp" | "local_archive";
  messageId?: string;
  archivePath?: string;
  error?: string;
}

/**
 * Generates an executive, luxury HTML email template containing every detail
 * submitted by the client on the Bespoke Custom Order form.
 */
export function generateBespokeEmailHtml(order: StoredCustomOrder): string {
  const measurementRows = Object.entries(order.measurements || {})
    .filter(([_, val]) => val !== undefined && val !== null && val !== "")
    .map(
      ([key, val]) => `
      <tr style="border-bottom: 1px solid #e5e0d8;">
        <td style="padding: 8px 12px; font-weight: 500; color: #444; text-transform: capitalize;">
          ${key.replace(/([A-Z])/g, " $1").trim()}
        </td>
        <td style="padding: 8px 12px; font-weight: 600; color: #111; text-align: right;">
          ${val} ${order.measurement_unit || "in"}
        </td>
      </tr>`
    )
    .join("");

  const customizationsList = Array.isArray(order.customizations) && order.customizations.length > 0
    ? order.customizations.map((c) => `<li style="margin-bottom: 4px;">${c}</li>`).join("")
    : "<em>No specific modifications selected</em>";

  const filesList = Array.isArray(order.files) && order.files.length > 0
    ? order.files
        .map(
          (f) => `
        <li style="margin-bottom: 6px;">
          <strong>${f.file_name}</strong> (${(f.file_size / 1024).toFixed(1)} KB${f.kind ? ` - ${f.kind}` : ""})
        </li>`
        )
        .join("")
    : "<em>No reference images attached</em>";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New Bespoke Commission - ${order.order_number}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; color: #1f1d1a; line-height: 1.5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2ddd5; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    <!-- Header -->
    <tr>
      <td style="background-color: #121212; padding: 32px 36px; text-align: center;">
        <div style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; letter-spacing: 0.2em; color: #ffffff; text-transform: uppercase;">
          NOVA <span style="font-style: italic; font-weight: normal; color: #cbb479;">NANCY</span>
        </div>
        <div style="margin-top: 8px; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #a39c91;">
          Atelier Haute Couture · Kasoa, Ghana
        </div>
      </td>
    </tr>

    <!-- Alert Banner -->
    <tr>
      <td style="background-color: #fbf7ee; border-bottom: 2px solid #cbb479; padding: 18px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; color: #9c7b2c;">
                ✨ New Bespoke Commission Received
              </div>
              <div style="font-size: 18px; font-family: Georgia, serif; font-weight: bold; color: #111; margin-top: 4px;">
                Order Ref: ${order.order_number}
              </div>
            </td>
            <td style="text-align: right; vertical-align: top; font-size: 12px; color: #777;">
              ${new Date(order.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 32px 36px;">
        <!-- Client Profile -->
        <h2 style="font-family: Georgia, serif; font-size: 18px; color: #111; border-bottom: 1px solid #e5e0d8; padding-bottom: 8px; margin-top: 0;">
          👤 Client Information
        </h2>
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px; margin-bottom: 24px;">
          <tr>
            <td width="35%" style="color: #666; font-weight: 500;">Full Name:</td>
            <td width="65%" style="font-weight: 600; color: #111;">${order.full_name}</td>
          </tr>
          <tr>
            <td style="color: #666; font-weight: 500;">Email:</td>
            <td><a href="mailto:${order.email}" style="color: #9c7b2c; text-decoration: none; font-weight: 600;">${order.email}</a></td>
          </tr>
          <tr>
            <td style="color: #666; font-weight: 500;">Phone Number:</td>
            <td><a href="tel:${order.phone}" style="color: #111; text-decoration: none; font-weight: 600;">${order.phone}</a></td>
          </tr>
          ${
            order.whatsapp
              ? `<tr>
            <td style="color: #666; font-weight: 500;">WhatsApp:</td>
            <td><a href="https://wa.me/${order.whatsapp.replace(/[^0-9]/g, "")}" style="color: #25D366; text-decoration: none; font-weight: 600;">${order.whatsapp} ↗</a></td>
          </tr>`
              : ""
          }
          <tr>
            <td style="color: #666; font-weight: 500;">Preferred Contact:</td>
            <td style="text-transform: capitalize; font-weight: 600;">${order.preferred_contact || "WhatsApp"}</td>
          </tr>
          ${
            order.delivery_address
              ? `<tr>
            <td style="color: #666; font-weight: 500;">Delivery / Fitting Address:</td>
            <td>${order.delivery_address}</td>
          </tr>`
              : ""
          }
        </table>

        <!-- Design & Garment Specifications -->
        <h2 style="font-family: Georgia, serif; font-size: 18px; color: #111; border-bottom: 1px solid #e5e0d8; padding-bottom: 8px; margin-top: 28px;">
          👗 Garment & Silhouette Details
        </h2>
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px; margin-bottom: 24px;">
          <tr>
            <td width="35%" style="color: #666; font-weight: 500;">Order Type:</td>
            <td width="65%" style="font-weight: 600;">${order.order_type || "Custom Bespoke"}</td>
          </tr>
          ${
            order.clothing_type
              ? `<tr>
            <td style="color: #666; font-weight: 500;">Clothing Type:</td>
            <td style="font-weight: 600;">${order.clothing_type}</td>
          </tr>`
              : ""
          }
          ${
            order.selected_design
              ? `<tr>
            <td style="color: #666; font-weight: 500;">Design Reference:</td>
            <td>${order.selected_design}</td>
          </tr>`
              : ""
          }
          ${
            order.fabric_preference
              ? `<tr>
            <td style="color: #666; font-weight: 500;">Fabric Preference:</td>
            <td style="font-weight: 600;">${order.fabric_preference}</td>
          </tr>`
              : ""
          }
          ${
            order.color
              ? `<tr>
            <td style="color: #666; font-weight: 500;">Color Choice:</td>
            <td>${order.color}${order.color_notes ? ` (${order.color_notes})` : ""}</td>
          </tr>`
              : ""
          }
          <tr>
            <td style="color: #666; font-weight: 500; vertical-align: top;">Customizations:</td>
            <td><ul style="margin: 0; padding-left: 20px;">${customizationsList}</ul></td>
          </tr>
          ${
            order.description
              ? `<tr>
            <td style="color: #666; font-weight: 500; vertical-align: top;">Client's Vision:</td>
            <td style="background-color: #faf8f5; padding: 10px; border-left: 3px solid #cbb479; font-style: italic;">"${order.description}"</td>
          </tr>`
              : ""
          }
          ${
            order.special_instructions
              ? `<tr>
            <td style="color: #666; font-weight: 500; vertical-align: top;">Special Instructions:</td>
            <td style="background-color: #faf8f5; padding: 10px; border-left: 3px solid #333;">${order.special_instructions}</td>
          </tr>`
              : ""
          }
        </table>

        <!-- Event Timeline -->
        <h2 style="font-family: Georgia, serif; font-size: 18px; color: #111; border-bottom: 1px solid #e5e0d8; padding-bottom: 8px; margin-top: 28px;">
          📅 Event & Timeline
        </h2>
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px; margin-bottom: 24px;">
          <tr>
            <td width="35%" style="color: #666; font-weight: 500;">Occasion / Event:</td>
            <td width="65%" style="font-weight: 600;">${order.event_type || "Private Occasion"}</td>
          </tr>
          ${
            order.event_date
              ? `<tr>
            <td style="color: #666; font-weight: 500;">Event Date:</td>
            <td>${order.event_date}</td>
          </tr>`
              : ""
          }
          ${
            order.required_date
              ? `<tr>
            <td style="color: #666; font-weight: 500;">Required By:</td>
            <td style="font-weight: 600; color: #b33924;">${order.required_date}</td>
          </tr>`
              : ""
          }
          ${
            order.urgency
              ? `<tr>
            <td style="color: #666; font-weight: 500;">Urgency:</td>
            <td style="text-transform: capitalize; font-weight: 600;">${order.urgency}</td>
          </tr>`
              : ""
          }
        </table>

        <!-- Body Measurements -->
        <h2 style="font-family: Georgia, serif; font-size: 18px; color: #111; border-bottom: 1px solid #e5e0d8; padding-bottom: 8px; margin-top: 28px;">
          📐 Body Measurements (${order.measurement_unit || "inches"})
        </h2>
        ${
          order.needs_measurement_help
            ? `<div style="background-color: #fdf5ea; border: 1px solid #eed9b7; padding: 12px 16px; font-size: 14px; color: #875a1e; margin-bottom: 24px;">
                ⚠️ <strong>Client requested measurement assistance:</strong> Mau to conduct in-person atelier fitting or guided WhatsApp video measurement.
               </div>`
            : measurementRows
            ? `<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; border: 1px solid #e5e0d8; margin-bottom: 24px;">
                ${measurementRows}
               </table>`
            : `<p style="font-style: italic; color: #888;">No measurements provided.</p>`
        }

        <!-- Uploaded References -->
        <h2 style="font-family: Georgia, serif; font-size: 18px; color: #111; border-bottom: 1px solid #e5e0d8; padding-bottom: 8px; margin-top: 28px;">
          📎 Attached Reference Files & Sketches
        </h2>
        <ul style="font-size: 13px; color: #444; padding-left: 20px; margin-bottom: 32px;">
          ${filesList}
        </ul>

        <!-- Action Box for Designer -->
        <div style="background-color: #1a1a1a; padding: 24px; text-align: center; color: #ffffff;">
          <div style="font-family: Georgia, serif; font-size: 16px; margin-bottom: 12px; color: #cbb479;">
            Ready to respond to ${order.full_name}?
          </div>
          <div style="margin-bottom: 16px; font-size: 13px; color: #bbb;">
            Client prefers contact via <strong>${order.preferred_contact?.toUpperCase() || "WHATSAPP"}</strong>.
          </div>
          <div>
            ${
              order.whatsapp || order.phone
                ? `<a href="https://wa.me/${(order.whatsapp || order.phone).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${order.full_name}, this is Mau from Nova Nancy Atelier. I have received your bespoke commission ${order.order_number} and would love to discuss your fitting.`)}" style="background-color: #25D366; color: #ffffff; text-decoration: none; padding: 10px 20px; font-size: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; display: inline-block; margin-right: 8px;">
                    Open WhatsApp Chat
                   </a>`
                : ""
            }
            <a href="mailto:${order.email}?subject=${encodeURIComponent(`Nova Nancy Bespoke Commission [${order.order_number}]`)}" style="background-color: #ffffff; color: #111111; text-decoration: none; padding: 10px 20px; font-size: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; display: inline-block;">
              Reply via Email
            </a>
          </div>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f7f5f0; border-top: 1px solid #e2ddd5; padding: 20px 36px; text-align: center; font-size: 11px; color: #888;">
        Nova Nancy Studio Management System · Automatic Intake Dispatch<br />
        Order Ref: ${order.order_number} · Dedicated Designer: Mau
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates plain-text version for email clients.
 */
export function generateBespokeEmailText(order: StoredCustomOrder): string {
  const measurements = Object.entries(order.measurements || {})
    .filter(([_, val]) => val !== undefined && val !== null && val !== "")
    .map(([k, v]) => `  - ${k}: ${v} ${order.measurement_unit || "in"}`)
    .join("\n");

  const files = (order.files || []).map((f) => `  - ${f.file_name} (${(f.file_size / 1024).toFixed(1)} KB)`).join("\n");

  return `========================================
NOVA NANCY ATELIER - NEW BESPOKE ORDER
========================================
Order Reference : ${order.order_number}
Received Date   : ${new Date(order.created_at).toLocaleString()}
Status          : ${order.status}

CLIENT INFORMATION:
-------------------
Full Name       : ${order.full_name}
Email           : ${order.email}
Phone           : ${order.phone}
WhatsApp        : ${order.whatsapp || "None"}
Preferred Contact: ${order.preferred_contact}
Delivery Address: ${order.delivery_address || "None"}

GARMENT SPECIFICATIONS:
-----------------------
Order Type      : ${order.order_type || "Custom Bespoke"}
Clothing Type   : ${order.clothing_type || "N/A"}
Design Reference: ${order.selected_design || "N/A"}
Fabric Choice   : ${order.fabric_preference || "N/A"}
Color           : ${order.color || "N/A"} ${order.color_notes ? `(${order.color_notes})` : ""}
Customizations  : ${(order.customizations || []).join(", ") || "None"}
Client's Vision : ${order.description || "N/A"}
Instructions    : ${order.special_instructions || "None"}

EVENT & TIMELINE:
-----------------
Event Type      : ${order.event_type || "N/A"}
Event Date      : ${order.event_date || "N/A"}
Required Date   : ${order.required_date || "N/A"}
Urgency         : ${order.urgency || "Standard"}

MEASUREMENTS (${order.measurement_unit || "in"}):
-------------------------
${order.needs_measurement_help ? "Client requested measurement assistance from Mau." : measurements || "None provided."}

UPLOADED FILES:
---------------
${files || "No files attached."}

========================================
Reply directly to ${order.email} or WhatsApp ${order.whatsapp || order.phone}
========================================`;
}

/**
 * Dispatches the bespoke order notification to the designer's email.
 * Evaluates Resend, SMTP (Nodemailer), and saves an archive copy to disk.
 */
export async function dispatchBespokeOrderEmail(
  order: StoredCustomOrder
): Promise<SendBespokeEmailResult> {
  const recipient = DESIGNER_EMAIL;
  const subject = `✨ New Bespoke Order [${order.order_number}]: ${order.full_name} (${order.clothing_type || "Custom Couture"})`;
  const html = generateBespokeEmailHtml(order);
  const text = generateBespokeEmailText(order);

  // 1. Always archive to local disk for 100% auditing and backup
  let archivePath: string | undefined;
  try {
    const archiveDir = path.resolve(process.cwd(), "logs", "bespoke-orders");
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }
    archivePath = path.join(archiveDir, `${order.order_number}.html`);
    fs.writeFileSync(archivePath, html, "utf-8");
  } catch (err) {
    console.warn("[bespoke-email] Could not write archive file:", err);
  }

  // 2. Try sending via Resend API if RESEND_API_KEY is configured (Primary)
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    try {
      const fromAddress = process.env.RESEND_FROM_EMAIL || "Nova Nancy Atelier <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [recipient],
          reply_to: order.email,
          subject,
          html,
          text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`[bespoke-email] Successfully sent order email via Resend to ${recipient}. ID:`, data.id);
        return {
          success: true,
          recipient,
          provider: "resend",
          messageId: data.id,
          archivePath,
        };
      } else {
        const errorData = await res.json().catch(() => null);
        console.warn("[bespoke-email] Resend API error response:", errorData);

        // If Resend free sandbox requires sending to the account owner email first:
        const sandboxOwner = process.env.RESEND_SANDBOX_EMAIL?.trim() || "sameben0123@gmail.com";
        if (errorData?.statusCode === 403 && sandboxOwner && sandboxOwner !== recipient) {
          console.log(`[bespoke-email] Attempting Resend sandbox delivery to account owner: ${sandboxOwner}`);
          const sandboxHtml = `
            <div style="background-color: #fff3cd; color: #856404; padding: 16px; margin-bottom: 24px; border: 1px solid #ffeeba; font-family: sans-serif; font-size: 13px;">
              <strong>⚠️ Resend Sandbox Delivery Notice:</strong><br />
              This bespoke commission is intended for: <strong>${recipient}</strong>.<br />
              Because your domain is not yet verified on Resend, Resend delivers testing emails to your account address (${sandboxOwner}).<br />
              <em>To deliver directly to ${recipient}, verify your domain at <a href="https://resend.com/domains" target="_blank">resend.com/domains</a>.</em>
            </div>
            ${html}
          `;

          const retryRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: fromAddress,
              to: [sandboxOwner],
              reply_to: order.email,
              subject: `[Bespoke Order for ${recipient}] ${subject}`,
              html: sandboxHtml,
              text: `[Intended for: ${recipient}]\n\n${text}`,
            }),
          });

          if (retryRes.ok) {
            const retryData = await retryRes.json();
            console.log(`[bespoke-email] Successfully delivered order email via Resend Sandbox to ${sandboxOwner}. ID:`, retryData.id);
            return {
              success: true,
              recipient: sandboxOwner,
              provider: "resend",
              messageId: retryData.id,
              archivePath,
            };
          }
        }
      }
    } catch (e) {
      console.warn("[bespoke-email] Resend dispatch failed:", e);
    }
  }

  // 3. Try sending via SendGrid API if SENDGRID_API_KEY is configured
  const sendgridKey = process.env.SENDGRID_API_KEY?.trim();
  if (sendgridKey) {
    try {
      const fromEmail = process.env.SENDGRID_FROM_EMAIL?.trim() || "orders@novanancy.com";
      const fromName = process.env.SENDGRID_FROM_NAME?.trim() || "Nova Nancy Atelier";

      const payload = {
        personalizations: [
          {
            to: [{ email: recipient, name: "Mau - Nova Nancy Atelier" }],
            subject,
          },
        ],
        from: {
          email: fromEmail,
          name: fromName,
        },
        reply_to: {
          email: order.email,
          name: order.full_name,
        },
        content: [
          {
            type: "text/plain",
            value: text,
          },
          {
            type: "text/html",
            value: html,
          },
        ],
      };

      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 202 || res.ok) {
        console.log(`[bespoke-email] Successfully dispatched order email via SendGrid to ${recipient}`);
        return {
          success: true,
          recipient,
          provider: "sendgrid",
          archivePath,
        };
      } else {
        const errorText = await res.text();
        console.warn(`[bespoke-email] SendGrid API error response (${res.status}):`, errorText);
      }
    } catch (sendgridErr) {
      console.warn("[bespoke-email] SendGrid dispatch failed:", sendgridErr);
    }
  }

  // 3. Try sending via SMTP (Nodemailer) if SMTP credentials are configured
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  if (smtpHost || (smtpUser && smtpPass)) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtpHost || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: (process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) === 465 : true),
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `Nova Nancy Atelier <${smtpUser}>`,
        to: recipient,
        replyTo: order.email,
        subject,
        html,
        text,
      });

      console.log(`[bespoke-email] Successfully sent order email via SMTP to ${recipient}. Message ID:`, info.messageId);
      return {
        success: true,
        recipient,
        provider: "smtp",
        messageId: info.messageId,
        archivePath,
      };
    } catch (smtpErr) {
      console.warn("[bespoke-email] SMTP dispatch failed:", smtpErr);
    }
  }

  // 4. Fallback: Logged and archived locally with full details
  console.log(
    `[bespoke-email] Order details for ${order.order_number} archived for designer (${recipient}) at ${archivePath || "console"}. To enable direct inbox transmission, configure RESEND_API_KEY or SMTP_USER/SMTP_PASS.`
  );

  return {
    success: true,
    recipient,
    provider: "local_archive",
    archivePath,
  };
}
