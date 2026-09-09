import { supabase } from "@/integrations/supabase/client";

export type NotificationRow = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export async function fetchNotifications(userId: string, limit = 30): Promise<NotificationRow[]> {
  const { data } = await supabase
    .from("notifications")
    .select("id, kind, title, body, link, read_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as NotificationRow[];
}

export async function markNotificationRead(id: string) {
  await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
}

export async function markAllNotificationsRead(userId: string) {
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);
}
