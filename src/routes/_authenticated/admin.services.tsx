import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/shell";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/services")({
  head: () => ({ meta: [{ title: "Admin · Services | Nova Nancy" }] }),
  component: AdminServices,
});
function AdminServices() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    description: "",
    base_price: "",
  });

  async function refresh() {
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });
    setServices(data ?? []);
  }
  useEffect(() => {
    refresh();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("services").insert({
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
      category: form.category,
      description: form.description,
      base_price: form.base_price ? Number(form.base_price) : null,
    });
    if (error) return toast.error(error.message);
    setForm({ title: "", slug: "", category: "", description: "", base_price: "" });
    refresh();
  }
  async function remove(id: string) {
    await supabase.from("services").delete().eq("id", id);
    refresh();
  }

  const inputCls = "w-full border border-input bg-background px-3 py-2 text-sm";

  return (
    <DashboardShell title="Services Catalog">
      <form
        onSubmit={create}
        className="mb-8 grid grid-cols-1 gap-3 border border-border bg-background p-6 md:grid-cols-6"
      >
        <input
          placeholder="Title"
          className={inputCls + " md:col-span-2"}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Category"
          className={inputCls}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="Slug"
          className={inputCls}
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <input
          placeholder="Base price"
          type="number"
          className={inputCls}
          value={form.base_price}
          onChange={(e) => setForm({ ...form, base_price: e.target.value })}
        />
        <button className="bg-primary px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-primary-foreground">
          Add
        </button>
        <textarea
          placeholder="Description"
          className={inputCls + " md:col-span-6"}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </form>

      <div className="border border-border bg-background">
        <table className="w-full">
          <thead className="border-b border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-b border-border/60 last:border-0">
                <td className="p-4">
                  <div className="font-serif text-lg">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.description}</div>
                </td>
                <td className="p-4 text-sm">{s.category}</td>
                <td className="p-4 text-sm">${s.base_price}</td>
                <td className="p-4">
                  <button
                    onClick={() => remove(s.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
