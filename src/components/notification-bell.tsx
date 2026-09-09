import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRow,
} from "@/lib/notifications";

export function NotificationBell() {
  const { user } = useAuth();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [open, setOpen] = useState(false);

  async function refresh(userId: string) {
    setItems(await fetchNotifications(userId));
  }

  useEffect(() => {
    if (!user) return;
    refresh(user.id);
    const t = setInterval(() => refresh(user.id), 20000);
    return () => clearInterval(t);
  }, [user?.id]);

  if (!user) return null;
  const unread = items.filter((i) => !i.read_at).length;

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center border border-border hover:bg-secondary"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 border border-border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Notifications</span>
            {unread > 0 && (
              <button
                onClick={async () => {
                  await markAllNotificationsRead(user.id);
                  refresh(user.id);
                }}
                className="text-[10px] uppercase tracking-[0.2em] text-accent hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nothing new yet.</p>
            ) : (
              items.map((n) => {
                const inner = (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-serif text-base leading-snug">{n.title}</span>
                      {!n.read_at && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                    </div>
                    {n.body && <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>}
                    <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </>
                );
                const cls = `block w-full border-b border-border/60 px-4 py-3 text-left transition-colors hover:bg-secondary ${
                  n.read_at ? "" : "bg-secondary/40"
                }`;
                const onPick = async () => {
                  if (!n.read_at) await markNotificationRead(n.id);
                  setOpen(false);
                  refresh(user.id);
                };
                return n.link ? (
                  <Link key={n.id} to={n.link as any} className={cls} onClick={onPick}>
                    {inner}
                  </Link>
                ) : (
                  <button key={n.id} className={cls} onClick={onPick}>
                    {inner}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
