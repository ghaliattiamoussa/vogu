// src/components/cart/EmptyCart.tsx
"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center" dir="rtl">
      {/* أيقونة */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-[#121212] border border-[#1A1A1A] flex items-center justify-center">
          <ShoppingBag size={36} className="text-[#262626]" />
        </div>
        <span className="absolute -top-1 -right-1 text-2xl">🛍️</span>
      </div>

      <h2 className="text-xl font-bold text-[#EDE8DF] font-[Tajawal] mb-2">
        سلتك فارغة!
      </h2>
      <p className="text-sm text-[#8A8480] font-[Tajawal] mb-8 max-w-xs leading-relaxed">
        لم تضف أي منتجات بعد. اكتشف أحدث صيحات الموضة وأضف ما يعجبك.
      </p>

      <Link href="/shop">
        <Button size="lg">
          تسوق الآن
        </Button>
      </Link>

      {/* اقتراحات سريعة */}
      <div className="flex flex-wrap gap-2 justify-center mt-8">
        {["نساء", "رجال", "أطفال", "تخفيضات"].map(cat => (
          <Link
            key={cat}
            href={`/category/${cat === "نساء" ? "women" : cat === "رجال" ? "men" : cat === "أطفال" ? "kids" : "sale"}`}
            className="text-xs text-[#8A8480] border border-[#1A1A1A] px-4 py-1.5 rounded-full font-[Tajawal] hover:border-[#C9A86E] hover:text-[#C9A86E] transition-all"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default EmptyCart;
