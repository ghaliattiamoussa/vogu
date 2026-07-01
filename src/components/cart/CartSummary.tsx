// src/components/cart/CartSummary.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { formatPrice, FREE_SHIPPING_THRESHOLD, SHIPPING_OPTIONS } from "@/lib/constants";

export function CartSummary() {
  const router   = useRouter();
  const items    = useCartStore(s => s.items);
  const [coupon, setCoupon]       = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError]     = useState("");

  const subtotal   = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping   = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_OPTIONS[0].price;
  const discount   = couponApplied ? couponApplied.discount : 0;
  const total      = subtotal + shipping - discount;
  const remaining  = FREE_SHIPPING_THRESHOLD - subtotal;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "validate_coupon", code: coupon }),
      });
      const data = await r.json();
      if (r.ok) {
        setCouponApplied({ code: coupon, discount: data.discount });
        setCoupon("");
      } else {
        setCouponError(data.error ?? "كوبون غير صالح");
      }
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="bg-[#121212] border border-[#1A1A1A] rounded-2xl p-5 flex flex-col gap-4 sticky top-24" dir="rtl">
      <h2 className="text-base font-bold text-[#EDE8DF] font-[Tajawal]">ملخص الطلب</h2>

      {/* شريط الشحن المجاني */}
      {remaining > 0 && (
        <div className="bg-[#0D0D0D] rounded-xl p-3">
          <p className="text-xs text-[#8A8480] font-[Tajawal] mb-2">
            أضف <span className="text-[#C9A86E] font-bold">{formatPrice(remaining)}</span> للحصول على شحن مجاني 🎁
          </p>
          <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C9A86E] rounded-full transition-all duration-500"
              style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* كوبون الخصم */}
      <div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484542]" />
            <input
              value={coupon}
              onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }}
              placeholder="كود الخصم"
              className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl pr-9 pl-3 py-2.5 text-sm text-[#EDE8DF] font-[Tajawal] placeholder:text-[#484542] focus:outline-none focus:border-[#C9A86E]"
            />
          </div>
          <Button variant="outline" size="sm" onClick={applyCoupon} loading={couponLoading} className="shrink-0">
            تطبيق
          </Button>
        </div>
        {couponError    && <p className="text-xs text-[#D07070] mt-1 font-[Tajawal]">⚠ {couponError}</p>}
        {couponApplied  && <p className="text-xs text-[#5CB87A] mt-1 font-[Tajawal]">✓ تم تطبيق {couponApplied.code}</p>}
      </div>

      {/* تفاصيل الأسعار */}
      <div className="flex flex-col gap-2 border-t border-[#1A1A1A] pt-4">
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
          <span className="text-[#C9A86E]">{formatPrice(total)}</span>
        </div>
      </div>

      {/* زر إتمام الطلب */}
      <Button
        fullWidth
        size="lg"
        onClick={() => router.push("/checkout")}
        rightIcon={<ChevronLeft size={16} />}
      >
        إتمام الطلب
      </Button>

      {/* وسائل الدفع */}
      <div className="flex items-center justify-center gap-3 pt-1">
        {["Visa", "MC", "Fawry", "ValU"].map(p => (
          <span key={p} className="text-[9px] text-[#484542] border border-[#1A1A1A] px-2 py-0.5 rounded font-medium">
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

export default CartSummary;
