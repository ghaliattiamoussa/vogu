// src/app/(vendor)/vendor/dashboard/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  Store,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useVendorSession } from "@/hooks/useVendorSession";

// ─── Light Theme Palette ──────────────────────────────────────
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
  ok:   "#3D9960",
} as const;

type Stats = {
  products: { total: number; pending: number };
  orders: { total: number; awaitingShipment: number };
  revenue: { total: number };
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
      className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl p-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon size={18} />
        </div>
      </div>
      <p className="font-cormorant text-[32px] font-light text-[#1A1714] leading-none">
        {value}
      </p>
      <p className="text-[12px] text-[#6B6560] font-tajawal mt-1">{title}</p>
      <p className="text-[10px] text-[#A39E96] font-tajawal mt-0.5">{sub}</p>
    </motion.div>
  );
}

// ─── Quick Actions ─────────────────────────────────────────────
function QuickActions() {
  return (
    <div className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl p-5">
      <h2 className="font-cormorant text-[18px] text-[#1A1714] mb-4">
        إجراءات سريعة
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/vendor/products/new"
          className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[#A8823C]0D border border-[#A8823C]/30 text-[#A8823C] hover:bg-[#A8823C] hover:text-white transition-all text-[12px] font-bold font-tajawal"
        >
          <Package size={16} />
          إضافة منتج
        </Link>
        <Link
          href="/vendor/products"
          className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[#F5F3EF] border border-[#EAE7E1] text-[#1A1714] hover:bg-[#EAE7E1] transition-all text-[12px] font-bold font-tajawal"
        >
          <ShoppingBag size={16} />
          إدارة المنتجات
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function VendorDashboardPage() {
  const { vendor, loading: authLoading } = useVendorSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch stats ──
  const fetchStats = async () => {
    if (!vendor) return;
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/stats");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && vendor) {
      fetchStats();
    }
  }, [authLoading, vendor]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-[#A8823C] animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return null;
  }

  const hasPending = stats?.products?.pending && stats.products.pending > 0;
  const hasAwaiting = stats?.orders?.awaitingShipment && stats.orders.awaitingShipment > 0;

  return (
    <div style={{ padding: "28px 24px", minHeight: "100%" }} dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#A8823C] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1">
          بوابة التجار
        </p>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-cormorant text-[30px] font-light text-[#1A1714]">
            مرحباً، {vendor.name} 👋
          </h1>
          <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#EAE7E1] rounded-xl px-4 py-2">
            <Store size={14} className="text-[#A8823C]" />
            <p className="text-[11px] text-[#1A1714] font-tajawal font-bold">
              {vendor.businessName}
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="إجمالي المنتجات"
            value={stats.products.total}
            sub={`${stats.products.pending} في انتظار المراجعة`}
            icon={Package}
            color="bg-[#A8823C]0D text-[#A8823C]"
            delay={0}
          />
          <StatCard
            title="إجمالي الطلبات"
            value={stats.orders.total}
            sub={`${stats.orders.awaitingShipment} في انتظار التجهيز`}
            icon={ShoppingBag}
            color="bg-[#3D9960]0D text-[#3D9960]"
            delay={0.08}
          />
          <StatCard
            title="الإيرادات"
            value={`${stats.revenue.total.toLocaleString("ar-EG")} ج.م`}
            sub="إجمالي المبيعات"
            icon={TrendingUp}
            color="bg-[#2E7BA4]0D text-[#2E7BA4]"
            delay={0.16}
          />
        </div>
      )}

      {/* ── Alerts ── */}
      {(hasPending || hasAwaiting) && (
        <div className="mb-6 space-y-2">
          {hasPending && (
            <div className="flex items-center gap-3 bg-[#A8823C]0D border border-[#A8823C]/30 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-[#A8823C] flex-shrink-0" />
              <p className="text-[12px] text-[#1A1714] font-tajawal">
                لديك{" "}
                <Link
                  href="/vendor/products"
                  className="font-bold text-[#A8823C] hover:underline"
                >
                  {stats?.products.pending} منتج
                </Link>{" "}
                في انتظار مراجعة الإدمن
              </p>
            </div>
          )}
          {hasAwaiting && (
            <div className="flex items-center gap-3 bg-[#3D9960]0D border border-[#3D9960]/30 rounded-xl px-4 py-3">
              <Clock size={16} className="text-[#3D9960] flex-shrink-0" />
              <p className="text-[12px] text-[#1A1714] font-tajawal">
                لديك{" "}
                <Link
                  href="/vendor/orders"
                  className="font-bold text-[#3D9960] hover:underline"
                >
                  {stats?.orders.awaitingShipment} طلب
                </Link>{" "}
                في انتظار التجهيز والشحن للإدمن
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Quick Actions ── */}
      <QuickActions />

      {/* ── Info Box ── */}
      <div className="mt-6 bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-[#A8823C] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] text-[#1A1714] font-tajawal">
            <strong>مرحباً بك في بوابة التجار!</strong>
          </p>
          <p className="text-[11px] text-[#6B6560] font-tajawal mt-1">
            • أضف منتجاتك الجديدة وسيتم مراجعتها من قبل الإدمن.
            <br />
            • تابع طلباتك وقم بتجهيزها وشحنها للإدمن.
            <br />
            • لا تظهر بيانات العملاء هنا — للحفاظ على خصوصيتهم.
          </p>
        </div>
      </div>
    </div>
  );
}