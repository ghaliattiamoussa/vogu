// src/app/admin/vendor-products/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Package,
  Store,
  X,
  AlertCircle,
  ChevronLeft,
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

type Product = {
  id: string;
  nameAr: string;
  nameEn: string;
  brand: string;
  price: number;
  origPrice: number | null;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  createdAt: string;
  category: { nameAr: string };
  vendor: {
    storeName: string;
    contactName: string;
    email: string;
  } | null;
  images: { url: string }[];
  variants: { stock: number }[];
};

// ─── Status Badge ─────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "في انتظار المراجعة", color: C.gold, bg: `${C.gold}0D` },
    APPROVED: { label: "موافق عليه", color: C.ok, bg: `${C.ok}0D` },
    REJECTED: { label: "مرفوض", color: C.err, bg: `${C.err}0D` },
  };
  const s = map[status] || map.PENDING;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.color}33`,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 10,
        fontFamily: "Tajawal, sans-serif",
        fontWeight: 700,
        display: "inline-block",
      }}
    >
      {s.label}
    </span>
  );
}

// ─── Product Row ──────────────────────────────────────────────
function ProductRow({
  product,
  onAction,
  loading,
}: {
  product: Product;
  onAction: (id: string, action: "approve" | "reject", reason?: string) => void;
  loading: boolean;
}) {
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const isPending = product.approvalStatus === "PENDING";

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-[#EAE7E1] hover:bg-[#F5F3EF] transition-colors"
    >
      {/* اسم المنتج */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-14 rounded-lg bg-[#F5F3EF] overflow-hidden flex-shrink-0 border border-[#EAE7E1]">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.nameAr}
                width={40}
                height={56}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={16} className="text-[#A39E96]" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-[#1A1714] font-tajawal truncate max-w-[140px]">
              {product.nameAr}
            </p>
            <p className="text-[10px] text-[#6B6560] font-tajawal">
              {product.brand}
            </p>
          </div>
        </div>
      </td>

      {/* التاجر */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Store size={12} className="text-[#A8823C]" />
          <span className="text-[11px] text-[#1A1714] font-tajawal font-medium">
            {product.vendor?.storeName || "غير معروف"}
          </span>
        </div>
        <p className="text-[9px] text-[#A39E96] font-tajawal mt-0.5">
          {product.vendor?.contactName} · {product.vendor?.email}
        </p>
      </td>

      {/* السعر والمخزون */}
      <td className="px-4 py-3">
        <p className="text-[13px] font-bold text-[#A8823C] font-cormorant">
          {product.price.toLocaleString("ar-EG")}
          <span className="text-[10px] font-tajawal font-normal mr-0.5">ج.م</span>
        </p>
        <p className="text-[10px] text-[#6B6560] font-tajawal">
          مخزون: {totalStock} قطعة
        </p>
      </td>

      {/* الحالة */}
      <td className="px-4 py-3">
        <StatusBadge status={product.approvalStatus} />
        {product.rejectionReason && (
          <p className="text-[9px] text-[#C0504D] font-tajawal mt-1 max-w-[140px] truncate">
            السبب: {product.rejectionReason}
          </p>
        )}
      </td>

      {/* الإجراءات */}
      <td className="px-4 py-3">
        {isPending ? (
          <div className="flex items-center gap-2">
            {/* موافقة */}
            <button
              onClick={() => onAction(product.id, "approve")}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold font-tajawal bg-[#3D9960]0D border border-[#3D9960]/30 text-[#3D9960] hover:bg-[#3D9960] hover:text-white transition-all disabled:opacity-50"
            >
              <Check size={12} />
              موافقة
            </button>

            {/* رفض */}
            {!showReject ? (
              <button
                onClick={() => setShowReject(true)}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold font-tajawal bg-[#C0504D]0D border border-[#C0504D]/30 text-[#C0504D] hover:bg-[#C0504D] hover:text-white transition-all disabled:opacity-50"
              >
                <X size={12} />
                رفض
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-[#F5F3EF] p-1 rounded-lg border border-[#EAE7E1]">
                <input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="سبب الرفض..."
                  className="bg-transparent border-none outline-none text-[10px] text-[#1A1714] font-tajawal w-24 placeholder:text-[#A39E96]"
                  dir="rtl"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (!rejectReason.trim()) {
                      toast.error("يرجى كتابة سبب الرفض");
                      return;
                    }
                    onAction(product.id, "reject", rejectReason.trim());
                    setShowReject(false);
                    setRejectReason("");
                  }}
                  className="p-1 rounded bg-[#C0504D] text-white hover:brightness-110 transition-all"
                >
                  <Check size={10} />
                </button>
                <button
                  onClick={() => {
                    setShowReject(false);
                    setRejectReason("");
                  }}
                  className="p-1 rounded bg-[#EAE7E1] text-[#6B6560] hover:bg-[#DDD9D1] transition-all"
                >
                  <X size={10} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="text-[11px] text-[#A8823C] font-tajawal hover:underline flex items-center gap-1"
          >
            عرض <ChevronLeft size={10} />
          </Link>
        )}
      </td>
    </motion.tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AdminVendorProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">(
    "PENDING"
  );

  // ── Guard ──
  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [session, status, router]);

  // ── Fetch ──
  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "ALL") params.set("status", filter);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchProducts();
    }
  }, [session, filter]);

  // ── Action ──
  const handleAction = async (
    id: string,
    action: "approve" | "reject",
    reason?: string
  ) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalStatus: action === "approve" ? "APPROVED" : "REJECTED",
          rejectionReason: reason || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "فشل تحديث الحالة");
        return;
      }

      toast.success(
        action === "approve"
          ? "✅ تمت الموافقة على المنتج"
          : "❌ تم رفض المنتج"
      );
      fetchProducts();
    } catch {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setActionLoading(null);
    }
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-[#A8823C] animate-spin" />
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "ADMIN") return null;

  const pendingCount = products.filter((p) => p.approvalStatus === "PENDING").length;

  return (
    <div className="p-6 md:p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-[#A8823C] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1">
            لوحة التحكم
          </p>
          <h1 className="font-cormorant text-[34px] font-light text-[#1A1714]">
            منتجات التجار
            <span className="text-[18px] text-[#A39E96] font-tajawal mr-3">
              ({products.length})
            </span>
          </h1>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-[#F5F3EF] p-1 rounded-xl border border-[#EAE7E1]">
          {[
            { id: "PENDING", label: `معلقة (${pendingCount})` },
            { id: "APPROVED", label: "موافق" },
            { id: "REJECTED", label: "مرفوض" },
            { id: "ALL", label: "الكل" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-tajawal transition-all ${
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

      {/* ── Table ── */}
      <div className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EAE7E1] bg-[#F5F3EF]">
                {["المنتج", "التاجر", "السعر", "الحالة", "إجراءات"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] text-[#6B6560] font-tajawal font-normal text-right"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#EAE7E1]">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-[#F5F3EF] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <Package size={32} className="text-[#A39E96] mx-auto mb-3" />
                    <p className="text-[13px] text-[#6B6560] font-tajawal">
                      {filter === "PENDING"
                        ? "لا توجد منتجات معلقة للمراجعة"
                        : "لا توجد منتجات في هذه الفئة"}
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onAction={handleAction}
                    loading={actionLoading === product.id}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Info box ── */}
      <div className="mt-6 bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-[#A8823C] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] text-[#1A1714] font-tajawal">
            عند الموافقة على منتج تاجر، يصبح <strong>نشطاً ومرئياً للعملاء</strong> تلقائياً.
          </p>
          <p className="text-[11px] text-[#6B6560] font-tajawal mt-1">
            يمكنك أيضاً تعديل أي منتج من خلال زر "عرض" بعد الموافقة أو الرفض.
          </p>
        </div>
      </div>
    </div>
  );
}