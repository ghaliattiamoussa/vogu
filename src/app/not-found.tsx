import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[#070707] flex flex-col items-center justify-center px-4 text-center"
      dir="rtl"
    >
      {/* Background blur blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-10 rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle,#C9A86E,transparent 70%)" }}
        />
      </div>

      <div className="relative z-10">
        {/* 404 number */}
        <p
          className="font-cormorant font-light text-[#1A1200] select-none leading-none"
          style={{ fontSize: "clamp(120px, 20vw, 220px)" }}
        >
          404
        </p>

        {/* Logo */}
        <div className="-mt-8 mb-6">
          <p className="font-cormorant text-[32px] font-light tracking-[0.2em] text-[#EDE8DF]">
            V<span className="text-[#C9A86E]">Ō</span>GU
          </p>
          <p className="text-[10px] tracking-[0.35em] text-[#484542] font-tajawal uppercase mt-1">
            أزياء فاخرة
          </p>
        </div>

        <h1 className="font-cormorant text-[28px] text-[#EDE8DF] font-light mb-3">
          الصفحة غير موجودة
        </h1>
        <p className="text-[13px] text-[#8A8480] font-tajawal mb-8 max-w-[320px] mx-auto leading-relaxed">
          يبدو أن هذه الصفحة لا وجود لها، ربما تم نقلها أو حذفها. دعنا نعيدك للمنزل.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-[#C9A86E] text-[#060606] px-8 py-3 rounded-xl text-[13px] font-bold font-tajawal hover:brightness-110 transition-all shadow-[0_8px_24px_#9A784840]"
          >
            الصفحة الرئيسية
          </Link>
          <Link
            href="/shop"
            className="border border-[#262626] text-[#EDE8DF] px-8 py-3 rounded-xl text-[13px] font-tajawal hover:border-[#C9A86E] hover:text-[#C9A86E] transition-all"
          >
            تصفح المتجر
          </Link>
        </div>
      </div>
    </div>
  );
}
