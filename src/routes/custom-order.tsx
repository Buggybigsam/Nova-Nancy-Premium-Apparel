import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { portfolioPieces } from "@/data/portfolio";
import {
  ALLOWED_FILE_TYPES,
  CLOTHING_TYPES,
  CUSTOMIZATION_OPTIONS,
  EVENT_TYPES,
  FABRIC_OPTIONS,
  FILE_KINDS,
  MAX_FILES,
  MAX_FILE_SIZE,
  MEASUREMENT_GROUPS,
  ORDER_TYPES,
  formatFileSize,
} from "@/lib/custom-orders";
import { createIntakeUploads, submitCustomOrder } from "@/lib/custom-orders.functions";
import {
  Check,
  FileText,
  Loader2,
  Upload,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/custom-order")({
  validateSearch: (s: Record<string, unknown>) =>
    ({ design: typeof s["design"] === "string" ? s["design"] : undefined }) as { design?: string },
  head: () => ({
    meta: [
      { title: "Design Your Outfit | Nova Nancy Custom Order" },
      {
        name: "description",
        content:
          "Send Nova Nancy your reference images, body measurements and design brief, and receive a personal quotation for your bespoke Ankara piece.",
      },
      { property: "og:title", content: "Design Your Outfit | Nova Nancy" },
      {
        property: "og:description",
        content:
          "Upload references, enter measurements and submit your bespoke garment request in minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustomOrderPage,
});

type UploadState = "uploading" | "done" | "error";
interface UploadItem {
  id: string;
  file: File;
  preview: string | null;
  kind: string;
  path?: string;
  state: UploadState;
  error?: string;
}

const STEPS = [
  "Your details",
  "Order type",
  "References",
  "Measurements",
  "Design brief",
  "Event",
  "Review",
];

const input =
  "w-full border border-input bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none";
const label = "mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground";

function CustomOrderPage() {
  const search = useSearch({ from: "/custom-order" });
  const nav = useNavigate();
  const prepare = useServerFn(createIntakeUploads);
  const submit = useServerFn(submitCustomOrder);

  const [intakeId] = useState(() => crypto.randomUUID());
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const { user } = useAuth();

  const [client, setClient] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    preferredContact: "whatsapp" as "whatsapp" | "phone" | "email",
    deliveryAddress: "",
  });

  useEffect(() => {
    if (!user) return;
    setClient((c) => ({
      ...c,
      fullName: c.fullName || user.user_metadata?.full_name || "",
      email: c.email || user.email || "",
    }));
    supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setClient((c) => ({
            ...c,
            fullName: c.fullName || data.full_name || "",
            phone: c.phone || data.phone || "",
            whatsapp: c.whatsapp || data.phone || "",
          }));
        }
      });
  }, [user]);
  const [orderType, setOrderType] = useState<(typeof ORDER_TYPES)[number]["value"]>(
    search.design ? "existing_design" : "custom_design",
  );
  const [selectedDesign, setSelectedDesign] = useState(search.design ?? "");
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [unit, setUnit] = useState<"inches" | "cm">("inches");
  const [needsHelp, setNeedsHelp] = useState(false);
  const [measures, setMeasures] = useState<Record<string, string>>({});
  const [design, setDesign] = useState({
    clothingType: "",
    fabricPreference: "",
    color: "",
    colorNotes: "",
    description: "",
    specialInstructions: "",
  });
  const [customizations, setCustomizations] = useState<string[]>([]);
  const [event, setEvent] = useState({
    eventType: "",
    eventDate: "",
    requiredDate: "",
    urgency: "standard",
  });
  const [agree, setAgree] = useState({
    measurements: false,
    terms: false,
    privacy: false,
    payment: false,
  });

  useEffect(
    () => () => uploads.forEach((u) => u.preview && URL.revokeObjectURL(u.preview)),
    [uploads],
  );

  const rushWarning = useMemo(() => {
    if (!event.requiredDate) return null;
    const days = Math.ceil((new Date(event.requiredDate).getTime() - Date.now()) / 86400000);
    if (days < 0) return "That date is in the past.";
    if (days < 14)
      return `Only ${days} day${days === 1 ? "" : "s"} away. Bespoke pieces normally need 3 to 4 weeks, so Mau will confirm whether a rush slot is available.`;
    return null;
  }, [event.requiredDate]);

  async function addFiles(list: FileList | null) {
    if (!list) return;
    const room = MAX_FILES - uploads.length;
    const picked = Array.from(list).slice(0, Math.max(0, room));
    if (Array.from(list).length > room) toast.error(`You can attach up to ${MAX_FILES} files.`);

    for (const file of picked) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a JPG, PNG, WEBP or PDF file.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is larger than 10MB.`);
        continue;
      }
      const id = crypto.randomUUID();
      const item: UploadItem = {
        id,
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
        kind: "Inspiration",
        state: "uploading",
      };
      setUploads((prev) => [...prev, item]);

      try {
        const { slots } = await prepare({
          data: { intakeId, files: [{ name: file.name, type: file.type, size: file.size }] },
        });
        const slot = slots[0]!;
        const { error } = await supabase.storage
          .from("design-uploads")
          .uploadToSignedUrl(slot.path, slot.token, file);
        if (error) throw error;
        setUploads((prev) =>
          prev.map((u) => (u.id === id ? { ...u, state: "done", path: slot.path } : u)),
        );
      } catch (err) {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, state: "error", error: (err as Error).message } : u,
          ),
        );
      }
    }
  }

  const stepValid = (i: number) => {
    if (i === 0)
      return (
        client.fullName.trim().length > 1 &&
        /\S+@\S+\.\S+/.test(client.email) &&
        client.phone.trim().length >= 6
      );
    if (i === 1) return orderType !== "existing_design" || !!selectedDesign;
    if (i === 3) return needsHelp || Object.values(measures).some((v) => v.trim() !== "");
    if (i === 4) return true; // Design brief is optional and never blocks progression
    if (i === 6) return Object.values(agree).every(Boolean);
    return true;
  };

  const handleNextStep = () => {
    if (step === 0) {
      if (client.fullName.trim().length <= 1) {
        toast.error("Please enter your full name to continue.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(client.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
      if (client.phone.trim().length < 6) {
        toast.error("Please enter a valid phone number.");
        return;
      }
    }
    if (step === 1 && orderType === "existing_design" && !selectedDesign) {
      toast.error("Please select a design from the collection to continue.");
      return;
    }
    if (step === 2 && uploading) {
      toast.info("Please wait for your images to finish uploading.");
      return;
    }
    if (step === 3 && !needsHelp && !Object.values(measures).some((v) => v.trim() !== "")) {
      toast.error("Please enter your measurements or tick 'Book me a measurement appointment'.");
      return;
    }
    // Step 4 (Design brief) and Step 5 (Event) are fully unblocked
    setStep((s) => s + 1);
  };

  async function handleSubmit() {
    if (!stepValid(6)) {
      toast.error("Please tick the confirmation boxes below to agree to bespoke terms.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submit({
        data: {
          intakeId,
          fullName: client.fullName,
          email: client.email,
          phone: client.phone,
          whatsapp: client.whatsapp || undefined,
          preferredContact: client.preferredContact,
          deliveryAddress: client.deliveryAddress || undefined,
          orderType,
          selectedDesign: selectedDesign || undefined,
          clothingType: design.clothingType || undefined,
          fabricPreference: design.fabricPreference || undefined,
          color: design.color || undefined,
          colorNotes: design.colorNotes || undefined,
          customizations,
          description: design.description || undefined,
          specialInstructions: design.specialInstructions || undefined,
          eventType: event.eventType || undefined,
          eventDate: event.eventDate || undefined,
          requiredDate: event.requiredDate || undefined,
          urgency: event.urgency,
          measurementUnit: unit,
          measurements: needsHelp ? {} : measures,
          needsMeasurementHelp: needsHelp,
          files: uploads
            .filter((u) => u.state === "done" && u.path)
            .map((u) => ({
              name: u.file.name,
              type: u.file.type,
              size: u.file.size,
              kind: u.kind,
              path: u.path!,
            })),
        },
      });
      nav({ to: "/order-confirmed", search: { ref: result.orderNumber } });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const uploading = uploads.some((u) => u.state === "uploading");

  return (
    <div className="min-h-screen bg-beige">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-16">
        <span className="eyebrow">Bespoke commission</span>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">Design your outfit</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Seven short steps. Share your references, your measurements and exactly how you want the
          piece to look, and Mau will respond with a quotation.
        </p>

        {/* Stepper */}
        <ol className="mt-8 flex gap-1 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex min-w-0 flex-1 flex-col gap-2">
              <div className={`h-1 w-full ${i <= step ? "bg-accent" : "bg-border"}`} />
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`truncate text-left text-[10px] uppercase tracking-[0.18em] ${
                  i === step ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {i + 1}. {s}
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-6 border border-border bg-background p-5 md:p-8">
          {step === 0 && (
            <section className="space-y-5">
              <h2 className="font-serif text-2xl">Your details</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={label}>Full name *</label>
                  <input
                    className={input}
                    value={client.fullName}
                    onChange={(e) => setClient({ ...client, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>Email address *</label>
                  <input
                    type="email"
                    className={input}
                    value={client.email}
                    onChange={(e) => setClient({ ...client, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>Phone number *</label>
                  <input
                    className={input}
                    value={client.phone}
                    onChange={(e) => setClient({ ...client, phone: e.target.value })}
                    placeholder="+233 55 050 1177"
                  />
                </div>
                <div>
                  <label className={label}>WhatsApp number</label>
                  <input
                    className={input}
                    value={client.whatsapp}
                    onChange={(e) => setClient({ ...client, whatsapp: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>Preferred contact</label>
                  <select
                    className={input}
                    value={client.preferredContact}
                    onChange={(e) =>
                      setClient({
                        ...client,
                        preferredContact: e.target.value as typeof client.preferredContact,
                      })
                    }
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Phone call</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div>
                  <label className={label}>Delivery location</label>
                  <input
                    className={input}
                    value={client.deliveryAddress}
                    onChange={(e) => setClient({ ...client, deliveryAddress: e.target.value })}
                    placeholder="Kasoa, Ghana"
                  />
                </div>
              </div>
              {!stepValid(0) && (
                <p className="text-xs text-muted-foreground">
                  Name, a valid email and a phone number are required.
                </p>
              )}
            </section>
          )}

          {step === 1 && (
            <section className="space-y-5">
              <h2 className="font-serif text-2xl">What kind of order is this?</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {ORDER_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setOrderType(t.value)}
                    className={`border px-5 py-4 text-left text-sm transition-colors ${
                      orderType === t.value
                        ? "border-accent bg-secondary"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {(orderType === "existing_design" || orderType === "modification") && (
                <div>
                  <label className={label}>Choose a design from the portfolio</label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {portfolioPieces.map((p) => (
                      <button
                        key={p.slug}
                        type="button"
                        onClick={() => setSelectedDesign(p.title)}
                        className={`group overflow-hidden border text-left ${
                          selectedDesign === p.title ? "border-accent" : "border-border"
                        }`}
                      >
                        <img
                          src={p.image}
                          alt={p.title}
                          className="aspect-[3/4] w-full object-cover"
                        />
                        <div className="p-2">
                          <div className="truncate text-xs font-medium">{p.title}</div>
                          <div className="truncate text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            {p.category}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {step === 2 && (
            <section className="space-y-5">
              <h2 className="font-serif text-2xl">Reference images and files</h2>
              <p className="text-sm text-muted-foreground">
                Front, back and side views, fabric photos, sketches, measurement charts or any
                inspiration. JPG, PNG, WEBP or PDF, up to 10MB each, {MAX_FILES} files maximum.
              </p>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  void addFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInput.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-border px-6 py-12 text-center transition-colors hover:border-accent"
              >
                <Upload className="h-6 w-6 text-accent" />
                <p className="mt-3 text-sm">Tap to choose files or drag them here</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Uploading directly from your phone works perfectly
                </p>
              </div>
              <input
                ref={fileInput}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => {
                  void addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              {uploads.length > 0 && (
                <ul className="space-y-3">
                  {uploads.map((u) => (
                    <li key={u.id} className="flex items-center gap-4 border border-border p-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden border border-border bg-secondary">
                        {u.preview ? (
                          <img
                            src={u.preview}
                            alt={u.file.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm">{u.file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(u.file.size)}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <select
                            className="border border-input bg-background px-2 py-1 text-xs"
                            value={u.kind}
                            onChange={(e) =>
                              setUploads((prev) =>
                                prev.map((x) =>
                                  x.id === u.id ? { ...x, kind: e.target.value } : x,
                                ),
                              )
                            }
                          >
                            {FILE_KINDS.map((k) => (
                              <option key={k} value={k}>
                                {k}
                              </option>
                            ))}
                          </select>
                          {u.state === "uploading" && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Loader2 className="h-3 w-3 animate-spin" /> Uploading
                            </span>
                          )}
                          {u.state === "done" && (
                            <span className="flex items-center gap-1 text-xs text-emerald-700">
                              <Check className="h-3 w-3" /> Uploaded
                            </span>
                          )}
                          {u.state === "error" && (
                            <span className="text-xs text-red-600">Failed: {u.error}</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${u.file.name}`}
                        onClick={() => setUploads((prev) => prev.filter((x) => x.id !== u.id))}
                        className="shrink-0 border border-border p-2 hover:bg-secondary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {step === 3 && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-2xl">Body measurements</h2>
                <div className="flex border border-border">
                  {(["inches", "cm"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-4 py-2 text-xs uppercase tracking-[0.2em] ${unit === u ? "bg-ink text-cream" : ""}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-start gap-3 border border-border p-4 text-sm">
                <input
                  type="checkbox"
                  checked={needsHelp}
                  onChange={(e) => setNeedsHelp(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  I do not know my measurements. Book me a measurement appointment with Mau.
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Mau will contact you to arrange a studio visit or guide you over WhatsApp video.
                  </span>
                </span>
              </label>
              {!needsHelp &&
                MEASUREMENT_GROUPS.map((g) => (
                  <div key={g.group}>
                    <h3 className="mb-3 text-[11px] uppercase tracking-[0.25em] text-accent">
                      {g.group}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {g.fields.map((f) => (
                        <div key={f.key}>
                          <label
                            className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                            title={f.hint}
                          >
                            {f.label}
                          </label>
                          <input
                            inputMode="decimal"
                            className={input}
                            placeholder={unit}
                            value={measures[f.key] ?? ""}
                            onChange={(e) => setMeasures({ ...measures, [f.key]: e.target.value })}
                          />
                          {f.hint && (
                            <p className="mt-1 text-[10px] leading-tight text-muted-foreground">
                              {f.hint}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </section>
          )}

          {step === 4 && (
            <section className="space-y-5">
              <h2 className="font-serif text-2xl">Design requirements</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={label}>Clothing type</label>
                  <select
                    className={input}
                    value={design.clothingType}
                    onChange={(e) => setDesign({ ...design, clothingType: e.target.value })}
                  >
                    <option value="">Select…</option>
                    {CLOTHING_TYPES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Fabric</label>
                  <select
                    className={input}
                    value={design.fabricPreference}
                    onChange={(e) => setDesign({ ...design, fabricPreference: e.target.value })}
                  >
                    <option value="">Select…</option>
                    {FABRIC_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Colour</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      aria-label="Pick a colour"
                      className="h-12 w-14 border border-input bg-background"
                      onChange={(e) => setDesign({ ...design, color: e.target.value })}
                    />
                    <input
                      className={input}
                      placeholder="Gold, deep burgundy, ivory…"
                      value={design.color}
                      onChange={(e) => setDesign({ ...design, color: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className={label}>Colour or fabric notes</label>
                  <input
                    className={input}
                    value={design.colorNotes}
                    onChange={(e) => setDesign({ ...design, colorNotes: e.target.value })}
                    placeholder="Matching the wax print I uploaded"
                  />
                </div>
              </div>
              <div>
                <label className={label}>Customisations</label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {CUSTOMIZATION_OPTIONS.map((c) => {
                    const on = customizations.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          setCustomizations((prev) =>
                            on ? prev.filter((x) => x !== c) : [...prev, c],
                          )
                        }
                        className={`border px-3 py-2 text-left text-xs ${on ? "border-accent bg-secondary" : "border-border"}`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className={label}>
                  Design notes & vision (optional)
                </label>
                <textarea
                  rows={5}
                  className={input}
                  value={design.description}
                  onChange={(e) => setDesign({ ...design, description: e.target.value })}
                  placeholder="Silhouette, neckline, sleeves, hem, lining, fit, finishing, or any details Mau should know. You can also leave this blank to discuss during consultation."
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Optional: Describe any preferences you have, or leave empty to discuss directly with Mau.
                </p>
              </div>
              <div>
                <label className={label}>Special instructions</label>
                <textarea
                  rows={3}
                  className={input}
                  value={design.specialInstructions}
                  onChange={(e) => setDesign({ ...design, specialInstructions: e.target.value })}
                />
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="space-y-5">
              <h2 className="font-serif text-2xl">Event information</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={label}>Occasion</label>
                  <select
                    className={input}
                    value={event.eventType}
                    onChange={(e) => setEvent({ ...event, eventType: e.target.value })}
                  >
                    <option value="">Select…</option>
                    {EVENT_TYPES.map((e2) => (
                      <option key={e2} value={e2}>
                        {e2}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Urgency</label>
                  <select
                    className={input}
                    value={event.urgency}
                    onChange={(e) => setEvent({ ...event, urgency: e.target.value })}
                  >
                    <option value="standard">Standard, 3 to 4 weeks</option>
                    <option value="priority">Priority, 2 weeks</option>
                    <option value="rush">Rush, under 2 weeks</option>
                  </select>
                </div>
                <div>
                  <label className={label}>Event date</label>
                  <input
                    type="date"
                    className={input}
                    value={event.eventDate}
                    onChange={(e) => setEvent({ ...event, eventDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>Date outfit is needed</label>
                  <input
                    type="date"
                    className={input}
                    value={event.requiredDate}
                    onChange={(e) => setEvent({ ...event, requiredDate: e.target.value })}
                  />
                </div>
              </div>
              {rushWarning && (
                <p className="flex items-start gap-2 border border-accent/40 bg-secondary p-4 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {rushWarning}
                </p>
              )}
            </section>
          )}

          {step === 6 && (
            <section className="space-y-6">
              <h2 className="font-serif text-2xl">Review your request</h2>
              <ReviewBlock
                title="Personal information"
                onEdit={() => setStep(0)}
                rows={[
                  ["Name", client.fullName],
                  ["Email", client.email],
                  ["Phone", client.phone],
                  ["WhatsApp", client.whatsapp || "Not given"],
                  ["Preferred contact", client.preferredContact],
                  ["Delivery", client.deliveryAddress || "Not given"],
                ]}
              />
              <ReviewBlock
                title="Order type"
                onEdit={() => setStep(1)}
                rows={[
                  ["Type", ORDER_TYPES.find((t) => t.value === orderType)?.label ?? orderType],
                  ["Selected design", selectedDesign || "Not applicable"],
                ]}
              />
              <ReviewBlock
                title={`Uploaded files (${uploads.filter((u) => u.state === "done").length})`}
                onEdit={() => setStep(2)}
                rows={
                  uploads.length
                    ? uploads.map(
                        (u) =>
                          [
                            u.kind,
                            `${u.file.name} · ${u.state === "done" ? "uploaded" : u.state}`,
                          ] as [string, string],
                      )
                    : [["Files", "None attached"]]
                }
              />
              <ReviewBlock
                title="Measurements"
                onEdit={() => setStep(3)}
                rows={
                  needsHelp
                    ? [["Measurements", "Appointment requested with Mau"]]
                    : (Object.entries(measures)
                        .filter(([, v]) => v.trim())
                        .map(([k, v]) => [k.replace(/_/g, " "), `${v} ${unit}`]) as [
                        string,
                        string,
                      ][])
                }
              />
              <ReviewBlock
                title="Design requirements"
                onEdit={() => setStep(4)}
                rows={[
                  ["Clothing type", design.clothingType || "Not set"],
                  [
                    "Fabric",
                    FABRIC_OPTIONS.find((f) => f.value === design.fabricPreference)?.label ??
                      "Not set",
                  ],
                  ["Colour", design.color || "Not set"],
                  ["Customisations", customizations.join(", ") || "None"],
                  ["Description", design.description.trim() || "Discuss directly with Mau during consultation"],
                  ["Special instructions", design.specialInstructions || "None"],
                ]}
              />
              <ReviewBlock
                title="Event"
                onEdit={() => setStep(5)}
                rows={[
                  ["Occasion", event.eventType || "Not set"],
                  ["Event date", event.eventDate || "Not set"],
                  ["Needed by", event.requiredDate || "Not set"],
                  ["Urgency", event.urgency],
                ]}
              />

              <div className="space-y-3 border border-border p-5 text-sm">
                {[
                  [
                    "measurements",
                    "I confirm my measurements are accurate and understand I am responsible for them.",
                  ],
                  [
                    "terms",
                    "I accept the design and customisation terms, including that handmade pieces vary slightly.",
                  ],
                  [
                    "privacy",
                    "I agree to the privacy policy covering my contact details, measurements and uploads.",
                  ],
                  [
                    "payment",
                    "I understand a quotation follows and that production starts after payment terms are agreed.",
                  ],
                ].map(([key, text]) => (
                  <label key={key} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={agree[key as keyof typeof agree]}
                      onChange={(e) => setAgree({ ...agree, [key]: e.target.checked })}
                    />
                    <span>{text}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="inline-flex items-center gap-2 border border-border px-5 py-3 text-[11px] uppercase tracking-[0.25em] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {step < 6 ? (
              <button
                type="button"
                disabled={step === 2 && uploading}
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 bg-primary px-7 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent disabled:opacity-50"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={!stepValid(6) || submitting}
                onClick={() => void handleSubmit()}
                className="inline-flex items-center gap-2 bg-primary px-7 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Submit custom order
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <WhatsAppButton variant="outline" label="Ask Mau a question" />
          <Link
            to="/track"
            className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent"
          >
            Track an existing request
          </Link>
        </div>
      </main>
    </div>
  );
}

function ReviewBlock({
  title,
  rows,
  onEdit,
}: {
  title: string;
  rows: [string, string][];
  onEdit: () => void;
}) {
  return (
    <div className="border border-border p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[11px] uppercase tracking-[0.25em] text-accent">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent"
        >
          Edit
        </button>
      </div>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        {rows.length === 0 && <dd className="text-muted-foreground">Nothing entered</dd>}
        {rows.map(([k, v], i) => (
          <div key={`${k}-${i}`} className="min-w-0">
            <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{k}</dt>
            <dd className="break-words">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
