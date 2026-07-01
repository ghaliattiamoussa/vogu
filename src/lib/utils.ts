import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Tailwind Class Merger ───────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── السعر بالجنيه المصري ────────────────────────────────────────────────────
export function formatPrice(
  amount: number,
  options: { currency?: string; decimals?: number } = {}
) {
  const { currency = 'EGP', decimals = 0 } = options
  return new Intl.NumberFormat('ar-EG', {
    style:                 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

// ─── نسبة الخصم ──────────────────────────────────────────────────────────────
export function calcDiscount(original: number, sale: number): number {
  if (!original || original <= sale) return 0
  return Math.round(((original - sale) / original) * 100)
}

// ─── التاريخ بالعربي ─────────────────────────────────────────────────────────
export function formatDate(date: Date | string, short = false): string {
  return new Intl.DateTimeFormat('ar-EG', {
    year:  'numeric',
    month: short ? 'short' : 'long',
    day:   'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('ar-EG', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  )
  if (seconds < 60)   return 'منذ لحظات'
  if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`
  if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`
  return formatDate(date, true)
}

// ─── Cloudinary URLs ─────────────────────────────────────────────────────────
export function cloudinaryUrl(
  publicId: string,
  options: {
    width?:   number
    height?:  number
    quality?: number | 'auto'
    format?:  'webp' | 'avif' | 'auto'
    crop?:    'fill' | 'fit' | 'thumb' | 'scale'
    gravity?: 'auto' | 'face' | 'center'
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format  = 'webp',
    crop    = 'fill',
    gravity = 'auto',
  } = options

  const transforms: string[] = [
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`,
    `g_${gravity}`,
    width  ? `w_${width}`  : '',
    height ? `h_${height}` : '',
  ].filter(Boolean)

  const base = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
  return `${base}/${transforms.join(',')}/${publicId}`
}

// ─── Slug ────────────────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]+/g, '')
    .replace(/--+/g, '-')
}

// ─── حالة الطلب بالعربي ──────────────────────────────────────────────────────
const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'قيد الانتظار',  color: 'text-yellow-400' },
  CONFIRMED:  { label: 'مؤكد',          color: 'text-blue-400'   },
  PROCESSING: { label: 'جاري التجهيز',  color: 'text-purple-400' },
  SHIPPED:    { label: 'تم الشحن',       color: 'text-indigo-400' },
  DELIVERED:  { label: 'تم التوصيل', color: 'text-green-400' },
};
// — ترتيب المقاسات
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.toUpperCase());
    const bi = SIZE_ORDER.indexOf(b.toUpperCase());
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}