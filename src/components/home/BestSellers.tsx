// src/components/home/BestSellers.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, TrendingUp } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

import type { Product } from "@/types";


export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch("/api/products?sort=popular&limit=6")
      .then(r => r.json())
      .then(d => { setProducts(d.products ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 bg-[#0A0A0A]" dir="rtl">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 max-w-7xl mx-auto">
        <div>
          <p className="text-xs text-[#C9A86E] font-[Tajawal] tracking-[0.3em] uppercase mb-2 flex items-center gap-2">
            <TrendingUp size={12} />
            الأكثر طلباً
          </p>
          <h2 className="text-3xl font-bold text-[#EDE8DF]" style={{ fontFamily: "'Cormorant Garant', serif" }}>
            الأكثر مبيعاً
          </h2>
        </div>
        <Link href="/shop?sort=popular"
          className="text-sm text-[#C9A86E] font-[Tajawal] hover:underline flex items-center gap-1">
          عرض الكل <ChevronLeft size={14} />
        </Link>
      </div>

      {/* الشبكة */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-3 sm:gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((p, i) => (
              <div key={p.id} className="relative">
                {/* ترتيب الأفضل مبيعاً */}
                {i < 3 && (
                  <span className="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-[#C9A86E] text-[#060606] text-xs font-bold flex items-center justify-center font-[Tajawal] shadow-lg">
                    {(i + 1).toLocaleString("ar-EG")}
                  </span>
                )}
                <ProductCard product={p} />
              </div>
            ))
        }
      </div>
    </section>
  );
}

export default BestSellers;
