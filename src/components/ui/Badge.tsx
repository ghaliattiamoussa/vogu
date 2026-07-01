// ============================================================
// src/components/ui/Badge.tsx
// ============================================================
import { cn } from "@/lib/utils";

type BadgeVariant = "gold" | "red" | "green" | "gray" | "blue";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  gold:  "bg-[#C9A86E] text-[#060606]",
  red:   "bg-[#D07070] text-white",
  green: "bg-[#5CB87A] text-[#060606]",
  gray:  "bg-[#262626] text-[#8A8480]",
  blue:  "bg-[#4A7ABF] text-white",
};

export function Badge({ children, variant = "gold", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full",
        "text-[10px] font-bold font-[Tajawal] tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
