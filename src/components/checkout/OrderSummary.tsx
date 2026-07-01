// src/components/checkout/OrderSummary.tsx
"use client";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice, FREE_SHIPPING_THRESHOLD, SHIPPING_OPTIONS } from "@/lib/constants";

interface OrderSummaryProps {
  shippingCost?: number;
  discount?:     number;
}

export function OrderSummary({ shippingCost, discount = 0 }: OrderSummaryProps) {
  const items    = useCartStore(s => s.items);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = shippingCost ?? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_OPTIONS[0].price);
  const total    = subtotal + shipping - discount;

  return (
    <div className="bg-[#121212] border border-[#1A1A1A] rounded-2xl overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1A1A1A]">
        <h3 className="text-sm font-bold text-[#EDE8DF] font-[Tajawal]">
          ملخص الطلب
          <span className="text-[#484542] font-normal mr-2">
            ({items.length.toLocaleString("ar-EG")} {items.length === 1 ? "منتج" : "منتجات"})
          </span>
        </h3>
      </div>

      {/* المنتجات */}
      <div className="px-5 py-3 flex flex-col gap-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 items-center">
            {/* صورة */}
            <div className="relative w-14 aspect-[3/4] rounded-lg overflow-hidden bg-[#1A1A1A] shrink-0">
              {item.image
                ? <Image src={item.image} alt={item.name} fill className="object-cover" />
                : <div className="absolute inset-0 bg-[#262626]" />
              }
              {/* شارة الكمية */}
              <span className="absolute -top-1 -left-1 w-4 h-4 bg-[#C9A86E] text-[#060606] text-[9px] font-bold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>

            {/* التفاصيل */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#EDE8DF] font-[Tajawal] line-clamp-1">{item.name}</p>
              <div className="flex gap-1 mt-0.5">
                {item.size  && <span className="text-[10px] text-[#484542] font-[Tajawal]">{item.size}</span>}
                {item.size && item.color && <span className="text-[10px] text-[#484542]">·</span>}
                {item.color && <span className="text-[10px] text-[#484542] font-[Tajawal]">{item.color}</span>}
              </div>
            </div>

            {/* السعر */}
            <span className="text-xs font-bold text-[#C9A86E] font-[Tajawal] shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* الأسعار */}
      <div className="px-5 py-4 border-t border-[#1A1A1A] flex flex-col gap-2.5">
        <div className="flex justify-between text-sm font-[Tajawal]">
          <span className="text-[#8A8480]">المجموع الفرعي</span>
          <span className="text-[#EDE8DF]">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm font-[Tajawal]">
          <span className="text-[#8A8480]">الشحن</span>
          <span className={shipping === 0 ? "text-[#5CB87A]" : "text-[#EDE8DF]"}>
            {shipping === 0 ? "مجاني 🎁" : formatPrice(shipping)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm font-[Tajawal]">
            <span className="text-[#8A8480]">الخصم</span>
            <span className="text-[#5CB87A]">− {formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-base font-bold font-[Tajawal] border-t border-[#1A1A1A] pt-3 mt-1">
          <span className="text-[#EDE8DF]">الإجمالي</span>
          <span className="text-[#C9A86E] text-lg">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
