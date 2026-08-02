import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/shell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Admin · Users | Nova Nancy" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [rolesByUser, setRolesByUser] = useState<Record<string, string[]>>({});

  async function refresh() {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);
    setProfiles(p ?? []);
    const map: Record<string, string[]> = {};
    (r ?? []).forEach((row: any) => { (map[row.user_id] ||= []).push(row.role); });
    setRolesByUser(map);
  }
  useEffect(() => { refresh(); }, []);

  async function toggle(userId: string, role: "customer" | "designer" | "admin") {
    const has = rolesByUser[userId]?.includes(role);
    if (has) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role });
    }
    toast.success("Roles updated"); refresh();
  }

  return (
    <DashboardShell title="Users & Roles">
      <div className="border border-border bg-background">
        <table className="w-full">
          <thead className="border-b border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <tr><th className="p-4 text-left">Member</th><th className="p-4 text-left">Roles</th></tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0">
                <td className="p-4">
                  <div className="font-medium">{p.full_name ?? "N/A"}</div>
                  <div className="text-xs text-muted-foreground">{p.id.slice(0, 8)}</div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {(["customer","designer","admin"] as const).map((role) => {
                      const active = rolesByUser[p.id]?.includes(role);
                      return (
                        <button key={role} onClick={() => toggle(p.id, role)}
                          className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] ${active ? "bg-ink text-cream" : "border border-input hover:bg-secondary"}`}>
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
