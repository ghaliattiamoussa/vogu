"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight, Package, User, MapPin, CreditCard,
  ShoppingBag, ChevronDown, Loader2, Check, Phone, Mail,
  Calendar, Hash, Tag, Truck, Download, X, ZoomIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ── ثوابت ──────────────────────────────────────────────────────
const C = {
  bg:   "#070707", surf: "#0D0D0D", card: "#121212",
  b1:   "#1A1A1A", b2:   "#262626",
  gold: "#C9A86E", t1:   "#EDE8DF", t2:   "#8A8480", t3:   "#484542",
  green:"#5CB87A", red:  "#D07070", blue: "#7EB8D4",
} as const;

const ORDER_STATUSES = [
  { id: "PENDING",    label: "انتظار",  color: "text-[#C9A86E] bg-[#1A1200] border-[#C9A86E]/20" },
  { id: "CONFIRMED",  label: "مؤكد",   color: "text-[#5CB87A] bg-[#001A08] border-[#5CB87A]/20" },
  { id: "PROCESSING", label: "تجهيز",  color: "text-[#7EB8D4] bg-[#001018] border-[#7EB8D4]/20" },
  { id: "SHIPPED",    label: "شحن",    color: "text-[#A078D4] bg-[#0A0018] border-[#A078D4]/20" },
  { id: "DELIVERED",  label: "تسليم",  color: "text-[#5CB87A] bg-[#001A08] border-[#5CB87A]/20" },
  { id: "CANCELLED",  label: "ملغي",   color: "text-[#D07070] bg-[#1A0808] border-[#D07070]/20" },
  { id: "RETURNED",   label: "مرتجع",  color: "text-[#8A8480] bg-[#121212] border-[#262626]"    },
];

const PAY_STATUSES = [
  { id: "UNPAID",   label: "غير مدفوع", color: "text-[#D07070]" },
  { id: "PAID",     label: "مدفوع",     color: "text-[#5CB87A]" },
  { id: "REFUNDED", label: "مسترجع",    color: "text-[#7EB8D4]" },
  { id: "PARTIAL",  label: "جزئي",      color: "text-[#C9A86E]" },
];

const PAY_METHODS: Record<string, string> = {
  stripe:            "بطاقة ائتمان (Stripe)",
  cash_on_delivery:  "الدفع عند الاستلام",
};

// ── مكوّن البطاقة ────────────────────────────────────────────
function Card({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1A1A1A]">
        <div className="w-7 h-7 rounded-lg bg-[#1A1200] flex items-center justify-center">
          <Icon size={13} className="text-[#C9A86E]" />
        </div>
        <h3 className="text-[13px] font-bold text-[#EDE8DF] font-tajawal">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── صف معلومة ────────────────────────────────────────────────
function InfoRow({ label, value, valueClass = "" }: {
  label: string; value: React.ReactNode; valueClass?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#1A1A1A] last:border-0">
      <span className="text-[11px] text-[#484542] font-tajawal whitespace-nowrap">{label}</span>
      <span className={`text-[12px] text-[#EDE8DF] font-tajawal text-left ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id     = params.id as string;

  const [order,          setOrder]          = useState<any>(null);
  const [loading,        setLoading]        = useState(true);
  const [statusOpen,     setStatusOpen]     = useState(false);
  const [payOpen,        setPayOpen]        = useState(false);
  const [savingStatus,   setSavingStatus]   = useState(false);
  const [savingPay,      setSavingPay]      = useState(false);
  const [previewImage,   setPreviewImage]   = useState<string | null>(null);

  // ── تحميل الصورة ──────────────────────────────────────────
  const downloadImage = async (url: string, filename: string) => {
    try {
      const res  = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch {
      // fallback: افتح الرابط في تبويب جديد
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(d => { setOrder(d.order); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  // ── تحديث الحالة ─────────────────────────────────────────
  const updateStatus = async (status: string) => {
    setSavingStatus(true);
    setStatusOpen(false);
    try {
      const res  = await fetch(`/api/admin/orders/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
      const data = await res.json();
      setOrder((prev: any) => ({ ...prev, status: data.order.status }));
    } finally { setSavingStatus(false); }
  };

  const updatePayStatus = async (paymentStatus: string) => {
    setSavingPay(true);
    setPayOpen(false);
    try {
      const res  = await fetch(`/api/admin/orders/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ paymentStatus }),
      });
      const data = await res.json();
      setOrder((prev: any) => ({ ...prev, paymentStatus: data.order.paymentStatus }));
    } finally { setSavingPay(false); }
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070707]">
        <Loader2 size={28} className="text-[#C9A86E] animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#070707]" dir="rtl">
        <p className="text-[#484542] font-tajawal mb-4">الطلب غير موجود</p>
        <Link href="/admin/orders" className="text-[#C9A86E] text-sm font-tajawal hover:underline">
          العودة للطلبات
        </Link>
      </div>
    );
  }

  const statusObj  = ORDER_STATUSES.find(s => s.id === order.status);
  const payObj     = PAY_STATUSES.find(s => s.id === order.paymentStatus);
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("ar-EG", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-[#070707] p-6 md:p-8" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[#484542] hover:text-[#EDE8DF] transition-colors mb-3 font-tajawal text-[12px]"
          >
            <ArrowRight size={13} />
            العودة للطلبات
          </button>
          <p className="text-[#C9A86E] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1">
            تفاصيل الطلب
          </p>
          <h1 className="font-cormorant text-[28px] font-light text-[#EDE8DF] flex items-center gap-3">
            #{id.slice(-8).toUpperCase()}
            <span className="text-[14px] text-[#484542] font-tajawal font-normal">
              {formatDate(order.createdAt)}
            </span>
          </h1>
        </div>

        {/* أزرار تغيير الحالة */}
        <div className="flex items-center gap-3 flex-wrap">

          {/* حالة الطلب */}
          <div className="relative">
            <button
              onClick={() => { setStatusOpen(v => !v); setPayOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[12px] font-tajawal transition-all ${statusObj?.color ?? ""}`}
            >
              {savingStatus
                ? <Loader2 size={12} className="animate-spin" />
                : <><span>{statusObj?.label ?? order.status}</span><ChevronDown size={12} /></>
              }
            </button>
            {statusOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
                <div className="absolute top-full mt-1 right-0 z-50 bg-[#121212] border border-[#262626] rounded-xl overflow-hidden min-w-[140px] shadow-2xl">
                  {ORDER_STATUSES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => updateStatus(s.id)}
                      className={`flex items-center gap-2 w-full text-right px-4 py-2.5 text-[12px] font-tajawal hover:bg-[#1A1A1A] transition-colors ${order.status === s.id ? "text-[#C9A86E]" : "text-[#8A8480]"}`}
                    >
                      {order.status === s.id && <Check size={11} />}
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* حالة الدفع */}
          <div className="relative">
            <button
              onClick={() => { setPayOpen(v => !v); setStatusOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#262626] bg-[#121212] text-[12px] font-tajawal text-[#8A8480]"
            >
              {savingPay
                ? <Loader2 size={12} className="animate-spin" />
                : <><span className={payObj?.color}>{payObj?.label ?? order.paymentStatus}</span><ChevronDown size={12} /></>
              }
            </button>
            {payOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPayOpen(false)} />
                <div className="absolute top-full mt-1 right-0 z-50 bg-[#121212] border border-[#262626] rounded-xl overflow-hidden min-w-[130px] shadow-2xl">
                  {PAY_STATUSES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => updatePayStatus(s.id)}
                      className={`flex items-center gap-2 w-full text-right px-4 py-2.5 text-[12px] font-tajawal hover:bg-[#1A1A1A] transition-colors ${order.paymentStatus === s.id ? s.color : "text-[#8A8480]"}`}
                    >
                      {order.paymentStatus === s.id && <Check size={11} />}
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── عمود يمين: العميل + العنوان + الدفع ── */}
        <div className="space-y-5">

          {/* معلومات العميل */}
          <Card title="معلومات العميل" icon={User}>
            <div className="flex items-center gap-3 mb-4">
              {order.user?.image ? (
                <Image src={order.user.image} alt="" width={40} height={40} className="rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1A1200] border border-[#C9A86E]/20 flex items-center justify-center">
                  <User size={16} className="text-[#C9A86E]" />
                </div>
              )}
              <div>
                <p className="text-[13px] font-bold text-[#EDE8DF] font-tajawal">
                  {order.user?.name ?? "بدون اسم"}
                </p>
                <p className="text-[10px] text-[#484542] font-tajawal">عميل</p>
              </div>
            </div>
            {order.user?.email && (
              <div className="flex items-center gap-2 py-2 border-t border-[#1A1A1A]">
                <Mail size={11} className="text-[#484542]" />
                <span className="text-[11px] text-[#8A8480] font-tajawal break-all">{order.user.email}</span>
              </div>
            )}
            {order.user?.phone && (
              <div className="flex items-center gap-2 py-2 border-t border-[#1A1A1A]">
                <Phone size={11} className="text-[#484542]" />
                <span className="text-[11px] text-[#8A8480] font-tajawal">{order.user.phone}</span>
              </div>
            )}
          </Card>

          {/* عنوان الشحن */}
          <Card title="عنوان الشحن" icon={MapPin}>
            {order.address ? (
              <div className="space-y-1.5">
                <InfoRow label="الاسم"    value={order.address.fullName} />
                <InfoRow label="الهاتف"   value={order.address.phone} />
                <InfoRow label="الشارع"   value={order.address.street} />
                <InfoRow label="المدينة"  value={order.address.city} />
                <InfoRow label="المحافظة" value={order.address.state} />
                <InfoRow label="الدولة"   value={order.address.country} />
                {order.address.postalCode && (
                  <InfoRow label="الرمز البريدي" value={order.address.postalCode} />
                )}
              </div>
            ) : (
              <p className="text-[12px] text-[#484542] font-tajawal">لا يوجد عنوان مسجّل</p>
            )}
          </Card>

          {/* معلومات الدفع */}
          <Card title="معلومات الدفع" icon={CreditCard}>
            <InfoRow
              label="طريقة الدفع"
              value={PAY_METHODS[order.paymentMethod ?? ""] ?? order.paymentMethod ?? "—"}
            />
            <InfoRow
              label="حالة الدفع"
              value={
                <span className={payObj?.color ?? "text-[#8A8480]"}>
                  {payObj?.label ?? order.paymentStatus}
                </span>
              }
            />
            {order.stripePaymentId && (
              <InfoRow label="Stripe ID" value={
                <span className="font-mono text-[10px] text-[#484542]">{order.stripePaymentId}</span>
              } />
            )}
            {order.couponCode && (
              <InfoRow label="كوبون الخصم" value={
                <span className="flex items-center gap-1 text-[#C9A86E]">
                  <Tag size={10} /> {order.couponCode}
                </span>
              } />
            )}
          </Card>

        </div>

        {/* ── عمود يسار: المنتجات + الملخص ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* منتجات الطلب */}
          <Card title={`منتجات الطلب (${order.items?.length ?? 0})`} icon={ShoppingBag}>
            <div className="space-y-3">
              {order.items?.map((item: any, i: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-[#121212] border border-[#1A1A1A] hover:border-[#262626] transition-colors"
                >
                  {/* صورة المنتج */}
                  <div className="w-16 h-20 rounded-lg bg-[#1A1A1A] flex-shrink-0 overflow-hidden flex items-center justify-center border border-[#262626] relative group cursor-pointer"
                    onClick={() => item.imageUrl && setPreviewImage(item.imageUrl)}
                  >
                    {item.imageUrl ? (
                      <>
                        <Image src={item.imageUrl} alt={item.nameAr} width={64} height={80} className="object-cover w-full h-full" />
                        {/* أيقونة تكبير عند التمرير */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn size={18} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <Package size={20} className="text-[#484542]" />
                    )}
                  </div>

                  {/* أزرار الصورة - تظهر لكل المنتجات التي لها صورة */}
                  {item.imageUrl && (
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadImage(item.imageUrl, `${item.nameAr || "تصميم"}.png`); }}
                        className="p-1.5 rounded-lg bg-[#1A1200] border border-[#C9A86E]/20 text-[#C9A86E] hover:bg-[#C9A86E]/20 transition-colors"
                        title="تحميل الصورة"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewImage(item.imageUrl); }}
                        className="p-1.5 rounded-lg bg-[#001018] border border-[#7EB8D4]/20 text-[#7EB8D4] hover:bg-[#7EB8D4]/20 transition-colors"
                        title="عرض بحجم كامل"
                      >
                        <ZoomIn size={14} />
                      </button>
                    </div>
                  )}

                  {/* التفاصيل */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#EDE8DF] font-tajawal truncate">
                      {item.nameAr}
                    </p>
                    <p className="text-[10px] text-[#C9A86E] font-tajawal mt-0.5 tracking-widest uppercase">
                      {item.brand}
                    </p>
                    {!item.productId && (
                      <span className="inline-block text-[9px] text-[#C9A86E] bg-[#1A1200] border border-[#C9A86E]/30 px-2 py-0.5 rounded-full font-tajawal mt-1">
                        ✦ تصميم مخصص
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {item.size && (
                        <span className="text-[10px] text-[#8A8480] font-tajawal bg-[#1A1A1A] px-2 py-0.5 rounded-md border border-[#262626]">
                          مقاس: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="text-[10px] text-[#8A8480] font-tajawal bg-[#1A1A1A] px-2 py-0.5 rounded-md border border-[#262626] flex items-center gap-1">
                          {item.variant?.colorHex && (
                            <span className="w-2.5 h-2.5 rounded-full inline-block border border-[#484542]" style={{ background: item.variant.colorHex }} />
                          )}
                          {item.color}
                        </span>
                      )}
                      <span className="text-[10px] text-[#8A8480] font-tajawal bg-[#1A1A1A] px-2 py-0.5 rounded-md border border-[#262626]">
                        الكمية: {item.qty}
                      </span>
                    </div>
                  </div>

                  {/* السعر */}
                  <div className="text-left flex-shrink-0">
                    <p className="text-[14px] font-bold text-[#C9A86E] font-cormorant">
                      {(item.price * item.qty).toLocaleString("ar-EG")}
                    </p>
                    <p className="text-[10px] text-[#484542] font-tajawal">ج.م</p>
                    {item.qty > 1 && (
                      <p className="text-[9px] text-[#484542] font-tajawal mt-0.5">
                        {item.price.toLocaleString("ar-EG")} × {item.qty}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* ملخص مالي */}
          <Card title="ملخص الطلب" icon={Tag}>
            <div className="space-y-0">
              <InfoRow label="المجموع الفرعي"
                value={`${order.subtotal?.toLocaleString("ar-EG") ?? 0} ج.م`} />
              <InfoRow label="الشحن"
                value={order.shippingCost > 0
                  ? `${order.shippingCost.toLocaleString("ar-EG")} ج.م`
                  : <span className="text-[#5CB87A]">مجاني</span>
                }
              />
              {order.discount > 0 && (
                <InfoRow label="الخصم"
                  value={<span className="text-[#D07070]">- {order.discount.toLocaleString("ar-EG")} ج.م</span>}
                />
              )}
              {order.couponCode && (
                <InfoRow label="كوبون"
                  value={<span className="text-[#C9A86E]">{order.couponCode}</span>}
                />
              )}
            </div>
            {/* الإجمالي */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#262626]">
              <span className="text-[13px] font-bold text-[#EDE8DF] font-tajawal">الإجمالي</span>
              <span className="font-cormorant text-[22px] text-[#C9A86E]">
                {order.total?.toLocaleString("ar-EG")} ج.م
              </span>
            </div>
          </Card>

          {/* ── اثبات التحويل ── */}
{order.notes && (
  <Card title="اثبات التحويل" icon={Hash}>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* عرض النص كسطور */}
      {order.notes.split('\n').map((line: string, i: number) => {
        // التحقق إذا كان السطر يحتوي على رابط صورة
        if (line.includes('صورة التحويل:') && line.includes('http')) {
          const imageUrl = line.replace('صورة التحويل:', '').trim();
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <p style={{ fontSize: 11, color: C.t2, fontFamily: "Tajawal, sans-serif" }}>
                صورة التحويل:
              </p>
              <div style={{
                width: "100%",
                maxWidth: 300,
                borderRadius: 10,
                overflow: "hidden",
                border: `1px solid ${C.b1}`,
                background: C.surf,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="إثبات التحويل"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 10,
                  color: C.gold,
                  fontFamily: "Tajawal, sans-serif",
                  textDecoration: "underline",
                }}
              >
                فتح الصورة في تبويب جديد
              </a>
            </div>
          );
        }
        // عرض النص العادي
        return (
          <p key={i} style={{ fontSize: 11, color: C.t2, fontFamily: "Tajawal, sans-serif", lineHeight: 1.7 }}>
            {line}
          </p>
        );
      })}
    </div>
  </Card>
)}ذ

        </div>
      </div>

      {/* ── مودال معاينة الصورة بحجم كامل ── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setPreviewImage(null)}
          >
            <X size={20} />
          </button>
          <div
            className="relative max-w-[90vw] max-h-[85vh] rounded-2xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="معاينة التصميم"
              className="w-full h-full object-contain"
            />
          </div>
          <a
            href={previewImage}
            download="تصميم.png"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A86E] text-[#070707] text-[13px] font-bold font-tajawal hover:bg-[#C9A86E]/80 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={15} />
            تحميل الصورة
          </a>
        </div>
      )}
    </div>
  );
}
