"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  qty:      number;
  onChange: (qty: number) => void;
  min?:     number;
  max?:     number;
}

export function QuantitySelector({
  qty,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const dec = () => qty > min && onChange(qty - 1);
  const inc = () => qty < max && onChange(qty + 1);

  return (
    <div className="flex items-center gap-0" dir="ltr">
      <button
        onClick={dec}
        disabled={qty <= min}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-r-xl border border-[#262626]",
          "text-[#EDE8DF] transition-all duration-200",
          qty <= min
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-[#1A1A1A] hover:border-[#C9A86E] active:scale-95"
        )}
      >
        <Minus size={14} />
      </button>

      <div className="w-12 h-10 flex items-center justify-center border-y border-[#262626] bg-[#121212]">
        <span className="text-[14px] font-bold text-[#EDE8DF] font-tajawal">
          {qty}
        </span>
      </div>

      <button
        onClick={inc}
        disabled={qty >= max}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-l-xl border border-[#262626]",
          "text-[#EDE8DF] transition-all duration-200",
          qty >= max
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-[#1A1A1A] hover:border-[#C9A86E] active:scale-95"
        )}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
