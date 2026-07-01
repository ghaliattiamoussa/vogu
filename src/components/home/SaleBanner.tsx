// src/components/home/Newsletter.tsx
"use client";
import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { newsletterSchema } from "@/lib/validations";

export function Newsletter() {
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "البريد الإلكتروني غير صحيح");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "حدث خطأ، حاول مجدداً");
        setStatus("error");
      }
    } catch {
      setError("حدث خطأ، حاول مجدداً");
      setStatus("error");
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6" dir="rtl">
      <div className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl border border-[#1E1E1E] bg-[#0D0D0D] p-8 sm:p-12 text-center">

        {/* خلفية decorative */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#C9A86E]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#C9A86E]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* أيقونة */}
          <div className="w-14 h-14 rounded-2xl bg-[#C9A86E]/10 border border-[#C9A86E]/30 flex items-center justify-center mx-auto mb-5">
            <Mail size={22} className="text-[#C9A86E]" />
          </div>

          {/* العنوان */}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#EDE8DF] mb-3" style={{ fontFamily: "'Cormorant Garant', serif" }}>
            كن أول من يعلم
          </h2>
          <p className="text-sm text-[#8A8480] font-[Tajawal] mb-8 max-w-md mx-auto leading-relaxed">
            اشترك في نشرتنا البريدية واحصل على عروض خاصة، إشعارات بالمنتجات الجديدة،
            وخصومات تصل إلى ٢٠٪ على أول طلب
          </p>

          {/* الفورم */}
          {status === "success" ? (
            <div className="flex items-center justify-center gap-2 text-[#5CB87A] font-[Tajawal] py-3.5">
              <Check size={18} />
              <span className="text-sm font-bold">تم الاشتراك بنجاح! تابع بريدك الإلكتروني 🎉</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); setStatus("idle"); }}
                  placeholder="بريدك الإلكتروني"
                  dir="ltr"
                  className="flex-1 bg-[#121212] border border-[#1A1A1A] rounded-xl px-4 py-3 text-sm text-[#EDE8DF] placeholder:text-[#484542] font-[Tajawal] text-right focus:outline-none focus:border-[#C9A86E] transition-all"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-[#C9A86E] text-[#060606] font-bold font-[Tajawal] px-6 py-3 rounded-xl hover:bg-[#DDBF88] transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {status === "loading" ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    "اشترك الآن"
                  )}
                </button>
              </div>
              {error && (
                <p className="text-xs text-[#D07070] font-[Tajawal] mt-2">⚠ {error}</p>
              )}
              <p className="text-[10px] text-[#484542] font-[Tajawal] mt-4">
                بالاشتراك، أنت توافق على سياسة الخصوصية ولن نشارك بريدك مع أي طرف ثالث
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
