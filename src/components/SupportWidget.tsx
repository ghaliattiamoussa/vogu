"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Phone, Mail,
  Loader2, CheckCircle2, ChevronRight, Clock,
} from "lucide-react";

// ── صفحات نُخفي فيها زر الدعم (فيها شريط أدوات سفلي/تداخل) ──
const HIDDEN_ROUTES = ["/customize"];

// ══════════════════════════════════════════════════════════════
// ⚙️ بيانات التواصل — غيّرها بمعلوماتك الحقيقية
// ══════════════════════════════════════════════════════════════
const CONTACT = {
  whatsappNumber: "201234567890",      // بدون + وبدون مسافات (كود الدولة + الرقم)
  phoneDisplay:   "+20 123 456 7890",  // الرقم كما يظهر للعميل
  phoneLink:      "+201234567890",     // الرقم للاتصال المباشر
  email:          "support@vogu.com",
  workingHours:   "يومياً من ١٠ صباحاً حتى ١٢ منتصف الليل",
};

const WHATSAPP_PRESET_MSG = encodeURIComponent("مرحباً، أحتاج مساعدة بخصوص طلب من متجر VŌGU 🙏");

// ── Types ─────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "agent";
  text: string;
  time: string;
  id?: string;       // id من الـDB (للتتبّع)
  fromDb?: boolean;  // هل جت من الـDB (رد الأدمن)
}

type ViewMode = "menu" | "chat";

// ── Polling interval (بالثواني) ────────────────────────────────
const POLL_INTERVAL = 4; // كل 4 ثواني بشوف فيش ردود جديدة

// ── Helpers ───────────────────────────────────────────────────
function nowTime() {
  return new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

// ══════════════════════════════════════════════════════════════
// Contact Method Row (WhatsApp / Phone / Email)
// ══════════════════════════════════════════════════════════════
function ContactRow({
  icon, label, sub, color, onClick,
}: {
  icon: React.ReactNode; label: string; sub: string; color: string; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        width: "100%", padding: "12px 14px",
        background: hov ? "#161616" : "#0D0D0D",
        border: `1px solid ${hov ? color + "55" : "#1A1A1A"}`,
        borderRadius: 12, cursor: "pointer",
        transition: "all 0.2s", textAlign: "right",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: `${color}1A`, color,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, color: "#EDE8DF", fontFamily: "Tajawal, sans-serif", fontWeight: 600 }}>{label}</p>
        <p style={{ fontSize: 11, color: "#8A8480", fontFamily: "Tajawal, sans-serif", marginTop: 1, direction: "ltr", textAlign: "right" }}>{sub}</p>
      </div>
      <ChevronRight
        size={15}
        style={{
          color: hov ? color : "#484542",
          transform: hov ? "rotate(180deg) translateX(-3px)" : "rotate(180deg)",
          transition: "all 0.2s",
          flexShrink: 0,
        }}
      />
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// Chat Panel
// ══════════════════════════════════════════════════════════════
function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "agent",
      text: "أهلاً بك في خدمة عملاء VŌGU 👋\nكيف يمكننا مساعدتك اليوم؟",
      time: nowTime(),
    },
  ]);
  const [input,   setInput]   = useState("");
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = { role: "user", text, time: nowTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      await fetch("/api/support", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: text }),
      });
    } catch {
      // نتجاهل الخطأ هنا — تجربة العميل تستمر بشكل طبيعي
    }

    // رد تلقائي بعد قليل
    await new Promise(r => setTimeout(r, 900));
    setMessages(prev => [...prev, {
      role: "agent",
      time: nowTime(),
      text: "تم استلام رسالتك ✅ سيقوم أحد ممثلي خدمة العملاء بالرد عليك خلال دقائق.\n\nللرد الفوري، يمكنك التواصل عبر واتساب 💬",
    }]);
    setSending(false);
    setSent(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 340 }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-start" : "flex-end" }}
          >
            <div style={{
              maxWidth: "82%",
              background: m.role === "user" ? "#161616" : "linear-gradient(135deg,#1A1200,#221800)",
              border: `1px solid ${m.role === "user" ? "#262626" : "rgba(154,120,72,0.3)"}`,
              borderRadius: m.role === "user" ? "10px 10px 10px 3px" : "10px 10px 3px 10px",
              padding: "9px 12px",
              color: "#EDE8DF", fontSize: 12.5,
              fontFamily: "Tajawal, sans-serif", lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}>
              {m.text}
            </div>
            <span style={{ fontSize: 9, color: "#484542", marginTop: 3, fontFamily: "Tajawal, sans-serif" }}>{m.time}</span>
          </motion.div>
        ))}

        {sending && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{
              background: "linear-gradient(135deg,#1A1200,#221800)",
              border: "1px solid rgba(154,120,72,0.3)",
              borderRadius: "10px 10px 3px 10px",
              padding: "10px 13px", display: "flex", gap: 4, alignItems: "center",
            }}>
              {[0, 0.15, 0.3].map(d => (
                <motion.div
                  key={d}
                  style={{ width: 5, height: 5, borderRadius: "50%", background: "#C9A86E" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: d }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick hint after first reply */}
      {sent && (
        <div style={{ padding: "0 16px 8px" }}>
          <a
            href={`https://wa.me/${CONTACT.whatsappNumber}?text=${WHATSAPP_PRESET_MSG}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "#25D36622", border: "1px solid #25D36655",
              color: "#3DDC84", borderRadius: 9, padding: "8px",
              fontSize: 11.5, fontFamily: "Tajawal, sans-serif", fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <WhatsAppIcon size={13} /> الاستمرار عبر واتساب
          </a>
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 8, padding: "10px 14px 14px", borderTop: "1px solid #1A1A1A" }}>
        <button
          onClick={send}
          disabled={!input.trim() || sending}
          style={{
            background: input.trim() && !sending ? "#C9A86E" : "#161616",
            color:      input.trim() && !sending ? "#060606" : "#484542",
            border: "none", borderRadius: 8, padding: 9,
            cursor: input.trim() && !sending ? "pointer" : "not-allowed",
            display: "flex", flexShrink: 0, transition: "all 0.2s",
          }}
        >
          {sending ? <Loader2 size={15} style={{ animation: "spin 0.7s linear infinite" }} /> : <Send size={15} />}
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="اكتب مشكلتك هنا..."
          style={{
            flex: 1, background: "#0D0D0D", border: "1px solid #1A1A1A",
            borderRadius: 8, padding: "9px 13px", color: "#EDE8DF",
            fontSize: 12.5, fontFamily: "Tajawal, sans-serif", outline: "none", direction: "rtl",
          }}
        />
      </div>
    </div>
  );
}

// ── WhatsApp SVG Icon (مش موجودة في lucide) ───────────────────
function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.6 6.32A8.86 8.86 0 0 0 12.06 4C7.27 4 3.37 7.9 3.37 12.68c0 1.5.39 2.97 1.14 4.26L3.16 21l4.18-1.31a9.05 9.05 0 0 0 4.7 1.28h.01c4.78 0 8.67-3.9 8.67-8.68a8.6 8.6 0 0 0-2.32-5.97zM12.06 19.4a7.2 7.2 0 0 1-3.68-1.01l-.26-.16-2.72.85.85-2.65-.17-.27a7.13 7.13 0 0 1-1.11-3.78c0-3.95 3.23-7.18 7.21-7.18a7.13 7.13 0 0 1 5.07 2.11 7.13 7.13 0 0 1 2.11 5.08c0 3.97-3.23 7.2-7.2 7.2zm4.13-5.4c-.22-.11-1.32-.65-1.53-.72-.2-.08-.35-.11-.5.11-.15.22-.58.72-.71.87-.13.15-.27.16-.49.05-.22-.11-.95-.35-1.81-1.12-.67-.6-1.12-1.34-1.25-1.56-.13-.22-.01-.34.1-.46.1-.11.22-.27.34-.41.11-.13.15-.22.22-.37.07-.15.04-.27-.02-.38-.07-.11-.59-1.43-.81-1.95-.21-.5-.43-.43-.59-.44-.15 0-.32-.01-.49-.01-.17 0-.44.06-.67.31-.23.25-.86.85-.86 2.07s.88 2.4 1 2.57c.13.16 1.74 2.65 4.2 3.61 2.46.95 2.46.64 2.91.6.45-.04 1.32-.54 1.51-1.06.18-.52.18-.97.13-1.06-.05-.1-.2-.16-.42-.27z"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN — Floating Support Widget
// ══════════════════════════════════════════════════════════════
export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("menu");
  const [showBadge, setShowBadge] = useState(true);
  const pathname = usePathname();

  // نُخفي الويدجت بالكامل في الصفحات المحدّدة (مثل المُخصِّص)
  if (HIDDEN_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return null;
  }

  const toggle = () => {
    setOpen(v => !v);
    setShowBadge(false);
    if (open) setView("menu");
  };

  return (
    <>
      {/* ── Floating Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              bottom: 92,
              right: "clamp(12px, 4vw, 28px)",
              width: "min(340px, calc(100vw - 24px))",
              background: "#0A0A0A",
              border: "1px solid #1A1A1A",
              borderRadius: 18,
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              zIndex: 9998,
              overflow: "hidden",
              direction: "rtl",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 18px",
              background: "linear-gradient(135deg, #131313 0%, #1A1200 100%)",
              borderBottom: "1px solid #1A1A1A",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "linear-gradient(135deg,#C9A86E,#9A7848)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#060606", fontFamily: "'Cormorant Garant', serif",
                  fontSize: 17, fontWeight: 600, position: "relative", flexShrink: 0,
                }}>
                  V
                  <span style={{
                    position: "absolute", bottom: -2, left: -2,
                    width: 11, height: 11, borderRadius: "50%",
                    background: "#5CB87A", border: "2px solid #0A0A0A",
                  }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, color: "#EDE8DF", fontFamily: "Tajawal, sans-serif", fontWeight: 700 }}>فريق دعم VŌGU</p>
                  <p style={{ fontSize: 10.5, color: "#5CB87A", fontFamily: "Tajawal, sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#5CB87A" }} /> متصل الآن
                  </p>
                </div>
              </div>
              <button onClick={toggle} style={{
                background: "#161616", border: "1px solid #262626",
                borderRadius: 8, padding: 6, cursor: "pointer", color: "#8A8480", display: "flex",
              }}>
                <X size={14} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #1A1A1A" }}>
              {[
                { id: "menu", label: "تواصل سريع" },
                { id: "chat", label: "محادثة مباشرة" },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setView(t.id as ViewMode)}
                  style={{
                    flex: 1, padding: "11px 0",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 12.5, fontFamily: "Tajawal, sans-serif",
                    fontWeight: view === t.id ? 700 : 400,
                    color: view === t.id ? "#C9A86E" : "#8A8480",
                    borderBottom: view === t.id ? "2px solid #C9A86E" : "2px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {view === "menu" ? (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <ContactRow
                    icon={<WhatsAppIcon size={18} />}
                    label="واتساب"
                    sub={`+${CONTACT.whatsappNumber}`}
                    color="#25D366"
                    onClick={() => window.open(`https://wa.me/${CONTACT.whatsappNumber}?text=${WHATSAPP_PRESET_MSG}`, "_blank")}
                  />
                  <ContactRow
                    icon={<Phone size={17} />}
                    label="اتصال مباشر"
                    sub={CONTACT.phoneDisplay}
                    color="#7BA7C4"
                    onClick={() => window.open(`tel:${CONTACT.phoneLink}`, "_self")}
                  />
                  <ContactRow
                    icon={<Mail size={17} />}
                    label="البريد الإلكتروني"
                    sub={CONTACT.email}
                    color="#C9A86E"
                    onClick={() => window.open(`mailto:${CONTACT.email}`, "_self")}
                  />

                  {/* Working hours */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    marginTop: 4, padding: "10px 12px",
                    background: "#0D0D0D", border: "1px solid #1A1A1A", borderRadius: 10,
                  }}>
                    <Clock size={13} style={{ color: "#484542", flexShrink: 0 }} />
                    <p style={{ fontSize: 11, color: "#8A8480", fontFamily: "Tajawal, sans-serif" }}>{CONTACT.workingHours}</p>
                  </div>

                  <button
                    onClick={() => setView("chat")}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      background: "#C9A86E", color: "#060606",
                      border: "none", borderRadius: 10, padding: "11px",
                      fontSize: 12.5, fontFamily: "Tajawal, sans-serif", fontWeight: 700,
                      cursor: "pointer", marginTop: 4, transition: "filter 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.08)")}
                    onMouseLeave={e => (e.currentTarget.style.filter = "none")}
                  >
                    <MessageCircle size={14} /> ابدأ محادثة مباشرة
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChatPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ── */}
      <div style={{
        position: "fixed", bottom: 24,
        right: "clamp(12px, 4vw, 28px)",
        zIndex: 9999,
      }}>
        {/* Pulse ring */}
        {!open && (
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.45, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0,
              borderRadius: "50%", background: "#C9A86E",
            }}
          />
        )}

        <motion.button
          onClick={toggle}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: "relative",
            width: 58, height: 58, borderRadius: "50%",
            background: "linear-gradient(135deg, #DDBF88, #C9A86E, #9A7848)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#060606",
            boxShadow: "0 10px 30px rgba(201,168,110,0.45)",
          }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <MessageCircle size={24} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification badge */}
          {showBadge && !open && (
            <span style={{
              position: "absolute", top: -3, left: -3,
              width: 19, height: 19, borderRadius: "50%",
              background: "#D07070", color: "#fff",
              fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Tajawal, sans-serif",
              border: "2px solid #070707",
            }}>
              1
            </span>
          )}
        </motion.button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}