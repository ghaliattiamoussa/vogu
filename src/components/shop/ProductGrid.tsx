// src/components/shop/ProductGrid.tsx
"use client";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import type { Product } from "@/types";

interface ProductGridProps {
  products:    Product[];
  loading?:    boolean;
  page?:       number;
  totalPages?: number;
  onPageChange?: (p: number) => void;
  emptyMessage?: string;
}

export function ProductGrid({ products, loading, page = 1, totalPages = 1, onPageChange, emptyMessage = "لا توجد منتجات" }: ProductGridProps) {
  if (loading) return <ProductGridSkeleton count={8} />;
  if (!products.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4">🛍️</span>
      <p className="text-[#8A8480] font-[Tajawal]">{emptyMessage}</p>
    </div>
  );
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange!} />}
    </div>
  );
}
export default ProductGrid;
