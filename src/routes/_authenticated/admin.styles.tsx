import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useUserRoles } from "@/hooks/use-auth";
import { DashboardShell, EmptyState } from "@/components/dashboard/shell";
import { fetchAllStyles, type StyleWithImage } from "@/lib/styles";
import { Palette, Trash2, Upload, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/styles")({
  head: () => ({
    meta: [
      { title: "Homepage Styles | Nova Nancy" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Upload and manage the fashion styles shown on the Nova Nancy homepage." },
      { property: "og:title", content: "Homepage Styles | Nova Nancy" },
      { property: "og:description", content: "Upload and manage the fashion styles shown on the Nova Nancy homepage." },
    ],
  }),
  component: AdminStyles,
});

function AdminStyles() {
  const { user } = useAuth();
  const { roles } = useUserRoles(user?.id);
  const isAdmin = roles.includes("admin");

  const [items, setItems] = useState<StyleWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", tag: "", description: "" });

  async function refresh() {
    setItems(await fetchAllStyles());
    setLoading(false);
  }
  useEffect(() => {
    refresh();
  }, []);

  function pick(f: File | null) {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !user) return toast.error("Choose a photo first");
    if (file.size > 10 * 1024 * 1024) return toast.error("Please choose a photo under 10MB");
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("styles").upload(path, file, { contentType: file.type });
      if (up.error) throw up.error;
      const { error } = await supabase.from("styles").insert({
        title: form.title.trim(),
        tag: form.tag.trim() || null,
        description: form.description.trim() || null,
        storage_path: path,
        created_by: user.id,
      });
      if (error) throw error;
      toast.success("Style added to the homepage");
      setForm({ title: "", tag: "", description: "" });
      pick(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublish(s: StyleWithImage) {
    const { error } = await supabase.from("styles").update({ is_published: !s.is_published }).eq("id", s.id);
    if (error) return toast.error(error.message);
    refresh();
  }

  async function remove(s: StyleWithImage) {
    const { error } = await supabase.from("styles").delete().eq("id", s.id);
    if (error) return toast.error(error.message);
    await supabase.storage.from("styles").remove([s.storage_path]);
    toast.success("Style removed");
    refresh();
  }

  const inputCls = "w-full border border-input bg-background px-4 py-3 text-sm";
  const labelCls = "mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground";

  if (!isAdmin) {
    return (
      <DashboardShell title="Homepage Styles">
        <p className="text-sm text-muted-foreground">This area is reserved for the studio owner.</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Homepage Styles">
      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={upload} className="space-y-4 border border-border bg-background p-6">
          <h3 className="font-serif text-xl">Add a new style</h3>
          <div>
            <label className={labelCls}>Photo</label>
            <input type="file" accept="image/*" className={inputCls} onChange={(e) => pick(e.target.files?.[0] ?? null)} />
            {preview && <img src={preview} alt="Selected style" className="mt-3 aspect-[4/5] w-full object-cover" />}
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <input className={inputCls} placeholder="Ankara, Bridal, Corporate" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Short description</label>
            <textarea className={inputCls} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent disabled:opacity-60"
          >
            <Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Publish to homepage"}
          </button>
        </form>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-3">{[1, 2, 3].map((i) => <div key={i} className="aspect-[4/5] animate-pulse bg-muted" />)}</div>
          ) : items.length === 0 ? (
            <EmptyState icon={Palette} title="No styles yet" description="Upload your first look and it appears on the homepage straight away." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((s) => (
                <div key={s.id} className="border border-border bg-background">
                  {s.imageUrl && <img src={s.imageUrl} alt={s.title} className="aspect-[4/5] w-full object-cover" />}
                  <div className="space-y-2 p-4">
                    <div className="font-serif text-lg">{s.title}</div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.tag ?? "Style"}</div>
                    {s.description && <p className="text-xs text-muted-foreground">{s.description}</p>}
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => togglePublish(s)} className="flex items-center gap-1.5 border border-input px-3 py-2 text-[10px] uppercase tracking-[0.2em] hover:bg-secondary">
                        {s.is_published ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Show</>}
                      </button>
                      <button onClick={() => remove(s)} className="flex items-center gap-1.5 border border-input px-3 py-2 text-[10px] uppercase tracking-[0.2em] hover:bg-secondary">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
