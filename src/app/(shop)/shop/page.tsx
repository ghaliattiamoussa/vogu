'use client';

// src/app/(shop)/shop/page.tsx
import SubcategoryNav from '@/components/shop/SubcategoryNav';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/shop/ProductCard';

// ── الألوان — ثيم فاتح (مطابقة لـ tailwind.config.ts) ──────────────
const C = {
  bg:   '#FAFAF8',
  surf: '#F5F3EF',
  card: '#FFFFFF',
  b1:   '#EAE7E1',
  b2:   '#DDD9D1',
  gold: '#A8823C',
  t1:   '#1A1714',
  t2:   '#6B6560',
  t3:   '#A39E96',
} as const;

// ── البيانات ─────────────────────────────────────────────
const SORT_OPTIONS = [
  { id: 'new',        label: 'الأحدث'              },
  { id: 'popular',    label: 'الأكثر مبيعاً'        },
  { id: 'rating',     label: 'الأعلى تقييماً'       },
  { id: 'price_asc',  label: 'السعر: الأقل أولاً'  },
  { id: 'price_desc', label: 'السعر: الأعلى أولاً' },
];

const SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PRICES = [
  { id: 'all',  label: 'الكل'            , min: 0,    max: 99999 },
  { id: 'p1',   label: 'أقل من ٥٠٠ ج.م' , min: 0,    max: 500   },
  { id: 'p2',   label: '٥٠٠ – ١٠٠٠ ج.م' , min: 500,  max: 1000  },
  { id: 'p3',   label: '١٠٠٠ – ٢٠٠٠ ج.م', min: 1000, max: 2000  },
  { id: 'p4',   label: 'أكثر من ٢٠٠٠ ج.م', min: 2000, max: 99999 },
];

// ══════════════════════════════════════════════════════════
function ShopContent() {
  const router      = useRouter();
  const searchParams = useSearchParams();

  const activeCat  = searchParams.get('cat')  || 'all';
  const activeSort = searchParams.get('sort') || 'new';
  const activeQ    = searchParams.get('q')    || '';

  const [products,      setProducts]      = useState<any[]>([]);
  const [total,         setTotal]         = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [sortOpen,      setSortOpen]      = useState(false);
  const [searchVal,     setSearchVal]     = useState(activeQ);

  // فلاتر
  const [selSizes,  setSelSizes]  = useState<string[]>([]);
  const [selPrice,  setSelPrice]  = useState('all');
  const [onlyNew,   setOnlyNew]   = useState(false);
  const [onlySale,  setOnlySale]  = useState(false);

  // جلب المنتجات
const fetchProducts = useCallback(async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    if (activeCat !== 'all') params.set('category', activeCat);
    if (activeSort)          params.set('sort', activeSort);
    if (activeQ)             params.set('q', activeQ);
    if (onlyNew)             params.set('isNew', 'true');
    if (onlySale)            params.set('onSale', 'true');
    if (selSizes.length)     params.set('sizes', selSizes.join(','));
    const priceObj = PRICES.find(p => p.id === selPrice);
    if (priceObj && selPrice !== 'all') {
      params.set('minPrice', String(priceObj.min));
      params.set('maxPrice', String(priceObj.max));
    }

    const res  = await fetch(`/api/products?${params}`);
    const data = await res.json();

    const raw = data.products ?? [];

    const mapped = raw.map((p: any) => ({
      id:            p.id,
      nameAr:        p.nameAr        ?? '',
      nameEn:        p.nameEn        ?? '',
      brand:         p.brand         ?? '',
      price:         p.price         ?? 0,
      compareAtPrice: p.origPrice ?? null,
      rating:        p.rating        ?? 0,
      reviewCount:   p._count?.reviews ?? 0,
      isNew:         p.isNew         ?? false,
      onSale:         p.origPrice ? p.price < p.origPrice : false,
      stock:          (p.variants ?? []).reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0),
      images:         (p.images ?? [])
                        .map((img: any) => typeof img === 'string' ? img : (img.url ?? ''))
                        .filter(Boolean),
      variants: (p.variants ?? []).map((v: any) => ({
        size:     v.size     ?? '',
        color:    v.color    ?? '',
        colorHex: v.colorHex ?? '#000',
        stock:    v.stock    ?? 0,
      })),
    }));

    setProducts(mapped);
    setTotal(data.pagination?.total ?? raw.length);

  } catch (err) {
    console.error('Fetch error:', err);
    setProducts([]);
  } finally {
    setLoading(false);
  }
}, [activeCat, activeSort, activeQ, selSizes, selPrice, onlyNew, onlySale]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // تغيير الفئة
  const handleCat = (id: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (id === 'all') p.delete('cat'); else p.set('cat', id);
    router.push(`/shop?${p}`);
  };

  // تغيير الترتيب
  const handleSort = (id: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set('sort', id);
    router.push(`/shop?${p}`);
    setSortOpen(false);
  };

  // البحث
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams.toString());
    if (searchVal.trim()) p.set('q', searchVal.trim());
    else p.delete('q');
    router.push(`/shop?${p}`);
  };

  // عدد الفلاتر النشطة
  const activeFilters =
    selSizes.length +
    (selPrice !== 'all' ? 1 : 0) +
    (onlyNew ? 1 : 0) +
    (onlySale ? 1 : 0);

  return (
    <div dir="rtl" style={{ background: C.bg, minHeight: '100vh' }}>

     <SubcategoryNav />

      {/* ══ شريط الأدوات ══ */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '14px 20px',
          borderBottom:   `1px solid ${C.b1}`,
          gap:            12,
          flexWrap:       'wrap',
        }}
      >
        {/* يمين: زر الفلتر + الترتيب */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* ── زر الفلتر ── */}
          <button
            onClick={() => setFilterOpen(true)}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          7,
              background:   activeFilters > 0 ? C.gold + '18' : C.card,
              border:       `1px solid ${activeFilters > 0 ? C.gold + '55' : C.b2}`,
              borderRadius: 9,
              padding:      '8px 14px',
              color:        activeFilters > 0 ? C.gold : C.t2,
              fontSize:     13,
              fontFamily:   'Tajawal, sans-serif',
              cursor:       'pointer',
              transition:   'all 0.2s',
              position:     'relative',
            }}
          >
            <SlidersHorizontal size={14} />
            <span>فلترة</span>
            {activeFilters > 0 && (
              <span
                style={{
                  background:     C.gold,
                  color:          '#FFFFFF',
                  borderRadius:   '50%',
                  width:          17,
                  height:         17,
                  fontSize:       10,
                  fontWeight:     700,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontFamily:     'Tajawal, sans-serif',
                }}
              >
                {activeFilters}
              </span>
            )}
          </button>

          {/* ── الترتيب ── */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setSortOpen((v) => !v)}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        6,
                background: C.card,
                border:     `1px solid ${C.b2}`,
                borderRadius: 9,
                padding:    '8px 12px',
                color:      C.t2,
                fontSize:   12,
                fontFamily: 'Tajawal, sans-serif',
                cursor:     'pointer',
              }}
            >
              <span>{SORT_OPTIONS.find(s => s.id === activeSort)?.label ?? 'الأحدث'}</span>
              <ChevronDown size={13} />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  style={{
                    position:     'absolute',
                    top:          '110%',
                    right:        0,
                    background:   C.card,
                    border:       `1px solid ${C.b2}`,
                    borderRadius: 9,
                    overflow:     'hidden',
                    zIndex:       50,
                    minWidth:     170,
                    boxShadow:    '0 8px 24px rgba(0,0,0,0.10)',
                  }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSort(opt.id)}
                      style={{
                        display:    'block',
                        width:      '100%',
                        textAlign:  'right',
                        background: activeSort === opt.id ? C.gold + '15' : 'none',
                        border:     'none',
                        padding:    '10px 14px',
                        color:      activeSort === opt.id ? C.gold : C.t2,
                        fontSize:   12,
                        fontFamily: 'Tajawal, sans-serif',
                        cursor:     'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* وسط: البحث */}
        <form
          onSubmit={handleSearch}
          style={{
            display:      'flex',
            alignItems:   'center',
            background:   C.card,
            border:       `1px solid ${C.b2}`,
            borderRadius: 9,
            padding:      '6px 12px',
            gap:          8,
            flex:         '0 1 260px',
          }}
        >
          <Search size={13} color={C.t3} />
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="ابحث في المنتجات..."
            dir="rtl"
            style={{
              background: 'none',
              border:     'none',
              outline:    'none',
              color:      C.t1,
              fontSize:   12,
              fontFamily: 'Tajawal, sans-serif',
              flex:       1,
            }}
          />
        </form>

        {/* يسار: عدد المنتجات */}
        <span
          style={{
            fontSize:   12,
            color:      C.t3,
            fontFamily: 'Tajawal, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? '...' : `${total} منتج`}
        </span>
      </div>

      {/* ══ شبكة المنتجات — نمط Dalydress: بدون فجوات، حافة-لحافة ══ */}
      <style>{`
        .vogu-product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0;
        }
        @media (min-width: 640px) {
          .vogu-product-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1100px) {
          .vogu-product-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      <div style={{ maxWidth: 1800, margin: '0 auto' }}>
        {loading ? (
          /* Skeleton */
          <div className="vogu-product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background:  C.surf,
                  aspectRatio: '3 / 4',
                  animation:   'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          /* لا يوجد منتجات */
          <div
            style={{
              textAlign:      'center',
              padding:        '80px 20px',
              color:          C.t3,
              fontFamily:     'Tajawal, sans-serif',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 16, color: C.t2, marginBottom: 8 }}>
              لا توجد منتجات مطابقة
            </p>
            <p style={{ fontSize: 13 }}>جرّب تغيير الفلاتر أو البحث بكلمة أخرى</p>
          </div>
        ) : (
          <div className="vogu-product-grid">
           {products.map((product) => (
<ProductCard key={product.id} product={product} />
))}
          </div>
        )}
      </div>

      {/* ══ Filter Drawer ══ */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              style={{
                position:       'fixed',
                inset:          0,
                background:     'rgba(26,23,20,0.45)',
                zIndex:         200,
                backdropFilter: 'blur(4px)',
              }}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              dir="rtl"
              style={{
                position:      'fixed',
                right:         0,
                top:           0,
                bottom:        0,
                width:         300,
                background:    C.surf,
                zIndex:        201,
                display:       'flex',
                flexDirection: 'column',
                borderLeft:    `1px solid ${C.b2}`,
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding:        '16px 18px',
                  borderBottom:   `1px solid ${C.b1}`,
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'center',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    fontSize:   16,
                    fontWeight: 700,
                    color:      C.t1,
                  }}
                >
                  الفلاتر
                  {activeFilters > 0 && (
                    <span
                      style={{
                        marginRight:    8,
                        background:     C.gold,
                        color:          '#FFFFFF',
                        borderRadius:   '50%',
                        width:          18,
                        height:         18,
                        fontSize:       10,
                        fontWeight:     700,
                        display:        'inline-flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        verticalAlign:  'middle',
                      }}
                    >
                      {activeFilters}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setFilterOpen(false)}
                  style={{
                    background:   C.card,
                    border:       `1px solid ${C.b2}`,
                    borderRadius: 7,
                    padding:      6,
                    cursor:       'pointer',
                    color:        C.t2,
                    display:      'flex',
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* محتوى الفلاتر */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>

                {/* السعر */}
                <FilterSection title="السعر">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {PRICES.map((p) => (
                      <label
                        key={p.id}
                        style={{
                          display:    'flex',
                          alignItems: 'center',
                          gap:        9,
                          cursor:     'pointer',
                        }}
                      >
                        <div
                          onClick={() => setSelPrice(p.id)}
                          style={{
                            width:          16,
                            height:         16,
                            borderRadius:   '50%',
                            border:         `2px solid ${selPrice === p.id ? C.gold : C.b2}`,
                            background:     selPrice === p.id ? C.gold : 'none',
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            cursor:         'pointer',
                            flexShrink:     0,
                            transition:     'all 0.2s',
                          }}
                        />
                        <span
                          style={{
                            fontSize:   12,
                            color:      selPrice === p.id ? C.t1 : C.t2,
                            fontFamily: 'Tajawal, sans-serif',
                          }}
                        >
                          {p.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* المقاس */}
                <FilterSection title="المقاس">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {SIZES.map((size) => {
                      const sel = selSizes.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() =>
                            setSelSizes((prev) =>
                              sel ? prev.filter((s) => s !== size) : [...prev, size],
                            )
                          }
                          style={{
                            background:   sel ? C.gold + '22' : C.card,
                            border:       `1px solid ${sel ? C.gold : C.b2}`,
                            borderRadius: 7,
                            padding:      '6px 12px',
                            color:        sel ? C.gold : C.t2,
                            fontSize:     12,
                            fontFamily:   'Tajawal, sans-serif',
                            cursor:       'pointer',
                            transition:   'all 0.2s',
                          }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </FilterSection>

                {/* عرض */}
                <FilterSection title="عرض">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { val: onlyNew,  set: setOnlyNew,  label: 'وصل حديثاً' },
                      { val: onlySale, set: setOnlySale, label: 'تخفيضات فقط' },
                    ].map(({ val, set, label }) => (
                      <label
                        key={label}
                        onClick={() => set((v) => !v)}
                        style={{
                          display:    'flex',
                          alignItems: 'center',
                          gap:        9,
                          cursor:     'pointer',
                        }}
                      >
                        <div
                          style={{
                            width:          16,
                            height:         16,
                            borderRadius:   4,
                            border:         `2px solid ${val ? C.gold : C.b2}`,
                            background:     val ? C.gold : 'none',
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            flexShrink:     0,
                            transition:     'all 0.2s',
                          }}
                        >
                          {val && <Check size={9} color="#FFFFFF" />}
                        </div>
                        <span
                          style={{
                            fontSize:   12,
                            color:      val ? C.t1 : C.t2,
                            fontFamily: 'Tajawal, sans-serif',
                          }}
                        >
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              </div>

              {/* أزرار */}
              <div
                style={{
                  padding:    '14px 18px',
                  borderTop:  `1px solid ${C.b1}`,
                  display:    'flex',
                  gap:        10,
                }}
              >
                <button
                  onClick={() => {
                    setSelSizes([]);
                    setSelPrice('all');
                    setOnlyNew(false);
                    setOnlySale(false);
                  }}
                  style={{
                    flex:         1,
                    background:   'none',
                    border:       `1px solid ${C.b2}`,
                    borderRadius: 9,
                    padding:      '10px',
                    color:        C.t2,
                    fontSize:     13,
                    fontFamily:   'Tajawal, sans-serif',
                    cursor:       'pointer',
                  }}
                >
                  إعادة ضبط
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  style={{
                    flex:         2,
                    background:   C.gold,
                    border:       'none',
                    borderRadius: 9,
                    padding:      '10px',
                    color:        '#FFFFFF',
                    fontSize:     13,
                    fontFamily:   'Tajawal, sans-serif',
                    fontWeight:   700,
                    cursor:       'pointer',
                  }}
                >
                  عرض النتائج {total > 0 && `(${total})`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* إغلاق dropdown الترتيب عند الضغط خارجه */}
      {sortOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 49 }}
          onClick={() => setSortOpen(false)}
        />
      )}
    </div>
  );
}

// مكوّن مساعد لقسم الفلتر
function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h4
        style={{
          fontSize:      12,
          color:         C.t1,
          fontFamily:    'Tajawal, sans-serif',
          fontWeight:    700,
          marginBottom:  12,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h4>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#FAFAF8', minHeight: '100vh' }} />
    }>
      <ShopContent />
    </Suspense>
  );
}