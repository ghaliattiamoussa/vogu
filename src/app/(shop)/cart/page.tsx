"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft,
  Tag, X, ChevronLeft, Package, Lock,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

// ── الألوان ──────────────────────────────────────────────────
const C = {
  bg:   "#070707", surf: "#0D0D0D", card: "#121212",
  b1:   "#1A1A1A", b2:   "#262626",
  gold: "#C9A86E", t1:   "#EDE8DF", t2:   "#8A8480", t3:   "#484542",
  red:  "#D07070", green:"#5CB87A",
} as const;

// ── تنسيق السعر ──────────────────────────────────────────────
const fmt = (n: number) => `${n.toLocaleString("ar-EG")} ج.م`;

// ══════════════════════════════════════════════════════════════
export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [discount,   setDiscount]   = useState(0);
  const [couponMsg,  setCouponMsg]  = useState<{ ok: boolean; text: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // ── الحسابات ─────────────────────────────────────────────
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total    = Math.max(0, subtotal - discount + shipping);

  // ── كوبون الخصم ──────────────────────────────────────────
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res  = await fetch(`/api/coupons/validate?code=${couponCode.toUpperCase()}&total=${subtotal}`);
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount);
        setCouponMsg({ ok: true, text: `✓ ${data.message}` });
      } else {
        setDiscount(0);
        setCouponMsg({ ok: false, text: data.error ?? "كود غير صالح" });
      }
    } catch {
      setCouponMsg({ ok: false, text: "خطأ في التحقق" });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCouponCode("");
    setCouponMsg(null);
  };

  // ── السلة فارغة ──────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center gap-6"
        dir="rtl"
        style={{ background: C.bg }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 14 }}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: C.card, border: `1px solid ${C.b2}` }}
        >
          <ShoppingBag size={36} style={{ color: C.t3 }} />
        </motion.div>

        <div className="text-center">
          <h2 className="font-cormorant text-[28px] font-light" style={{ color: C.t1 }}>
            السلة فارغة
          </h2>
          <p className="font-tajawal text-[13px] mt-2" style={{ color: C.t3 }}>
            أضف منتجات من متجرنا لتبدأ تسوقك
          </p>
        </div>

        <Link
          href="/shop"
          className="flex items-center gap-2 px-8 py-3 rounded-full font-tajawal font-bold text-[14px] transition-all hover:brightness-110"
          style={{ background: C.gold, color: "#060606" }}
        >
          <ShoppingBag size={16} />
          تسوق الآن
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ background: C.bg, minHeight: "100vh", padding: "32px 16px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div className="mb-8">
          <p className="font-tajawal text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: C.gold }}>
            VŌGU
          </p>
          <div className="flex items-center justify-between">
            <h1 className="font-cormorant text-[34px] font-light" style={{ color: C.t1 }}>
              سلة التسوق
              <span className="font-tajawal text-[18px] mr-3" style={{ color: C.t3 }}>
                ({items.length} {items.length === 1 ? "منتج" : "منتجات"})
              </span>
            </h1>
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 font-tajawal text-[12px] transition-colors hover:text-[#D07070]"
              style={{ color: C.t3 }}
            >
              <Trash2 size={13} />
              إفراغ السلة
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* ── قائمة المنتجات ── */}
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                  style={{
                    background:   C.surf,
                    border:       `1px solid ${C.b1}`,
                    borderRadius: 16,
                    padding:      "16px",
                    display:      "flex",
                    gap:          16,
                    alignItems:   "center",
                  }}
                >
                  {/* صورة المنتج */}
                  <Link href={`/product/${item.id}`} style={{ flexShrink: 0 }}>
                    <div
                      style={{
                        width:        88,
                        height:       110,
                        borderRadius: 12,
                        overflow:     "hidden",
                        background:   C.card,
                        border:       `1px solid ${C.b2}`,
                        position:     "relative",
                        flexShrink:   0,
                      }}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.nameAr}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center font-cormorant text-3xl" style={{ color: C.b2 }}>
                          V
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* تفاصيل */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {item.brand && (
                      <p className="font-tajawal text-[10px] tracking-widest uppercase mb-1" style={{ color: C.gold }}>
                        {item.brand}
                      </p>
                    )}
                    <Link href={`/product/${item.id}`}>
                      <h3
                        className="font-tajawal text-[14px] font-bold leading-snug line-clamp-2 hover:text-[#C9A86E] transition-colors"
                        style={{ color: C.t1 }}
                      >
                        {item.nameAr}
                      </h3>
                    </Link>

                    {/* المقاس واللون */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {item.size && (
                        <span
                          className="font-tajawal text-[10px] px-2 py-0.5 rounded-md"
                          style={{ background: C.card, border: `1px solid ${C.b2}`, color: C.t2 }}
                        >
                          {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span
                          className="font-tajawal text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1.5"
                          style={{ background: C.card, border: `1px solid ${C.b2}`, color: C.t2 }}
                        >
                          {item.colorHex && (
                            <span
                              className="w-2.5 h-2.5 rounded-full border"
                              style={{ background: item.colorHex, borderColor: C.b2 }}
                            />
                          )}
                          {item.color}
                        </span>
                      )}
                    </div>

                    {/* السعر + الكمية */}
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      <p className="font-cormorant text-[18px] font-bold" style={{ color: C.gold }}>
                        {fmt(item.price * item.quantity)}
                        {item.quantity > 1 && (
                          <span className="font-tajawal text-[11px] font-normal mr-1" style={{ color: C.t3 }}>
                            ({fmt(item.price)} × {item.quantity})
                          </span>
                        )}
                      </p>

                      {/* التحكم في الكمية */}
                      <div
                        className="flex items-center gap-0"
                        style={{
                          background:   C.card,
                          border:       `1px solid ${C.b2}`,
                          borderRadius: 10,
                          overflow:     "hidden",
                        }}
                      >
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(Number(item.id), item.size ?? "", item.color ?? "", item.quantity - 1)
                              : removeItem(Number(item.id), item.size ?? "", item.color ?? "")
                          }
                          className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-[#1A1A1A]"
                          style={{ color: C.t2 }}
                        >
                          {item.quantity === 1 ? <Trash2 size={13} style={{ color: C.red }} /> : <Minus size={13} />}
                        </button>
                        <span
                          className="w-9 text-center font-tajawal text-[13px] font-bold"
                          style={{ color: C.t1 }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(Number(item.id), item.size ?? "", item.color ?? "", item.quantity + 1)
                          }
                          className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-[#1A1A1A]"
                          style={{ color: C.t2 }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* زر الحذف */}
                  <button
                    onClick={() => removeItem(Number(item.id), item.size ?? "", item.color ?? "")}
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[#D07070]/10 self-start"
                    style={{ color: C.t3 }}
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* زر متابعة التسوق */}
            <Link
              href="/shop"
              className="flex items-center gap-2 font-tajawal text-[12px] mt-2 self-start transition-colors"
              style={{ color: C.t3 }}
            >
              <ArrowLeft size={13} />
              متابعة التسوق
            </Link>
          </div>

          {/* ── ملخص الطلب ── */}
          <div
            style={{
              background:   C.surf,
              border:       `1px solid ${C.b1}`,
              borderRadius: 20,
              padding:      24,
              position:     "sticky",
              top:          90,
            }}
          >
            <h3 className="font-cormorant text-[20px] font-light mb-5 flex items-center gap-2" style={{ color: C.t1 }}>
              <Package size={16} style={{ color: C.gold }} />
              ملخص الطلب
            </h3>

            {/* كوبون الخصم */}
            <div className="mb-5">
              <label className="flex items-center gap-1.5 font-tajawal text-[11px] mb-2" style={{ color: C.t2 }}>
                <Tag size={12} style={{ color: C.gold }} />
                كود الخصم
              </label>

              {discount > 0 ? (
                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{ background: "#001A08", border: `1px solid ${C.green}33` }}
                >
                  <span className="font-tajawal text-[12px]" style={{ color: C.green }}>
                    ✓ {couponCode} — خصم {fmt(discount)}
                  </span>
                  <button onClick={removeCoupon} style={{ color: C.t3 }}>
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponMsg(null); }}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="VOGU2025"
                    dir="ltr"
                    className="flex-1 font-tajawal text-[12px] px-3 py-2.5 rounded-xl outline-none tracking-widest transition-colors placeholder:text-[#484542]"
                    style={{
                      background: C.card,
                      border:     `1px solid ${couponMsg?.ok === false ? C.red : C.b2}`,
                      color:      C.t1,
                    }}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 rounded-xl font-tajawal text-[12px] font-bold transition-all hover:brightness-110 disabled:opacity-40"
                    style={{ background: C.card, border: `1px solid ${C.b2}`, color: C.gold }}
                  >
                    {couponLoading ? "..." : "تطبيق"}
                  </button>
                </div>
              )}

              {couponMsg && !couponMsg.ok && (
                <p className="font-tajawal text-[11px] mt-1.5" style={{ color: C.red }}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            <div className="h-px mb-4" style={{ background: C.b1 }} />

            {/* الأرقام */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between font-tajawal text-[12px]" style={{ color: C.t2 }}>
                <span>المجموع الفرعي</span>
                <span style={{ color: C.t1 }}>{fmt(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-tajawal text-[12px]">
                  <span style={{ color: C.t2 }}>الخصم</span>
                  <span style={{ color: C.green }}>− {fmt(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-tajawal text-[12px]">
                <span style={{ color: C.t2 }}>الشحن</span>
                <span style={{ color: shipping === 0 ? C.green : C.t1 }}>
                  {shipping === 0 ? "مجاني 🎉" : fmt(shipping)}
                </span>
              </div>
              {subtotal < 1200 && (
                <p className="font-tajawal text-[10px]" style={{ color: C.t3 }}>
                  أضف {fmt(1200 - subtotal)} للحصول على شحن مجاني
                </p>
              )}
            </div>

            <div className="h-px mb-4" style={{ background: C.b1 }} />

            <div className="flex justify-between items-baseline mb-6">
              <span className="font-tajawal font-bold text-[14px]" style={{ color: C.t1 }}>الإجمالي</span>
              <span className="font-cormorant text-[24px]" style={{ color: C.gold }}>{fmt(total)}</span>
            </div>

            {/* زر الشراء */}
            <button
              onClick={() => router.push("/checkout")}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-tajawal font-bold text-[14px] transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background: C.gold,
                color:      "#060606",
                boxShadow:  "0 8px 24px #9A784840",
              }}
            >
              <ChevronLeft size={17} />
              إتمام الشراء
            </button>

            {/* أمان */}
            <div
              className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-xl"
              style={{ background: C.card, border: `1px solid ${C.b1}` }}
            >
              <Lock size={11} style={{ color: C.green, flexShrink: 0 }} />
              <p className="font-tajawal text-[10px]" style={{ color: C.t3 }}>
                دفع آمن ومشفر — بياناتك محمية بالكامل
              </p>
            </div>

            {/* طرق الدفع المتاحة */}
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              {["💵 كاش", "⚡ InstaPay", "📱 Vodafone", "🏪 Fawry"].map((m) => (
                <span key={m} className="font-tajawal text-[9px]" style={{ color: C.t3 }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}