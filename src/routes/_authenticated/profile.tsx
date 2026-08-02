import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/shell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile | Nova Nancy" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data ?? { id: user.id }));
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.full_name,
      phone: profile.phone,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
    });
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  }

  if (!profile) return <DashboardShell title="Profile"><div>Loading…</div></DashboardShell>;
  const inputCls = "w-full border border-input bg-background px-4 py-3 text-sm";
  const labelCls = "mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground";

  return (
    <DashboardShell title="Profile">
      <form onSubmit={save} className="mx-auto max-w-2xl space-y-5 border border-border bg-background p-8">
        <div><label className={labelCls}>Full name</label><input className={inputCls} value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
        <div><label className={labelCls}>Phone</label><input className={inputCls} value={profile.phone ?? ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
        <div><label className={labelCls}>Bio</label><textarea rows={4} className={inputCls} value={profile.bio ?? ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></div>
        <div><label className={labelCls}>Avatar URL</label><input className={inputCls} value={profile.avatar_url ?? ""} onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })} /></div>
        <button className="bg-primary px-8 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent">Save</button>
      </form>
    </DashboardShell>
  );
}
