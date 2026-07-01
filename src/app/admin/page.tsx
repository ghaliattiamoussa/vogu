"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────
type Stats = {
  orders:    { total: number; thisMonth: number };
  revenue:   { total: number; thisMonth: number };
  customers: { total: number; new30d: number };
  products:  { total: number; lowStock: number };
  recentOrders: {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    user: { name: string | null; email: string | null } | null;
    _count: { items: number };
  }[];
  topProducts: {
    productId: string;
    _sum: { qty: number | null };
    product: { nameAr: string; brand: string } | null;
  }[];
};

// ─── Status badge ─────────────────────────────────────────────
const STATUS_COLOR: Record<string, string> = {
  PENDING:    "text-[#C9A86E] bg-[#1A1200]",
  CONFIRMED:  "text-[#5CB87A] bg-[#001A08]",
  PROCESSING: "text-[#7EB8D4] bg-[#001018]",
  SHIPPED:    "text-[#A078D4] bg-[#0A0018]",
  DELIVERED:  "text-[#5CB87A] bg-[#001A08]",
  CANCELLED:  "text-[#D07070] bg-[#1A0808]",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING:    "انتظار",
  CONFIRMED:  "مؤكد",
  PROCESSING: "تجهيز",
  SHIPPED:    "شحن",
  DELIVERED:  "تسليم",
  CANCELLED:  "ملغي",
};

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  color,
  delay,
}: {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5 hover:border-[#262626] transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon size={18} />
        </div>
        <ArrowUpRight size={14} className="text-[#484542]" />
      </div>
      <p className="font-cormorant text-[32px] font-light text-[#EDE8DF] leading-none">
        {value}
      </p>
      <p className="text-[12px] text-[#8A8480] font-tajawal mt-1">{title}</p>
      <p className="text-[10px] text-[#484542] font-tajawal mt-0.5">{sub}</p>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-[#0D0D0D] rounded-2xl animate-pulse border border-[#1A1A1A]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-72 bg-[#0D0D0D] rounded-2xl animate-pulse border border-[#1A1A1A]" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 md:p-8" dir="rtl">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[#C9A86E] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1">
          لوحة التحكم
        </p>
        <h1 className="font-cormorant text-[34px] font-light text-[#EDE8DF]">
          مرحباً بك
        </h1>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="إجمالي الطلبات"
          value={stats.orders.total.toLocaleString("ar-EG")}
          sub={`+${stats.orders.thisMonth} هذا الشهر`}
          icon={ShoppingBag}
          color="bg-[#1A1200] text-[#C9A86E]"
          delay={0}
        />
        <StatCard
          title="الإيرادات (ج.م)"
          value={stats.revenue.total.toLocaleString("ar-EG")}
          sub={`+${stats.revenue.thisMonth.toLocaleString("ar-EG")} هذا الشهر`}
          icon={TrendingUp}
          color="bg-[#001A08] text-[#5CB87A]"
          delay={0.08}
        />
        <StatCard
          title="إجمالي العملاء"
          value={stats.customers.total.toLocaleString("ar-EG")}
          sub={`+${stats.customers.new30d} آخر 30 يوم`}
          icon={Users}
          color="bg-[#001018] text-[#7EB8D4]"
          delay={0.16}
        />
        <StatCard
          title="المنتجات النشطة"
          value={stats.products.total.toLocaleString("ar-EG")}
          sub={`${stats.products.lowStock} منخفض المخزون`}
          icon={Package}
          color="bg-[#0A0018] text-[#A078D4]"
          delay={0.24}
        />
      </div>

      {/* Low stock warning */}
      {stats.products.lowStock > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 bg-[#1A0E00] border border-[#C9A86E]/20 rounded-xl px-4 py-3 mb-6"
        >
          <AlertTriangle size={16} className="text-[#C9A86E] flex-shrink-0" />
          <p className="text-[12px] text-[#C9A86E] font-tajawal">
            تنبيه: {stats.products.lowStock} منتج وصل لمخزون منخفض (5 قطع أو أقل)
          </p>
          <Link
            href="/admin/products"
            className="mr-auto text-[11px] text-[#C9A86E] font-tajawal hover:underline whitespace-nowrap"
          >
            عرض المنتجات ←
          </Link>
        </motion.div>
      )}

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-cormorant text-[18px] text-[#EDE8DF]">
              أحدث الطلبات
            </h2>
            <Link
              href="/admin/orders"
              className="text-[11px] text-[#C9A86E] font-tajawal hover:underline"
            >
              عرض الكل ←
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <p className="text-[12px] text-[#484542] font-tajawal text-center py-6">
                لا توجد طلبات بعد
              </p>
            ) : (
              stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#121212] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#EDE8DF] font-tajawal truncate">
                      {order.user?.name ?? order.user?.email ?? "ضيف"}
                    </p>
                    <p className="text-[10px] text-[#484542] font-tajawal mt-0.5">
                      #{order.id.slice(-6).toUpperCase()} · {order._count.items} منتج
                    </p>
                  </div>
                  <div className="text-left">
                    <span
                      className={`text-[10px] font-tajawal px-2 py-0.5 rounded-full ${
                        STATUS_COLOR[order.status] ?? "text-[#8A8480] bg-[#121212]"
                      }`}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    <p className="text-[12px] text-[#C9A86E] font-cormorant mt-1 text-left">
                      {order.total.toLocaleString("ar-EG")} ج.م
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-cormorant text-[18px] text-[#EDE8DF]">
              الأكثر مبيعاً
            </h2>
            <Link
              href="/admin/products"
              className="text-[11px] text-[#C9A86E] font-tajawal hover:underline"
            >
              عرض الكل ←
            </Link>
          </div>

          <div className="space-y-3">
            {stats.topProducts.length === 0 ? (
              <p className="text-[12px] text-[#484542] font-tajawal text-center py-6">
                لا توجد بيانات مبيعات بعد
              </p>
            ) : (
              stats.topProducts.map((tp, i) => (
                <div
                  key={tp.productId}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#121212] transition-colors"
                >
                  {/* Rank */}
                  <span className="w-6 h-6 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[11px] text-[#8A8480] font-cormorant flex-shrink-0">
                    {i + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#EDE8DF] font-tajawal truncate">
                      {tp.product?.nameAr ?? "منتج محذوف"}
                    </p>
                    <p className="text-[10px] text-[#484542] font-tajawal mt-0.5">
                      {tp.product?.brand}
                    </p>
                  </div>

                  <div className="text-left flex-shrink-0">
                    <p className="text-[12px] font-bold text-[#C9A86E] font-cormorant">
                      {tp._sum.qty ?? 0}
                    </p>
                    <p className="text-[9px] text-[#484542] font-tajawal">قطعة</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
