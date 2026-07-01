"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X, Zap } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIStylistProps {
  open: boolean;
  onClose: () => void;
}

// ─── Quick-pick chips shown above the input ──────────────────
const QUICK_PICKS = [
  "مناسبة رسمية",
  "كاجوال يومي",
  "حفل زفاف",
  "إطلالة شتوية",
  "هدية لصديقة",
  "ميزانية محدودة",
];

// ─── Welcome message ─────────────────────────────────────────
const WELCOME: Message = {
  role: "assistant",
  content:
    "مرحباً بك في خدمة مستشار الأزياء VŌGU ✨\n\nأنا هنا لمساعدتك في اختيار الملابس المثالية. أخبرني عن:\n• المناسبة التي تبحث عنها\n• ميزانيتك التقريبية\n• أسلوبك المفضل\n\nوسأقدم لك توصيات مخصصة!",
};

// ─── Typing dots ─────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 0.15, 0.3].map((delay, i) => (
        <span
          key={i}
          className="block h-[6px] w-[6px] rounded-full bg-[#C9A86E]"
          style={{ animation: `vogu-pulse 1s ${delay}s ease-in-out infinite` }}
        />
      ))}
    </div>
  );
}

// ─── Single chat bubble ───────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[82%] rounded-[10px] px-[13px] py-[10px] text-[12px] leading-[1.75] whitespace-pre-wrap font-tajawal ${
          isUser
            ? "bg-[#121212] border border-[#1A1A1A] text-[#EDE8DF] rounded-bl-[3px]"
            : "border border-[#9A784833] text-[#EDE8DF] rounded-br-[3px]"
        }`}
        style={
          !isUser
            ? { background: "linear-gradient(135deg,#1A1200,#221800)" }
            : undefined
        }
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function AIStylist({ open, onClose }: AIStylistProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // ─── Send message ───────────────────────────────────────────
  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setLoading(true);

    try {
      // Call our own API route (keeps the API key server-side)
      const res = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "عذراً، حدث خطأ." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مجدداً.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleQuickPick = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setMessages([WELCOME]);
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-[4px]"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-[201] flex w-full max-w-[380px] flex-col border-l border-[#262626] bg-[#0D0D0D]"
            dir="rtl"
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between border-b border-[#1A1A1A] px-4 py-[14px]"
              style={{
                background: "linear-gradient(135deg,#121212 0%,#1A1200 100%)",
              }}
            >
              <div className="flex items-center gap-3">
                {/* AI avatar */}
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#060606]"
                  style={{
                    background: "linear-gradient(135deg,#C9A86E,#9A7848)",
                  }}
                >
                  <Zap size={16} />
                </div>

                <div>
                  <h3 className="font-cormorant text-[16px] font-normal text-[#EDE8DF]">
                    مستشار الأزياء
                  </h3>
                  <p className="flex items-center gap-1 text-[9px] text-[#C9A86E] font-tajawal">
                    <span className="inline-block h-[6px] w-[6px] rounded-full bg-[#5CB87A]" />
                    VŌGU AI Stylist • متصل
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Clear chat */}
                {messages.length > 1 && (
                  <button
                    onClick={handleClear}
                    className="rounded-[7px] border border-[#262626] bg-[#121212] px-[9px] py-[6px] text-[9px] text-[#8A8480] transition-colors hover:text-[#EDE8DF] font-tajawal"
                  >
                    مسح المحادثة
                  </button>
                )}

                {/* Close */}
                <button
                  onClick={onClose}
                  className="flex rounded-[7px] border border-[#262626] bg-[#121212] p-[7px] text-[#8A8480] transition-colors hover:text-[#EDE8DF]"
                  aria-label="إغلاق"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex flex-1 flex-col gap-[9px] overflow-y-auto p-[13px]">
              {messages.map((msg, i) => (
                <Bubble key={i} msg={msg} />
              ))}

              {/* Loading dots */}
              {loading && (
                <div className="flex justify-end">
                  <div
                    className="rounded-[10px] rounded-br-[3px] border border-[#9A784833]"
                    style={{
                      background: "linear-gradient(135deg,#1A1200,#221800)",
                    }}
                  >
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* ── Quick picks ── */}
            <div className="flex gap-[5px] overflow-x-auto border-t border-[#1A1A1A] px-[13px] py-[8px] no-scrollbar">
              {QUICK_PICKS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickPick(q)}
                  className="flex-shrink-0 rounded-[20px] border border-[#262626] bg-[#121212] px-[10px] py-[5px] text-[10px] text-[#8A8480] transition-colors hover:text-[#EDE8DF] font-tajawal whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* ── Input bar ── */}
            <div className="flex gap-[7px] border-t border-[#1A1A1A] px-[13px] pb-[16px] pt-[9px]">
              {/* Send button */}
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="flex flex-shrink-0 items-center justify-center rounded-[8px] p-[8px] transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  background:
                    input.trim() && !loading ? "#C9A86E" : "#121212",
                  color:
                    input.trim() && !loading ? "#060606" : "#484542",
                }}
                aria-label="إرسال"
              >
                {loading ? (
                  <span
                    className="block h-[17px] w-[17px] rounded-full border-2 border-[#262626] border-t-[#C9A86E]"
                    style={{ animation: "spin 0.7s linear infinite" }}
                  />
                ) : (
                  <Send size={15} />
                )}
              </button>

              {/* Text input */}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب سؤالك عن الأزياء..."
                dir="rtl"
                className="flex-1 rounded-[8px] border border-[#262626] bg-[#121212] px-[12px] py-[8px] text-[12px] text-[#EDE8DF] placeholder-[#484542] outline-none transition-colors focus:border-[#C9A86E]/50 font-tajawal"
              />
            </div>

            {/* Powered-by tag */}
            <div className="flex items-center justify-center gap-1 pb-3 text-[9px] text-[#484542] font-tajawal">
              <Sparkles size={9} className="text-[#C9A86E]" />
              مدعوم بتقنية Claude AI من Anthropic
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
