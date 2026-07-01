'use client';

// src/components/shop/SubcategoryNav.tsx
// شريط الفئات الفرعية — مع Dropdown يحسب موضعه ديناميكياً (لا يُقطع أبداً)

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── الألوان — ثيم فاتح ──────────────────────────────────────
const C = {
  surf: '#F5F3EF',
  card: '#FAFAF8',
  b1:   '#EAE7E1',
  b2:   '#DDD9D1',
  gold: '#A8823C',
  t1:   '#1A1714',
  t2:   '#6B6560',
  t3:   '#A39E96',
} as const;

// ── بيانات الفئات الفرعية ────────────────────────────────
const SUBCATEGORIES: Record<
  string,
  { id: string; label: string; subs?: string[] }[]
> = {
  all: [
    { id: 'new',     label: 'وصل حديثاً',   subs: ['هذا الأسبوع', 'هذا الشهر']                   },
    { id: 'best',    label: 'الأكثر مبيعاً', subs: ['الأعلى تقييماً', 'الأكثر طلباً']              },
    { id: 'sale',    label: 'تخفيضات',       subs: ['خصم ٢٠٪', 'خصم ٤٠٪', 'خصم ٦٠٪']              },
    { id: 'brands',  label: 'الماركات',      subs: ['VŌGU Luxe', 'VŌGU Studio', 'VŌGU Couture']    },
  ],
  women: [
    { id: 'dresses',     label: 'فساتين',           subs: ['سهرة', 'كاجوال', 'مناسبات', 'صيفي']     },
    { id: 'tops',        label: 'بلايز وتيشرتات',   subs: ['كلاسيك', 'كروب', 'بوف سليف', 'أوف شولدر'] },
    { id: 'skirts',      label: 'تنانير',           subs: ['قصيرة', 'ميدي', 'طويلة', 'مطوية']       },
    { id: 'jackets',     label: 'جاكيتات ومعاطف',   subs: ['بليزر', 'معطف صوف', 'كارديجان', 'بومبر']  },
    { id: 'pants',       label: 'بناطيل',           subs: ['جينز', 'كتان', 'بوت كت', 'واسع']        },
    { id: 'accessories', label: 'إكسسوارات',        subs: ['حقائب', 'أحزمة', 'مجوهرات', 'أوشحة']   },
  ],
  men: [
    { id: 'tshirts',     label: 'تيشرتات',         subs: ['كلاسيك', 'ضيق', 'واسع', 'V-neck', 'هينلي'] },
    { id: 'shirts',      label: 'قمصان',           subs: ['رسمي', 'كاجوال', 'أكسفورد', 'لينن']         },
    { id: 'pullovers',   label: 'بلوفرات',         subs: ['صوف', 'كشمير', 'قطن', 'كرو نيك']            },
    { id: 'jackets',     label: 'جاكيتات ومعاطف', subs: ['بليزر', 'معطف صوف', 'بومبر', 'سترة رياضية']  },
    { id: 'pants',       label: 'بناطيل',         subs: ['جينز', 'شينو', 'كلاسيك', 'جوجر']             },
    { id: 'accessories', label: 'إكسسوارات',      subs: ['أحزمة', 'ساعات', 'نظارات', 'قبعات']          },
  ],
  kids: [
    { id: 'girls',    label: 'بنات',      subs: ['فساتين', 'تيشرتات', 'بناطيل', 'طقم']  },
    { id: 'boys',     label: 'أولاد',     subs: ['تيشرتات', 'بناطيل', 'جاكيتات', 'طقم'] },
    { id: 'babies',   label: 'مواليد',   subs: ['٠-٦ أشهر', '٦-١٢ شهر', '١-٢ سنة']    },
    { id: 'shoes',    label: 'أحذية',    subs: ['رياضي', 'كاجوال', 'رسمي']              },
    { id: 'uniforms', label: 'يونيفورم', subs: ['مدرسي', 'رياضي']                       },
  ],
  sale: [
    { id: 'up20',   label: 'خصم يصل ٢٠٪',   subs: ['نساء', 'رجال', 'أطفال']       },
    { id: 'up40',   label: 'خصم يصل ٤٠٪',   subs: ['فساتين', 'جاكيتات', 'إكسسوارات'] },
    { id: 'up60',   label: 'خصم يصل ٦٠٪',   subs: ['تصفية نهاية الموسم']            },
    { id: 'flash',  label: 'عروض محدودة ⚡',  subs: ['عرض اليوم', 'آخر قطع']          },
  ],
};

interface DropdownPos {
  top:   number;
  right: number;
}

// ══════════════════════════════════════════════════════════
export default function SubcategoryNav() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const activeCat  = searchParams.get('cat') || searchParams.get('category') || 'all';
  const activeSub  = searchParams.get('sub') || '';

  const [hoverId, setHoverId]         = useState<string | null>(null);
  const [pos,     setPos]             = useState<DropdownPos>({ top: 0, right: 0 });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subcats = SUBCATEGORIES[activeCat] ?? SUBCATEGORIES['all'];
  if (!subcats.length) return null;

  const navigate = (subId: string, sub?: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set('sub', subId);
    if (sub) p.set('subsub', sub);
    else      p.delete('subsub');
    router.push(`/shop?${p}`);
  };

  // ── فتح الـ dropdown مع حساب موضعه الحقيقي على الشاشة ──────
  const openDropdown = (catId: string, el: HTMLElement) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const rect = el.getBoundingClientRect();
    setPos({
      top:   rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
    setHoverId(catId);
  };

  // ── غلق بتأخير بسيط (يسمح بالحركة من الزر للقائمة بدون اختفاء) ──
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setHoverId(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const activeCatData = subcats.find((c) => c.id === hoverId);

  return (
    <div
      dir="rtl"
      style={{
        background:   C.card,
        borderBottom: `1px solid ${C.b1}`,
        position:     'relative',
        zIndex:        90,
      }}
    >
      <div
        style={{
          display:        'flex',
          justifyContent: 'center',
          overflowX:      'auto',
          overflowY:      'visible',
          scrollbarWidth: 'none',
          maxWidth:       1400,
          margin:         '0 auto',
          padding:        '0 16px',
        }}
      >
        {subcats.map((cat) => {
          const isActive = activeSub === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => navigate(cat.id)}
              onMouseEnter={(e) => openDropdown(cat.id, e.currentTarget)}
              onMouseLeave={scheduleClose}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          4,
                background:   'none',
                border:       'none',
                borderBottom: isActive
                  ? `2px solid ${C.gold}`
                  : '2px solid transparent',
                color:        C.gold,
                fontFamily:   'Tajawal, sans-serif',
                fontSize:     13,
                fontWeight:   isActive ? 700 : 500,
                padding:      '12px 16px',
                cursor:       'pointer',
                whiteSpace:   'nowrap',
                transition:   'all 0.2s',
                opacity:      isActive ? 1 : 0.85,
                flexShrink:   0,
              }}
            >
              {cat.label}
              {cat.subs && cat.subs.length > 0 && (
                <ChevronDown
                  size={11}
                  style={{
                    transition: 'transform 0.2s',
                    transform:  hoverId === cat.id ? 'rotate(180deg)' : 'rotate(0)',
                    opacity:    0.7,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════
          الـ Dropdown — يُرسم خارج الصف القابل للسكرول
          بموضع fixed محسوب بدقة، فلا يُقطع أبداً
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeCatData?.subs && activeCatData.subs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            style={{
              position:     'fixed',
              top:          pos.top,
              right:        pos.right,
              background:   C.card,
              border:       `1px solid ${C.b2}`,
              borderRadius: 10,
              minWidth:     150,
              padding:      '6px 0',
              boxShadow:    '0 10px 30px rgba(26,23,20,0.16)',
              zIndex:       300,
            }}
          >
            {activeCatData.subs.map((sub) => (
              <button
                key={sub}
                onClick={() => navigate(activeCatData.id, sub)}
                style={{
                  display:    'block',
                  width:      '100%',
                  textAlign:  'right',
                  background: 'none',
                  border:     'none',
                  padding:    '9px 16px',
                  color:      C.gold,
                  fontSize:   12,
                  fontFamily: 'Tajawal, sans-serif',
                  cursor:     'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  opacity:    0.8,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity    = '1';
                  (e.currentTarget as HTMLElement).style.background = C.surf;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity    = '0.8';
                  (e.currentTarget as HTMLElement).style.background = 'none';
                }}
              >
                {sub}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}