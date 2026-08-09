import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listConversations,
  getConversation,
  sendConversationMessage,
} from "@/lib/custom-orders.functions";
import { DashboardShell, EmptyState } from "@/components/dashboard/shell";
import { MessageCircle, Send, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/messages")({
  head: () => ({
    meta: [
      { title: "Messages | Nova Nancy" },
      { name: "description", content: "Talk directly with the Nova Nancy atelier about your commission." },
    ],
  }),
  component: MessagesPage,
});

type Conversation = {
  id: string;
  order_number: string;
  full_name: string;
  clothing_type: string | null;
  status: string;
  lastMessage: { body: string; sender: string; created_at: string } | null;
};

type Message = { id: string; sender: string; body: string; created_at: string };

function MessagesPage() {
  const loadList = useServerFn(listConversations);
  const loadThread = useServerFn(getConversation);
  const sendMessage = useServerFn(sendConversationMessage);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [body, setBody] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const refreshList = useCallback(async () => {
    try {
      const res = await loadList({});
      setIsAdmin(res.isAdmin);
      setConversations(res.conversations as Conversation[]);
      setActiveId((cur) => cur ?? res.conversations[0]?.id ?? null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load conversations");
    } finally {
      setLoading(false);
    }
  }, [loadList]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const refreshThread = useCallback(
    async (id: string) => {
      try {
        const res = await loadThread({ data: { orderId: id } });
        setMessages(res.messages as Message[]);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not load this conversation");
      }
    },
    [loadThread],
  );

  useEffect(() => {
    if (!activeId) return;
    refreshThread(activeId);
    const t = setInterval(() => refreshThread(activeId), 15000);
    return () => clearInterval(t);
  }, [activeId, refreshThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    try {
      const created = (await sendMessage({ data: { orderId: activeId, body: text } })) as Message;
      setMessages((m) => [...m, created]);
      setBody("");
      refreshList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Message not sent");
    } finally {
      setSending(false);
    }
  }

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const mine = isAdmin ? "admin" : "client";

  if (loading) {
    return (
      <DashboardShell title="Messages">
        <div className="text-sm text-muted-foreground">Loading conversations…</div>
      </DashboardShell>
    );
  }

  if (conversations.length === 0) {
    return (
      <DashboardShell title="Messages">
        <EmptyState
          icon={MessageCircle}
          title="No conversations yet"
          description="Messages are grouped by commission. Place a commission request to start chatting with the atelier."
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Messages">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Conversations
            </span>
            <button
              type="button"
              onClick={refreshList}
              className="text-muted-foreground hover:text-accent"
              aria-label="Refresh conversations"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="max-h-[70vh] overflow-y-auto">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={`w-full border-b border-border px-4 py-4 text-left transition-colors ${
                    c.id === activeId ? "bg-secondary" : "hover:bg-secondary/60"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-serif text-base">{c.order_number}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {c.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">
                    {isAdmin ? c.full_name : (c.clothing_type ?? "Commission")}
                  </div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">
                    {c.lastMessage ? c.lastMessage.body : "No messages yet"}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex min-h-[60vh] flex-col border border-border bg-background">
          <header className="border-b border-border px-6 py-4">
            <div className="font-serif text-xl">{active?.order_number ?? "Conversation"}</div>
            <div className="text-xs text-muted-foreground">
              {isAdmin ? active?.full_name : "Nova Nancy atelier"}
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Start the conversation, we usually reply within a few hours.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[80%] p-3 text-sm ${
                    m.sender === mine ? "ml-auto bg-secondary" : "bg-beige"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {m.sender === "admin" ? "Atelier" : "Client"}
                  </div>
                  <div className="mt-1 whitespace-pre-wrap">{m.body}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={onSend} className="flex gap-2 border-t border-border p-4">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type a message"
              maxLength={3000}
              className="flex-1 border border-input bg-background px-4 py-3 text-sm"
            />
            <button
              type="submit"
              disabled={sending || !body.trim()}
              className="flex items-center gap-2 bg-primary px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {sending ? "Sending" : "Send"}
            </button>
          </form>
        </section>
      </div>
    </DashboardShell>
  );
}
