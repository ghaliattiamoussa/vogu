// ============================================================
// src/lib/constants.ts — ثوابت مشروع VŌGU (للسوق المصري)
// ============================================================

// ─── App Info ────────────────────────────────────────────────
export const APP_NAME        = "VŌGU";
export const APP_TAGLINE     = "تجربة تسوق فاخرة";
export const APP_DESCRIPTION = "VŌGU — متجر أزياء فاخر يجمع الأناقة والجودة الاستثنائية";
export const APP_URL         = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ─── Theme Colors (تطابق التصميم الأصلي) ──────────────────────
export const THEME = {
  bg:    "#070707",
  surf:  "#0D0D0D",
  card:  "#121212",
  cardH: "#181818",
  b1:    "#1A1A1A",
  b2:    "#262626",
  gold:  "#C9A86E",
  goldL: "#DDBF88",
  goldD: "#9A7848",
  t1:    "#EDE8DF",
  t2:    "#8A8480",
  t3:    "#484542",
  ok:    "#5CB87A",
  err:   "#D07070",
} as const;

// ─── Fonts ────────────────────────────────────────────────────
export const FONTS = {
  arabic: "Tajawal, sans-serif",
  latin:  "'Cormorant Garant', serif",
} as const;

// ─── Currency (مصري) ──────────────────────────────────────────
export const DEFAULT_CURRENCY = "EGP";
export const CURRENCY_SYMBOL  = "ج.م";
export const CURRENCY_LOCALE  = "ar-EG";

/** يحوّل الرقم لصيغة مصرية: 1299 → "١٬٢٩٩ ج.م" */
export const formatPrice = (price: number): string =>
  price.toLocaleString("ar-EG") + " " + CURRENCY_SYMBOL;

// ─── Pagination ───────────────────────────────────────────────
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE   = 10;
export const REVIEWS_PER_PAGE  = 5;

// ─── Categories (تطابق التصميم) ──────────────────────────────
export const CATEGORIES = [
  { id: "all",         label: "الكل",       slug: "all",         icon: "✦"  },
  { id: "women",       label: "نساء",        slug: "women",       icon: "👗" },
  { id: "men",         label: "رجال",        slug: "men",         icon: "👔" },
  { id: "kids",        label: "أطفال",       slug: "kids",        icon: "🧒" },
  { id: "accessories", label: "إكسسوارات",  slug: "accessories", icon: "👜" },
  { id: "sale",        label: "تخفيضات",     slug: "sale",        icon: "🏷️" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

// ─── Sizes ────────────────────────────────────────────────────
export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export const KIDS_SIZES     = ["2Y", "4Y", "6Y", "8Y", "10Y", "12Y", "14Y"] as const;

// ─── Sort Options ─────────────────────────────────────────────
export const SORT_OPTIONS = [
  { label: "مميز",          value: "featured"   },
  { label: "الأقل سعراً",  value: "price_asc"  },
  { label: "الأعلى سعراً", value: "price_desc" },
  { label: "الأعلى تقييماً", value: "rating"   },
  { label: "الأحدث",       value: "newest"     },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

// ─── Price Ranges ─────────────────────────────────────────────
export const PRICE_RANGES = [
  { label: "أقل من 500 ج.م",          min: 0,    max: 500   },
  { label: "500 — 1,000 ج.م",          min: 500,  max: 1000  },
  { label: "1,000 — 2,500 ج.م",        min: 1000, max: 2500  },
  { label: "2,500 — 5,000 ج.م",        min: 2500, max: 5000  },
  { label: "أكثر من 5,000 ج.م",        min: 5000, max: 99999 },
] as const;

// ─── Order Status ─────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING:    { label: "قيد الانتظار",  color: "yellow" },
  CONFIRMED:  { label: "مؤكد",          color: "blue"   },
  PROCESSING: { label: "جاري التجهيز",  color: "purple" },
  SHIPPED:    { label: "تم الشحن",      color: "indigo" },
  DELIVERED:  { label: "تم التسليم",    color: "green"  },
  CANCELLED:  { label: "ملغي",          color: "red"    },
  REFUNDED:   { label: "مسترجع",        color: "gray"   },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;

// ─── Shipping (مصري) ──────────────────────────────────────────
export const SHIPPING_OPTIONS = [
  {
    id:          "standard",
    label:       "التوصيل العادي",
    description: "3-5 أيام عمل",
    price:       50,
    icon:        "🚚",
  },
  {
    id:          "express",
    label:       "التوصيل السريع",
    description: "1-2 يوم عمل",
    price:       100,
    icon:        "⚡",
  },
  {
    id:          "free",
    label:       "توصيل مجاني",
    description: "5-7 أيام عمل (للطلبات فوق 1,000 ج.م)",
    price:       0,
    icon:        "🎁",
  },
] as const;

export const FREE_SHIPPING_THRESHOLD = 1000; // جنيه مصري

// ─── Payment Methods ──────────────────────────────────────────
export const PAYMENT_METHODS = [
  { id: "card",  label: "بطاقة ائتمان / خصم", icon: "💳", brands: ["Visa", "Mastercard"] },
  { id: "cod",   label: "الدفع عند الاستلام",  icon: "💵" },
  { id: "fawry", label: "فوري",                 icon: "🏪" },
  { id: "valu",  label: "ValU تقسيط",           icon: "📱" },
] as const;

export const PAYMENT_ICONS = ["Visa", "Mastercard", "PayPal", "Apple Pay", "Fawry"];

// ─── Egyptian Phone Validation ────────────────────────────────
export const EGYPT_PHONE_REGEX = /^(\+20|0)(10|11|12|15)[0-9]{8}$/;
export const EGYPT_PHONE_HINT  = "مثال: 01012345678";

// ─── Egyptian Cities ──────────────────────────────────────────
export const EGYPT_CITIES = [
  "القاهرة", "الإسكندرية", "الجيزة", "شرم الشيخ", "الغردقة",
  "المنصورة", "طنطا", "أسيوط", "الأقصر", "أسوان",
  "بورسعيد", "السويس", "الإسماعيلية", "المنيا", "الفيوم",
  "دمياط", "كفر الشيخ", "سوهاج", "قنا", "مرسى مطروح",
] as const;

// ─── Cart ─────────────────────────────────────────────────────
export const MAX_CART_QUANTITY = 10;
export const CART_STORAGE_KEY  = "vogu_cart";
export const WISH_STORAGE_KEY  = "vogu_wishlist";

// ─── Toast Messages ───────────────────────────────────────────
export const TOAST = {
  ADDED_TO_CART:         "✅ تم إضافة المنتج للسلة",
  REMOVED_FROM_CART:     "🗑️ تم حذف المنتج من السلة",
  ADDED_TO_WISHLIST:     "❤️ تم الإضافة للمفضلة",
  REMOVED_FROM_WISHLIST: "💔 تم الحذف من المفضلة",
  ORDER_PLACED:          "🎉 تم تقديم طلبك بنجاح",
  PROFILE_UPDATED:       "✅ تم تحديث الملف الشخصي",
  REVIEW_SUBMITTED:      "⭐ شكراً! تم إرسال تقييمك",
  ERROR_GENERIC:         "❌ حدث خطأ، يرجى المحاولة مجدداً",
  LOGIN_REQUIRED:        "🔒 يرجى تسجيل الدخول أولاً",
} as const;

// ─── Navigation ───────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "الرئيسية",   href: "/"                  },
  { label: "المتجر",     href: "/shop"               },
  { label: "نساء",       href: "/category/women"     },
  { label: "رجال",       href: "/category/men"       },
  { label: "أطفال",      href: "/category/kids"      },
  { label: "تخفيضات",   href: "/category/sale"      },
] as const;

// ─── Footer Links ─────────────────────────────────────────────
export const FOOTER_LINKS = [
  { title: "تسوق",     links: ["نساء", "رجال", "أطفال", "تخفيضات", "وصل حديثاً"] },
  { title: "المساعدة", links: ["تواصل معنا", "الشحن والتوصيل", "سياسة الإرجاع", "تتبع الطلب"] },
  { title: "الشركة",   links: ["من نحن", "المدونة", "الاستدامة", "العمل معنا"] },
] as const;

// ─── Social Links ─────────────────────────────────────────────
export const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://instagram.com/vogu" },
  { name: "TikTok",    href: "https://tiktok.com/@vogu"   },
  { name: "Facebook",  href: "https://facebook.com/vogu"  },
] as const;

// ─── Admin ────────────────────────────────────────────────────
export const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

// ─── API Routes ───────────────────────────────────────────────
export const API = {
  PRODUCTS:   "/api/products",
  CART:       "/api/cart",
  ORDERS:     "/api/orders",
  REVIEWS:    "/api/reviews",
  WISHLIST:   "/api/wishlist",
  CHECKOUT:   "/api/checkout",
  UPLOAD:     "/api/upload",
  SEARCH:     "/api/search",
  STYLIST:    "/api/stylist",
  CATEGORIES: "/api/categories",
} as const;