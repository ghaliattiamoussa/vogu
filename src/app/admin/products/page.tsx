"use client";

import { motion } from "framer-motion";
import {
  Eye, EyeOff, Package, Pencil, Plus, Search, Star, X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────
type Variant = { stock: number };

type Product = {
  id: string;
  nameAr: string;
  nameEn: string;
  brand: string;
  price: number;
  origPrice: number | null;
  isActive: boolean;
  isNew: boolean;
  isBest: boolean;
  slug: string;
  createdAt: string;
  category: { nameAr: string; slug: string };
  images: { url: string }[];
  variants: Variant[];
  _count: { reviews: number };
};

// ─── Product Row ──────────────────────────────────────────────
function ProductRow({
  product,
  onToggle,
}: {
  product: Product;
  onToggle: (id: string, active: boolean) => void;
}) {
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const isLow      = totalStock > 0 && totalStock <= 10;
  const isOut      = totalStock === 0;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-[#1A1A1A] hover:bg-[#0D0D0D] transition-colors"
    >
      {/* Image + Name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-14 rounded-lg bg-[#1A1A1A] overflow-hidden flex-shrink-0">
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
                <span className="font-cormorant text-lg text-[#262626]">V</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-[#EDE8DF] font-tajawal truncate max-w-[160px]">
              {product.nameAr}
            </p>
            <p className="text-[10px] text-[#484542] font-tajawal">{product.brand}</p>
            <p className="text-[10px] text-[#484542] font-tajawal">{product.category.nameAr}</p>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-3 text-right">
        <p className="text-[13px] font-bold text-[#C9A86E] font-cormorant">
          {product.price.toLocaleString("ar-EG")}
          <span className="text-[10px] font-tajawal font-normal mr-0.5">ج.م</span>
        </p>
        {product.origPrice && (
          <p className="text-[10px] text-[#484542] line-through font-tajawal">
            {product.origPrice.toLocaleString("ar-EG")}
          </p>
        )}
      </td>

      {/* Stock */}
      <td className="px-4 py-3 text-center">
        <span
          className={`text-[11px] font-tajawal px-2 py-0.5 rounded-full ${
            isOut
              ? "bg-[#1A0808] text-[#D07070]"
              : isLow
              ? "bg-[#1A1200] text-[#C9A86E]"
              : "bg-[#001A08] text-[#5CB87A]"
          }`}
        >
          {isOut ? "نفد" : `${totalStock} قطعة`}
        </span>
      </td>

      {/* Badges */}
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          {product.isNew && (
            <span className="text-[9px] bg-[#1A1200] text-[#C9A86E] border border-[#C9A86E]/20 px-1.5 py-0.5 rounded font-tajawal">
              جديد
            </span>
          )}
          {product.isBest && (
            <span className="text-[9px] bg-[#001018] text-[#7EB8D4] border border-[#7EB8D4]/20 px-1.5 py-0.5 rounded font-tajawal flex items-center gap-0.5">
              <Star size={8} /> مميز
            </span>
          )}
        </div>
      </td>

      {/* Reviews */}
      <td className="px-4 py-3 text-center">
        <span className="text-[12px] text-[#8A8480] font-tajawal">
          {product._count.reviews}
        </span>
      </td>

      {/* Status toggle */}
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => onToggle(product.id, !product.isActive)}
          className={`flex items-center gap-1.5 mx-auto text-[11px] font-tajawal px-3 py-1.5 rounded-lg border transition-all ${
            product.isActive
              ? "bg-[#001A08] border-[#5CB87A]/30 text-[#5CB87A] hover:bg-[#002A10]"
              : "bg-[#1A0808] border-[#D07070]/30 text-[#D07070] hover:bg-[#2A0808]"
          }`}
        >
          {product.isActive ? (
            <><Eye size={11} /> نشط</>
          ) : (
            <><EyeOff size={11} /> مخفي</>
          )}
        </button>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-3">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="text-[11px] text-[#8A8480] font-tajawal hover:text-[#C9A86E] transition-colors flex items-center gap-1"
          >
            <Pencil size={11} />
            تعديل
          </Link>
          <Link
            href={`/product/${product.slug ?? product.id}`}
            target="_blank"
            className="text-[11px] text-[#8A8480] font-tajawal hover:text-[#C9A86E] transition-colors"
          >
            عرض ←
          </Link>
        </div>
      </td>
    </motion.tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [q, setQ]               = useState("");
  const [page, setPage]         = useState(1);
  const [category, setCategory] = useState("all");

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category !== "all") params.set("category", category);
    params.set("page",  String(page));
    params.set("limit", "20");

    const res  = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setTotal(data.pagination?.total ?? 0);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [q, page, category]);

  const toggleActive = async (id: string, active: boolean) => {
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: active } : p))
    );
    await fetch(`/api/admin/products/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ isActive: active }),
    });
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6 md:p-8" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#C9A86E] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1">
            لوحة التحكم
          </p>
          <h1 className="font-cormorant text-[34px] font-light text-[#EDE8DF]">
            المنتجات
            <span className="text-[18px] text-[#484542] font-tajawal mr-3">
              ({total})
            </span>
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#C9A86E] text-[#060606] px-5 py-2.5 rounded-xl text-[13px] font-bold font-tajawal hover:brightness-110 transition-all"
        >
          <Plus size={15} />
          منتج جديد
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-3 py-2.5 flex-1 min-w-[200px] max-w-[340px] focus-within:border-[#C9A86E]/40 transition-colors">
          <Search size={13} className="text-[#484542]" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="ابحث باسم المنتج أو الماركة..."
            className="bg-transparent text-[12px] text-[#EDE8DF] placeholder-[#484542] outline-none flex-1 font-tajawal"
            dir="rtl"
          />
          {q && (
            <button onClick={() => setQ("")}>
              <X size={11} className="text-[#484542]" />
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-[12px] text-[#EDE8DF] font-tajawal outline-none cursor-pointer"
          dir="rtl"
        >
          <option value="all">كل الفئات</option>
          <option value="women">نساء</option>
          <option value="men">رجال</option>
          <option value="kids">أطفال</option>
          <option value="sale">تخفيضات</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A] bg-[#121212]">
                {["المنتج", "السعر", "المخزون", "الحالة", "التقييمات", "التفعيل", "إجراءات"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] text-[#484542] font-tajawal font-normal text-right"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1A1A1A]">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-[#1A1A1A] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Package size={32} className="text-[#484542] mx-auto mb-3" />
                    <p className="text-[13px] text-[#484542] font-tajawal">
                      لا توجد منتجات
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onToggle={toggleActive}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-[13px] font-tajawal transition-all ${
                p === page
                  ? "bg-[#C9A86E] text-[#060606] font-bold"
                  : "bg-[#0D0D0D] border border-[#1A1A1A] text-[#8A8480] hover:border-[#C9A86E]/40"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}