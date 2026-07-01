"use client";

import { cn } from "@/lib/utils";

interface Color {
  name: string;
  hex: string;
}

interface ColorSelectorProps {
  colors:   Color[];
  selected: string;
  onChange: (color: string) => void;
}

export function ColorSelector({
  colors,
  selected,
  onChange,
}: ColorSelectorProps) {
  return (
    <div className="flex flex-col gap-2" dir="rtl">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#EDE8DF] font-tajawal">
          اللون
        </span>
        {selected && (
          <span className="text-sm text-[#C9A86E] font-tajawal">{selected}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isActive = selected === color.name;
          return (
            <button
              key={color.hex}
              onClick={() => onChange(color.name)}
              title={color.name}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all duration-200",
                isActive
                  ? "border-[#C9A86E] scale-110 shadow-[0_0_0_2px_#0D0D0D,0_0_0_4px_#C9A86E]"
                  : "border-[#262626] hover:border-[#8A8480] hover:scale-105"
              )}
              style={{ background: color.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}