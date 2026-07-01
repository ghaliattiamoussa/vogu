'use client';

import { useState, useMemo, useEffect } from 'react';
import { X, Search, ChevronLeft, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── useMediaQuery hook ───────────────────────────────────────
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

const C = {
  bg:   '#FAFAF8', surf: '#F5F3EF', card: '#FFFFFF',
  b1:   '#EAE7E1', b2:   '#DDD9D1',
  gold: '#A8823C', goldL:'#C9A86E',
  t1:   '#1A1714', t2:   '#6B6560', t3:   '#A39E96',
  err:  '#C0504D', ok:   '#3D9960',
} as const;

export interface CatalogProduct {
  id: string; name: string; description: string;
  category: string; subcategory: string;
  price: number; rating: number; badge?: string;
  svgType: 'tshirt' | 'hoodie' | 'pants' | 'shorts' | 'jacket';
  colors: { name: string; hex: string }[];
  features: string[];

frontImage?: string | null; // 👈 السطر الجديد
  backImage?: string | null;  // 👈
}

const CATALOG_FALLBACK: CatalogProduct[] = [
  {
    id: 'tshirt-classic', name: 'تيشرت كلاسيك',
    description: 'قطن ١٠٠٪ ناعم ومريح للاستخدام اليومي',
    category: 'tshirts', subcategory: 'short-sleeve',
    price: 249, rating: 4.8, badge: 'الأكثر مبيعاً', svgType: 'tshirt',
    features: ['قطن ١٠٠٪', 'مناسب للطباعة', 'متعدد الألوان'],
    colors: [
      { name: 'أبيض', hex: '#F5F5F0' }, { name: 'أسود', hex: '#1A1A1A' },
      { name: 'رمادي', hex: '#9CA3AF' }, { name: 'كحلي', hex: '#1E3A5F' },
      { name: 'أزرق', hex: '#3B82F6' }, { name: 'أحمر', hex: '#EF4444' },
      { name: 'أخضر', hex: '#22C55E' }, { name: 'بيج', hex: '#D4B896' },
    ],
  },
  {
    id: 'tshirt-oversized', name: 'تيشرت أوفرسايز',
    description: 'قصّة واسعة عصرية، خامة مزدوجة ثقيلة',
    category: 'tshirts', subcategory: 'short-sleeve',
    price: 299, rating: 4.7, badge: 'جديد', svgType: 'tshirt',
    features: ['قطن مزدوج', 'قصة واسعة', 'أكمام مسقطة'],
    colors: [
      { name: 'أبيض', hex: '#F5F5F0' }, { name: 'أسود', hex: '#1A1A1A' },
      { name: 'بيج داكن', hex: '#C4A882' }, { name: 'رمادي فاتح', hex: '#D1D5DB' },
      { name: 'زيتي', hex: '#4A5240' }, { name: 'بني', hex: '#78503A' },
    ],
  },
  {
    id: 'tshirt-polo', name: 'تيشرت بولو',
    description: 'أناقة كلاسيكية مع ياقة مزرورة',
    category: 'tshirts', subcategory: 'polo',
    price: 349, rating: 4.6, svgType: 'tshirt',
    features: ['بيكيه قطن', 'ياقة مزرورة', 'مناسب للعمل'],
    colors: [
      { name: 'أبيض', hex: '#F5F5F0' }, { name: 'أسود', hex: '#1A1A1A' },
      { name: 'كحلي', hex: '#1E3A5F' }, { name: 'أخضر زيتي', hex: '#4A5240' },
      { name: 'بردقان', hex: '#C2410C' },
    ],
  },
  {
    id: 'tshirt-longsleeve', name: 'تيشرت كم طويل',
    description: 'خامة قطن ثقيلة مناسبة للطقس البارد',
    category: 'tshirts', subcategory: 'long-sleeve',
    price: 319, rating: 4.5, svgType: 'tshirt',
    features: ['كم طويل', 'قطن ثقيل', 'حافة ضلعية'],
    colors: [
      { name: 'أسود', hex: '#1A1A1A' }, { name: 'أبيض', hex: '#F5F5F0' },
      { name: 'رمادي', hex: '#6B7280' }, { name: 'كحلي', hex: '#1E3A5F' },
      { name: 'بني', hex: '#78503A' },
    ],
  },
  {
    id: 'hoodie-pullover', name: 'هودي بدون زيبر',
    description: 'قطن فليس دافئ مع كنغر وكابة',
    category: 'hoodies', subcategory: 'pullover',
    price: 499, rating: 4.9, badge: 'الأكثر مبيعاً', svgType: 'hoodie',
    features: ['فليس قطن ٣٠٠ جرام', 'جيب كنغر', 'كابة قابلة للتعديل'],
    colors: [
      { name: 'أسود', hex: '#1A1A1A' }, { name: 'رمادي', hex: '#6B7280' },
      { name: 'كحلي', hex: '#1E3A5F' }, { name: 'أبيض', hex: '#F5F5F0' },
      { name: 'بيج', hex: '#D4B896' }, { name: 'أخضر', hex: '#166534' },
      { name: 'بردقان', hex: '#C2410C' },
    ],
  },
  {
    id: 'hoodie-zip', name: 'هودي بزيبر كامل',
    description: 'زيبر YKK متين، مريح وعملي',
    category: 'hoodies', subcategory: 'zip',
    price: 549, rating: 4.7, badge: 'جديد', svgType: 'hoodie',
    features: ['زيبر YKK', 'جيبين جانبيين', 'كابة كبيرة'],
    colors: [
      { name: 'أسود', hex: '#1A1A1A' }, { name: 'رمادي فاتح', hex: '#D1D5DB' },
      { name: 'كحلي', hex: '#1E3A5F' }, { name: 'أخضر زيتي', hex: '#4A5240' },
    ],
  },
  {
    id: 'hoodie-crop', name: 'هودي كروب (نسائي)',
    description: 'قصة قصيرة عصرية مع كابة',
    category: 'hoodies', subcategory: 'pullover',
    price: 449, rating: 4.6, svgType: 'hoodie',
    features: ['قصة كروب', 'فليس ناعم', 'متعدد الألوان'],
    colors: [
      { name: 'وردي', hex: '#EC4899' }, { name: 'أبيض', hex: '#F5F5F0' },
      { name: 'أسود', hex: '#1A1A1A' }, { name: 'بيج', hex: '#D4B896' },
      { name: 'بنفسجي', hex: '#8B5CF6' },
    ],
  },
  {
    id: 'pants-jogger', name: 'بنطال جوجر',
    description: 'فليس ناعم مع عقدة وساق ضلعية',
    category: 'pants', subcategory: 'jogger',
    price: 399, rating: 4.7, badge: 'الأكثر مبيعاً', svgType: 'pants',
    features: ['فليس ناعم', 'جيبان جانبيان', 'ساق ضلعية'],
    colors: [
      { name: 'أسود', hex: '#1A1A1A' }, { name: 'رمادي', hex: '#6B7280' },
      { name: 'كحلي', hex: '#1E3A5F' }, { name: 'زيتي', hex: '#4A5240' },
      { name: 'بيج', hex: '#D4B896' },
    ],
  },
  {
    id: 'pants-cargo', name: 'بنطال كارجو',
    description: 'عملي مع جيوب جانبية واسعة',
    category: 'pants', subcategory: 'cargo',
    price: 449, rating: 4.5, svgType: 'pants',
    features: ['٦ جيوب', 'قماش تويل', 'حزام قابل للفك'],
    colors: [
      { name: 'زيتي', hex: '#4A5240' }, { name: 'أسود', hex: '#1A1A1A' },
      { name: 'بيج', hex: '#C4A882' }, { name: 'رمادي', hex: '#6B7280' },
    ],
  },
  {
    id: 'shorts-basic', name: 'شورت أساسي',
    description: 'قطن خفيف مثالي للصيف',
    category: 'shorts', subcategory: 'basic',
    price: 199, rating: 4.6, svgType: 'shorts',
    features: ['قطن خفيف', 'جيبان', 'طول الركبة'],
    colors: [
      { name: 'أسود', hex: '#1A1A1A' }, { name: 'رمادي', hex: '#9CA3AF' },
      { name: 'كحلي', hex: '#1E3A5F' }, { name: 'أبيض', hex: '#F5F5F0' },
      { name: 'أخضر', hex: '#22C55E' }, { name: 'أحمر', hex: '#EF4444' },
    ],
  },
  {
    id: 'jacket-bomber', name: 'جاكيت بومبر',
    description: 'تصميم عسكري أنيق مع أكمام ضلعية',
    category: 'jackets', subcategory: 'bomber',
    price: 649, rating: 4.8, badge: 'مميز', svgType: 'jacket',
    features: ['بطانة ساتان', 'زيبر YKK', 'جيبان جانبيان'],
    colors: [
      { name: 'أسود', hex: '#1A1A1A' }, { name: 'زيتي', hex: '#4A5240' },
      { name: 'كحلي', hex: '#1E3A5F' }, { name: 'بيج', hex: '#C4A882' },
    ],
  },
  {
    id: 'jacket-varsity', name: 'جاكيت فارسيتي',
    description: 'أسلوب الكوليج الكلاسيكي بتصميم عصري',
    category: 'jackets', subcategory: 'varsity',
    price: 699, rating: 4.7, badge: 'جديد', svgType: 'jacket',
    features: ['صوف وجلد صناعي', 'ضلعي الأكمام', 'شعار قابل للتطريز'],
    colors: [
      { name: 'أسود/أبيض', hex: '#1A1A1A' }, { name: 'كحلي/أبيض', hex: '#1E3A5F' },
      { name: 'أحمر/أبيض', hex: '#EF4444' },
    ],
  },
];

const CATEGORIES = [
  {
    id: 'tshirts', label: 'تيشرتات', emoji: '👕',
    subcategories: [
      { id: 'short-sleeve', label: 'كم قصير' },
      { id: 'long-sleeve', label: 'كم طويل' },
      { id: 'polo', label: 'بولو' },
    ],
  },
  {
    id: 'hoodies', label: 'هوديز', emoji: '🧥',
    subcategories: [
      { id: 'pullover', label: 'بدون زيبر' },
      { id: 'zip', label: 'بزيبر' },
    ],
  },
  {
    id: 'pants', label: 'بناطيل', emoji: '👖',
    subcategories: [
      { id: 'jogger', label: 'جوجر' },
      { id: 'cargo', label: 'كارجو' },
    ],
  },
  {
    id: 'shorts', label: 'شورتات', emoji: '🩳',
    subcategories: [{ id: 'basic', label: 'أساسي' }],
  },
  {
    id: 'jackets', label: 'جاكيتات', emoji: '🧤',
    subcategories: [
      { id: 'bomber', label: 'بومبر' },
      { id: 'varsity', label: 'فارسيتي' },
    ],
  },
];

const COLOR_FAMILIES = [
  { name: 'أسود', hex: '#1A1A1A' },
  { name: 'أبيض', hex: '#F5F5F0', border: true },
  { name: 'رمادي', hex: '#9CA3AF' },
  { name: 'كحلي', hex: '#1E3A5F' },
  { name: 'أزرق', hex: '#3B82F6' },
  { name: 'أحمر', hex: '#EF4444' },
  { name: 'أخضر', hex: '#22C55E' },
  { name: 'وردي', hex: '#EC4899' },
  { name: 'بنفسجي', hex: '#8B5CF6' },
  { name: 'بيج', hex: '#D4B896', border: true },
  { name: 'بني', hex: '#78503A' },
  { name: 'برتقالي', hex: '#F97316' },
];

interface ProductCatalogModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (product: CatalogProduct, color: { name: string; hex: string }) => void;
}

function ProductCard({
  product,
  onSelect,
}: {
  product: CatalogProduct;
  onSelect: (p: CatalogProduct, c: { name: string; hex: string }) => void;
}) {
  const [hovered, setHovered]           = useState(false);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selColor, setSelColor]         = useState(product.colors[0]);

  const displayColor = hoveredColor
    ? product.colors.find(c => c.hex === hoveredColor) ?? selColor
    : selColor;

  const BADGE_COLORS: Record<string, string> = {
    'الأكثر مبيعاً': '#F97316',
    'جديد': C.gold,
    'مميز': '#8B5CF6',
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   C.card,
        border:       `1px solid ${hovered ? C.gold + '60' : C.b1}`,
        borderRadius: 14,
        overflow:     'hidden',
        cursor:       'pointer',
        transition:   'all 0.2s',
        boxShadow:    hovered ? `0 6px 24px ${C.gold}18` : '0 1px 4px rgba(0,0,0,0.04)',
        transform:    hovered ? 'translateY(-2px)' : 'none',
      }}
    >
           {/* معاينة اللون أو الصورة الحقيقية */}
      <div style={{
        aspectRatio:    '4/3',
        background:     product.frontImage ? '#FFFFFF' : displayColor.hex,
        position:       'relative',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        transition:     'background 0.3s',
        borderBottom:   `1px solid ${C.b1}`,
      }}>
        {product.frontImage ? (
          // عرض الصورة الحقيقية لو موجودة
          <img 
            src={product.frontImage} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} 
          />
        ) : (
          // العرض العادي (الألوان وكلمة VŌGU) لو مفيش صورة
          <>
            <span style={{
              position:       'absolute',
              bottom:         8,
              right:          8,
              fontSize:       9,
              color:          displayColor.hex === '#F5F5F0' ? C.t2 : 'rgba(255,255,255,0.85)',
              fontFamily:     'Tajawal, sans-serif',
              background:     'rgba(0,0,0,0.15)',
              padding:        '2px 7px',
              borderRadius:   10,
              backdropFilter: 'blur(4px)',
            }}>
              {displayColor.name}
            </span>

            {product.badge && (
              <span style={{
                position:     'absolute',
                top:          10,
                right:        10,
                background:   BADGE_COLORS[product.badge] ?? C.gold,
                color:        '#fff',
                fontSize:     9,
                fontWeight:   700,
                padding:      '3px 8px',
                borderRadius: 10,
                fontFamily:   'Tajawal, sans-serif',
              }}>
                {product.badge}
              </span>
            )}

            <span style={{
              fontFamily: "'Cormorant Garant', serif",
              fontSize:   52,
              fontWeight: 300,
              color:      displayColor.hex === '#F5F5F0'
                ? 'rgba(0,0,0,0.08)'
                : 'rgba(255,255,255,0.15)',
              userSelect: 'none',
              transition: 'color 0.3s',
            }}>
              VŌGU
            </span>
          </>
        )}
      </div>

      {/* معلومات */}
      <div style={{ padding: '12px 14px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.t1, fontFamily: 'Tajawal, sans-serif', marginBottom: 3 }}>
          {product.name}
        </p>
        <p style={{ fontSize: 11, color: C.t3, fontFamily: 'Tajawal, sans-serif', marginBottom: 8, lineHeight: 1.5 }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <Star size={10} fill={C.gold} color={C.gold} />
          <span style={{ fontSize: 10, color: C.t2, fontFamily: 'Tajawal, sans-serif' }}>
            {product.rating}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
          {product.colors.slice(0, 8).map((c) => (
            <button
              key={c.hex}
              title={c.name}
              onMouseEnter={() => setHoveredColor(c.hex)}
              onMouseLeave={() => setHoveredColor(null)}
              onClick={(e) => { e.stopPropagation(); setSelColor(c); }}
              style={{
                width:        18,
                height:       18,
                borderRadius: '50%',
                background:   c.hex,
                border:       selColor.hex === c.hex ? `2px solid ${C.gold}` : '1.5px solid rgba(0,0,0,0.12)',
                outline:      selColor.hex === c.hex ? `2px solid ${C.gold}40` : 'none',
                outlineOffset: 1,
                cursor:       'pointer',
                transition:   'transform 0.15s',
                transform:    selColor.hex === c.hex ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          ))}
          {product.colors.length > 8 && (
            <span style={{ fontSize: 9, color: C.t3, alignSelf: 'center', fontFamily: 'Tajawal, sans-serif' }}>
              +{product.colors.length - 8}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 17, color: C.gold, fontWeight: 600 }}>
            {product.price.toLocaleString('ar-EG')}
            <span style={{ fontSize: 11, fontFamily: 'Tajawal, sans-serif', marginRight: 2 }}>ج.م</span>
          </span>
          <button
            onClick={() => onSelect(product, selColor)}
            style={{
              background:   `linear-gradient(135deg, ${C.goldL}, ${C.gold})`,
              color:        '#fff',
              border:       'none',
              borderRadius: 8,
              padding:      '6px 14px',
              fontSize:     11,
              fontFamily:   'Tajawal, sans-serif',
              fontWeight:   700,
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              gap:          4,
              transition:   'all 0.15s',
              boxShadow:    `0 3px 10px ${C.gold}30`,
            }}
          >
            <Check size={11} />
            اختر
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalogModal({ open, onClose, onSelect }: ProductCatalogModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [activeCategory,    setActiveCategory]    = useState('tshirts');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQ,           setSearchQ]           = useState('');
  const [colorFilter,       setColorFilter]        = useState<string | null>(null);
  const [expandedCat,       setExpandedCat]        = useState<string | null>('tshirts');
  const [mobileCatOpen,     setMobileCatOpen]     = useState(false);
  
  // 👇 جلب المنتجات من قاعدة البيانات عبر /api/customize
  const [catalogData, setCatalogData] = useState<CatalogProduct[]>(CATALOG_FALLBACK);

    useEffect(() => {
    if (open) {
      fetch("/api/customize")
        .then((res) => res.json())
        .then((data) => {
          const products: any[] = data.products || [];
          if (products.length > 0) {
            // تحويل منتجات الـDB إلى صيغة CatalogProduct
            const mapped: CatalogProduct[] = products.map((db: any) => ({
              id: db.id,
              name: db.label,
              description: `سعر ${db.price} ج.م`,
              category: db.category?.slug || 'other',
              subcategory: '',
              price: Number(db.price) || 299,
              rating: 4.5,
              svgType: db.svgType || 'tshirt',
              colors: Array.isArray(db.colors) && db.colors.length > 0 ? db.colors : CATALOG_FALLBACK[0].colors,
              features: [],
              frontImage: db.frontImage || null,
              backImage: db.backImage || null,
            }));
            setCatalogData(mapped);
          } else {
            // لو مفيش منتجات في الـDB، نستخدم الـfallback
            setCatalogData(CATALOG_FALLBACK);
          }
        })
        .catch(() => setCatalogData(CATALOG_FALLBACK));
    }
  }, [open]);
  // 👆 نهاية الكود الجديد

  const filtered = useMemo(() => {
    // 👇 غيّر CATALOG لـ catalogData هنا
    return catalogData.filter((p) => {
      const matchCat   = p.category === activeCategory || (activeCategory === 'other' && p.category === 'other');
      const matchSub   = !activeSubcategory || p.subcategory === activeSubcategory;
      const matchQ     = !searchQ || p.name.includes(searchQ) || p.description.includes(searchQ);
      const matchColor = !colorFilter || p.colors.some(c => c.hex === colorFilter);
      return matchCat && matchSub && matchQ && matchColor;
    });
  }, [activeCategory, activeSubcategory, searchQ, colorFilter, catalogData]); // 👉 لا تنسى تضيف catalogData في الـ dependencies

  // ... باقي الكود خله زي ما هو ...

  const handleSelect = (product: CatalogProduct, color: { name: string; hex: string }) => {
    onSelect(product, color);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position:       'fixed',
              inset:          0,
              background:     'rgba(26,23,20,0.55)',
              zIndex:         400,
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* ✅ Wrapper للتوسيط — منفصل عن الأنيميشن */}
          <div style={{
            position:       'fixed',
            inset:          0,
            zIndex:         401,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            pointerEvents:  'none',
          }}>
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: isMobile ? 1 : 0.95, y: isMobile ? '100%' : 10 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: isMobile ? 1 : 0.95, y: isMobile ? '100%' : 10 }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              dir="rtl"
              style={{
                width:         isMobile ? '100vw' : 'min(95vw, 1040px)',
                height:        isMobile ? '100vh' : 'min(88vh, 700px)',
                background:    C.bg,
                borderRadius:  isMobile ? 0 : 20,
                boxShadow:     '0 32px 80px rgba(0,0,0,0.28)',
                display:       'flex',
                flexDirection: 'column',
                overflow:      'hidden',
                pointerEvents: 'all',
              }}
            >
              {/* ══ Header ══ */}
              <div style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                flexWrap:       isMobile ? 'wrap' : 'nowrap',
                gap:            isMobile ? 10 : 0,
                padding:        isMobile ? '14px 14px' : '18px 24px',
                borderBottom:   `1px solid ${C.b1}`,
                background:     C.card,
                flexShrink:     0,
              }}>
                <div>
                  <h2 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: isMobile ? 18 : 22, fontWeight: 400, color: C.t1, marginBottom: 2 }}>
                    اختر منتجك
                  </h2>
                  <p style={{ fontSize: isMobile ? 10 : 11, color: C.t3, fontFamily: 'Tajawal, sans-serif' }}>
                    {catalogData.length} منتج جاهز للتخصيص
                  </p>
                </div>

                <div style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          8,
                  background:   C.surf,
                  border:       `1px solid ${C.b2}`,
                  borderRadius: 12,
                  padding:      '8px 14px',
                  flex:         isMobile ? '1 1 100%' : '0 1 240px',
                  order:        isMobile ? 3 : 2,
                }}>
                  <Search size={13} color={C.t3} />
                  <input
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    dir="rtl"
                    style={{
                      background: 'none', border: 'none', outline: 'none',
                      fontSize: 12, color: C.t1, fontFamily: 'Tajawal, sans-serif', flex: 1,
                    }}
                  />
                </div>

                <button
                  onClick={onClose}
                  style={{
                    background: C.surf, border: `1px solid ${C.b2}`,
                    borderRadius: 10, padding: 8, cursor: 'pointer',
                    color: C.t2, display: 'flex',
                    order: isMobile ? 2 : 3,
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* ══ Body ══ */}
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

                {/* Sidebar — Desktop: ثابت | Mobile: Drawer منزلق من اليمين */}
                {isMobile ? (
                  <>
                    {/* زر فتح التصنيفات على الموبايل */}
                    <button
                      onClick={() => setMobileCatOpen(true)}
                      style={{
                        position: 'absolute', top: 8, right: 12, zIndex: 10,
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: C.card, border: `1px solid ${C.b2}`,
                        borderRadius: 20, padding: '6px 12px', cursor: 'pointer',
                        color: C.t1, fontSize: 12, fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    >
                      <span>{CATEGORIES.find(c => c.id === activeCategory)?.emoji}</span>
                      {CATEGORIES.find(c => c.id === activeCategory)?.label}
                      <ChevronLeft size={13} />
                    </button>

                    {/* Drawer منزلق */}
                    <AnimatePresence>
                      {mobileCatOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileCatOpen(false)}
                            style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(0,0,0,0.4)' }}
                          />
                          <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                            style={{
                              position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 21,
                              width: '78%', maxWidth: 280,
                              background: C.card, borderLeft: `1px solid ${C.b1}`,
                              overflowY: 'auto', padding: '12px 0',
                              boxShadow: '-8px 0 24px rgba(0,0,0,0.12)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 10px', borderBottom: `1px solid ${C.b1}`, marginBottom: 8 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: C.t1, fontFamily: 'Tajawal, sans-serif' }}>التصنيفات</span>
                              <button onClick={() => setMobileCatOpen(false)} style={{ background: C.surf, border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.t2 }}>
                                <X size={14} />
                              </button>
                            </div>
                            {CATEGORIES.map((cat) => {
                              const isActive   = activeCategory === cat.id;
                              const isExpanded = expandedCat === cat.id;
                              return (
                                <div key={cat.id}>
                                  <button
                                    onClick={() => {
                                      setActiveCategory(cat.id);
                                      setActiveSubcategory(null);
                                      setExpandedCat(isExpanded ? null : cat.id);
                                    }}
                                    style={{
                                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                      padding: '11px 16px', background: isActive ? `${C.gold}12` : 'none',
                                      border: 'none', borderRight: isActive ? `3px solid ${C.gold}` : '3px solid transparent',
                                      cursor: 'pointer', color: isActive ? C.gold : C.t1,
                                      fontSize: 13, fontFamily: 'Tajawal, sans-serif', fontWeight: isActive ? 700 : 400,
                                      textAlign: 'right', transition: 'all 0.15s',
                                    }}
                                  >
                                    <span>{cat.emoji}</span>
                                    <span style={{ flex: 1 }}>{cat.label}</span>
                                    <ChevronLeft size={13} style={{ transform: isExpanded ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform 0.2s', opacity: 0.4 }} />
                                  </button>
                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                        <button onClick={() => { setActiveSubcategory(null); setMobileCatOpen(false); }} style={{ width: '100%', textAlign: 'right', padding: '8px 16px 8px 12px', paddingRight: 40, background: !activeSubcategory && isActive ? `${C.gold}08` : 'none', border: 'none', color: !activeSubcategory && isActive ? C.gold : C.t2, fontSize: 12, fontFamily: 'Tajawal, sans-serif', cursor: 'pointer' }}>الكل</button>
                                        {cat.subcategories.map((sub) => (
                                          <button key={sub.id} onClick={() => { setActiveCategory(cat.id); setActiveSubcategory(sub.id); setMobileCatOpen(false); }} style={{ width: '100%', textAlign: 'right', padding: '8px 16px 8px 12px', paddingRight: 40, background: activeSubcategory === sub.id ? `${C.gold}08` : 'none', border: 'none', color: activeSubcategory === sub.id ? C.gold : C.t2, fontSize: 12, fontFamily: 'Tajawal, sans-serif', cursor: 'pointer', transition: 'all 0.15s' }}>{sub.label}</button>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                <div style={{
                  width: 220, borderLeft: `1px solid ${C.b1}`,
                  background: C.card, overflowY: 'auto',
                  flexShrink: 0, padding: '12px 0',
                }}>
                  {CATEGORIES.map((cat) => {
                    const isActive   = activeCategory === cat.id;
                    const isExpanded = expandedCat === cat.id;
                    return (
                      <div key={cat.id}>
                        <button
                          onClick={() => {
                            setActiveCategory(cat.id);
                            setActiveSubcategory(null);
                            setExpandedCat(isExpanded ? null : cat.id);
                          }}
                          style={{
                            width:        '100%',
                            display:      'flex',
                            alignItems:   'center',
                            gap:          10,
                            padding:      '10px 16px',
                            background:   isActive ? `${C.gold}12` : 'none',
                            border:       'none',
                            borderRight:  isActive ? `3px solid ${C.gold}` : '3px solid transparent',
                            cursor:       'pointer',
                            color:        isActive ? C.gold : C.t1,
                            fontSize:     13,
                            fontFamily:   'Tajawal, sans-serif',
                            fontWeight:   isActive ? 700 : 400,
                            textAlign:    'right',
                            transition:   'all 0.15s',
                          }}
                        >
                          <span>{cat.emoji}</span>
                          <span style={{ flex: 1 }}>{cat.label}</span>
                          <ChevronLeft
                            size={13}
                            style={{
                              transform:  isExpanded ? 'rotate(-90deg)' : 'rotate(0)',
                              transition: 'transform 0.2s',
                              opacity:    0.4,
                            }}
                          />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <button
                                onClick={() => setActiveSubcategory(null)}
                                style={{
                                  width: '100%', textAlign: 'right',
                                  padding: '7px 16px 7px 12px', paddingRight: 40,
                                  background: !activeSubcategory && isActive ? `${C.gold}08` : 'none',
                                  border: 'none',
                                  color: !activeSubcategory && isActive ? C.gold : C.t2,
                                  fontSize: 12, fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
                                }}
                              >
                                الكل
                              </button>
                              {cat.subcategories.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() => { setActiveCategory(cat.id); setActiveSubcategory(sub.id); }}
                                  style={{
                                    width: '100%', textAlign: 'right',
                                    padding: '7px 16px 7px 12px', paddingRight: 40,
                                    background: activeSubcategory === sub.id ? `${C.gold}08` : 'none',
                                    border: 'none',
                                    color: activeSubcategory === sub.id ? C.gold : C.t2,
                                    fontSize: 12, fontFamily: 'Tajawal, sans-serif',
                                    cursor: 'pointer', transition: 'all 0.15s',
                                  }}
                                >
                                  {sub.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
                )}

                {/* المنطقة الرئيسية */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                  {/* فلتر الألوان */}
                  <div style={{
                    padding: isMobile ? '48px 12px 10px' : '12px 20px', borderBottom: `1px solid ${C.b1}`,
                    background: C.card, display: 'flex', alignItems: 'center',
                    gap: 8, flexWrap: 'wrap', flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 11, color: C.t3, fontFamily: 'Tajawal, sans-serif', marginLeft: 4 }}>
                      اللون:
                    </span>
                    <button
                      onClick={() => setColorFilter(null)}
                      style={{
                        fontSize: 11, fontFamily: 'Tajawal, sans-serif',
                        padding: '3px 10px', borderRadius: 10,
                        border: `1px solid ${!colorFilter ? C.gold : C.b2}`,
                        background: !colorFilter ? `${C.gold}15` : 'none',
                        color: !colorFilter ? C.gold : C.t2, cursor: 'pointer',
                      }}
                    >
                      الكل
                    </button>
                    {COLOR_FAMILIES.map((cf) => (
                      <button
                        key={cf.hex}
                        title={cf.name}
                        onClick={() => setColorFilter(colorFilter === cf.hex ? null : cf.hex)}
                        style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: cf.hex,
                          border: colorFilter === cf.hex
                            ? `2px solid ${C.gold}`
                            : `1.5px solid ${(cf as any).border ? C.b2 : 'transparent'}`,
                          outline: colorFilter === cf.hex ? `2px solid ${C.gold}40` : 'none',
                          outlineOffset: 1, cursor: 'pointer',
                          transform: colorFilter === cf.hex ? 'scale(1.2)' : 'scale(1)',
                          transition: 'transform 0.15s',
                        }}
                      />
                    ))}
                    <span style={{ fontSize: 11, color: C.t3, fontFamily: 'Tajawal, sans-serif', marginRight: 'auto' }}>
                      {filtered.length} منتج
                    </span>
                  </div>

                  {/* شبكة المنتجات */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {filtered.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                        <p style={{ fontSize: 14, color: C.t2, fontFamily: 'Tajawal, sans-serif' }}>
                          لا توجد منتجات مطابقة
                        </p>
                        <button
                          onClick={() => { setSearchQ(''); setColorFilter(null); setActiveSubcategory(null); }}
                          style={{
                            marginTop: 12, fontSize: 12, color: C.gold,
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontFamily: 'Tajawal, sans-serif', textDecoration: 'underline',
                          }}
                        >
                          مسح الفلاتر
                        </button>
                      </div>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: 16,
                      }}>
                        {filtered.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onSelect={handleSelect}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}