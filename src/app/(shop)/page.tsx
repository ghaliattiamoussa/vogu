"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, RotateCcw, Shield, Headphones } from "lucide-react";
import PromoSlider from "@/components/home/PromoSlider";
import ProductCard from "@/components/shop/ProductCard";
import type { Product } from "@/types";

// ── ألوان ──────────────────────────────────────────────────────
const C = {
  bg:     "#FAFAF8",
  cream:  "#F5F0E8",
  gold:   "#C9A86E",
  goldD:  "#A8885A",
  t1:     "#1A1A1A",
  t2:     "#6B6B6B",
  t3:     "#A0998F",
  border: "#E8E2D9",
  white:  "#FFFFFF",
};

// ── Trust Badges ──────────────────────────────────────────────
const TRUST = [
  { icon: Truck,       label: "شحن مجاني",    desc: "للطلبات فوق 1200 ج.م"   },
  { icon: RotateCcw,   label: "إرجاع ٣٠ يوم", desc: "إرجاع مجاني وسهل"      },
  { icon: Shield,      label: "دفع آمن",       desc: "بيانات محمية ومشفرة"   },
  { icon: Headphones,  label: "دعم متواصل",    desc: "خدمة عملاء ٢٤/٧"      },
];

// ── Categories ─────────────────────────────────────────────────
const CATS = [
  { id: "women", label: "نساء",     img: "/images/cat-women.jpg",  color: "#F0EBE3" },
  { id: "men",   label: "رجال",     img: "/images/cat-men.jpg",    color: "#E8EBF0" },
  { id: "kids",  label: "أطفال",    img: "/images/cat-kids.jpg",   color: "#EBF0E8" },
  { id: "sale",  label: "تخفيضات",  img: "/images/cat-sale.jpg",   color: "#F0E8E8" },
];

// ── Skeleton ──────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-2xl" style={{ background: C.cream }} />
      <div className="pt-3 space-y-2">
        <div className="h-2 rounded w-1/4" style={{ background: C.border }} />
        <div className="h-3 rounded w-3/4" style={{ background: C.border }} />
        <div className="h-4 rounded w-1/3" style={{ background: C.border }} />
      </div>
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────
function SectionHeader({ label, title, href }: {
  label: string; title: string; href: string;
}) {
  return (
    <div className="flex items-end justify-between mb-8" dir="rtl">
      <div>
        <p style={{ color: C.gold, fontSize: 10, letterSpacing: "0.3em",
          fontFamily: "Tajawal,sans-serif", textTransform: "uppercase", marginBottom: 4 }}>
          {label}
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garant',serif", fontSize: 32,
          fontWeight: 400, color: C.t1, lineHeight: 1.1 }}>
          {title}
        </h2>
      </div>
      <Link href={href}
        className="flex items-center gap-2 text-sm font-tajawal transition-colors"
        style={{ color: C.goldD, fontSize: 13 }}
        onMouseEnter={e => (e.currentTarget.style.color = C.t1)}
        onMouseLeave={e => (e.currentTarget.style.color = C.goldD)}
      >
        <span>عرض الكل</span>
        <ArrowLeft size={14} />
      </Link>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
export default function HomePage() {
  const [newArrivals,  setNewArrivals]  = useState<Product[]>([]);
  const [bestSellers,  setBestSellers]  = useState<Product[]>([]);
  const [loadingNew,   setLoadingNew]   = useState(true);
  const [loadingBest,  setLoadingBest]  = useState(true);
  const [email,        setEmail]        = useState("");
  const [subscribed,   setSubscribed]   = useState(false);

  // جلب وصل حديثاً
  useEffect(() => {
    fetch("/api/products?isNew=true&limit=4&sort=new")
      .then(r => r.json())
      .then(d => { setNewArrivals(d.products ?? []); setLoadingNew(false); })
      .catch(() => setLoadingNew(false));
  }, []);

  // جلب الأكثر مبيعاً
  useEffect(() => {
    fetch("/api/products?sort=rating&limit=4")
      .then(r => r.json())
      .then(d => { setBestSellers(d.products ?? []); setLoadingBest(false); })
      .catch(() => setLoadingBest(false));
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>

      {/* ══ 1. Hero Slider ══════════════════════════════════════ */}
      <PromoSlider />

      {/* ══ 2. وصل حديثاً ═══════════════════════════════════════ */}
      <section style={{ padding: "72px 0", background: C.white }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeader label="NEW ARRIVALS" title="وصل حديثاً" href="/shop?sort=new" />

          {loadingNew ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-5"
            >
              {newArrivals.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ══ 3. تصنيفات بصرية ════════════════════════════════════ */}
      <section style={{ padding: "72px 0", background: C.cream }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: C.gold, fontSize: 10, letterSpacing: "0.3em",
              fontFamily: "Tajawal,sans-serif", textTransform: "uppercase", marginBottom: 8 }}>
              COLLECTIONS
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garant',serif", fontSize: 34,
              fontWeight: 400, color: C.t1 }}>
              تسوّق حسب التصنيف
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" dir="rtl">
            {CATS.map((cat, i) => (
              <motion.div key={cat.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/shop?cat=${cat.id}`}
                  className="group block relative overflow-hidden rounded-2xl"
                  style={{ aspectRatio: "3/4", background: cat.color }}>

                  {/* placeholder visual */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ fontFamily: "'Cormorant Garant',serif",
                      fontSize: 80, color: C.gold, opacity: 0.15, fontWeight: 300 }}>
                      V
                    </span>
                  </div>

                  {/* overlay on hover */}
                  <div className="absolute inset-0 transition-all duration-500 group-hover:bg-black/10" />

                  {/* label */}
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <div style={{ background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(8px)", borderRadius: 12,
                      padding: "10px 16px", display: "flex",
                      alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Tajawal,sans-serif",
                        fontSize: 15, fontWeight: 700, color: C.t1 }}>
                        {cat.label}
                      </span>
                      <span style={{ color: C.gold, fontSize: 18 }}>←</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. الأكثر مبيعاً ════════════════════════════════════ */}
      <section style={{ padding: "72px 0", background: C.white }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeader label="BEST SELLERS" title="الأكثر مبيعاً" href="/shop?sort=rating" />

          {loadingBest ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-5"
            >
              {bestSellers.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ══ 5. Trust Badges ════════════════════════════════════ */}
      <section style={{ padding: "48px 0",
        background: C.t1, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6" dir="rtl">
            {TRUST.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4">
                <div style={{ width: 44, height: 44, borderRadius: 12,
                  background: `${C.gold}22`, border: `1px solid ${C.gold}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0 }}>
                  <Icon size={20} color={C.gold} />
                </div>
                <div>
                  <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14,
                    fontWeight: 700, color: C.white, marginBottom: 2 }}>
                    {label}
                  </p>
                  <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11,
                    color: C.t3 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. Newsletter ══════════════════════════════════════ */}
      <section style={{ padding: "80px 24px",
        background: `linear-gradient(135deg, ${C.cream} 0%, #EDE8DF 100%)` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }} dir="rtl">
          <p style={{ color: C.gold, fontSize: 10, letterSpacing: "0.3em",
            fontFamily: "Tajawal,sans-serif", textTransform: "uppercase",
            marginBottom: 12 }}>
            NEWSLETTER
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garant',serif", fontSize: 32,
            fontWeight: 400, color: C.t1, marginBottom: 8 }}>
            النشرة البريدية
          </h2>
          <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14,
            color: C.t2, marginBottom: 32, lineHeight: 1.7 }}>
            اشترك واحصل على خصم ١٠٪ على أول طلب عند التسجيل
          </p>

          {subscribed ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: C.white, border: `1px solid ${C.border}`,
                borderRadius: 16, padding: "20px 32px" }}>
              <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15,
                color: C.gold, fontWeight: 700 }}>
                ✓ شكراً لاشتراكك! كود الخصم في بريدك
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe}
              style={{ display: "flex", gap: 10, direction: "rtl" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
                dir="rtl"
                style={{ flex: 1, background: C.white,
                  border: `1px solid ${C.border}`, borderRadius: 12,
                  padding: "13px 16px", fontFamily: "Tajawal,sans-serif",
                  fontSize: 14, color: C.t1, outline: "none" }}
                onFocus={e => (e.target.style.borderColor = C.gold)}
                onBlur={e  => (e.target.style.borderColor = C.border)}
              />
              <button type="submit"
                style={{ background: C.gold, color: "#fff", border: "none",
                  borderRadius: 12, padding: "13px 24px",
                  fontFamily: "Tajawal,sans-serif", fontSize: 14,
                  fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                اشترك
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}