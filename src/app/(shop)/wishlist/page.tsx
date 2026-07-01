"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";

type WishlistProduct = {
  id: string;
  nameAr: string;
  nameEn: string;        // ← أضف هذا
  brand: string;
  price: number;
  origPrice: number | null;
  slug: string;
  images: { url: string }[];
  variants: { id: string; color: string; colorHex: string; size: string; stock: number }[];
  category: { slug: string };
};
type WishlistItem = {
  id: string;
  productId: string;
  product: WishlistProduct;
};

export default function WishlistPage() {
  const [items, setItems]     = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  const addToCart = useCartStore((s) => s.addItem);

  const fetchWishlist = async () => {
    const res  = await fetch("/api/wishlist");
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchWishlist(); }, []);

  const remove = async (productId: string) => {
    setRemoving(productId);
    await fetch("/api/wishlist", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ productId }),
    });
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    setRemoving(null);
  };

 const handleAddToCart = (item: WishlistItem) => {
  const firstVariant = item.product.variants.find((v) => v.stock > 0);
  if (!firstVariant) return;

  addToCart({
    id:       Date.now(),
    nameAr:   item.product.nameAr,
    nameEn:   item.product.nameEn,
    brand:    item.product.brand,
    price:    item.product.price,
    grad:     `linear-gradient(135deg, ${firstVariant.colorHex}, #0D0D0D)`,
    image:    item.product.images[0]?.url,
    size:     firstVariant.size,
    color:    firstVariant.color,
    colorHex: firstVariant.colorHex,
    quantity: 1,
  });
};

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-10" dir="rtl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-[#121212] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-10" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#C9A86E] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1">
          حسابي
        </p>
        <h1 className="font-cormorant text-[36px] font-light text-[#EDE8DF] flex items-center gap-3">
          المفضلة
          {items.length > 0 && (
            <span className="text-[16px] text-[#484542] font-tajawal">({items.length})</span>
          )}
        </h1>
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-28 gap-5">
          <div className="w-20 h-20 rounded-full bg-[#121212] border border-[#1A1A1A] flex items-center justify-center">
            <Heart size={30} className="text-[#484542]" />
          </div>
          <div className="text-center">
            <p className="font-cormorant text-2xl text-[#EDE8DF] mb-1">قائمة المفضلة فارغة</p>
            <p className="text-[12px] text-[#484542] font-tajawal">
              احفظ منتجاتك المفضلة لتجدها هنا
            </p>
          </div>
          <Link
            href="/shop"
            className="bg-[#C9A86E] text-[#060606] px-8 py-3 rounded-xl text-[13px] font-bold font-tajawal hover:brightness-110 transition-all"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <>
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map((item, i) => {
                const p        = item.product;
                const discount = p.origPrice
                  ? Math.round((1 - p.price / p.origPrice) * 100)
                  : null;
                const inStock  = p.variants.some((v) => v.stock > 0);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#121212] border border-[#1A1A1A]">
                      <Link href={`/product/${p.slug ?? p.id}`}>
                        {p.images[0] ? (
                          <Image
                            src={p.images[0].url}
                            alt={p.nameAr}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1E1E1E] to-[#0D0D0D]">
                            <span className="font-cormorant text-5xl text-[#262626]">V</span>
                          </div>
                        )}
                      </Link>

                      {discount && (
                        <span className="absolute top-2.5 right-2.5 bg-[#D07070] text-white text-[9px] font-bold px-2.5 py-[3px] rounded-full font-tajawal">
                          -{discount}%
                        </span>
                      )}

                      {/* Remove button */}
                      <button
                        onClick={() => remove(item.productId)}
                        disabled={removing === item.productId}
                        className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-black/60 border border-[#1A1A1A] flex items-center justify-center hover:border-[#D07070] hover:text-[#D07070] text-[#8A8480] transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="pt-3 px-0.5">
                      <p className="text-[10px] text-[#484542] font-tajawal">{p.brand}</p>
                      <p className="text-[13px] text-[#EDE8DF] font-tajawal mt-0.5 truncate">
                        {p.nameAr}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="font-cormorant text-[16px] text-[#C9A86E] font-bold">
                          {p.price.toLocaleString("ar-EG")}
                          <span className="text-[11px] font-tajawal font-normal mr-0.5">ج.م</span>
                        </span>
                        {p.origPrice && (
                          <span className="text-[11px] text-[#484542] line-through font-tajawal">
                            {p.origPrice.toLocaleString("ar-EG")}
                          </span>
                        )}
                      </div>

                      {/* Add to cart */}
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!inStock}
                        className={`w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-tajawal font-bold transition-all ${
                          inStock
                            ? "bg-[#1A1200] border border-[#C9A86E]/30 text-[#C9A86E] hover:bg-[#C9A86E] hover:text-[#060606]"
                            : "bg-[#0D0D0D] border border-[#1A1A1A] text-[#484542] cursor-not-allowed"
                        }`}
                      >
                        <ShoppingBag size={13} />
                        {inStock ? "أضف للسلة" : "غير متوفر"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>

          {/* Clear all */}
          <div className="flex justify-center mt-10">
            <button
              onClick={async () => {
                await fetch("/api/wishlist", { method: "DELETE" });
                setItems([]);
              }}
              className="flex items-center gap-2 text-[11px] text-[#484542] font-tajawal hover:text-[#D07070] transition-colors"
            >
              <Trash2 size={12} />
              مسح القائمة كاملاً
            </button>
          </div>
        </>
      )}
    </div>
  );
}
