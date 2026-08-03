import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/dashboard/shell";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/orders/new")({
  head: () => ({ meta: [{ title: "New order | Nova Nancy" }] }),
  component: NewOrder,
});

const MEASUREMENTS = [
  { key: "bust", label: "Bust (in)" },
  { key: "waist", label: "Waist (in)" },
  { key: "hips", label: "Hips (in)" },
  { key: "shoulder", label: "Shoulder (in)" },
  { key: "sleeve_length", label: "Sleeve length (in)" },
  { key: "arm_hole", label: "Arm hole (in)" },
  { key: "dress_length", label: "Dress length (in)" },
  { key: "height", label: "Height (in)" },
] as const;

const MAX_FILES = 6;
const MAX_SIZE = 8 * 1024 * 1024;

function NewOrder() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", service_id: "", designer_id: "", notes: "", budget: "", deadline: "" });
  const [measures, setMeasures] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("services").select("*").eq("is_active", true).then(({ data }) => setServices(data ?? []));
    supabase.from("designers").select("id, headline, profiles(full_name)").eq("is_approved", true).then(({ data }) => setDesigners(data ?? []));
  }, []);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const picked = Array.from(list).filter((f) => {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name} is not an image`);
        return false;
      }
      if (f.size > MAX_SIZE) {
        toast.error(`${f.name} is larger than 8MB`);
        return false;
      }
      return true;
    });
    setFiles((prev) => [...prev, ...picked].slice(0, MAX_FILES));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from("orders").insert({
      customer_id: user.id,
      service_id: form.service_id || null,
      designer_id: form.designer_id || null,
      title: form.title,
      notes: form.notes,
      budget: form.budget ? Number(form.budget) : null,
      deadline: form.deadline || null,
      measurements: measures,
    }).select().single();

    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }

    for (const file of files) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${data.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("design-uploads").upload(path, file, { upsert: false });
      if (upErr) {
        toast.error(`Could not upload ${file.name}`);
        continue;
      }
      await supabase.from("design_uploads").insert({
        customer_id: user.id,
        order_id: data.id,
        image_url: path,
        notes: form.notes || null,
      });
    }

    setLoading(false);
    toast.success("Order submitted");
    nav({ to: "/orders/$id", params: { id: data.id } });
  }

  const inputCls = "w-full border border-input bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none";
  const labelCls = "mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground";

  return (
    <DashboardShell title="New Order">
      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6 border border-border bg-background p-8">
        <div>
          <label className={labelCls}>Piece title</label>
          <input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ankara evening gown" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className={labelCls}>Service</label>
            <select className={inputCls} value={form.service_id} onChange={(e) => setForm({ ...form, service_id: e.target.value })}>
              <option value="">Select…</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Designer</label>
            <select className={inputCls} value={form.designer_id} onChange={(e) => setForm({ ...form, designer_id: e.target.value })}>
              <option value="">Auto assign</option>
              {designers.map((d) => <option key={d.id} value={d.id}>{d.profiles?.full_name ?? d.headline}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Describe how your attire should look</label>
          <textarea
            rows={5}
            required
            className={inputCls}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Style, silhouette, sleeve type, fabric preference, colours, occasion, anything you would like Mau to know."
          />
        </div>

        <div>
          <label className={labelCls}>Reference images (up to {MAX_FILES})</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-border px-6 py-10 text-center transition-colors hover:border-accent"
            onClick={() => fileInput.current?.click()}
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Click or drag images of the style you want</p>
            <p className="mt-1 text-[11px] text-muted-foreground">JPG or PNG, up to 8MB each</p>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
          />
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {previews.map((src, i) => (
                <div key={src} className="group relative aspect-square overflow-hidden border border-border">
                  <img src={src} alt={`Reference ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 bg-background/90 p-1 text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className={labelCls}>Body measurements</label>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {MEASUREMENTS.map((m) => (
              <div key={m.key}>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{m.label}</label>
                <input
                  inputMode="decimal"
                  className={inputCls}
                  value={measures[m.key] ?? ""}
                  onChange={(e) => setMeasures({ ...measures, [m.key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Not sure of a measurement? Leave it blank and Mau will confirm it at your fitting.</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div><label className={labelCls}>Budget (USD)</label><input type="number" className={inputCls} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></div>
          <div><label className={labelCls}>Deadline</label><input type="date" className={inputCls} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
        </div>

        <button disabled={loading} className="flex items-center gap-2 bg-primary px-8 py-3.5 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Submit order
        </button>
      </form>
    </DashboardShell>
  );
}
