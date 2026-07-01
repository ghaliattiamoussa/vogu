// ════════════════════════════════════════════════════════════
//  VŌGU Store — Customizer Catalog
//  طبقة وسيطة بين قاعدة البيانات وصفحة التصميم.
//  - PRODUCT_COLORS_EXTENDED: لوحة ألوان احترافية موسّعة
//  - resolveCatalogProduct: يحوّل منتج الـDB إلى تعريف تفصيلي قابل للرسم
// ════════════════════════════════════════════════════════════

export interface CustomColor { name: string; hex: string }

export interface CatalogProductFull {
  id: string;
  label: string;
  categoryId: string;
  categoryLabel?: string;
  categoryEmoji?: string;
  svgType: string;
  price: number;
  sizes: string[];
  colors: CustomColor[];
  defaultColor: string;
  printArea: { top: number; left: number; width: number; height: number };
  // الجوانب الأربعة — صورة حقيقية أو null
  frontImage?: string | null;
  backImage?: string | null;
  rightSleeveImage?: string | null;
  leftSleeveImage?: string | null;
  // دوال رسم SVG fallback (لو مفيش صورة)
  frontSvg: (color: string) => string;
  backSvg: (color: string) => string;
  rightSleeveSvg: (color: string) => string;
  leftSleeveSvg: (color: string) => string;
}

// ─── لوحة ألوان احترافية موسّعة (38 لون) ────────────────────
export const PRODUCT_COLORS_EXTENDED: CustomColor[] = [
  { name: "أبيض",        hex: "#F5F5F0" }, { name: "كريمي",        hex: "#EDE8D8" },
  { name: "شمبانيا",     hex: "#F5E6CC" }, { name: "بيج",          hex: "#D4B896" },
  { name: "بيج داكن",    hex: "#C4A882" }, { name: "بني فاتح",     hex: "#A78B5F" },
  { name: "بني",         hex: "#78503A" }, { name: "بني داكن",     hex: "#4A2C1A" },
  { name: "أسود",        hex: "#1A1A1A" }, { name: "رمادي فاتح",   hex: "#D1D5DB" },
  { name: "رمادي",       hex: "#6B7280" }, { name: "رمادي داكن",   hex: "#374151" },
  { name: "حبري",        hex: "#1E293B" }, { name: "كحلي",         hex: "#1E3A5F" },
  { name: "نيلي",        hex: "#4338CA" }, { name: "سماوي",        hex: "#3B82F6" },
  { name: "تركوازي",     hex: "#06B6D4" }, { name: "أزرق سماوي",   hex: "#7DD3FC" },
  { name: "أخضر فاتح",   hex: "#86EFAC" }, { name: "فستقي",        hex: "#34D399" },
  { name: "أخضر",        hex: "#16A34A" }, { name: "أخضر زيتي",    hex: "#4A5240" },
  { name: "زيتي داكن",   hex: "#3F4A2E" }, { name: "ليموني",       hex: "#A3E635" },
  { name: "أصفر فاتح",   hex: "#FEF08A" }, { name: "خوخي",         hex: "#FBBF24" },
  { name: "برتقالي",     hex: "#F97316" }, { name: "بردقان",       hex: "#C2410C" },
  { name: "كورال",       hex: "#FB7185" }, { name: "أحمر",         hex: "#DC2626" },
  { name: "عنابي",       hex: "#7F1D1D" }, { name: "روز",          hex: "#FDA4AF" },
  { name: "وردي",        hex: "#EC4899" }, { name: "وردي داكن",    hex: "#9D174D" },
  { name: "بنفسجي",      hex: "#7C3AED" }, { name: "لافندر",       hex: "#A78BFA" },
  { name: "ذهبي",        hex: "#C9A86E" }, { name: "فضي",          hex: "#94A3B8" },
];

// ─── منتج افتراضي fallback (لو الـDB فاضي أو فيه خطأ) ─────────
export const DEFAULT_FALLBACK_PRODUCT: CatalogProductFull = {
  id: "fallback-tshirt",
  label: "تيشرت",
  categoryId: "fallback",
  svgType: "tshirt",
  price: 299,
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  colors: PRODUCT_COLORS_EXTENDED,
  defaultColor: "#F5F5F0",
  printArea: { top: 24, left: 24, width: 52, height: 46 },
  frontImage: null,
  backImage: null,
  rightSleeveImage: null,
  leftSleeveImage: null,
  frontSvg: (c) => `<svg viewBox="0 0 420 500" xmlns="http://www.w3.org/2000/svg"><path d="M152 40 L88 18 L10 92 L60 142 L94 106 L78 440 L342 440 L326 106 L268 40 C262 68 238 90 210 90 C182 90 158 68 152 40 Z" fill="${c}"/></svg>`,
  backSvg: (c) => `<svg viewBox="0 0 420 500" xmlns="http://www.w3.org/2000/svg"><path d="M152 40 L88 18 L10 92 L60 142 L94 106 L78 440 L342 440 L326 106 L268 40 C262 68 238 86 210 86 C182 86 158 68 152 40 Z" fill="${c}"/></svg>`,
  rightSleeveSvg: (c) => `<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="20" width="120" height="360" rx="20" fill="${c}"/></svg>`,
  leftSleeveSvg: (c) => `<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="20" width="120" height="360" rx="20" fill="${c}"/></svg>`,
};

// ─── دوال SVG أساسية لكل نوع منتج ────────────────────────────
import {
  TSHIRT_FRONT,
} from "@/components/customize/garmentSvgs";

// رسم خلفي بسيط (معاكس الأمامي بدون تفاصيل الياقة الأمامية)
const TSHIRT_BACK_SIMPLE = (color: string) => `
<svg viewBox="0 0 420 500" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="210" cy="494" rx="128" ry="8" fill="#000" fill-opacity="0.08"/>
  <path d="M152 40 L88 18 L10 92 L60 142 L94 106" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M268 40 L332 18 L410 92 L360 142 L326 106" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40 C262 68 238 86 210 86 C182 86 158 68 152 40 Z" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M172 40 C175 55 192 65 210 65 C228 65 245 55 248 40" fill="none" stroke="#00000018" stroke-width="2.5"/>
  <line x1="210" y1="65" x2="210" y2="440" stroke="#00000012" stroke-width="1.5"/>
</svg>`;

// رسم بسيط للأكمام (يُستعمل fallback)
const SLEEVE_SVG = (color: string, side: "right" | "left") => `
<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
  <path d="M${side === "right" ? "30 20 L150 20 L170 380 L40 380" : "50 20 L170 20 L160 380 L30 380"} L40 20 Z"
    fill="${color}" />
</svg>`;

// ─── تحويل منتج الـDB إلى تعريف تفصيلي ──────────────────────
export function resolveCatalogProduct(db: any): CatalogProductFull {
  const printArea = (db.printArea && typeof db.printArea === "object")
    ? db.printArea
    : { top: 24, left: 24, width: 52, height: 46 };

  const colors: CustomColor[] = Array.isArray(db.colors) && db.colors.length > 0
    ? db.colors
    : PRODUCT_COLORS_EXTENDED;

  const sizes: string[] = Array.isArray(db.sizes) && db.sizes.length > 0
    ? db.sizes
    : ["XS", "S", "M", "L", "XL", "XXL"];

  // اختيار رسم SVG حسب نوع المنتج
  const svgType = db.svgType || "tshirt";

  return {
    id: db.id,
    label: db.label || "منتج",
    categoryId: db.categoryId || db.category?.id || "",
    categoryLabel: db.category?.label,
    categoryEmoji: db.category?.emoji,
    svgType,
    price: Number(db.price) || 299,
    sizes,
    colors,
    defaultColor: db.defaultColor || "#F5F5F0",
    printArea,
    frontImage: db.frontImage || null,
    backImage: db.backImage || null,
    rightSleeveImage: db.rightSleeveImage || null,
    leftSleeveImage: db.leftSleeveImage || null,
    // كل الأنواع تستخدم رسم التيشرت كـ fallback مرئي مؤقت
    frontSvg: (c) => TSHIRT_FRONT(c),
    backSvg: (c) => TSHIRT_BACK_SIMPLE(c),
    rightSleeveSvg: (c) => SLEEVE_SVG(c, "right"),
    leftSleeveSvg: (c) => SLEEVE_SVG(c, "left"),
  };
}
