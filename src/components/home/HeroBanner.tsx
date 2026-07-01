// src/components/home/HeroBanner.tsx
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, LogIn, Sparkles, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { formatPrice, calcDiscount } from "@/lib/utils";

// ── الألوان — ثيم فاتح (مطابقة لـ tailwind.config.ts) ──────────────
const C = {
  bg:    "#FAFAF8",
  surf:  "#F5F3EF",
  card:  "#FFFFFF",
  b1:    "#EAE7E1",
  b2:    "#DDD9D1",
  gold:  "#A8823C",
  goldL: "#C9A86E",
  t1:    "#1A1714",
  t2:    "#6B6560",
  t3:    "#A39E96",
} as const;

const MAX_SLIDES = 6;
const AUTOPLAY_MS = 5000;

// ── جمل فرعية احتياطية لو المنتج بدون description ────────────────
const FALLBACK_DESC = [
  "قطعة مختارة بعناية من تشكيلتنا الفاخرة، صُممت لتعكس أناقتك الخاصة",
  "تصميم استثنائي يجمع بين الجودة العالية والخامات الراقية",
  "إطلالة عصرية بلمسة فاخرة، مثالية لكل المناسبات",
  "صُنعت بدقة لتمنحك الراحة والأناقة في آنٍ واحد",
];

interface Slide {
  id:        string;
  title:     string;
  subtitle:  string;
  desc:      string;
  cta:       string;
  href:      string;
  image:     string;
  badge:     string;
  price?:    number;
  origPrice?: number | null;
}

// ── جلب أفضل المنتجات مبيعاً وتحويلها لشرائح ─────────────────────
function useBestSellerSlides() {
  const [slides,  setSlides]  = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res  = await fetch(`/api/products?sort=popular&limit=${MAX_SLIDES}`);
        const data = await res.json();
        const raw: any[] = data.products ?? [];

        const mapped: Slide[] = raw.slice(0, MAX_SLIDES).map((p: any, i: number) => {
          const getImg = (img: any) => (typeof img === "string" ? img : img?.url) || "";
          const image  = getImg(p.images?.[0]);
          const price  = p.price ?? 0;
          const orig   = p.origPrice ?? null;
          const onSale = !!(orig && orig > price);
          const discount = onSale ? calcDiscount(price, orig) : 0;

          let badge = "✨ الأكثر مبيعاً";
          if (p.isNew)      badge = "✨ وصل حديثاً";
          else if (onSale)  badge = `🔥 خصم ${discount}٪`;

          return {
            id:        p.id,
            title:     p.nameAr || p.nameEn || "تشكيلة VŌGU",
            subtitle:  p.brand || "VŌGU",
            desc:      (p.description && p.description.trim()) || FALLBACK_DESC[i % FALLBACK_DESC.length],
            cta:       "تسوق الآن",
            href:      `/product/${p.id}`,
            image,
            badge,
            price,
            origPrice: orig,
          };
        }).filter((s: Slide) => !!s.image);

        if (active) setSlides(mapped);
      } catch {
        if (active) setSlides([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return { slides, loading };
}

// ══════════════════════════════════════════════════════════════
export function HeroBanner() {
  const { slides, loading } = useBestSellerSlides();
  const { data: session }   = useSession();

  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => { setCurrent(0); }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const prev = () => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  // ── Loading skeleton ─────────────────────────────────────────
  if (loading) {
    return (
      <section
        className="relative w-full h-[85vh] min-h-[500px] max-h-[750px] overflow-hidden"
        style={{ background: C.surf }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 sm:px-10">
            <div className="max-w-xl space-y-4">
              <div className="h-6 w-32 rounded-full animate-pulse" style={{ background: C.b1 }} />
              <div className="h-12 w-80 rounded-lg animate-pulse" style={{ background: C.b1 }} />
              <div className="h-4 w-64 rounded animate-pulse" style={{ background: C.b1 }} />
              <div className="h-12 w-40 rounded-xl animate-pulse" style={{ background: C.b1 }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section
      className="relative w-full h-[85vh] min-h-[500px] max-h-[750px] overflow-hidden"
      style={{ background: C.surf }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        touchStartX.current = null;
      }}
      dir="rtl"
    >
      {/* ════════ الصور ════════ */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === current ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          {/* تدرّج فاتح خفيف لضمان وضوح النص (ثيم فاتح) */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to left, ${C.bg}F2 0%, ${C.bg}A8 35%, transparent 65%)`,
            }}
          />
        </div>
      ))}

      {/* ════════ شريط علوي: تسجيل دخول + صمم على ذوقك ════════ */}
      <div className="absolute top-6 inset-x-6 sm:inset-x-10 grid grid-cols-3 items-center z-20">
        {/* حساب المستخدم (col 1 — يمين في RTL) */}
        <div className="justify-self-start">
          {session?.user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-md transition-all hover:shadow-md"
              style={{ background: `${C.card}E6`, border: `1px solid ${C.b2}` }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{ background: `${C.gold}22`, color: C.gold, fontFamily: "'Cormorant Garant', serif" }}
              >
                {session.user.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <span className="text-[12px] font-[Tajawal] font-medium" style={{ color: C.t1 }}>
                {session.user.name?.split(" ")[0] || "حسابي"}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full backdrop-blur-md transition-all hover:shadow-md"
              style={{ background: `${C.card}E6`, border: `1px solid ${C.b2}`, color: C.t1 }}
            >
              <LogIn size={13} />
              <span className="text-[12px] font-[Tajawal] font-medium">تسجيل الدخول</span>
            </Link>
          )}
        </div>

        {/* صمم على ذوقك (col 2 — exact center) */}
        <div className="justify-self-center">
          <Link
            href="/customize"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-[Tajawal] font-bold text-[12px] transition-all hover:shadow-lg active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${C.goldL}, ${C.gold})`,
              color: "#FFFFFF",
            }}
          >
            <Sparkles size={13} />
            صمم على ذوقك
          </Link>
        </div>

        {/* (col 3 — فارغ للموازنة) */}
        <div className="justify-self-end" />
      </div>

      {/* ════════ المحتوى ════════ */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6 sm:px-10">
          <div className="max-w-xl">
            {/* Badge */}
            <span
              key={`badge-${current}`}
              className="inline-block text-xs font-[Tajawal] font-bold px-3 py-1 rounded-full mb-4 backdrop-blur-sm animate-in fade-in duration-500"
              style={{ color: C.gold, border: `1px solid ${C.gold}55`, background: `${C.gold}14` }}
            >
              {slide.badge}
            </span>

            {/* البراند */}
            <p
              key={`sub-${current}`}
              className="text-[11px] font-[Tajawal] tracking-[0.25em] uppercase mb-2 animate-in fade-in duration-500"
              style={{ color: C.gold }}
            >
              {slide.subtitle}
            </p>

            {/* العنوان */}
            <h1
              key={`title-${current}`}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3 animate-in slide-in-from-right-8 duration-500"
              style={{ fontFamily: "'Cormorant Garant', serif", color: C.t1 }}
            >
              {slide.title}
            </h1>

            {/* السعر */}
            {slide.price !== undefined && (
              <div className="flex items-baseline gap-2.5 mb-3">
                <span className="text-xl font-bold font-[Tajawal]" style={{ color: C.gold }}>
                  {formatPrice(slide.price)}
                </span>
                {slide.origPrice && slide.origPrice > slide.price && (
                  <span
                    className="text-sm font-[Tajawal] line-through"
                    style={{ color: C.t3 }}
                  >
                    {formatPrice(slide.origPrice)}
                  </span>
                )}
              </div>
            )}

            <p
              key={`desc-${current}`}
              className="text-sm font-[Tajawal] leading-relaxed mb-7 max-w-sm animate-in fade-in duration-700"
              style={{ color: C.t2 }}
            >
              {slide.desc}
            </p>

            {/* الأزرار */}
            <div className="flex gap-3 flex-wrap">
              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 font-bold font-[Tajawal] px-7 py-3.5 rounded-xl transition-all active:scale-95 hover:shadow-lg"
                style={{ background: C.gold, color: "#FFFFFF" }}
              >
                {slide.cta}
                <ChevronLeft size={16} />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 font-[Tajawal] px-7 py-3.5 rounded-xl transition-all text-sm hover:shadow-sm"
                style={{ border: `1px solid ${C.b2}`, color: C.t1, background: `${C.card}99` }}
              >
                استعرض الكل
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ════════ أزرار التنقل ════════ */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="الشريحة السابقة"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow-md z-20"
            style={{ background: `${C.card}E6`, border: `1px solid ${C.b2}`, color: C.t1 }}
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={next}
            aria-label="الشريحة التالية"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow-md z-20"
            style={{ background: `${C.card}E6`, border: `1px solid ${C.b2}`, color: C.t1 }}
          >
            <ChevronLeft size={18} />
          </button>
        </>
      )}

      {/* ════════ مؤشرات الشرائح ════════ */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`الذهاب للشريحة ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === current ? 28 : 7,
                height: 7,
                background: i === current ? C.gold : C.b2,
              }}
            />
          ))}
        </div>
      )}

      {/* ════════ عداد الشرائح ════════ */}
      <div
        className="absolute bottom-6 right-6 text-xs font-[Tajawal] z-20"
        style={{ color: C.t3 }}
      >
        {(current + 1).toLocaleString("ar-EG")} / {slides.length.toLocaleString("ar-EG")}
      </div>
    </section>
  );
}

export default HeroBanner;