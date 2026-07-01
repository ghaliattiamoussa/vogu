// src/app/(vendor)/vendor/orders/page.tsx
'use client';

import { motion } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useVendorSession } from '@/hooks/useVendorSession';
import { toast } from 'sonner';

// ─── Light Theme Palette ──────────────────────────────────────
const C = {
  bg:   '#FAFAF8',
  surf: '#F5F3EF',
  card: '#FFFFFF',
  b1:   '#EAE7E1',
  b2:   '#DDD9D1',
  gold: '#A8823C',
  goldL:'#C9A86E',
  t1:   '#1A1714',
  t2:   '#6B6560',
  t3:   '#A39E96',
  err:  '#C0504D',
  ok:   '#3D9960',
} as const;

type OrderItem = {
  id: string;
  qty: number;
  price: number;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  vendorShipStatus: 'AWAITING_VENDOR' | 'SHIPPED_TO_ADMIN' | 'RECEIVED_BY_ADMIN' | 'NOT_REQUIRED';
  order: {
    id: string;
    status: string;
    createdAt: string;
  };
  product: {
    id: string;
    nameAr: string;
    nameEn: string;
    brand: string;
    images: { url: string }[];
  };
  variant: {
    size: string | null;
    color: string | null;
    colorHex: string | null;
  } | null;
};

// ─── Status Badge ─────────────────────────────────────────────
function ShipStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    AWAITING_VENDOR: {
      label: 'في انتظار التجهيز',
      color: C.gold,
      bg: `${C.gold}0D`,
      icon: <Clock size={12} />,
    },
    SHIPPED_TO_ADMIN: {
      label: 'تم الشحن للإدمن',
      color: C.ok,
      bg: `${C.ok}0D`,
      icon: <Truck size={12} />,
    },
    RECEIVED_BY_ADMIN: {
      label: 'تم الاستلام',
      color: C.t3,
      bg: `${C.t3}0D`,
      icon: <CheckCircle2 size={12} />,
    },
    NOT_REQUIRED: {
      label: 'غير مطلوب',
      color: C.t3,
      bg: `${C.t3}0D`,
      icon: <AlertCircle size={12} />,
    },
  };
  const s = map[status] || map.AWAITING_VENDOR;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.color}33`,
        padding: '4px 10px',
        borderRadius: 20,
        fontSize: 10,
        fontFamily: 'Tajawal, sans-serif',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {s.icon}
      {s.label}
    </span>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: 'قيد الانتظار', color: C.gold, bg: `${C.gold}0D` },
    CONFIRMED: { label: 'مؤكد', color: '#2E7BA4', bg: '#2E7BA40D' },
    PROCESSING: { label: 'جاري التجهيز', color: '#6B46C1', bg: '#6B46C10D' },
    SHIPPED: { label: 'تم الشحن للعميل', color: C.ok, bg: `${C.ok}0D` },
    DELIVERED: { label: 'تم التسليم', color: C.ok, bg: `${C.ok}0D` },
    CANCELLED: { label: 'ملغي', color: C.err, bg: `${C.err}0D` },
  };
  const s = map[status] || map.PENDING;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.color}33`,
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: 9,
        fontFamily: 'Tajawal, sans-serif',
        fontWeight: 500,
        display: 'inline-block',
      }}
    >
      {s.label}
    </span>
  );
}

// ─── Order Item Card ──────────────────────────────────────────
function OrderItemCard({
  item,
  onShip,
  loading,
}: {
  item: OrderItem;
  onShip: (id: string) => void;
  loading: boolean;
}) {
  const isAwaiting = item.vendorShipStatus === 'AWAITING_VENDOR';
  const isShipped = item.vendorShipStatus === 'SHIPPED_TO_ADMIN';
  const isReceived = item.vendorShipStatus === 'RECEIVED_BY_ADMIN';

  const imageUrl = item.product.images[0]?.url || null;
  const size = item.variant?.size || item.size || '—';
  const color = item.variant?.color || item.color || '—';
  const colorHex = item.variant?.colorHex || item.colorHex || '#A39E96';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl p-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* صورة المنتج */}
        <div className="w-24 h-32 rounded-xl bg-[#F5F3EF] overflow-hidden flex-shrink-0 border border-[#EAE7E1]">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={item.product.nameAr}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={24} className="text-[#A39E96]" />
            </div>
          )}
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-[10px] text-[#A8823C] font-tajawal tracking-widest uppercase">
                {item.product.brand}
              </p>
              <h3 className="text-[14px] font-bold text-[#1A1714] font-tajawal">
                {item.product.nameAr}
              </h3>
              <p className="text-[11px] text-[#6B6560] font-tajawal">
                {item.product.nameEn}
              </p>
            </div>
            <div className="text-left">
              <p className="text-[11px] text-[#6B6560] font-tajawal">
                الكمية: <span className="font-bold text-[#1A1714]">{item.qty}</span>
              </p>
              <p className="text-[12px] font-bold text-[#A8823C] font-cormorant">
                {(item.price * item.qty).toLocaleString('ar-EG')} ج.م
              </p>
            </div>
          </div>

          {/* المقاس واللون */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {size && (
              <span className="text-[10px] text-[#6B6560] font-tajawal bg-[#F5F3EF] px-2 py-0.5 rounded border border-[#EAE7E1]">
                مقاس: {size}
              </span>
            )}
            {color && (
              <span className="text-[10px] text-[#6B6560] font-tajawal bg-[#F5F3EF] px-2 py-0.5 rounded border border-[#EAE7E1] flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-[#DDD9D1]"
                  style={{ background: colorHex }}
                />
                {color}
              </span>
            )}
          </div>

          {/* رقم الطلب والتاريخ */}
          <div className="flex items-center gap-4 mt-2">
            <p className="text-[10px] text-[#A39E96] font-tajawal">
              طلب #{item.order.id.slice(-8).toUpperCase()}
            </p>
            <p className="text-[9px] text-[#A39E96] font-tajawal">
              {new Date(item.order.createdAt).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* الحالة والأزرار */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex flex-col items-end gap-1">
            <ShipStatusBadge status={item.vendorShipStatus} />
            <OrderStatusBadge status={item.order.status} />
          </div>

          {isAwaiting && (
            <button
              onClick={() => onShip(item.id)}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold font-tajawal bg-[#A8823C] text-white hover:brightness-110 transition-all disabled:opacity-50"
            >
              <Truck size={13} />
              تأكيد الشحن للإدمن
            </button>
          )}

          {isShipped && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#3D9960] font-tajawal bg-[#3D9960]0D px-3 py-1.5 rounded-xl border border-[#3D9960]/30">
              <CheckCircle2 size={13} />
              في الطريق للإدمن
            </div>
          )}

          {isReceived && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#A39E96] font-tajawal">
              <CheckCircle2 size={13} />
              تم الاستلام
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────
function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-20 h-20 rounded-full bg-[#F5F3EF] border border-[#EAE7E1] flex items-center justify-center">
        <ShoppingBag size={32} className="text-[#A39E96]" />
      </div>
      <p className="text-[16px] font-bold text-[#1A1714] font-tajawal">لا توجد طلبات بعد</p>
      <p className="text-[12px] text-[#6B6560] font-tajawal">
        ستظهر هنا طلبات المنتجات التي قمت ببيعها
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function VendorOrdersPage() {
  const { vendor, loading: authLoading } = useVendorSession();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/orders');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && vendor) {
      fetchOrders();
    }
  }, [authLoading, vendor]);

  // ── تأكيد الشحن للإدمن ──
  const handleShip = async (itemId: string) => {
    setActionLoading(itemId);
    try {
      const res = await fetch(`/api/vendor/orders/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorShipStatus: 'SHIPPED_TO_ADMIN' }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'فشل تحديث الحالة');
        return;
      }

      toast.success('✅ تم تأكيد الشحن للإدمن');
      fetchOrders(); // تحديث القائمة
    } catch {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setActionLoading(null);
    }
  };

  // ── تحميل ──
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-[#A8823C] animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return null; // middleware هيعيد التوجيه
  }

  const awaitingCount = items.filter((i) => i.vendorShipStatus === 'AWAITING_VENDOR').length;

  return (
    <div style={{ padding: '28px 24px', minHeight: '100%' }} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-[#A8823C] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1">
            بوابة التجار
          </p>
          <h1 className="font-cormorant text-[30px] font-light text-[#1A1714]">
            طلباتي
            <span className="text-[16px] text-[#A39E96] font-tajawal mr-3">
              ({items.length} {items.length === 1 ? 'طلب' : 'طلبات'})
            </span>
          </h1>
        </div>

        {awaitingCount > 0 && (
          <div className="flex items-center gap-2 bg-[#A8823C]0D border border-[#A8823C]/30 rounded-xl px-4 py-2">
            <Clock size={14} className="text-[#A8823C]" />
            <p className="text-[11px] text-[#A8823C] font-tajawal font-bold">
              {awaitingCount} منتج في انتظار التجهيز
            </p>
          </div>
        )}
      </div>

      {/* ── قائمة الطلبات ── */}
      {items.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <OrderItemCard
              key={item.id}
              item={item}
              onShip={handleShip}
              loading={actionLoading === item.id}
            />
          ))}
        </div>
      )}

      {/* ── توضيح ── */}
      <div className="mt-8 bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-[#A8823C] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] text-[#1A1714] font-tajawal">
            <strong>ملاحظة:</strong> أنت ترى فقط المنتجات التي قمت ببيعها، 
            <span className="text-[#A8823C]"> بدون أي بيانات للعميل</span> (الاسم، التليفون، العنوان).
          </p>
          <p className="text-[11px] text-[#6B6560] font-tajawal mt-1">
            بعد تجهيز الطلب، اضغط "تأكيد الشحن للإدمن" — وسيظهر الطلب في لوحة الإدمن لاستلامه وشحنه للعميل.
          </p>
        </div>
      </div>
    </div>
  );
}