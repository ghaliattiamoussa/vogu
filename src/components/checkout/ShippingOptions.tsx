// src/components/checkout/ShippingOptions.tsx
"use client";
import { cn } from "@/lib/utils";
import { SHIPPING_OPTIONS, formatPrice } from "@/lib/constants";

interface ShippingOptionsProps {
  selected:  string;
  onChange:  (id: string) => void;
  subtotal:  number;
}

export function ShippingOptions({ selected, onChange, subtotal }: ShippingOptionsProps) {
  return (
    <div className="flex flex-col gap-3" dir="rtl">
      <h3 className="text-sm font-bold text-[#EDE8DF] font-[Tajawal]">طريقة الشحن</h3>

      {SHIPPING_OPTIONS.map((option) => {
        const isFreeEligible = option.id === "free" && subtotal < 1000;
        const isSelected     = selected === option.id;

        return (
          <button
            key={option.id}
            onClick={() => !isFreeEligible && onChange(option.id)}
            disabled={isFreeEligible}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 text-right transition-all duration-200",
              isSelected
                ? "border-[#C9A86E] bg-[#C9A86E]/5"
                : isFreeEligible
                ? "border-[#1A1A1A] bg-[#0D0D0D] opacity-40 cursor-not-allowed"
                : "border-[#1A1A1A] bg-[#121212] hover:border-[#262626]"
            )}
          >
            {/* الأيقونة */}
            <span className="text-2xl shrink-0">{option.icon}</span>

            {/* التفاصيل */}
            <div className="flex-1">
              <p className={cn(
                "text-sm font-bold font-[Tajawal]",
                isSelected ? "text-[#C9A86E]" : "text-[#EDE8DF]"
              )}>
                {option.label}
              </p>
              <p className="text-xs text-[#484542] font-[Tajawal] mt-0.5">
                {option.description}
              </p>
              {isFreeEligible && (
                <p className="text-xs text-[#C9A86E] font-[Tajawal] mt-0.5">
                  أضف {formatPrice(1000 - subtotal)} للحصول على شحن مجاني
                </p>
              )}
            </div>

            {/* السعر */}
            <div className="shrink-0 text-left">
              <span className={cn(
                "text-sm font-bold font-[Tajawal]",
                option.price === 0 ? "text-[#5CB87A]" : isSelected ? "text-[#C9A86E]" : "text-[#EDE8DF]"
              )}>
                {option.price === 0 ? "مجاني" : formatPrice(option.price)}
              </span>
            </div>

            {/* مؤشر الاختيار */}
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
              isSelected ? "border-[#C9A86E] bg-[#C9A86E]" : "border-[#262626]"
            )}>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-[#060606]" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ShippingOptions;
