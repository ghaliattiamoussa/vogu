// src/app/admin/vendor-orders/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Store,
  Loader2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Light Theme Palette ──────────────────────────────────────
const C = {
  bg:   "#FAFAF8",
  surf: "#F5F3EF",
  card: "#FFFFFF",
  b1:   "#EAE7E1",
  b2:   "#DDD9D1",
  gold: "#A8823C",
  goldL:"#C9A86E",
  t1:   "#1A1714",
  t2:   "#6B6560",
  t3:   "#A39E96",
  err:  "#C0504D",
  ok:   "#3D9960",
} as const;

type OrderItem = {
  id: string;
  qty: number;
  price: number;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  vendorShipStatus: "AWAITING_VENDOR" | "SHIPPED_TO_ADMIN" | "RECEIVED_BY_ADMIN" | "NOT_REQUIRED";
  product: { nameAr: string; nameEn: string; brand: string; slug: string };
  variant: { size: string | null; color: string | null; colorHex: string | null } | null;
  vendor: { id: string; storeName: string; contactName: string; email: string } | null;
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  couponCode: string | null;
  notes: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string | null; image: string | null; phone: string | null };
  address: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string | null;
  } | null;
  items: OrderItem[];
};

// ─── Status Badges ─────────────────────────────────────────────
function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "قيد الانتظار", color: C.gold, bg: `${C.gold}0D` },
    CONFIRMED: { label: "مؤكد", color: "#2E7BA4", bg: "#2E7BA40D" },
    PROCESSING: { label: "جاري التجهيز", color: "#6B46C1", bg: "#6B46C10D" },
    SHIPPED: { label: "تم الشحن للعميل", color: C.ok, bg: `${C.ok}0D` },
    DELIVERED: { label: "تم التسليم", color: C.ok, bg: `${C.ok}0D` },
    CANCELLED: { label: "ملغي", color: C.err, bg: `${C.err}0D` },
  };
  const s = map[status] || map.PENDING;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.color}33`,
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 9,
        fontFamily: "Tajawal, sans-serif",
        fontWeight: 600,
        display: "inline-block",
      }}
    >
      {s.label}
    </span>
  );
}

function VendorShipStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    AWAITING_VENDOR: {
      label: "في انتظار التاجر",
      color: C.gold,
      bg: `${C.gold}0D`,
      icon: <Clock size={12} />,
    },
    SHIPPED_TO_ADMIN: {
      label: "شحن للتاجر للإدمن",
      color: "#2E7BA4",
      bg: "#2E7BA40D",
      icon: <Truck size={12} />,
    },
    RECEIVED_BY_ADMIN: {
      label: "تم الاستلام من الإدمن",
      color: C.ok,
      bg: `${C.ok}0D`,
      icon: <CheckCircle2 size={12} />,
    },
    NOT_REQUIRED: {
      label: "غير مطلوب",
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
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 9,
        fontFamily: "Tajawal, sans-serif",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {s.icon}
      {s.label}
    </span>
  );
}

// ─── Order Item Row ────────────────────────────────────────────
function VendorOrderItem({
  item,
  orderId,
  onReceive,
  loading,
}: {
  item: OrderItem;
  orderId: string;
  onReceive: (orderItemId: string) => void;
  loading: boolean;
}) {
  const isShippedToAdmin = item.vendorShipStatus === "SHIPPED_TO_ADMIN";
  const isReceived = item.vendorShipStatus === "RECEIVED_BY_ADMIN";
  const isAwaiting = item.vendorShipStatus === "AWAITING_VENDOR";

  return (
    <div className="flex items-center gap-4 p-3 bg-[#F5F3EF] rounded-xl border border-[#EAE7E1]">
      {/* معلومات المنتج */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#A8823C] font-tajawal tracking-widest uppercase">
          {item.product.brand}
        </p>
        <p className="text-[12px] font-bold text-[#1A1714] font-tajawal">
          {item.product.nameAr}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {item.size && (
            <span className="text-[9px] text-[#6B6560] font-tajawal bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#EAE7E1]">
              مقاس: {item.size}
            </span>
          )}
          {item.color && (
            <span className="text-[9px] text-[#6B6560] font-tajawal bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#EAE7E1] flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full border border-[#DDD9D1]"
                style={{ background: item.colorHex || "#A39E96" }}
              />
              {item.color}
            </span>
          )}
          <span className="text-[9px] text-[#6B6560] font-tajawal bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#EAE7E1]">
            × {item.qty}
          </span>
        </div>
      </div>

      {/* التاجر */}
      <div className="flex-shrink-0 text-left">
        <p className="text-[10px] text-[#A39E96] font-tajawal">التاجر</p>
        <p className="text-[11px] font-bold text-[#1A1714] font-tajawal">
          {item.vendor?.storeName || "غير معروف"}
        </p>
        <p className="text-[9px] text-[#A39E96] font-tajawal">
          {item.vendor?.contactName}
        </p>
      </div>

      {/* الحالة */}
      <div className="flex-shrink-0">
        <VendorShipStatusBadge status={item.vendorShipStatus} />
      </div>

      {/* زر الاستلام (يظهر فقط لما يكون التاجر شحن للإدمن) */}
      {isShippedToAdmin && (
        <button
          onClick={() => onReceive(item.id)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold font-tajawal bg-[#3D9960] text-white hover:brightness-110 transition-all disabled:opacity-50"
        >
          <CheckCircle2 size={12} />
          تأكيد الاستلام
        </button>
      )}

      {isReceived && (
        <div className="flex items-center gap-1.5 text-[10px] text-[#3D9960] font-tajawal bg-[#3D9960]0D px-3 py-1.5 rounded-lg border border-[#3D9960]/30">
          <CheckCircle2 size={12} />
          تم الاستلام
        </div>
      )}

      {isAwaiting && (
        <div className="flex items-center gap-1.5 text-[10px] text-[#A39E96] font-tajawal">
          <Clock size={12} />
          في انتظار التاجر
        </div>
      )}
    </div>
  );
}

// ─── Order Card ────────────────────────────────────────────────
function OrderCard({
  order,
  onReceiveItem,
  loading,
}: {
  order: Order;
  onReceiveItem: (orderItemId: string) => void;
  loading: boolean;
}) {
const vendorItems = order.items.filter((item) => item.vendor !== null);
  if (vendorItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl overflow-hidden"
    >
      {/* Header - معلومات العميل */}
      <div className="p-5 border-b border-[#EAE7E1] bg-[#F5F3EF]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#A8823C]0D border border-[#A8823C]/30 flex items-center justify-center overflow-hidden">
              {order.user.image ? (
                <Image
                  src={order.user.image}
                  alt={order.user.name || "عميل"}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <User size={18} className="text-[#A8823C]" />
              )}
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#1A1714] font-tajawal">
                {order.user.name || "عميل"}
              </p>
              <p className="text-[10px] text-[#6B6560] font-tajawal flex items-center gap-2">
                <Mail size={10} />
                {order.user.email}
                {order.user.phone && (
                  <>
                    <span className="text-[#EAE7E1]">·</span>
                    <Phone size={10} />
                    {order.user.phone}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <OrderStatusBadge status={order.status} />
            <Link
              href={`/admin/orders/${order.id}`}
              className="text-[10px] text-[#A8823C] font-tajawal hover:underline flex items-center gap-1"
            >
              عرض تفاصيل الطلب <ChevronLeft size={10} />
            </Link>
          </div>
        </div>

        {/* العنوان */}
        {order.address && (
          <div className="flex items-center gap-2 mt-2 text-[10px] text-[#6B6560] font-tajawal">
            <MapPin size={12} className="text-[#A8823C]" />
            <span>
              {order.address.fullName} · {order.address.street}، {order.address.city}
              {order.address.state && `، ${order.address.state}`}
              {order.address.country && `، ${order.address.country}`}
            </span>
            <span className="text-[#EAE7E1]">·</span>
            <span>📞 {order.address.phone}</span>
          </div>
        )}

        <div className="flex items-center gap-4 mt-1 text-[9px] text-[#A39E96] font-tajawal">
          <span>طلب #{order.id.slice(-8).toUpperCase()}</span>
          <span>·</span>
          <span>
            {new Date(order.createdAt).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>·</span>
          <span>
            الإجمالي:{" "}
            <span className="font-bold text-[#A8823C]">
              {order.total.toLocaleString("ar-EG")} ج.م
            </span>
          </span>
        </div>
      </div>

      {/* Body - عناصر الطلب من التجار */}
      <div className="p-4 space-y-3">
        <p className="text-[11px] font-bold text-[#1A1714] font-tajawal flex items-center gap-2">
          <Store size={14} className="text-[#A8823C]" />
          منتجات التجار ({vendorItems.length})
        </p>
        {vendorItems.map((item) => (
          <VendorOrderItem
            key={item.id}
            item={item}
            orderId={order.id}
            onReceive={onReceiveItem}
loading={loading}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AdminVendorOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "awaiting" | "shipped" | "received">("all");

  // ── Guard ──
  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [session, status, router]);

  // ── Fetch ──
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders?vendorId=has-vendor");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchOrders();
    }
  }, [session]);

  // ── تأكيد الاستلام من التاجر ──
  const handleReceive = async (orderItemId: string) => {
    setActionLoading(orderItemId);
    try {
      // نحتاج نجيب الـ orderId من الـ item
      const order = orders.find((o) => o.items.some((i) => i.id === orderItemId));
      if (!order) {
        toast.error("لم نتمكن من تحديد الطلب");
        return;
      }

      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderItemId,
          vendorShipStatus: "RECEIVED_BY_ADMIN",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "فشل تحديث الحالة");
        return;
      }

      toast.success("✅ تم تأكيد استلام المنتج من التاجر");
      fetchOrders();
    } catch {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Filtering ──
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    const hasStatus = order.items.some((item) => {
      if (filter === "awaiting") return item.vendorShipStatus === "AWAITING_VENDOR";
      if (filter === "shipped") return item.vendorShipStatus === "SHIPPED_TO_ADMIN";
      if (filter === "received") return item.vendorShipStatus === "RECEIVED_BY_ADMIN";
      return true;
    });
    return hasStatus;
  });

  const awaitingCount = orders.reduce((acc, o) => {
    return acc + o.items.filter((i) => i.vendorShipStatus === "AWAITING_VENDOR").length;
  }, 0);
  const shippedCount = orders.reduce((acc, o) => {
    return acc + o.items.filter((i) => i.vendorShipStatus === "SHIPPED_TO_ADMIN").length;
  }, 0);
  const receivedCount = orders.reduce((acc, o) => {
    return acc + o.items.filter((i) => i.vendorShipStatus === "RECEIVED_BY_ADMIN").length;
  }, 0);

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-[#A8823C] animate-spin" />
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "ADMIN") return null;

  return (
    <div className="p-6 md:p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-[#A8823C] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1">
            لوحة التحكم
          </p>
          <h1 className="font-cormorant text-[34px] font-light text-[#1A1714]">
            طلبات التجار
            <span className="text-[18px] text-[#A39E96] font-tajawal mr-3">
              ({orders.length} طلب)
            </span>
          </h1>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-[#F5F3EF] p-1 rounded-xl border border-[#EAE7E1]">
          {[
            { id: "all", label: `الكل (${orders.length})` },
            { id: "awaiting", label: `في انتظار التاجر (${awaitingCount})` },
            { id: "shipped", label: `شحن للتاجر للإدمن (${shippedCount})` },
            { id: "received", label: `تم الاستلام (${receivedCount})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-tajawal transition-all ${
                filter === t.id
                  ? "bg-[#A8823C] text-white font-bold"
                  : "text-[#6B6560] hover:bg-[#EAE7E1]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Orders List ── */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-20 h-20 rounded-full bg-[#F5F3EF] border border-[#EAE7E1] flex items-center justify-center">
            <ShoppingBag size={32} className="text-[#A39E96]" />
          </div>
          <p className="text-[16px] font-bold text-[#1A1714] font-tajawal">
            {filter === "all"
              ? "لا توجد طلبات من تجار"
              : filter === "awaiting"
              ? "جميع المنتجات تم تجهيزها من التجار"
              : filter === "shipped"
              ? "لا توجد منتجات في الطريق للإدمن"
              : "لا توجد منتجات مستلمة بعد"}
          </p>
          <p className="text-[12px] text-[#6B6560] font-tajawal">
            ستظهر هنا الطلبات التي تحتوي على منتجات من التجار
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onReceiveItem={handleReceive}
              loading={!!actionLoading}
            />
          ))}
        </div>
      )}

      {/* ── Info Box ── */}
      <div className="mt-8 bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-[#A8823C] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] text-[#1A1714] font-tajawal">
            <strong>ملاحظة:</strong> هنا تظهر الطلبات التي تحتوي على منتجات من التجار.
          </p>
          <p className="text-[11px] text-[#6B6560] font-tajawal mt-1">
            • <strong>في انتظار التاجر:</strong> التاجر لم يقم بتجهيز المنتج بعد.
            <br />
            • <strong>شحن للتاجر للإدمن:</strong> التاجر أكد أنه شحن المنتج لك — اضغط "تأكيد الاستلام" بعد استلامه فعلياً.
            <br />
            • <strong>تم الاستلام:</strong> أنت استلمت المنتج وجاهز لشحنه للعميل.
          </p>
        </div>
      </div>
    </div>
  );
}