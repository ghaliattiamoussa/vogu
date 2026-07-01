"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";

// ── الألوان — ثيم فاتح (مطابقة لـ tailwind.config.ts) ──────────────
const C = {
  bg:   '#FAFAF8',
  hov:  '#F0EEE9',
  b1:   '#EAE7E1',
  b2:   '#DDD9D1',
  gold: '#A8823C',
  t1:   '#1A1714',
  t2:   '#6B6560',
} as const;

// ══════════════════════════════════════════════════════════════
// زر السلة الاحترافي — بنفس أسلوب المواقع الكبيرة (نون / زارا / نمشي)
// ══════════════════════════════════════════════════════════════
interface CartButtonProps {
  count:       number;
  subtotal?:   number;
  onClick:     () => void;
  showLabel?:  boolean;
}

export default function CartButton({
  count, subtotal, onClick, showLabel = true,
}: CartButtonProps) {
  const [hov,   setHov]   = useState(false);
  const [pulse, setPulse] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={`السلة — ${count} منتج`}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 9,
        background: hov ? C.hov : "transparent",
        border: `1px solid ${hov ? C.gold + "55" : C.b2}`,
        borderRadius: 50,
        padding: showLabel ? "8px 16px 8px 14px" : "9px",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
        transform: pulse ? "scale(1.06)" : "scale(1)",
      }}
    >
      {/* ── الأيقونة + Badge ── */}
      <div style={{ position: "relative", display: "flex" }}>
        <motion.div
          animate={pulse ? { rotate: [0, -12, 12, -6, 0] } : {}}
          transition={{ duration: 0.45 }}
        >
          <ShoppingBag
            size={19}
            strokeWidth={1.8}
            style={{ color: hov ? C.gold : C.t1, transition: "color 0.2s" }}
          />
        </motion.div>

        {/* Badge — يظهر فقط لو فيه منتجات */}
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              style={{
                position: "absolute",
                top: -8, left: -9,
                minWidth: 18, height: 18,
                padding: "0 4px",
                borderRadius: "50%",
                background: C.gold,
                color: "#FFFFFF",
                fontSize: 10,
                fontWeight: 800,
                fontFamily: "Tajawal, sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${C.bg}`,
                boxShadow: pulse ? "0 0 0 4px rgba(168,130,60,0.22)" : "none",
              }}
            >
              {count > 99 ? "99+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── النص + السعر (Desktop فقط عادة) ── */}
      {showLabel && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.15 }}>
          <span style={{
            fontSize: 12.5, fontFamily: "Tajawal, sans-serif",
            fontWeight: 600, color: C.t1,
          }}>
            السلة
          </span>
          {subtotal !== undefined && subtotal > 0 && (
            <span style={{
              fontSize: 11, fontFamily: "Tajawal, sans-serif",
              color: C.gold, fontWeight: 700,
            }}>
              {formatPrice(subtotal)}
            </span>
          )}
        </div>
      )}
    </button>
  );
}