import React from "react";
import type { StoredCustomOrder } from "@/lib/custom-orders.storage";

interface BespokeOrderDossierProps {
  order: Partial<StoredCustomOrder>;
  submittedDate?: string;
}

// Flat Azure Blue SVG icons matching the user's uploaded intake dossier screenshot
const UserIcon = () => (
  <svg className="w-5 h-5 fill-[#1976d2] inline-block flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const DressIcon = () => (
  <svg className="w-5 h-5 fill-[#1976d2] inline-block flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2c-.6 0-1.1.2-1.5.5L7 5.5l1.5 2.5L7 11v10c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V11l-1.5-3L17 5.5l-3.5-3c-.4-.3-.9-.5-1.5-.5zM10.5 4h3l2 1.7-1 1.7L12 6.5l-2.5.9-1-1.7L10.5 4z" />
  </svg>
);

const MeasureIcon = () => (
  <svg className="w-5 h-5 fill-[#1976d2] inline-block flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h2v4h2V8h2v3h2V8h2v4h2V8h2v3h2V8h3v8z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5 fill-[#1976d2] inline-block flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
);

const VisionIcon = () => (
  <svg className="w-5 h-5 fill-[#1976d2] inline-block flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l2.4 5.2 5.6.8-4 4 1 5.6-5-2.8-5 2.8 1-5.6-4-4 5.6-.8z" />
  </svg>
);

export const BespokeOrderDossier = React.forwardRef<HTMLDivElement, BespokeOrderDossierProps>(
  ({ order, submittedDate }, ref) => {
    const measurements = order.measurements || {};
    const measurementRows = Object.entries(measurements)
      .filter(([_, val]) => val !== undefined && val !== null && val !== "")
      .map(([k, v]) => ({
        key: k.replace(/([A-Z])/g, " $1").trim(),
        value: `${v} ${order.measurement_unit || "in"}`,
      }));

    const dateFormatted = submittedDate || (order.created_at
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
        }));

    return (
      <div
        ref={ref}
        id="bespoke-pdf-dossier"
        className="w-full max-w-[680px] mx-auto bg-white border border-[#e2ddd5] shadow-lg text-[#1f1d1a] font-sans print:border-none print:shadow-none"
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
      >
        {/* Header matching user's image */}
        <div className="bg-[#121212] px-9 py-8 text-center text-white">
          <div className="font-serif text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase">
            NOVA <span className="italic font-normal text-[#cbb479]">NANCY</span>
          </div>
          <div className="mt-2 text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#a39c91]">
            Atelier Haute Couture · Kasoa, Ghana
          </div>
        </div>

        {/* Alert / Ref Bar matching user's image */}
        <div className="bg-[#fcf9f2] border-b-2 border-[#cbb479] px-9 py-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9c7b2c] flex items-center gap-1.5">
              <span>✨</span>
              <span>New Bespoke Commission Received</span>
            </div>
            <div className="text-lg md:text-xl font-serif text-[#111] mt-0.5">
              Order Ref: <span className="font-bold">{order.order_number || "NN-PENDING"}</span>
            </div>
          </div>
          <div className="text-xs text-[#777] font-medium text-right">
            {dateFormatted}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-8 sm:p-9 space-y-7 text-sm">
          {/* Section 1: Client Information */}
          <div>
            <div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-2">
              <UserIcon />
              <h2 className="font-serif text-lg text-[#111] font-bold">
                Client Information
              </h2>
            </div>
            <table className="w-full mt-3 text-sm border-collapse">
              <tbody>
                <tr className="border-b border-[#f3eee7]/80">
                  <td className="py-2.5 w-[38%] text-[#666] font-medium">Full Name:</td>
                  <td className="py-2.5 text-[#111] font-bold">{order.full_name || "N/A"}</td>
                </tr>
                <tr className="border-b border-[#f3eee7]/80">
                  <td className="py-2.5 text-[#666] font-medium">Email:</td>
                  <td className="py-2.5 text-[#9c7b2c] font-semibold">{order.email || "N/A"}</td>
                </tr>
                <tr className="border-b border-[#f3eee7]/80">
                  <td className="py-2.5 text-[#666] font-medium">Phone Number:</td>
                  <td className="py-2.5 text-[#111] font-bold">{order.phone || "N/A"}</td>
                </tr>
                <tr className="border-b border-[#f3eee7]/80">
                  <td className="py-2.5 text-[#666] font-medium">WhatsApp:</td>
                  <td className="py-2.5 text-[#16a34a] font-bold">
                    {order.whatsapp ? `${order.whatsapp} ↗` : order.phone ? `${order.phone} ↗` : "None"}
                  </td>
                </tr>
                <tr className="border-b border-[#f3eee7]/80">
                  <td className="py-2.5 text-[#666] font-medium">Preferred Contact:</td>
                  <td className="py-2.5 text-[#111] font-bold capitalize">{order.preferred_contact || "WhatsApp"}</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#666] font-medium">Delivery / Fitting Address:</td>
                  <td className="py-2.5 text-[#111] font-semibold">{order.delivery_address || "Kasoa Atelier"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Garment & Silhouette Details */}
          <div>
            <div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-2">
              <DressIcon />
              <h2 className="font-serif text-lg text-[#111] font-bold">
                Garment & Silhouette Details
              </h2>
            </div>
            <table className="w-full mt-3 text-sm border-collapse">
              <tbody>
                <tr className="border-b border-[#f3eee7]/80">
                  <td className="py-2.5 w-[38%] text-[#666] font-medium">Order Type:</td>
                  <td className="py-2.5 text-[#111] font-bold">{order.order_type || "existing_design"}</td>
                </tr>
                <tr className="border-b border-[#f3eee7]/80">
                  <td className="py-2.5 text-[#666] font-medium">Clothing Type:</td>
                  <td className="py-2.5 text-[#111] font-bold">{order.clothing_type || "Dress"}</td>
                </tr>
                <tr className="border-b border-[#f3eee7]/80">
                  <td className="py-2.5 text-[#666] font-medium">Design Reference:</td>
                  <td className="py-2.5 text-[#111] font-semibold">{order.selected_design || "Original Bespoke Design"}</td>
                </tr>
                <tr className="border-b border-[#f3eee7]/80">
                  <td className="py-2.5 text-[#666] font-medium">Fabric Preference:</td>
                  <td className="py-2.5 text-[#111] font-bold">{order.fabric_preference || "nova_provides"}</td>
                </tr>
                {order.color && (
                  <tr className="border-b border-[#f3eee7]/80">
                    <td className="py-2.5 text-[#666] font-medium">Colour:</td>
                    <td className="py-2.5 text-[#111] font-semibold">
                      {order.color} {order.color_notes ? `(${order.color_notes})` : ""}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="py-2.5 text-[#666] font-medium align-top">Customizations:</td>
                  <td className="py-2.5 text-[#111]">
                    {order.customizations && order.customizations.length > 0 ? (
                      <ul className="list-disc pl-5 m-0 space-y-0.5">
                        {order.customizations.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    ) : (
                      <em className="text-[#666] italic">No specific modifications selected</em>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Measurements */}
          <div>
            <div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-2">
              <MeasureIcon />
              <h2 className="font-serif text-lg text-[#111] font-bold">
                Body Measurements
              </h2>
            </div>
            {order.needs_measurement_help ? (
              <div className="mt-3 bg-[#fcf9f2] p-3.5 border border-[#cbb479]/40 text-xs text-[#856404] rounded-sm">
                <strong>Fitting Appointment Requested:</strong> Client requested in-person measurement appointment with Mau at Kasoa Atelier.
              </div>
            ) : measurementRows.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {measurementRows.map((m, idx) => (
                  <div key={idx} className="flex justify-between border-b border-[#f0ece5] py-2 px-2.5 bg-[#faf9f6]">
                    <span className="text-[#666] capitalize">{m.key}:</span>
                    <span className="font-bold text-[#111]">{m.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs italic text-[#777]">To be taken during studio consultation.</p>
            )}
          </div>

          {/* Section 4: Timeline & Occasion */}
          <div>
            <div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-2">
              <CalendarIcon />
              <h2 className="font-serif text-lg text-[#111] font-bold">
                Event & Timeline
              </h2>
            </div>
            <table className="w-full mt-3 text-sm border-collapse">
              <tbody>
                <tr className="border-b border-[#f3eee7]/80">
                  <td className="py-2.5 w-[38%] text-[#666] font-medium">Occasion:</td>
                  <td className="py-2.5 text-[#111] font-semibold">{order.event_type || "Private Bespoke Fitting"}</td>
                </tr>
                <tr className="border-b border-[#f3eee7]/80">
                  <td className="py-2.5 text-[#666] font-medium">Needed By Date:</td>
                  <td className="py-2.5 text-[#111] font-bold">{order.required_date || "To be scheduled"}</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#666] font-medium">Production Urgency:</td>
                  <td className="py-2.5 text-[#111] font-bold capitalize">{order.urgency || "Standard (3-4 weeks)"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Vision / Notes if provided */}
          {order.description && (
            <div>
              <div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-2">
                <VisionIcon />
                <h2 className="font-serif text-lg text-[#111] font-bold">
                  Client Vision & Notes
                </h2>
              </div>
              <p className="mt-2 text-xs text-[#444] bg-[#faf9f6] p-3 border border-[#eee] leading-relaxed">
                {order.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#f7f5f0] border-t border-[#e2ddd5] px-9 py-5 text-center text-[10px] text-[#888] space-y-1">
          <div>Nova Nancy Atelier Studio Management System · Bespoke Order Dossier</div>
          <div>Atelier WhatsApp: <strong>+233 55 050 1177</strong> · Kasoa, Ghana</div>
        </div>
      </div>
    );
  }
);

BespokeOrderDossier.displayName = "BespokeOrderDossier";
