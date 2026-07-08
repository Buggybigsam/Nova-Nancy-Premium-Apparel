import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/shell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/atelier")({
  head: () => ({ meta: [{ title: "My Atelier — Nova Nancy" }] }),
  component: AtelierPage,
});

function AtelierPage() {
  const { user } = useAuth();
  const [d, setD] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("designers").select("*").eq("profile_id", user.id).maybeSingle().then(({ data }) => setD(data ?? {
      profile_id: user.id, headline: "", specialties: [], years_experience: 0, hourly_rate: 0, portfolio_images: [], is_approved: false,
    }));
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const payload = {
      profile_id: user.id,
      headline: d.headline,
      specialties: typeof d.specialties === "string" ? d.specialties.split(",").map((s: string) => s.trim()) : d.specialties,
      years_experience: Number(d.years_experience) || 0,
      hourly_rate: Number(d.hourly_rate) || 0,
      portfolio_images: typeof d.portfolio_images === "string" ? d.portfolio_images.split("\n").filter(Boolean) : d.portfolio_images,
    };
    const { error } = await supabase.from("designers").upsert(payload, { onConflict: "profile_id" });
    if (error) return toast.error(error.message);

    // Ensure user has designer role
    await supabase.from("user_roles").insert({ user_id: user.id, role: "designer" }).select();
    toast.success("Atelier saved. Awaiting admin approval to appear publicly.");
  }

  if (!d) return <DashboardShell title="My Atelier"><div>Loading…</div></DashboardShell>;
  const inputCls = "w-full border border-input bg-background px-4 py-3 text-sm";
  const labelCls = "mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground";

  return (
    <DashboardShell title="My Atelier">
      <form onSubmit={save} className="mx-auto max-w-3xl space-y-5 border border-border bg-background p-8">
        {!d.is_approved && d.id && <div className="border border-accent bg-accent/10 p-4 text-sm">Pending admin approval before appearing in the public directory.</div>}
        <div><label className={labelCls}>Headline</label><input className={inputCls} value={d.headline ?? ""} onChange={(e) => setD({ ...d, headline: e.target.value })} placeholder="Master tailor · Milan-trained" /></div>
        <div><label className={labelCls}>Specialties (comma-separated)</label><input className={inputCls} value={Array.isArray(d.specialties) ? d.specialties.join(", ") : d.specialties} onChange={(e) => setD({ ...d, specialties: e.target.value })} placeholder="Bridal, Suiting, Evening" /></div>
        <div className="grid grid-cols-2 gap-6">
          <div><label className={labelCls}>Years experience</label><input type="number" className={inputCls} value={d.years_experience ?? 0} onChange={(e) => setD({ ...d, years_experience: e.target.value })} /></div>
          <div><label className={labelCls}>Hourly rate (USD)</label><input type="number" className={inputCls} value={d.hourly_rate ?? 0} onChange={(e) => setD({ ...d, hourly_rate: e.target.value })} /></div>
        </div>
        <div><label className={labelCls}>Portfolio image URLs (one per line)</label><textarea rows={5} className={inputCls} value={Array.isArray(d.portfolio_images) ? d.portfolio_images.join("\n") : d.portfolio_images} onChange={(e) => setD({ ...d, portfolio_images: e.target.value })} /></div>
        <button className="bg-primary px-8 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent">Save atelier</button>
      </form>
    </DashboardShell>
  );
}
