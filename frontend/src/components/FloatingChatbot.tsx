import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type ChatMessage = { role: "user" | "bot"; text: string };

type ConversationSummary = {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: string;
  messageCount: number;
};

interface FloatingChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const WELCOME: ChatMessage = { role: "bot", text: "Hi, I'm Finny AI. How can I help you today?" };

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function authHeaders(token: string | null): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function FloatingChatbot({ isOpen, onClose }: FloatingChatbotProps) {
  const { user, token } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = useCallback(async () => {
    setSidebarLoading(true);
    try {
      const res = await fetch("/api/v1/chat/conversations", { headers: authHeaders(token) });
      if (res.ok) {
        const data = (await res.json()) as { data: ConversationSummary[] };
        setConversations(data.data ?? []);
      }
    } catch {
      // sidebar failures are non-critical
    } finally {
      setSidebarLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      void fetchConversations();
    }
  }, [isOpen, fetchConversations]);

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([WELCOME]);
    setMessage("");
  };

  const loadConversation = async (convId: string) => {
    setActiveConversationId(convId);
    try {
      const res = await fetch(`/api/v1/chat/conversations/${convId}`, { headers: authHeaders(token) });
      if (!res.ok) return;
      const envelope = (await res.json()) as {
        data: { id: string; title: string; history: Array<{ role: string; content: string }>; createdAt: string };
      };
      const data = envelope.data;
      const loaded: ChatMessage[] = data.history.map((h) => ({
        role: h.role === "assistant" ? "bot" : "user",
        text: h.content,
      }));
      setMessages(loaded.length ? loaded : [WELCOME]);
    } catch {
      //
    }
    setTimeout(scrollToBottom, 80);
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;

    setMessage("");
    setMessages((prev) => [...prev, { role: "user", text: trimmedMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/chat/message", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          message: trimmedMessage,
          conversationHistory: [],
          userProfile: { userId: user?.id },
          conversationId: activeConversationId,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const envelope = (await response.json()) as {
        data: { reply: string; action?: { type: string | null }; conversationId: string };
      };
      const data = envelope.data;
      const reply = data.reply ?? "Sorry, I couldn't understand that response.";

      if (!activeConversationId && data.conversationId) {
        setActiveConversationId(data.conversationId);
        void fetchConversations();
      }

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong reaching the AI. Please try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative flex h-[min(640px,85vh)] w-full max-w-3xl overflow-hidden rounded-[1.5rem] border border-[color:var(--color-dust-grey)] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
        {/* Sidebar */}
        <aside className="flex w-56 flex-shrink-0 flex-col border-r border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)]">
          <div className="border-b border-[color:var(--color-dust-grey)] p-3">
            <button
              type="button"
              onClick={startNewChat}
              className="flex w-full items-center gap-2 rounded-xl bg-[color:var(--color-ebony)] px-3 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <span className="text-base leading-none">+</span>
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {sidebarLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[color:var(--color-dust-grey)] border-t-[color:var(--color-ebony)]" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="px-2 py-4 text-center text-xs text-[color:var(--color-charcoal)]/50">
                No conversations yet
              </p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => void loadConversation(conv.id)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                    activeConversationId === conv.id
                      ? "bg-[color:var(--color-muted-teal)]/15"
                      : "hover:bg-white/60"
                  }`}
                >
                  <p className="truncate text-sm font-medium text-[color:var(--color-charcoal)]">
                    {conv.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[color:var(--color-charcoal)]/50">
                    {timeAgo(conv.createdAt)}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-[color:var(--color-ebony)] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Finny AI</p>
              <p className="text-xs text-white/80">Online now</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chatbot"
              className="rounded-full px-2 py-1 text-sm transition hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-[color:var(--color-soft-linen)] px-4 py-4">
            {messages.map((chatMessage, index) => (
              <div
                key={`${chatMessage.role}-${index}`}
                className={`flex ${chatMessage.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    chatMessage.role === "user"
                      ? "bg-[color:var(--color-muted-teal)] text-white"
                      : "bg-white text-[color:var(--color-charcoal)] shadow-sm"
                  }`}
                >
                  {chatMessage.text}
                </div>
              </div>
            ))}
            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-[color:var(--color-charcoal)] shadow-sm">
                  <span className="animate-pulse">Finny is thinking…</span>
                </div>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[color:var(--color-dust-grey)] bg-white p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void sendMessage();
                }}
                placeholder="Type a message…"
                disabled={isLoading}
                className="flex-1 rounded-xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-3 py-2.5 text-sm text-[color:var(--color-charcoal)] outline-none placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.12)] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={isLoading}
                className="rounded-xl bg-[color:var(--color-ebony)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
