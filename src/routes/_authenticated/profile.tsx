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
  const { user, clerkUser } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const meta = (clerkUser?.unsafeMetadata ?? {}) as Record<string, string>;
    let local: Record<string, string> | null = null;
    try {
      const cached = localStorage.getItem(`nn_profile_${user.id}`);
      if (cached) local = JSON.parse(cached);
    } catch {
      // ignore JSON parse error
    }

    const initial = {
      id: user.id,
      email: user.email || clerkUser?.primaryEmailAddress?.emailAddress || "",
      full_name:
        local?.full_name ||
        clerkUser?.fullName ||
        clerkUser?.firstName ||
        user.user_metadata?.full_name ||
        "",
      phone: local?.phone || meta.phone || "",
      bio: local?.bio || meta.bio || "",
      avatar_url: local?.avatar_url || clerkUser?.imageUrl || user.user_metadata?.avatar_url || "",
    };
    setProfile(initial);

    // Also attempt to load from Supabase if reachable
    Promise.resolve(supabase.from("profiles").select("*").eq("id", user.id).maybeSingle())
      .then(({ data }) => {
        if (data) {
          setProfile((prev: Record<string, unknown>) => ({
            ...prev,
            ...data,
          }));
        }
      })
      .catch(() => {
        // graceful offline fallback
      });
  }, [user, clerkUser]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      // 1. Cache to local storage immediately
      localStorage.setItem(`nn_profile_${user.id}`, JSON.stringify(profile));

      // 2. Sync to Clerk user account if signed in with Clerk
      if (clerkUser) {
        const parts = (profile.full_name || "").trim().split(" ");
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";
        try {
          await clerkUser.update({
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            unsafeMetadata: {
              ...(clerkUser.unsafeMetadata ?? {}),
              phone: profile.phone ?? "",
              bio: profile.bio ?? "",
              avatar_url: profile.avatar_url ?? "",
            },
          });
        } catch (clerkErr) {
          console.warn("Clerk metadata update warning:", clerkErr);
        }
      }

      // 3. Attempt Supabase sync if reachable
      try {
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: profile.full_name,
          phone: profile.phone,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
        });
      } catch (sbErr) {
        console.warn("Supabase profile sync skipped:", sbErr);
      }

      toast.success("Profile saved successfully");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (!profile || !user) {
    return (
      <DashboardShell title="Profile">
        <div className="text-muted-foreground">Loading profile…</div>
      </DashboardShell>
    );
  }

  const inputCls = "w-full border border-input bg-background px-4 py-3 text-sm";
  const labelCls = "mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground";

  return (
    <DashboardShell title="Profile">
      <form
        onSubmit={save}
        className="mx-auto max-w-2xl space-y-5 border border-border bg-background p-8"
      >
        <div>
          <label className={labelCls}>Email address</label>
          <input
            disabled
            className={inputCls + " cursor-not-allowed opacity-60"}
            value={profile.email ?? user.email ?? ""}
          />
        </div>
        <div>
          <label className={labelCls}>Full name</label>
          <input
            className={inputCls}
            placeholder="Your full name"
            value={profile.full_name ?? ""}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input
            className={inputCls}
            placeholder="+1 (555) 000-0000"
            value={profile.phone ?? ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>Bio</label>
          <textarea
            rows={4}
            className={inputCls}
            placeholder="Tell us about yourself or your style preferences"
            value={profile.bio ?? ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>Avatar URL</label>
          <input
            className={inputCls}
            placeholder="https://..."
            value={profile.avatar_url ?? ""}
            onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
          />
        </div>
        <button
          disabled={saving}
          type="submit"
          className="bg-primary px-8 py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-accent disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </DashboardShell>
  );
}
