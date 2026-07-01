// ============================================================
// src/components/ui/Modal.tsx
// ============================================================
"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open:       boolean;
  onClose:    () => void;
  title?:     string;
  children:   React.ReactNode;
  size?:      "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
  className?: string;
}

const sizes = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  xl:   "max-w-2xl",
  full: "max-w-5xl",
};

export function Modal({
  open, onClose, title, children,
  size = "md", showClose = true, className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // إغلاق بـ Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // منع scroll الخلفية
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
    >
      <div
        className={cn(
          "w-full bg-[#121212] border border-[#1A1A1A] rounded-2xl",
          "shadow-2xl animate-in fade-in zoom-in-95 duration-200",
          "max-h-[90vh] overflow-y-auto",
          sizes[size],
          className
        )}
        dir="rtl"
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between p-5 border-b border-[#1A1A1A]">
            {title && (
              <h2 className="text-base font-bold text-[#EDE8DF] font-[Tajawal]">
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#8A8480] hover:text-[#EDE8DF] hover:bg-[#1A1A1A] transition-all"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
        {/* Content */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
