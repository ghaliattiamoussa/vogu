// src/components/shop/QuickViewModal.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { SizeSelector } from "./SizeSelector";
import { ColorSelector } from "./ColorSelector";
import { QuantitySelector } from "./QuantitySelector";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/constants";

interface Product {
  id: string; name: string; price: number; compareAtPrice?: number;
  images: string[]; sizes?: string[]; colors?: { n: string; h: string }[];
  rating?: number; reviewCount?: number; isNew?: boolean; onSale?: boolean;
  stock: number; category: string;
}

interface QuickViewModalProps {
  product: Product | null;
  open:    boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [size,     setSize]     = useState("");
  const [color,    setColor]    = useState("");
  const [qty,      setQty]      = useState(1);
  const [imgIdx,   setImgIdx]   = useState(0);
  const [added,    setAdded]    = useState(false);
  const addToCart = useCartStore(s => s.addItem);

  if (!product) return null;

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const handleAdd = () => {
  const selectedColor = product.colors?.find((c) => c.n === color);

  addToCart({
    id:       Date.now(),                          // ← number تلقائي
    nameAr:   product.name,
    nameEn:   product.name,
    brand:    product.category ?? "VŌGU",
    price:    product.price,
    grad:     selectedColor
                ? `linear-gradient(135deg, ${selectedColor.h}, #0D0D0D)`
                : "linear-gradient(135deg, #C9A86E, #0D0D0D)",
    image:    product.images[0],
    size,
    color,
    colorHex: selectedColor?.h ?? "#C9A86E",
    quantity: qty,
  });

  setAdded(true);
  setTimeout(() => { setAdded(false); onClose(); }, 1200);
};
  return (
    <Modal open={open} onClose={onClose} size="xl">
      <div className="flex flex-col sm:flex-row gap-6" dir="rtl">
        {/* الصور */}
        <div className="sm:w-80 shrink-0">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#0D0D0D]">
            {product.images[imgIdx] && (
              <Image src={product.images[imgIdx]} alt={product.name} fill className="object-cover" />
            )}
            {product.isNew  && <Badge className="absolute top-2 right-2">جديد</Badge>}
            {product.onSale && discount > 0 && <Badge variant="red" className="absolute top-2 left-2">-{discount}%</Badge>}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-2">
              {product.images.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`relative w-14 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? "border-[#C9A86E]" : "border-transparent opacity-60"}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* التفاصيل */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <p className="text-xs text-[#C9A86E] font-[Tajawal] mb-1 uppercase tracking-widest">{product.category}</p>
            <h2 className="text-xl font-bold text-[#EDE8DF] font-[Tajawal]">{product.name}</h2>
            {product.rating && (
              <div className="flex items-center gap-2 mt-1">
                <StarRating value={Math.round(product.rating)} readonly size="sm" />
                <span className="text-xs text-[#484542] font-[Tajawal]">({product.reviewCount?.toLocaleString("ar-EG")})</span>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-[#C9A86E] font-[Tajawal]">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-[#484542] line-through font-[Tajawal]">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <SizeSelector sizes={product.sizes} selected={size} onChange={setSize} />
          )}
          {product.colors && product.colors.length > 0 && (
            <ColorSelector colors={product.colors} selected={color} onChange={setColor} />
          )}

          <QuantitySelector qty={qty} onChange={setQty} max={product.stock} />

          <div className="flex gap-3 mt-2">
            <Button onClick={handleAdd} fullWidth disabled={product.stock === 0} loading={added}
              className={added ? "bg-[#5CB87A]!" : ""}>
              {added ? "✓ تمت الإضافة" : product.stock === 0 ? "نفد المخزون" : "أضف للسلة"}
            </Button>
            <Link href={`/product/${product.id}`} onClick={onClose}
              className="px-4 py-3 border border-[#262626] rounded-xl text-sm text-[#8A8480] hover:text-[#EDE8DF] hover:border-[#484542] transition-all font-[Tajawal] whitespace-nowrap flex items-center">
              عرض كامل
            </Link>
          </div>

          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-[#D07070] font-[Tajawal]">⚠ آخر {product.stock.toLocaleString("ar-EG")} قطع فقط!</p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default QuickViewModal;
