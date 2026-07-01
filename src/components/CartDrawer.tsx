'use client';

// src/components/CartDrawer.tsx

import { useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';

// ── الألوان ─────────────────────────────────────────────
const C = {
  bg:   '#070707',
  surf: '#0D0D0D',
  card: '#121212',
  b1:   '#1A1A1A',
  b2:   '#262626',
  gold: '#C9A86E',
  t1:   '#EDE8DF',
  t2:   '#8A8480',
  t3:   '#484542',
  ok:   '#5CB87A',
  err:  '#D07070',
} as const;

// ── أكواد الخصم المتاحة (مؤقتاً frontend — لاحقاً API) ──
const VALID_COUPONS: Record<string, number> = {
  VOGU2025: 15,
  SALE10:   10,
  VIP20:    20,
};

// ── تنسيق السعر بالجنيه المصري ──────────────────────────
const fmtPrice = (n: number) => n.toLocaleString('ar-EG') + ' ج.م';

// ── Props ────────────────────────────────────────────────
interface CartDrawerProps {
  open:    boolean;
  onClose: () => void;
}

// ══════════════════════════════════════════════════════════
export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [couponCode,    setCouponCode]    = useState('');
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponError,   setCouponError]   = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // ── Zustand ──
  const items          = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem     = useCartStore((s) => s.removeItem);
  const clearCart      = useCartStore((s) => s.clearCart);

  // ── الحسابات ──
  const totalItems    = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal      = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountPct   = couponApplied ? VALID_COUPONS[couponApplied] : 0;
  const discountAmt   = Math.round((subtotal * discountPct) / 100);
  const shippingFree  = subtotal >= 500;
  const total         = subtotal - discountAmt;

  // ── تطبيق كود الخصم ──
  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError('');

    // محاكاة تأخير API
    await new Promise((r) => setTimeout(r, 600));

    if (VALID_COUPONS[code]) {
      setCouponApplied(code);
      setCouponError('');
    } else {
      setCouponError('كود الخصم غير صحيح أو منتهي الصلاحية');
      setCouponApplied(null);
    }
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponCode('');
    setCouponError('');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Overlay الخلفية ── */}
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position:       'fixed',
              inset:          0,
              background:     'rgba(0,0,0,0.72)',
              zIndex:         200,
              backdropFilter: 'blur(5px)',
            }}
          />

          {/* ── الـ Drawer Panel ── */}
          <motion.div
            key="cart-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            dir="rtl"
            style={{
              position:     'fixed',
              left:         0,
              top:          0,
              bottom:       0,
              width:        Math.min(390, typeof window !== 'undefined' ? window.innerWidth : 390),
              background:   C.surf,
              zIndex:       201,
              display:      'flex',
              flexDirection:'column',
              borderRight:  `1px solid ${C.b2}`,
              overflowY:    'hidden',
            }}
          >

            {/* ═══ Header ═══ */}
            <div
              style={{
                padding:         '16px',
                borderBottom:    `1px solid ${C.b1}`,
                display:         'flex',
                justifyContent:  'space-between',
                alignItems:      'center',
                flexShrink:      0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingBag size={17} color={C.gold} />
                <h2
                  style={{
                    fontFamily: "'Cormorant Garant', serif",
                    fontSize:   18,
                    fontWeight: 400,
                    color:      C.t1,
                  }}
                >
                  سلة التسوق
                </h2>
                {totalItems > 0 && (
                  <span
                    style={{
                      background:     C.gold,
                      color:          '#060606',
                      borderRadius:   '50%',
                      width:          20,
                      height:         20,
                      fontSize:       11,
                      fontWeight:     700,
                      fontFamily:     'Tajawal, sans-serif',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                aria-label="إغلاق السلة"
                style={{
                  background:   C.card,
                  border:       `1px solid ${C.b2}`,
                  borderRadius: 7,
                  padding:      7,
                  cursor:       'pointer',
                  color:        C.t2,
                  display:      'flex',
                  transition:   'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.t1)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.t2)}
              >
                <X size={14} />
              </button>
            </div>

            {/* ═══ الجسم: فارغة أم فيها منتجات ═══ */}
            {items.length === 0 ? (

              /* ── حالة السلة الفارغة ── */
              <div
                style={{
                  flex:           1,
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            16,
                  padding:        32,
                  textAlign:      'center',
                }}
              >
                <div
                  style={{
                    width:          70,
                    height:         70,
                    borderRadius:   '50%',
                    background:     C.card,
                    border:         `1px solid ${C.b1}`,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingBag size={28} color={C.t3} />
                </div>
                <p
                  style={{
                    fontSize:   15,
                    color:      C.t2,
                    fontFamily: 'Tajawal, sans-serif',
                  }}
                >
                  سلتك فارغة
                </p>
                <p
                  style={{
                    fontSize:   12,
                    color:      C.t3,
                    fontFamily: 'Tajawal, sans-serif',
                    lineHeight: 1.7,
                    maxWidth:   220,
                  }}
                >
                  أضف بعض القطع الرائعة من تشكيلاتنا الفاخرة
                </p>
                <button
                  onClick={onClose}
                  style={{
                    background:   C.gold,
                    color:        '#060606',
                    border:       'none',
                    borderRadius: 8,
                    padding:      '10px 26px',
                    fontSize:     12,
                    fontFamily:   'Tajawal, sans-serif',
                    fontWeight:   700,
                    cursor:       'pointer',
                    display:      'flex',
                    alignItems:   'center',
                    gap:          6,
                  }}
                >
                  تسوق الآن
                  <ChevronLeft size={14} />
                </button>
              </div>

            ) : (
              <>
                {/* ── قائمة المنتجات ── */}
                <div
                  style={{
                    flex:      1,
                    overflowY: 'auto',
                    padding:   '8px 12px',
                  }}
                >
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      style={{
                        display:      'flex',
                        gap:          11,
                        padding:      '12px 0',
                        borderBottom: `1px solid ${C.b1}`,
                      }}
                    >
                      {/* صورة / تدرج المنتج */}
                      <div
                        style={{
                          width:        62,
                          height:       78,
                          borderRadius: 9,
                          background:   item.grad || `linear-gradient(135deg, ${C.card}, ${C.b1})`,
                          flexShrink:   0,
                          overflow:     'hidden',
                          position:     'relative',
                        }}
                      >
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.nameAr}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>

                      {/* تفاصيل المنتج */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize:   10,
                            color:      C.t3,
                            fontFamily: 'Tajawal, sans-serif',
                            marginBottom: 2,
                          }}
                        >
                          {item.brand}
                        </p>
                        <p
                          style={{
                            fontSize:     12,
                            color:        C.t1,
                            fontFamily:   'Tajawal, sans-serif',
                            fontWeight:   500,
                            lineHeight:   1.4,
                            marginBottom: 6,
                            // اقتطاع النص الطويل
                            overflow:     'hidden',
                            display:      '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          } as React.CSSProperties}
                        >
                          {item.nameAr}
                        </p>

                        {/* المقاس واللون */}
                        <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                          {[item.size, item.color].filter(Boolean).map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize:     10,
                                color:        C.t3,
                                fontFamily:   'Tajawal, sans-serif',
                                background:   C.card,
                                padding:      '2px 7px',
                                borderRadius: 4,
                                border:       `1px solid ${C.b2}`,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* الكمية + السعر + حذف */}
                        <div
                          style={{
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          {/* أزرار الكمية */}
                          <div
                            style={{
                              display:      'flex',
                              alignItems:   'center',
                              border:       `1px solid ${C.b2}`,
                              borderRadius: 6,
                              overflow:     'hidden',
                            }}
                          >
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  item.color,
                                  item.quantity - 1,
                                )
                              }
                              style={{
                                background: 'none',
                                border:     'none',
                                cursor:     'pointer',
                                padding:    '4px 8px',
                                color:      C.t2,
                                display:    'flex',
                                transition: 'color 0.2s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = C.t1)}
                              onMouseLeave={(e) => (e.currentTarget.style.color = C.t2)}
                            >
                              <Minus size={11} />
                            </button>

                            <span
                              style={{
                                padding:    '4px 8px',
                                fontSize:   12,
                                color:      C.t1,
                                fontFamily: 'Tajawal, sans-serif',
                                minWidth:   28,
                                textAlign:  'center',
                              }}
                            >
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  item.color,
                                  item.quantity + 1,
                                )
                              }
                              style={{
                                background: 'none',
                                border:     'none',
                                cursor:     'pointer',
                                padding:    '4px 8px',
                                color:      C.t2,
                                display:    'flex',
                                transition: 'color 0.2s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = C.t1)}
                              onMouseLeave={(e) => (e.currentTarget.style.color = C.t2)}
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          {/* السعر + حذف */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                              style={{
                                fontSize:   13,
                                fontWeight: 700,
                                color:      C.gold,
                                fontFamily: 'Tajawal, sans-serif',
                              }}
                            >
                              {fmtPrice(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() =>
                                removeItem(item.id, item.size, item.color)
                              }
                              aria-label="حذف المنتج"
                              style={{
                                background: 'none',
                                border:     'none',
                                cursor:     'pointer',
                                color:      C.t3,
                                display:    'flex',
                                padding:    3,
                                transition: 'color 0.2s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = C.err)}
                              onMouseLeave={(e) => (e.currentTarget.style.color = C.t3)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* زر إفراغ السلة */}
                  <button
                    onClick={clearCart}
                    style={{
                      display:   'block',
                      margin:    '14px auto 4px',
                      background:'none',
                      border:    'none',
                      cursor:    'pointer',
                      color:     C.t3,
                      fontSize:  11,
                      fontFamily:'Tajawal, sans-serif',
                      transition:'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.err)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.t3)}
                  >
                    إفراغ السلة
                  </button>
                </div>

                {/* ═══ Footer: كوبون + حساب + دفع ═══ */}
                <div
                  style={{
                    padding:     '14px 16px',
                    borderTop:   `1px solid ${C.b1}`,
                    background:  C.bg,
                    flexShrink:  0,
                  }}
                >
                  {/* ── حقل كود الخصم ── */}
                  {couponApplied ? (
                    <div
                      style={{
                        display:      'flex',
                        alignItems:   'center',
                        justifyContent:'space-between',
                        background:   C.ok + '15',
                        border:       `1px solid ${C.ok}44`,
                        borderRadius: 7,
                        padding:      '7px 11px',
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Tag size={12} color={C.ok} />
                        <span
                          style={{
                            fontSize:   11,
                            color:      C.ok,
                            fontFamily: 'Tajawal, sans-serif',
                            fontWeight: 600,
                          }}
                        >
                          {couponApplied} — خصم {discountPct}%
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        style={{
                          background: 'none',
                          border:     'none',
                          cursor:     'pointer',
                          color:      C.t3,
                          display:    'flex',
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError('');
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="كود الخصم (VOGU2025)"
                          dir="rtl"
                          style={{
                            flex:         1,
                            background:   C.card,
                            border:       `1px solid ${couponError ? C.err : C.b2}`,
                            borderRadius: 7,
                            padding:      '7px 10px',
                            color:        C.t1,
                            fontSize:     11,
                            fontFamily:   'Tajawal, sans-serif',
                            outline:      'none',
                            minWidth:     0,
                            transition:   'border-color 0.2s',
                          }}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || couponLoading}
                          style={{
                            background:   'none',
                            border:       `1px solid ${C.b2}`,
                            borderRadius: 7,
                            padding:      '7px 12px',
                            color:        couponLoading ? C.t3 : C.t2,
                            fontSize:     11,
                            fontFamily:   'Tajawal, sans-serif',
                            cursor:       couponCode.trim() && !couponLoading ? 'pointer' : 'not-allowed',
                            flexShrink:   0,
                            transition:   'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            if (couponCode.trim() && !couponLoading)
                              (e.currentTarget as HTMLElement).style.color = C.t1;
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = C.t2;
                          }}
                        >
                          {couponLoading ? '...' : 'تطبيق'}
                        </button>
                      </div>
                      {couponError && (
                        <p
                          style={{
                            fontSize:   10,
                            color:      C.err,
                            fontFamily: 'Tajawal, sans-serif',
                            marginTop:  5,
                          }}
                        >
                          {couponError}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── تفاصيل السعر ── */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: C.t2, fontFamily: 'Tajawal, sans-serif' }}>
                        المجموع الفرعي
                      </span>
                      <span style={{ fontSize: 12, color: C.t1, fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                        {fmtPrice(subtotal)}
                      </span>
                    </div>

                    {discountAmt > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, color: C.ok, fontFamily: 'Tajawal, sans-serif' }}>
                          الخصم ({discountPct}%)
                        </span>
                        <span style={{ fontSize: 12, color: C.ok, fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                          − {fmtPrice(discountAmt)}
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: C.t2, fontFamily: 'Tajawal, sans-serif' }}>
                        الشحن
                      </span>
                      <span
                        style={{
                          fontSize:   12,
                          color:      shippingFree ? C.ok : C.t2,
                          fontFamily: 'Tajawal, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        {shippingFree ? 'مجاني 🎉' : 'يُحسب عند الدفع'}
                      </span>
                    </div>
                  </div>

                  {/* ── الإجمالي النهائي ── */}
                  <div
                    style={{
                      display:        'flex',
                      justifyContent: 'space-between',
                      alignItems:     'center',
                      padding:        '11px 0',
                      borderTop:      `1px solid ${C.b1}`,
                      marginBottom:   14,
                    }}
                  >
                    <span
                      style={{
                        fontSize:   14,
                        color:      C.t1,
                        fontFamily: 'Tajawal, sans-serif',
                        fontWeight: 700,
                      }}
                    >
                      الإجمالي
                    </span>
                    <span
                      style={{
                        fontSize:   17,
                        color:      C.gold,
                        fontFamily: 'Tajawal, sans-serif',
                        fontWeight: 700,
                      }}
                    >
                      {fmtPrice(total)}
                    </span>
                  </div>

                  {/* ── زر إتمام الشراء ── */}
                  <Link
                    href="/checkout"
                    style={{
                      display:        'block',
                      width:          '100%',
                      background:     C.gold,
                      color:          '#060606',
                      border:         'none',
                      borderRadius:   9,
                      padding:        '13px',
                      fontSize:       13,
                      fontFamily:     'Tajawal, sans-serif',
                      fontWeight:     700,
                      cursor:         'pointer',
                      textAlign:      'center',
                      textDecoration: 'none',
                      transition:     'filter 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.filter = 'none')
                    }
                    onClick={onClose}
                  >
                    إتمام الشراء · {fmtPrice(total)}
                  </Link>

                  {/* ── الدفع الآمن ── */}
                  <p
                    style={{
                      textAlign:  'center',
                      fontSize:   10,
                      color:      C.t3,
                      fontFamily: 'Tajawal, sans-serif',
                      marginTop:  10,
                    }}
                  >
                    🔒 دفع آمن ومشفر بالكامل
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
