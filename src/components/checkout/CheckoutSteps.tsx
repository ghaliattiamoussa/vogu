// src/components/checkout/CheckoutSteps.tsx
"use client";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "عنوان الشحن", icon: "📍" },
  { id: 2, label: "طريقة الشحن", icon: "🚚" },
  { id: 3, label: "الدفع",       icon: "💳" },
  { id: 4, label: "التأكيد",     icon: "✅" },
];

export function CheckoutSteps({ currentStep }: { currentStep: number }) {
  const progressWidth = `calc(${((currentStep - 1) / (STEPS.length - 1)) * 100}% - 2.5rem)`;

  return (
    <div className="w-full" dir="rtl">
      <div className="flex items-center justify-between relative">
        {/* خط رمادي خلفية */}
        <div className="absolute top-5 right-5 left-5 h-px bg-[#1A1A1A]" />
        {/* خط ذهبي تقدم */}
        <div
          className="absolute top-5 right-5 h-px bg-[#C9A86E] transition-all duration-500"
          style={{ width: progressWidth }}
        />

        {STEPS.map((step) => {
          const done   = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 z-10">
              <div className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                done   ? "bg-[#C9A86E] border-[#C9A86E]"   :
                active ? "bg-[#121212] border-[#C9A86E]"   :
                         "bg-[#121212] border-[#262626]"
              )}>
                {done
                  ? <Check size={16} className="text-[#060606]" strokeWidth={3} />
                  : <span className={cn("text-base", active ? "opacity-100" : "opacity-30")}>{step.icon}</span>
                }
              </div>
              <span className={cn(
                "text-xs font-[Tajawal] whitespace-nowrap",
                done || active ? "text-[#EDE8DF]" : "text-[#484542]"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CheckoutSteps;
