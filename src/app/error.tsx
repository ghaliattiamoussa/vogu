"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div
      className="min-h-screen bg-[#070707] flex flex-col items-center justify-center px-4 text-center"
      dir="rtl"
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-10 rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle,#D07070,transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-[420px]"
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#1A0808] border border-[#D07070]/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={28} className="text-[#D07070]" />
        </div>

        {/* Logo */}
        <p className="font-cormorant text-[22px] tracking-[0.2em] text-[#EDE8DF] mb-1">
          V<span className="text-[#C9A86E]">Ō</span>GU
        </p>

        <h1 className="font-cormorant text-[28px] text-[#EDE8DF] font-light mb-3">
          حدث خطأ غير متوقع
        </h1>

        <p className="text-[13px] text-[#8A8480] font-tajawal mb-2 leading-relaxed">
          نعتذر عن هذا الخطأ. فريقنا يعمل على إصلاحه في أقرب وقت.
        </p>

        {/* Error details (dev only) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="bg-[#1A0808] border border-[#D07070]/20 rounded-xl px-4 py-3 mb-6 text-right">
            <p className="text-[10px] text-[#D07070] font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-[9px] text-[#484542] font-mono mt-1">
                digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-[#C9A86E] text-[#060606] px-7 py-3 rounded-xl text-[13px] font-bold font-tajawal hover:brightness-110 transition-all"
          >
            <RefreshCw size={14} />
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="border border-[#262626] text-[#EDE8DF] px-7 py-3 rounded-xl text-[13px] font-tajawal hover:border-[#C9A86E] hover:text-[#C9A86E] transition-all"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
