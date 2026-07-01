"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles, ChevronLeft, ChevronRight, Wand2 } from "lucide-react";
import {
  applyAiActions,
  type AiDesignResponse,
  type CustomizeAiContext,
  type DesignElement,
} from "@/lib/customizeAi";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CustomizeAiPanelProps {
  context: CustomizeAiContext;
  onApply: (result: {
    elements: DesignElement[];
    selectedId: string | null;
    productColor?: string;
    view?: "front" | "back";
  }) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

const QUICK_PROMPTS = [
  "اعملي شعار فريق كرة",
  "ضيفي اسم 'سارة' بخط كبير",
  "غيّري لون القماش لأسود",
  "كبّري النص المحدد",
  "امسحي كل التصميم",
];

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "مرحباً! ✨\n\nقولّي إيه اللي عايزه على التصميم:\n• \"اعملي شعار نادي الأهلي\"\n• \"غيّري اللون لأحمر\"\n• \"كبّري النص وحرّكيه فوق\"\n\nهنفّذ التعديلات على طول!",
};

export default function CustomizeAiPanel({
  context,
  onApply,
  collapsed = false,
  onToggleCollapse,
  isMobile = false,
}: CustomizeAiPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setLoading(true);

    try {
      const res = await fetch("/api/customize-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextHistory
            .filter((m) => m !== WELCOME)
            .map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      });

      const data = (await res.json()) as AiDesignResponse & { error?: string };

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "request_failed");
      }

      const result = applyAiActions(context, data.actions);
      onApply(result);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "عذراً، حصل خطأ. جرّب تاني أو صِغ طلبك بطريقة مختلفة.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        title="فتح مساعد التصميم"
        style={{
          ...(isMobile
            ? {
                position: "fixed",
                left: 12,
                bottom: 124,
                top: "auto",
                transform: "none",
                zIndex: 45,
                padding: "12px 14px",
                borderRadius: 14,
              }
            : {
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 20,
                padding: "14px 10px",
                borderRadius: 12,
              }),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          background: "linear-gradient(135deg, #C9A86E, #9A7848)",
          color: "#FFFFFF",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(201,168,110,0.35)",
          fontFamily: "Tajawal, sans-serif",
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        <Sparkles size={18} />
        {isMobile ? (
          <span>مساعد AI</span>
        ) : (
          <span style={{ writingMode: "vertical-rl", letterSpacing: "0.05em" }}>
            AI
          </span>
        )}
        {isMobile ? <ChevronRight size={14} /> : <ChevronRight size={14} />}
      </button>
    );
  }

  return (
    <div
      style={{
        ...(isMobile
          ? {
              // ── Mobile: شيت محادثة بعرض الشاشة، ثابت فوق شريط الأدوات السفلي ──
              position: "fixed",
              left: 0,
              right: 0,
              top: "auto",
              bottom: 60,
              width: "100%",
              maxHeight: "60vh",
              height: "60vh",
              zIndex: 45,
              borderRadius: "16px 16px 0 0",
              border: "1px solid #E5E7EB",
              borderBottom: "none",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.12)",
            }
          : {
              // ── Desktop: بانل جانبي عائم زي ما هو ──
              position: "absolute",
              left: 16,
              top: 16,
              bottom: 56,
              width: 300,
              zIndex: 20,
              borderRadius: 16,
              border: "1px solid #E5E7EB",
              boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
            }),
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        overflow: "hidden",
        fontFamily: "Tajawal, sans-serif",
      }}
      dir="rtl"
    >
      {/* Header */}
      <div
        style={{
          padding: isMobile ? "12px 14px" : "14px 16px",
          borderBottom: "1px solid #E5E7EB",
          background: "linear-gradient(135deg, #FEF3C7 0%, #FFFFFF 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #C9A86E, #9A7848)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
            }}
          >
            <Wand2 size={16} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ margin: 0, fontSize: isMobile ? 15 : 14, fontWeight: 700, color: "#1A1A1A" }}>
              مساعد التصميم
            </p>
            <p style={{ margin: 0, fontSize: isMobile ? 11 : 10, color: "#92400E" }}>
              صِف التصميم وهننفّذه
            </p>
          </div>
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            style={{
              background: "#FAF9F6",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: isMobile ? 8 : 6,
              cursor: "pointer",
              color: "#6B7280",
              display: "flex",
              flexShrink: 0,
            }}
            title="إخفاء اللوحة"
          >
            <ChevronLeft size={isMobile ? 18 : 14} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: isMobile ? 12 : 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: "#FAF9F6",
          minHeight: 0,
        }}
      >
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={i}
              style={{
                alignSelf: isUser ? "flex-start" : "flex-end",
                maxWidth: isMobile ? "82%" : "88%",
                padding: isMobile ? "10px 14px" : "9px 12px",
                borderRadius: isUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                background: isUser ? "#1A1A1A" : "#FFFFFF",
                color: isUser ? "#FFFFFF" : "#1A1A1A",
                fontSize: isMobile ? 13 : 12,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                border: isUser ? "none" : "1px solid #E5E7EB",
                boxShadow: isUser ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {msg.content}
            </div>
          );
        })}

        {loading && (
          <div
            style={{
              alignSelf: "flex-end",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              color: "#92400E",
              fontSize: 11,
            }}
          >
            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
            جاري تنفيذ التصميم...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div
        style={{
          padding: isMobile ? "10px 12px" : "8px 12px",
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          gap: 6,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          background: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => send(prompt)}
            disabled={loading}
            style={{
              flexShrink: 0,
              padding: isMobile ? "7px 12px" : "5px 10px",
              borderRadius: 20,
              border: "1px solid #E5E7EB",
              background: "#FAF9F6",
              color: "#6B7280",
              fontSize: isMobile ? 11 : 10,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Tajawal, sans-serif",
              opacity: loading ? 0.6 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          padding: isMobile ? "10px 12px calc(12px + env(safe-area-inset-bottom, 0px))" : 12,
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          gap: 8,
          background: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={isMobile ? 1 : 2}
          dir="rtl"
          placeholder='مثال: "اعملي نقش زهور وردي"'
          disabled={loading}
          style={{
            flex: 1,
            minWidth: 0,
            resize: "none",
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            padding: isMobile ? "12px 14px" : "10px 12px",
            fontSize: isMobile ? 14 : 12,
            fontFamily: "Tajawal, sans-serif",
            outline: "none",
            background: "#FAF9F6",
            color: "#1A1A1A",
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            alignSelf: "flex-end",
            width: isMobile ? 46 : 42,
            height: isMobile ? 46 : 42,
            borderRadius: 10,
            border: "none",
            cursor: !input.trim() || loading ? "not-allowed" : "pointer",
            flexShrink: 0,
            background:
              input.trim() && !loading
                ? "linear-gradient(135deg, #C9A86E, #9A7848)"
                : "#E5E7EB",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>

      <div
        style={{
          textAlign: "center",
          paddingBottom: 8,
          fontSize: 9,
          color: "#9CA3AF",
          background: "#FFFFFF",
        }}
      >
        <Sparkles size={9} style={{ display: "inline", verticalAlign: "middle" }} /> Claude AI
      </div>
    </div>
  );
}
