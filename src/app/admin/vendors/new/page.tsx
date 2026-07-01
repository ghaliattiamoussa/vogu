// src/app/admin/vendors/new/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  Loader2,
  Save,
  Store,
  User,
  Mail,
  Lock,
  Phone,
  X,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// ─── Light Theme Palette ──────────────────────────────────────
const C = {
  bg:   "#FAFAF8",
  surf: "#F5F3EF",
  card: "#FFFFFF",
  b1:   "#EAE7E1",
  b2:   "#DDD9D1",
  gold: "#A8823C",
  t1:   "#1A1714",
  t2:   "#6B6560",
  t3:   "#A39E96",
  err:  "#C0504D",
  ok:   "#3D9960",
} as const;

export default function AdminNewVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── التحقق من صحة البيانات ──
    if (!form.name || !form.email || !form.password || !form.businessName) {
      setError("جميع الحقول المطلوبة (*) يجب تعبئتها");
      return;
    }
    if (form.password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          businessName: form.businessName,
          phone: form.phone || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء إنشاء التاجر");
        return;
      }

      toast.success("✅ تم إنشاء حساب التاجر بنجاح!");
      router.push("/admin/vendors");
    } catch {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/vendors"
          className="text-[#6B6560] hover:text-[#1A1714] transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <p className="text-[#A8823C] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-0.5">
            لوحة التحكم
          </p>
          <h1 className="font-cormorant text-[30px] font-light text-[#1A1714]">
            إضافة تاجر جديد
          </h1>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-[#C0504D]0D border border-[#C0504D]/30 rounded-xl px-4 py-3 mb-6">
          <X size={14} className="text-[#C0504D]" />
          <p className="text-[12px] text-[#C0504D] font-tajawal">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── معلومات التاجر ── */}
        <div className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl p-5">
          <h2 className="font-cormorant text-[17px] text-[#1A1714] mb-4 flex items-center gap-2">
            <Store size={16} className="text-[#A8823C]" />
            معلومات التاجر
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الاسم */}
            <div className="md:col-span-2">
              <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
                اسم المسؤول *
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39E96]"
                />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="أحمد محمد"
                  className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl pr-10 pl-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] font-tajawal outline-none focus:border-[#A8823C]/40"
                  dir="rtl"
                />
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div className="md:col-span-2">
              <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
                البريد الإلكتروني *
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39E96]"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="vendor@example.com"
                  className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl pr-10 pl-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] font-tajawal outline-none focus:border-[#A8823C]/40"
                  dir="ltr"
                />
              </div>
            </div>

            {/* اسم المتجر */}
            <div className="md:col-span-2">
              <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
                اسم النشاط التجاري (اسم المتجر) *
              </label>
              <div className="relative">
                <Store
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39E96]"
                />
                <input
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder="متجر الأزياء الفاخرة"
                  className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl pr-10 pl-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] font-tajawal outline-none focus:border-[#A8823C]/40"
                  dir="rtl"
                />
              </div>
            </div>

            {/* رقم الهاتف */}
            <div className="md:col-span-2">
              <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
                رقم الهاتف (اختياري)
              </label>
              <div className="relative">
                <Phone
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39E96]"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl pr-10 pl-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] font-tajawal outline-none focus:border-[#A8823C]/40"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── كلمة المرور ── */}
        <div className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl p-5">
          <h2 className="font-cormorant text-[17px] text-[#1A1714] mb-4 flex items-center gap-2">
            <Lock size={16} className="text-[#A8823C]" />
            كلمة المرور
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* كلمة المرور */}
            <div>
              <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
                كلمة المرور *
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39E96]"
                />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl pr-10 pl-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] font-tajawal outline-none focus:border-[#A8823C]/40"
                  dir="ltr"
                />
              </div>
              <p className="text-[9px] text-[#A39E96] font-tajawal mt-1">
                8 أحرف على الأقل
              </p>
            </div>

            {/* تأكيد كلمة المرور */}
            <div>
              <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
                تأكيد كلمة المرور *
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39E96]"
                />
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl pr-10 pl-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] font-tajawal outline-none focus:border-[#A8823C]/40"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── زر الحفظ ── */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#A8823C] text-white rounded-2xl py-4 text-[14px] font-bold font-tajawal hover:brightness-110 transition-all disabled:opacity-60 shadow-[0_8px_24px_rgba(168,130,60,0.3)]"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <Save size={16} />
              إنشاء حساب التاجر
            </>
          )}
        </motion.button>

        <div className="bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 size={16} className="text-[#A8823C] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] text-[#1A1714] font-tajawal">
              سيتم إنشاء حساب التاجر مع <strong>صلاحية دخول كاملة</strong> إلى لوحة التحكم الخاصة به.
            </p>
            <p className="text-[11px] text-[#6B6560] font-tajawal mt-1">
              التاجر سيسجل دخوله على <strong>/vendor/login</strong> باستخدام البريد الإلكتروني وكلمة المرور اللتين حددتهما.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}