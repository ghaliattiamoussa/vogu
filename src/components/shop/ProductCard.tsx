"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingBag, Eye, Plus, X, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatPrice, calcDiscount } from "@/lib/utils";
import type { Product } from "@/types";

// ══════════════════════════════════════════════════════════════
// بطاقة منتج — نمط Dalydress: صورة كبيرة حافة-لحافة، بدون حواف
// دائرية، بدون إطار، بدون فجوات، بدون ظل بطاقة
// ══════════════════════════════════════════════════════════════
interface ProductCardProps {
  product: Product;
}

type ColorChoice = { name: string; hex: string };

const CARD = {
  imgBg:  "#F2F0ED",   // خلفية منطقة الصورة وقت التحميل
  text1:  "#1A1714",
  text2:  "#6B6560",
  text3:  "#A39E96",
  gold:   "#A8823C",
} as const;

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  const router = useRouter();
  const [hov, setHov] = useState(false);
  const [added, setAdded] = useState(false);

  const [selecting, setSelecting] = useState(false);
  const [selColor,  setSelColor]  = useState<ColorChoice | null>(null);
  const [selSize,   setSelSize]   = useState<string | null>(null);

  const addItem        = useCartStore((s) => s.addItem);
  const wishlistIds     = useWishlistStore((s) => s.ids);
  const toggleWishlist  = useWishlistStore((s) => s.toggle);

  const isWishlisted = wishlistIds.includes(product.id);

  const discount = product.originalPrice
    ? calcDiscount(product.price, product.originalPrice)
    : null;

  const getImg = (img: any) => (typeof img === "string" ? img : img?.url) || "";
  const firstImage  = getImg(product.images?.[0]);
  const secondImage = getImg(product.images?.[1]);
  const showImg     = hov && secondImage ? secondImage : firstImage;

  const uniqueColors = [
    ...new Map(
      (product.variants || [])
        .filter((v) => v.colorHex)
        .map((v) => [v.colorHex, v])
    ).values(),
  ].slice(0, 5);

  const defaultSize  = product.variants?.[0]?.size  || "ONE SIZE";
  const defaultColor = product.variants?.[0]?.color || "أساسي";

  const requiresColor = uniqueColors.length > 0;
  const allSizes = [
    ...new Set((product.variants || []).map((v) => v.size).filter(Boolean)),
  ] as string[];
  const requiresSize = allSizes.length > 0;

  const availableSizes = [
    ...new Set(
      (product.variants || [])
        .filter((v) => (!selColor || v.color === selColor.name) && v.size)
        .map((v) => v.size as string)
    ),
  ];

  const goToProduct = () => router.push(`/product/${product.id}`);

  const confirmAdd = (color: ColorChoice | null, size: string | null) => {
    const finalColor: ColorChoice = color ?? {
      name: defaultColor,
      hex: uniqueColors[0]?.colorHex ?? "#C9A86E",
    };
    const finalSize = size ?? defaultSize;

    addItem({
      id:       product.id,
      nameAr:   product.nameAr,
      nameEn:   product.name,
      brand:    product.brand,
      price:    product.price,
      grad:     "from-[#F2F0ED] to-[#E8E5E0]",
      image:    firstImage,
      size:     finalSize,
      color:    finalColor.name,
      colorHex: finalColor.hex,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelecting(false);
      setSelColor(null);
      setSelSize(null);
    }, 1500);
  };

  const startSelecting = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requiresColor && !requiresSize) {
      confirmAdd(null, null);
    } else {
      setSelecting(true);
    }
  };

  const cancelSelecting = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelecting(false);
    setSelColor(null);
    setSelSize(null);
  };

  const pickColor = (e: React.MouseEvent, c: ColorChoice) => {
    e.preventDefault();
    e.stopPropagation();
    setSelColor(c);
  };

  const pickSize = (e: React.MouseEvent, s: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelSize(s);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const badgeRed = product.badge?.includes("خصم") || product.badge?.includes("٪");

  return (
    // ── الغلاف الخارجي: بدون إطار / بدون حواف دائرية / بدون ظل / بدون رفع عند hover ──
    <div
      onClick={goToProduct}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "transparent",
        cursor: "pointer",
        position: "relative",
        direction: "rtl",
      }}
    >
      {/* ── صورة المنتج — حافة لحافة، بدون حواف دائرية ── */}
      <div style={{
        aspectRatio: "3/4", position: "relative", overflow: "hidden",
        background: CARD.imgBg,
      }}>
        {showImg ? (
          <Image
            src={showImg}
            alt={product.nameAr}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            style={{
              objectFit: "cover",
              transform: hov ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            background: CARD.imgBg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 42, color: "#D8D4CC" }}>V</span>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
            <span style={{
              background: badgeRed ? "#C0504D" : CARD.gold,
              color: "#FFFFFF", padding: "2px 9px", borderRadius: 20,
              fontSize: 10, fontWeight: 700, fontFamily: "Tajawal, sans-serif",
            }}>
              {product.badge}
            </span>
          </div>
        )}

        {/* زر المفضلة */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          style={{
            position: "absolute", top: 8, left: 8, zIndex: 2,
            background: isWishlisted ? "rgba(192,80,77,0.92)" : "rgba(255,255,255,0.85)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "50%", width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s",
            backdropFilter: "blur(4px)", color: isWishlisted ? "#fff" : "#6B6560",
          }}
        >
          <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* أزرار / لوحة الاختيار عند الـ hover */}
        <div
          onClick={(e) => selecting && e.stopPropagation()}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, padding: 9,
            background: selecting
              ? "linear-gradient(to top,rgba(255,255,255,0.98) 0%,rgba(255,255,255,0.92) 70%,transparent 100%)"
              : "linear-gradient(to top,rgba(255,255,255,0.95) 0%,transparent 100%)",
            display: "flex", flexDirection: "column", gap: 7,
            opacity: hov || selecting ? 1 : 0,
            transform: hov || selecting ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.28s",
          }}
        >
          {added ? (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "#4C9A6A", color: "#FFFFFF", borderRadius: 7, padding: "8px",
              fontSize: 11, fontFamily: "Tajawal, sans-serif", fontWeight: 700,
            }}>
              <Check size={13} /> تمت الإضافة للسلة
            </div>
          ) : selecting ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: CARD.gold, fontFamily: "Tajawal, sans-serif", fontWeight: 700 }}>
                  اختر اللون والمقاس
                </span>
                <button
                  onClick={cancelSelecting}
                  aria-label="إلغاء"
                  style={{
                    background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%",
                    width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: CARD.text2, flexShrink: 0,
                  }}
                >
                  <X size={11} />
                </button>
              </div>

              {requiresColor && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {uniqueColors.map((v, i) => {
                    const isSel = selColor?.hex === v.colorHex;
                    return (
                      <button
                        key={i}
                        title={v.color ?? ""}
                        onClick={(e) => pickColor(e, { name: v.color ?? "", hex: v.colorHex ?? "#ccc" })}
                        style={{
                          width: 21, height: 21, borderRadius: "50%", padding: 0,
                          background: v.colorHex ?? "#ccc",
                          border: isSel ? `2px solid ${CARD.gold}` : "1px solid rgba(0,0,0,0.15)",
                          boxShadow: isSel ? `0 0 0 2px ${CARD.gold}33` : "none",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {requiresSize && (
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {availableSizes.map((s) => {
                    const isSel = selSize === s;
                    return (
                      <button
                        key={s}
                        onClick={(e) => pickSize(e, s)}
                        style={{
                          padding: "4px 9px", borderRadius: 5,
                          background: isSel ? CARD.gold : "rgba(0,0,0,0.04)",
                          color: isSel ? "#FFFFFF" : CARD.text1,
                          border: isSel ? `1px solid ${CARD.gold}` : "1px solid rgba(0,0,0,0.1)",
                          fontSize: 10, fontFamily: "Tajawal, sans-serif",
                          fontWeight: isSel ? 700 : 500,
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const colorOk = !requiresColor || selColor;
                  const sizeOk  = !requiresSize  || selSize;
                  if (colorOk && sizeOk) confirmAdd(selColor, selSize);
                }}
                disabled={(requiresColor && !selColor) || (requiresSize && !selSize)}
                style={{
                  width: "100%", padding: "8px",
                  borderRadius: 7, border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  fontSize: 11, fontFamily: "Tajawal, sans-serif", fontWeight: 700,
                  transition: "all 0.2s",
                  background: ((requiresColor && !selColor) || (requiresSize && !selSize))
                    ? "rgba(0,0,0,0.06)" : CARD.gold,
                  color: ((requiresColor && !selColor) || (requiresSize && !selSize))
                    ? "#A8A39C" : "#FFFFFF",
                  cursor: ((requiresColor && !selColor) || (requiresSize && !selSize))
                    ? "not-allowed" : "pointer",
                }}
              >
                <ShoppingBag size={12} /> أضف إلى السلة
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToProduct(); }}
                style={{
                  flex: 1, background: "rgba(0,0,0,0.04)", color: CARD.text1,
                  border: "1px solid rgba(0,0,0,0.08)", borderRadius: 7, padding: "7px",
                  cursor: "pointer", fontSize: 11, fontFamily: "Tajawal, sans-serif", fontWeight: 500,
                  backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 4,
                }}
              >
                <Eye size={12} /> عرض سريع
              </button>
              <button
                onClick={startSelecting}
                aria-label="إضافة للسلة"
                title="إضافة للسلة"
                style={{
                  width: 34, flexShrink: 0,
                  background: CARD.gold, color: "#FFFFFF",
                  border: "none", borderRadius: 7,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── معلومات المنتج — padding بسيط جداً، بدون خلفية بطاقة ── */}
      <div style={{ padding: "9px 2px 2px" }}>
        <p style={{ fontSize: 10, color: CARD.text3, fontFamily: "Tajawal, sans-serif", marginBottom: 3 }}>
          {product.brand}
        </p>
        <p style={{
          fontSize: 13, color: CARD.text1, fontFamily: "Tajawal, sans-serif",
          fontWeight: 500, marginBottom: 6, lineHeight: 1.4,
          overflow: "hidden", textOverflow: "ellipsis",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {product.nameAr}
        </p>

        {product.rating > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 6, color: CARD.gold }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} width={10} height={10} viewBox="0 0 24 24"
                fill={i <= Math.round(product.rating) ? CARD.gold : "none"}
                stroke={CARD.gold} strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span style={{ fontSize: 9, color: CARD.text3, marginRight: 2, fontFamily: "Tajawal, sans-serif" }}>
              ({product.reviewCount})
            </span>
          </div>
        )}
{/* ── السعر (معدّل) ── */}
<div style={{ 
  display: "flex", 
  alignItems: "center", 
  gap: 6, 
  marginBottom: 9,
  flexWrap: "wrap",
}}>
  {/* السعر الحالي */}
  <span style={{ 
    fontSize: 16, 
    fontWeight: 700, 
    color: "#A8823C", 
    fontFamily: "Tajawal, sans-serif",
    letterSpacing: "0.01em",
  }}>
    {formatPrice(product.price)}
  </span>
  
  {/* السعر الأصلي (عند الخصم) */}
  {product.originalPrice && product.originalPrice > product.price && (
    <>
      <span style={{ 
        fontSize: 12, 
        color: "#A39E96", 
        textDecoration: "line-through", 
        fontFamily: "Tajawal, sans-serif",
      }}>
        {formatPrice(product.originalPrice)}
      </span>
      {/* نسبة الخصم */}
      <span style={{ 
        fontSize: 10, 
        color: "#C0504D", 
        fontFamily: "Tajawal, sans-serif", 
        fontWeight: 700,
        background: "#C0504D0D",
        padding: "1px 8px",
        borderRadius: 4,
        border: "1px solid #C0504D30",
      }}>
        {discount}%
      </span>
    </>
  )}
</div>

        {uniqueColors.length > 0 && (
          <div style={{ display: "flex", gap: 4 }}>
            {uniqueColors.map((v, i) => (
              <div key={i} title={v.color ?? ""} style={{
                width: 12, height: 12, borderRadius: "50%",
                background: v.colorHex ?? "#ccc", border: "1px solid rgba(0,0,0,0.1)",
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}