// src/components/cart/CartItem.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { QuantitySelector } from "@/components/shop/QuantitySelector";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/constants";

interface CartItemProps {
  item: {
    id:       string;
    name:     string;
    price:    number;
    image:    string;
    size?:    string;
    color?:   string;
    quantity: number;
  };
}

export function CartItem({ item }: CartItemProps) {
  const updateQty    = useCartStore(s => s.updateQuantity);
  const removeItem   = useCartStore(s => s.removeItem);

  return (
    <div className="flex gap-3 py-4 border-b border-[#1A1A1A] last:border-0" dir="rtl">
      {/* صورة المنتج */}
      <Link href={`/product/${item.id}`} className="shrink-0">
        <div className="relative w-20 aspect-[3/4] rounded-xl overflow-hidden bg-[#1A1A1A]">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#262626]" />
          )}
        </div>
      </Link>

      {/* التفاصيل */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/product/${item.id}`}>
              <p className="text-sm font-medium text-[#EDE8DF] font-[Tajawal] line-clamp-2 hover:text-[#C9A86E] transition-colors">
                {item.name}
              </p>
            </Link>
            {/* المقاس واللون */}
            <div className="flex gap-2 mt-1 flex-wrap">
              {item.size && (
                <span className="text-xs text-[#484542] font-[Tajawal] bg-[#1A1A1A] px-2 py-0.5 rounded-md">
                  {item.size}
                </span>
              )}
              {item.color && (
                <span className="text-xs text-[#484542] font-[Tajawal] bg-[#1A1A1A] px-2 py-0.5 rounded-md">
                  {item.color}
                </span>
              )}
            </div>
          </div>

          {/* زر الحذف */}
          <button
            onClick={() => removeItem(item.id, item.size, item.color)}
            className="shrink-0 p-1.5 rounded-lg text-[#484542] hover:text-[#D07070] hover:bg-[#1A1A1A] transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* السعر والكمية */}
        <div className="flex items-center justify-between mt-2">
          <QuantitySelector
            value={item.quantity}
            onChange={(v) => updateQty(item.id, v, item.size, item.color)}
            size="sm"
          />
          <span className="text-sm font-bold text-[#C9A86E] font-[Tajawal]">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
