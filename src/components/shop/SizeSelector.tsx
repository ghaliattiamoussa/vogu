"use client";

import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes:       string[];
  selected:    string;
  onChange:    (size: string) => void;
  outOfStock?: string[];
}

export function SizeSelector({
  sizes,
  selected,
  onChange,
  outOfStock = [],
}: SizeSelectorProps) {
  return (
    <div className="flex flex-col gap-2" dir="rtl">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#EDE8DF] font-tajawal">
          المقاس
        </span>
        {selected && (
          <span className="text-sm text-[#C9A86E] font-tajawal">{selected}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const oos      = outOfStock.includes(size);
          const isActive = selected === size;

          return (
            <button
              key={size}
              onClick={() => !oos && onChange(size)}
              disabled={oos}
              className={cn(
                "min-w-[44px] h-10 px-3 rounded-lg text-sm font-medium font-tajawal",
                "border transition-all duration-200",
                isActive && !oos
                  ? "bg-[#C9A86E] border-[#C9A86E] text-[#060606]"
                  : oos
                  ? "bg-[#0D0D0D] border-[#1A1A1A] text-[#484542] cursor-not-allowed line-through"
                  : "bg-[#121212] border-[#262626] text-[#EDE8DF] hover:border-[#C9A86E] hover:text-[#C9A86E]"
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
