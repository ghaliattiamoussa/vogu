// ============================================================
// src/components/ui/StarRating.tsx
// ============================================================
"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value:       number;
  onChange?:   (v: number) => void;
  readonly?:   boolean;
  size?:       "sm" | "md" | "lg";
  showCount?:  boolean;
  count?:      number;
  className?:  string;
}

const sizeMap = { sm: 11, md: 14, lg: 18 };

export function StarRating({
  value, onChange, readonly = false,
  size = "md", showCount, count, className,
}: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const px = sizeMap[size];

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((i) => {
        const active = (hover || value) >= i;
        return (
          <Star
            key={i}
            size={px}
            fill={active ? "#C9A86E" : "none"}
            color="#C9A86E"
            strokeWidth={active ? 0 : 1.5}
            className={cn(!readonly && "cursor-pointer transition-transform hover:scale-110")}
            onClick={() => !readonly && onChange?.(i)}
            onMouseEnter={() => !readonly && setHover(i)}
            onMouseLeave={() => !readonly && setHover(0)}
          />
        );
      })}
      {showCount && (
        <span className="text-[10px] text-[#484542] mr-1 font-[Tajawal]">
          ({count?.toLocaleString("ar-EG") ?? 0})
        </span>
      )}
    </span>
  );
}

export default StarRating;
