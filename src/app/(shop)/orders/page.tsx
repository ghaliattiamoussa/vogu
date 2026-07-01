"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft, Clock, Package,
  ShoppingBag, Truck, CheckCircle2, XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── الألوان الفاتحة (نفس باقي الموقع) ──────────────────────
const C = {
  bg:   "#FAFAF8",
  surf: "#F5F3EF",
  card: "#FFFFFF",
  b1:   "#EAE7E1",
  b2:   "#DDD9D1",
  gold: "#A8823C",
  t1:   "#1A1714",
  t2:   "#6B6560",
  t3:   "#A39E96",
  err:  "#C0504D",
  ok:   "#3F8F5F",
} as const;

// ─── Types ────────────────────────────────────────────────────
type OrderItem = {
  id: string;
  nameAr: string;
  imageUrl: string | null;
  price: number;
  qty: number;
  size: string;
  color: string;
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

// ─── Status config ────────────────────────────────────────────
const STATUS_MAP: Record<string, {
  label: string;
  bg: string;
  color: string;
  border: string;
  icon: React.ReactNode;
}> = {
  PENDING:    { label: "قيد الانتظار", bg: "#FEF9EE", color: "#A8823C", border: "#A8823C40", icon: <Clock size={12} /> },
  CONFIRMED:  { label: "تم التأكيد",   bg: "#F0FBF4", color: "#3F8F5F", border: "#3F8F5F40", icon: <CheckCircle2 size={12} /> },
  PROCESSING: { label: "جاري التجهيز", bg: "#EFF7FC", color: "#2E7BA4", border: "#2E7BA440", icon: <Package size={12} /> },
  SHIPPED:    { label: "تم الشحن",     bg: "#F3EFFE", color: "#6B46C1", border: "#6B46C140", icon: <Truck size={12} /> },
  DELIVERED:  { label: "تم التسليم",   bg: "#F0FBF4", color: "#3F8F5F", border: "#3F8F5F40", icon: <CheckCircle2 size={12} /> },
  CANCELLED:  { label: "ملغي",         bg: "#FEF1F1", color: "#C0504D", border: "#C0504D40", icon: <XCircle size={12} /> },
  RETURNED:   { label: "مُرتجع",       bg: "#FEF1F1", color: "#C0504D", border: "#C0504D40", icon: <XCircle size={12} /> },
};

// ─── Empty state ──────────────────────────────────────────────
function EmptyOrders() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "80px 20px", gap: 20,
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: C.surf, border: `1px solid ${C.b1}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ShoppingBag size={32} style={{ color: C.t3 }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 24, color: C.t1, marginBottom: 6 }}>
          لا توجد طلبات بعد
        </p>
        <p style={{ fontSize: 12, color: C.t3, fontFamily: "Tajawal, sans-serif" }}>
          ابدأ التسوق واستمتع بتجربة أزياء فاخرة
        </p>
      </div>
      <Link
        href="/shop"
        style={{
          background: C.gold, color: "#FFFFFF",
          padding: "12px 32px", borderRadius: 12,
          fontSize: 13, fontFamily: "Tajawal, sans-serif",
          fontWeight: 700, textDecoration: "none",
        }}
      >
        تسوق الآن
      </Link>
    </div>
  );
}

// ─── Order Card ───────────────────────────────────────────────
function OrderCard({ order }: { order: Order }) {
  const status = STATUS_MAP[order.status] ?? STATUS_MAP.PENDING;
  const date   = new Date(order.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.b1}`,
      borderRadius: 18, overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s, border-color 0.2s",
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = C.b2;
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = C.b1;
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px", borderBottom: `1px solid ${C.b1}`,
        background: C.surf,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Badge الحالة */}
          <span style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 11, fontFamily: "Tajawal, sans-serif", fontWeight: 700,
            padding: "4px 10px", borderRadius: 20,
            background: status.bg, color: status.color,
            border: `1px solid ${status.border}`,
          }}>
            {status.icon}
            {status.label}
          </span>
          <span style={{ fontSize: 11, color: C.t3, fontFamily: "Tajawal, sans-serif" }}>
            {date}
          </span>
        </div>
        <div style={{ textAlign: "left" }}>
          <p style={{ fontSize: 9, color: C.t3, fontFamily: "Tajawal, sans-serif" }}>رقم الطلب</p>
          <p style={{ fontSize: 11, color: C.t1, fontFamily: "monospace", fontWeight: 700 }}>
            #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>
      </div>

      {/* المنتجات */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>

        {/* صور المنتجات */}
        <div style={{ display: "flex", gap: -6, position: "relative" }}>
          {order.items.slice(0, 3).map((item, i) => (
            <div
              key={item.id}
              style={{
                width: 52, height: 68, borderRadius: 10,
                border: `2px solid ${C.card}`,
                background: C.surf, overflow: "hidden", flexShrink: 0,
                marginLeft: i > 0 ? -12 : 0,
                zIndex: 3 - i, position: "relative",
              }}
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.nameAr} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 18, color: C.t3 }}>V</span>
                </div>
              )}
            </div>
          ))}
          {order.items.length > 3 && (
            <div style={{
              width: 52, height: 68, borderRadius: 10,
              border: `2px solid ${C.card}`, background: C.surf,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginLeft: -12, zIndex: 0, position: "relative",
            }}>
              <span style={{ fontSize: 11, color: C.t2, fontFamily: "Tajawal, sans-serif" }}>
                +{order.items.length - 3}
              </span>
            </div>
          )}
        </div>

        {/* معلومات المنتج */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, color: C.t1, fontFamily: "Tajawal, sans-serif", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {order.items[0]?.nameAr}
            {order.items.length > 1 && (
              <span style={{ color: C.t3, fontWeight: 400 }}> و{order.items.length - 1} منتج آخر</span>
            )}
          </p>
          <p style={{ fontSize: 11, color: C.t3, fontFamily: "Tajawal, sans-serif", marginTop: 3 }}>
            {order.items[0]?.size} · {order.items[0]?.color}
          </p>
        </div>

        {/* الإجمالي */}
        <div style={{ textAlign: "left", flexShrink: 0 }}>
          <p style={{ fontSize: 9, color: C.t3, fontFamily: "Tajawal, sans-serif" }}>الإجمالي</p>
          <p style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 20, color: C.gold, lineHeight: 1.2 }}>
            {order.total.toLocaleString("ar-EG")}
            <span style={{ fontSize: 11, fontFamily: "Tajawal, sans-serif", marginRight: 3 }}>ج.م</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "12px 20px", borderTop: `1px solid ${C.b1}`,
        display: "flex", justifyContent: "flex-end",
      }}>
        <Link
          href={`/orders/${order.id}`}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 12, color: C.gold, fontFamily: "Tajawal, sans-serif",
            textDecoration: "none", fontWeight: 600,
          }}
        >
          عرض التفاصيل
          <ChevronLeft size={13} style={{ transform: "rotate(180deg)" }} />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ── جلب الطلبات ──
  const fetchOrders = () => {
    fetch(`/api/orders?page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders ?? []);
        setTotalPages(d.pagination?.totalPages ?? 1);
        setLoading(false);
      })
      .catch(() => {
        setOrders([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders();

    // ✅ تحديث تلقائي كل 15 ثانية
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [page]);

  return (
    <div
      style={{ minHeight: "100vh", background: C.bg, padding: "40px 16px" }}
      dir="rtl"
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            fontSize: 10, color: C.gold, fontFamily: "Tajawal, sans-serif",
            letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 6,
          }}>
            حسابي
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 36, fontWeight: 400, color: C.t1,
          }}>
            طلباتي
          </h1>
        </div>

        {/* المحتوى */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{
                height: 140, background: C.card, borderRadius: 18,
                border: `1px solid ${C.b1}`, animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <OrderCard order={order} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      fontSize: 13, fontFamily: "Tajawal, sans-serif",
                      cursor: "pointer", transition: "all 0.2s",
                      background:  p === page ? C.gold  : C.card,
                      color:       p === page ? "#FFF"  : C.t2,
                      border:      p === page ? "none"  : `1px solid ${C.b1}`,
                      fontWeight:  p === page ? 700     : 400,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}