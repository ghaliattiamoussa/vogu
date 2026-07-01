// ============================================================
// src/components/ui/Input.tsx
// ============================================================
"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:     string;
  error?:     string;
  hint?:      string;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, fullWidth, className, id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s+/g, "-").toLowerCase();
    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#EDE8DF] font-[Tajawal]">
            {label}
            {props.required && <span className="text-[#D07070] mr-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8480]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-[#121212] border rounded-lg px-4 py-2.5",
              "text-sm text-[#EDE8DF] placeholder:text-[#484542]",
              "font-[Tajawal] direction-rtl",
              "transition-all duration-200 outline-none",
              "focus:border-[#C9A86E] focus:ring-1 focus:ring-[#C9A86E]",
              error
                ? "border-[#D07070] focus:border-[#D07070] focus:ring-[#D07070]"
                : "border-[#1A1A1A] hover:border-[#262626]",
              leftIcon  && "pr-10",
              rightIcon && "pl-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8480]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#D07070] font-[Tajawal]">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-[#484542] font-[Tajawal]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
