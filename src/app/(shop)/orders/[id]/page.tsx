"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Light theme palette (نفس ألوان باقي الموقع) ──────────────
const C = {
  bg: "#FAFAF8",
  surf: "#F5F3EF",
  card: "#FFFFFF",
  b1: "#EAE7E1",
  b2: "#DDD9D1",
  gold: "#A8823C",
  goldSoft: "#A8823C12",
  t1: "#1A1714",
  t2: "#6B6560",
  t3: "#A39E96",
  err: "#C0504D",
  ok: "#3F8F5F",
} as const;

// ─── Types ────────────────────────────────────────────────────
type OrderItem = {
  id: string;
  nameAr: string;
  brand: string;
  imageUrl: string | null;
  price: number;
  qty: number;
  size: string;
  color: string;
};

type Address = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponCode: string | null;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
  address: Address | null;
};

// ─── Timeline steps ───────────────────────────────────────────
const STEPS = [
  { key: "PENDING", label: "تم الطلب", icon: Clock },
  { key: "CONFIRMED", label: "تم التأكيد", icon: CheckCircle2 },
  { key: "PROCESSING", label: "جاري التجهيز", icon: Package },
  { key: "SHIPPED", label: "تم الشحن", icon: Truck },
  { key: "DELIVERED", label: "تم التسليم", icon: CheckCircle2 },
];

const ORDER_INDEX: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
};

// ─── Timeline Component ─────────────────────────────────────
function Timeline({ status }: { status: string }) {
  if (status === "CANCELLED" || status === "RETURNED") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: `${C.err}0D`,
          border: `1px solid ${C.err}30`,
          borderRadius: 12,
          padding: "12px 16px",
        }}
      >
        <XCircle size={16} style={{ color: C.err }} />
        <span
          style={{
            fontSize: 13,
            color: C.err,
            fontFamily: "Tajawal, sans-serif",
            fontWeight: 700,
          }}
        >
          {status === "CANCELLED" ? "تم إلغاء الطلب" : "تم إرجاع الطلب"}
        </span>
      </div>
    );
  }

  const current = ORDER_INDEX[status] ?? 0;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isDone = i <= current;
        const isLast = i === STEPS.length - 1;

        return (
          <div
            key={step.key}
            style={{
              display: "flex",
              alignItems: "center",
              flex: isLast ? "0 0 auto" : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${isDone ? C.gold : C.b2}`,
                  background: isDone ? C.gold : C.card,
                  color: isDone ? "#fff" : C.t3,
                  boxShadow: isDone ? `0 0 0 4px ${C.gold}22` : "none",
                  transition: "all 0.3s",
                }}
              >
                <Icon size={14} />
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontFamily: "Tajawal, sans-serif",
                  whiteSpace: "nowrap",
                  color: isDone ? C.gold : C.t3,
                  fontWeight: isDone ? 700 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  margin: "0 4px",
                  marginBottom: 16,
                  borderRadius: 4,
                  background: i < current ? C.gold : C.b1,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function OrderDetailPage() {
  const rawId = useParams<{ id: string }>().id;
  // FIX #5: useParams value can be string | string[]
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FIX #2 + #3: fetch logic inside useEffect with unmount guard,
  // and polling failures no longer wipe an already-loaded order.
  useEffect(() => {
    if (!id) return;
    let active = true;

    const fetchOrder = async () => {
      try {
        const r = await fetch(`/api/orders/${id}`);
        if (!r.ok) throw new Error("not found");
        const d = await r.json();
        if (!active) return;
        setOrder(d.order);
        setError("");
      } catch {
        if (!active) return;
        // only surface an error if we never loaded an order
        setOrder((prev) => {
          if (!prev) setError("لم يتم العثور على الطلب");
          return prev;
        });
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrder();

    // تحديث تلقائي كل 15 ثانية
    const interval = setInterval(fetchOrder, 15000);

    // تنظيف عند مغادرة الصفحة
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [id]);

  // ✅ حالة التحميل
  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          background: C.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
        dir="rtl"
      >
        {/* FIX #4: use Tailwind's built-in animate-spin instead of inline keyframes */}
        <div
          className="animate-spin"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: `3px solid ${C.b1}`,
            borderTop: `3px solid ${C.gold}`,
          }}
        />
        <p
          style={{
            fontFamily: "'Tajawal', sans-serif",
            fontSize: 14,
            color: C.t2,
          }}
        >
          جارٍ تحميل الطلب...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div
        style={{
          minHeight: "60vh",
          background: C.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
        dir="rtl"
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24,
            color: C.t1,
          }}
        >
          الطلب غير موجود
        </p>
        <Link
          href="/orders"
          style={{
            color: C.gold,
            fontFamily: "Tajawal, sans-serif",
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          العودة للطلبات
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", background: C.bg, padding: "40px 16px" }}
      dir="rtl"
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Success banner */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: `${C.ok}0D`,
              border: `1px solid ${C.ok}30`,
              borderRadius: 16,
              padding: "16px 20px",
              marginBottom: 24,
            }}
          >
            <CheckCircle2 size={22} style={{ color: C.ok, flexShrink: 0 }} />
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.ok,
                  fontFamily: "Tajawal, sans-serif",
                }}
              >
                تم تاكيد الطلب بنجاح! 🎉
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: C.t2,
                  fontFamily: "Tajawal, sans-serif",
                  marginTop: 2,
                }}
              >
                سنتواصل معك قريباً لتأكيد شحن طلبك
              </p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <Link
              href="/orders"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: C.t2,
                fontSize: 12,
                fontFamily: "Tajawal, sans-serif",
                marginBottom: 8,
                textDecoration: "none",
              }}
            >
              <ChevronLeft size={13} /> طلباتي
            </Link>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 30,
                fontWeight: 400,
                color: C.t1,
              }}
            >
              تفاصيل الطلب
            </h1>
          </div>
          <div style={{ textAlign: "left" }}>
            <p
              style={{
                fontSize: 10,
                color: C.t3,
                fontFamily: "Tajawal, sans-serif",
              }}
            >
              رقم الطلب
            </p>
            <p
              style={{
                fontSize: 15,
                color: C.t1,
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              #{order.id.slice(-8).toUpperCase()}
            </p>
            <p
              style={{
                fontSize: 11,
                color: C.t3,
                fontFamily: "Tajawal, sans-serif",
                marginTop: 2,
              }}
            >
              {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.b1}`,
            borderRadius: 18,
            padding: 20,
            marginBottom: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 17,
              color: C.t1,
              marginBottom: 20,
            }}
          >
            حالة الطلب
          </h2>
          <Timeline status={order.status} />
        </div>

        {/* FIX #1: removed inline gridTemplateColumns/display so the
            Tailwind responsive class can take effect on md+ screens. */}
        <div
          className="grid grid-cols-1 md:grid-cols-[1fr_300px]"
          style={{ gap: 20 }}
        >
          {/* Left: Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.b1}`,
                borderRadius: 18,
                padding: 20,
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 17,
                  color: C.t1,
                  marginBottom: 16,
                }}
              >
                المنتجات ({order.items.length})
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 72,
                        borderRadius: 12,
                        background: C.surf,
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.nameAr}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 20,
                              color: C.t3,
                            }}
                          >
                            V
                          </span>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 10,
                          color: C.t3,
                          fontFamily: "Tajawal, sans-serif",
                        }}
                      >
                        {item.brand}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: C.t1,
                          fontFamily: "Tajawal, sans-serif",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.nameAr}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: C.t2,
                          fontFamily: "Tajawal, sans-serif",
                          marginTop: 2,
                        }}
                      >
                        {item.size} · {item.color} · ×{item.qty}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: C.gold,
                        fontFamily: "'Cormorant Garamond', serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {(item.price * item.qty).toLocaleString("en-US")} ج.م
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            {order.address && (
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.b1}`,
                  borderRadius: 18,
                  padding: 20,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 17,
                    color: C.t1,
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <MapPin size={14} style={{ color: C.gold }} />
                  عنوان التوصيل
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: C.t1,
                    fontFamily: "Tajawal, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {order.address.fullName}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: C.t2,
                    fontFamily: "Tajawal, sans-serif",
                    marginTop: 4,
                  }}
                >
                  {order.address.street}، {order.address.city}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: C.t2,
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  {order.address.phone}
                </p>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.b1}`,
              borderRadius: 18,
              padding: 20,
              height: "fit-content",
              boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 17,
                color: C.t1,
                marginBottom: 16,
              }}
            >
              ملخص الدفع
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  fontFamily: "Tajawal, sans-serif",
                }}
              >
                <span style={{ color: C.t2 }}>المجموع الفرعي</span>
                <span style={{ color: C.t1 }}>
                  {order.subtotal.toLocaleString("en-US")} ج.م
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  fontFamily: "Tajawal, sans-serif",
                }}
              >
                <span style={{ color: C.t2 }}>الشحن</span>
                <span style={{ color: order.shippingCost === 0 ? C.ok : C.t1 }}>
                  {order.shippingCost === 0
                    ? "مجاني"
                    : `${order.shippingCost} ج.م`}
                </span>
              </div>
              {order.discount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  <span style={{ color: C.ok }}>
                    خصم {order.couponCode && `(${order.couponCode})`}
                  </span>
                  <span style={{ color: C.ok }}>
                    − {order.discount.toLocaleString("en-US")} ج.م
                  </span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 12,
                  borderTop: `1px solid ${C.b1}`,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    color: C.t1,
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  الإجمالي
                </span>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    color: C.gold,
                  }}
                >
                  {order.total.toLocaleString("en-US")} ج.م
                </span>
              </div>
            </div>

            {/* Payment status */}
            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: `1px solid ${C.b1}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  fontFamily: "Tajawal, sans-serif",
                }}
              >
                <span style={{ color: C.t2 }}>حالة الدفع</span>
                <span
                  style={{
                    color:
                      order.paymentStatus === "PAID"
                        ? C.ok
                        : order.paymentStatus === "REFUNDED"
                        ? C.err
                        : C.gold,
                    fontWeight: 600,
                  }}
                >
                  {order.paymentStatus === "PAID"
                    ? "مدفوع ✓"
                    : order.paymentStatus === "REFUNDED"
                    ? "مُسترد"
                    : "في انتظار الدفع"}
                </span>
              </div>
            </div>

            {/* 📷 صورة التحويل (إن وجدت) */}
            {order.notes && order.notes.includes("صورة التحويل:") && (
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: `1px solid ${C.b1}`,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: C.t2,
                    fontFamily: "Tajawal, sans-serif",
                    marginBottom: 8,
                  }}
                >
                  🖼️ صورة إثبات التحويل
                </p>
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: `1px solid ${C.b1}`,
                    maxWidth: "100%",
                  }}
                >
                  <img
                    src={
                      order.notes.split("صورة التحويل: ")[1]?.split("\n")[0] ||
                      ""
                    }
                    alt="إثبات التحويل"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      maxHeight: 300,
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            )}

            <Link
              href="/shop"
              style={{
                display: "block",
                marginTop: 20,
                textAlign: "center",
                border: `1px solid ${C.b2}`,
                color: C.t2,
                borderRadius: 12,
                padding: "12px",
                fontSize: 12,
                fontFamily: "Tajawal, sans-serif",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
