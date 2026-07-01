// ============================================================
// src/components/ui/Button.tsx
// ============================================================
"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  fullWidth?: boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:   "bg-[#C9A86E] text-[#060606] hover:bg-[#DDBF88] active:bg-[#9A7848] font-bold",
  secondary: "bg-[#1A1A1A] text-[#EDE8DF] hover:bg-[#262626] border border-[#262626]",
  outline:   "bg-transparent text-[#C9A86E] border border-[#C9A86E] hover:bg-[#C9A86E] hover:text-[#060606]",
  ghost:     "bg-transparent text-[#8A8480] hover:text-[#EDE8DF] hover:bg-[#1A1A1A]",
  danger:    "bg-[#D07070] text-white hover:bg-[#B85555] font-bold",
};

const sizes: Record<Size, string> = {
  sm:   "px-3 py-1.5 text-xs rounded-lg",
  md:   "px-5 py-2.5 text-sm rounded-lg",
  lg:   "px-7 py-3.5 text-base rounded-xl",
  icon: "p-2 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          "inline-flex items-center justify-center gap-2",
          "font-medium transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-[#C9A86E] focus:ring-offset-2 focus:ring-offset-[#070707]",
          // Variant & Size
          variants[variant],
          sizes[size],
          // Full width
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 size={size === "sm" ? 13 : 15} className="animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
