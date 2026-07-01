// src/components/home/PromoSlider.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, Shirt, Baby, Flame, Crown } from "lucide-react";

const C = {
  bg:   "#FAFAF8",
  surf: "#F5F3EF",
  b1:   "#EAE7E1",
  b2:   "#DDD9D1",
  gold: "#A8823C",
  t1:   "#1A1714",
  t2:   "#6B6560",
  t3:   "#A39E96",
} as const;

const GOLD_GRADIENT = "linear-gradient(135deg, #C9A86E, #A8823C, #8A6830)";

interface Slide {
  id:       string;
  icon:     React.ElementType;
  badge:    string;
  title:    string;
  subtitle: string;
  href:     string;
  ctaLabel: string;
  image?:   string;
}

const CAMPAIGNS: Slide[] = [
  {
    id:       "all",
    icon:     Crown,
    badge:    "COLLECTION 2025",
    title:    "تجربة الأناقة الحقيقية",
    subtitle: "أحدث تشكيلات الأزياء الفاخرة، مصممة بإتقان لتعكس شخصيتك",
    href:     "/shop",
    ctaLabel: "تسوق الآن",
  },
  {
    id:       "women",
    icon:     Sparkles,
    badge:    "✨ تشكيلة حصرية",
    title:    "أنوثة بلا حدود",
    subtitle: "قطع مختارة بعناية لتُبرز جمالك الطبيعي في كل مناسبة",
    href:     "/shop?cat=women",
    ctaLabel: "تسوقي نساء",
  },
  {
    id:       "men",
    icon:     Shirt,
    badge:    "🔥 الأكثر طلباً",
    title:    "أناقة لا تُقاوم",
    image: "https://res.cloudinary.com/dsdu2izom/image/upload/v1781989157/vogu/products/mileepnsypwunpvsnnjf.png",
    subtitle: "إطلالات رجالية عصرية تجمع بين الجودة الفائقة والتصميم المتميز",
    href:     "/shop?cat=men",
    ctaLabel: "تسوق رجال",
  },
  {
    id:       "kids",
    icon:     Baby,
    badge:    "🧸 تشكيلة الصغار",
    title:    "ألوان تُبهج طفلك",
    subtitle: "ملابس مريحة وأنيقة، مصممة لأجمل لحظات الطفولة",
    href:     "/shop?cat=kids",
    ctaLabel: "تسوق أطفال",
  },
  {
    id:       "sale",
    icon:     Flame,
    badge:    "⚡ عرض محدود",
    title:    "خصومات تصل إلى ٦٠٪",
    subtitle: "فرصتك للحصول على أرقى التشكيلات بأسعار استثنائية",
    href:     "/shop?cat=sale",
    ctaLabel: "اكتشف العروض",
  },
  {
    id:       "custom",
    icon:     Sparkles,
    badge:    "تصميم مخصص",
    title:    "صمّم تيشيرتك الخاص",
    subtitle: "اختر الألوان والنصوص والرسومات لتعكس شخصيتك الفريدة",
    href:     "/customize",
    ctaLabel: "ابدأ التصميم",
  },
];

export default function PromoSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || CAMPAIGNS.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % CAMPAIGNS.length);
    }, 5500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  const goTo = useCallback((i: number) => {
    setActive(((i % CAMPAIGNS.length) + CAMPAIGNS.length) % CAMPAIGNS.length);
  }, []);

  return (
    <section
      dir="rtl"
      style={{ position: "relative", width: "100%", overflow: "hidden", minHeight: 520 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {CAMPAIGNS.map((s, i) => {
        const Icon = s.icon;
        const isActive = i === active;

        return (
          <div
            key={s.id}
            style={{
              position: i === 0 ? "relative" : "absolute",
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: "opacity 0.8s ease",
              pointerEvents: isActive ? "auto" : "none",
              minHeight: 520,
            }}
          >
            {/* ── الخلفية الكاملة (صورة واضحة بحجمها الكامل) ── */}
            <div style={{ position: "absolute", inset: 0 }}>
              {s.image ? (
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  priority={i === 0}
                  quality={95}
                  sizes="100vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center 25%",
                  }}
                />
              ) : (
                <>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(ellipse 70% 80% at 70% 40%, ${C.gold}22, transparent 65%),
                                 radial-gradient(ellipse 50% 60% at 20% 70%, ${C.gold}14, transparent 60%),
                                 ${C.surf}`,
                  }} />
                  <div style={{
                    position: "absolute", left: "14%", top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.08,
                  }}>
                    <Icon size={280} color={C.gold} strokeWidth={0.5} />
                  </div>
                </>
              )}
            </div>

            {/* ── Overlay خفيف فقط أسفل النص لقراءة واضحة، الصورة تبقى واضحة بالأعلى ── */}
            {s.image && (
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to left, rgba(250,250,248,0.94) 0%, rgba(250,250,248,0.75) 32%, rgba(250,250,248,0.15) 58%, transparent 78%)",
              }} />
            )}

            {/* ── محتوى النص — يمين الشاشة (RTL) ── */}
            <div style={{
              position: "relative", zIndex: 2,
              minHeight: 520,
              display: "flex", alignItems: "center",
              padding: "60px 64px",
              justifyContent: "flex-start",
            }}>
              <div style={{ maxWidth: 480 }}>

                {/* Badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 11, color: C.gold, letterSpacing: "0.22em",
                  fontFamily: "Tajawal, sans-serif", marginBottom: 20,
                  border: `1px solid ${C.gold}55`, borderRadius: 20,
                  padding: "5px 14px", background: `${C.gold}12`,
                }}>
                  <Icon size={11} />
                  {s.badge}
                </div>

                {/* العنوان */}
                <h1 style={{
                  fontFamily: "'Cormorant Garant', serif", fontWeight: 400,
                  fontSize: "clamp(34px, 4vw, 56px)", lineHeight: 1.15,
                  color: C.t1, margin: "0 0 16px",
                }}>
                  {s.title}
                </h1>

                {/* الوصف */}
                <p style={{
                  fontSize: 15, color: C.t2,
                  fontFamily: "Tajawal, sans-serif",
                  lineHeight: 1.85, margin: "0 0 32px", maxWidth: 420,
                }}>
                  {s.subtitle}
                </p>

                {/* الأزرار */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href={s.href} style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: GOLD_GRADIENT, color: "#FFF",
                    padding: "14px 28px", borderRadius: 999,
                    fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 14,
                    textDecoration: "none", boxShadow: `0 8px 24px ${C.gold}45`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 30px ${C.gold}55`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${C.gold}45`;
                    }}
                  >
                    {s.ctaLabel}
                    <ChevronLeft size={15} />
                  </Link>

                  {s.id !== "all" && (
                    <Link href="/shop" style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      border: `1.5px solid ${C.b2}`, color: C.t1,
                      padding: "13px 24px", borderRadius: 999,
                      fontFamily: "Tajawal, sans-serif", fontSize: 14,
                      textDecoration: "none", background: "rgba(255,255,255,0.75)",
                      backdropFilter: "blur(8px)", transition: "border-color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = C.gold}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = C.b2}
                    >
                      استكشف الكل
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── أسهم التنقل ── */}
      {[
        { dir: "prev", label: "السابق", side: "right" as const, icon: ChevronRight, action: () => goTo(active - 1) },
        { dir: "next", label: "التالي", side: "left"  as const, icon: ChevronLeft,  action: () => goTo(active + 1) },
      ].map(({ label, side, icon: ArrowIcon, action }) => (
        <button key={side} onClick={action} aria-label={label} style={{
          position: "absolute", top: "50%", [side]: 20,
          transform: "translateY(-50%)",
          width: 42, height: 42, borderRadius: "50%",
          background: "rgba(255,255,255,0.9)", border: `1px solid ${C.b1}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.t1, cursor: "pointer", zIndex: 6,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = C.gold;
            (e.currentTarget as HTMLElement).style.color = "#fff";
            (e.currentTarget as HTMLElement).style.borderColor = C.gold;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.9)";
            (e.currentTarget as HTMLElement).style.color = C.t1;
            (e.currentTarget as HTMLElement).style.borderColor = C.b1;
          }}
        >
          <ArrowIcon size={18} />
        </button>
      ))}

      {/* ── نقاط + عداد ── */}
      <div style={{
        position: "absolute", bottom: 28, right: 64,
        display: "flex", alignItems: "center", gap: 14, zIndex: 6,
      }}>
        <span style={{ fontSize: 11, color: C.t3, fontFamily: "Tajawal, sans-serif" }}>
          {String(active + 1).padStart(2, "0")} / {String(CAMPAIGNS.length).padStart(2, "0")}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {CAMPAIGNS.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              aria-label={`الشريحة ${i + 1}`}
              style={{
                width: i === active ? 24 : 6, height: 6,
                borderRadius: 4, padding: 0, border: "none", cursor: "pointer",
                background: i === active ? C.gold : C.b2,
                transition: "all 0.35s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}