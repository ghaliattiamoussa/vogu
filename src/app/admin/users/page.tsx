"use client";

import { motion } from "framer-motion";
import {
  Mail, Search, ShoppingBag, User, X, Calendar,
  KeyRound, ShieldX, ShieldCheck, LogOut, AtSign, Loader2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────
type Customer = {
  id:        string;
  name:      string | null;
  email:     string | null;
  image:     string | null;
  role:      string;
  isBlocked: boolean;
  createdAt: string;
  accounts:  { provider: string }[];
  _count: { orders: number };
};

// ─── Google Badge SVG ─────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users,         setUsers]         = useState<Customer[]>([]);
  const [total,         setTotal]         = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [q,             setQ]             = useState("");
  const [page,          setPage]          = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const LIMIT = 20;

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page",  String(page));
    params.set("limit", String(LIMIT));
    if (q) params.set("q", q);

    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((d) => { setUsers(d.users ?? []); setTotal(d.total ?? 0); })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [q, page]);

  const totalPages = Math.ceil(total / LIMIT);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric", month: "short", day: "numeric",
    });

  // ── تحديد طريقة التسجيل ──────────────────────────────────
  const getProvider = (user: Customer) => {
    if (user.accounts.some((a) => a.provider === "google")) return "google";
    return "email";
  };

  // ── تنفيذ الإجراء ─────────────────────────────────────────
  const handleAction = async (
    userId: string,
    action: string,
    confirmMsg: string
  ) => {
    if (!window.confirm(confirmMsg)) return;

    setActionLoading(`${userId}-${action}`);
    try {
      const res  = await fetch(`/api/admin/users/${userId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action }),
      });
      const data = await res.json();

      if (!res.ok) { toast.error(data.error ?? "حدث خطأ"); return; }

      toast.success(data.message ?? "تم بنجاح ✓");

      // تحديث الحالة محلياً بدون fetch جديد
      if (action === "block" || action === "unblock") {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, isBlocked: action === "block" } : u
          )
        );
      }
    } catch {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 md:p-8" dir="rtl">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[#C9A86E] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1">
          لوحة التحكم
        </p>
        <h1 className="font-cormorant text-[34px] font-light text-[#EDE8DF]">
          العملاء
          <span className="text-[18px] text-[#484542] font-tajawal mr-3">
            ({total})
          </span>
        </h1>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-2.5 max-w-[340px] mb-6 focus-within:border-[#C9A86E]/40 transition-colors">
        <Search size={13} className="text-[#484542]" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="ابحث بالاسم أو البريد..."
          className="bg-transparent text-[12px] text-[#EDE8DF] placeholder-[#484542] outline-none flex-1 font-tajawal"
          dir="rtl"
        />
        {q && (
          <button onClick={() => setQ("")}>
            <X size={11} className="text-[#484542] hover:text-[#EDE8DF]" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1A1A] bg-[#121212]">
                {["العميل", "البريد الإلكتروني", "طريقة التسجيل", "تاريخ التسجيل", "الطلبات", "الحالة", "إجراءات"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] text-[#484542] font-tajawal font-normal text-right whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1A1A1A]">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-[#1A1A1A] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <User size={32} className="text-[#484542] mx-auto mb-3" />
                    <p className="text-[13px] text-[#484542] font-tajawal">لا يوجد عملاء</p>
                  </td>
                </tr>
              ) : (
                users.map((user, i) => {
                  const provider = getProvider(user);
                  const isGoogle = provider === "google";

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border-b border-[#1A1A1A] transition-colors ${
                        user.isBlocked ? "bg-red-950/10" : "hover:bg-[#121212]"
                      }`}
                    >
                      {/* ── العميل ── */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full bg-[#1A1200] border border-[#C9A86E]/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {user.image ? (
                              <Image src={user.image} alt={user.name ?? ""} width={36} height={36} className="object-cover w-full h-full" />
                            ) : (
                              <User size={14} className="text-[#C9A86E]" />
                            )}
                            {/* طبقة حمراء لو محظور */}
                            {user.isBlocked && (
                              <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                                <ShieldX size={12} className="text-red-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-[#EDE8DF] font-tajawal">
                              {user.name ?? "بدون اسم"}
                            </p>
                            <p className="text-[10px] text-[#484542] font-mono">
                              {user.id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ── البريد ── */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Mail size={11} className="text-[#484542]" />
                          <span className="text-[11px] text-[#8A8480] font-tajawal">
                            {user.email ?? "—"}
                          </span>
                        </div>
                      </td>

                      {/* ── طريقة التسجيل ── */}
                      <td className="px-4 py-3">
                        {isGoogle ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-tajawal px-2.5 py-1 rounded-full bg-[#0A1A0A] border border-[#1A3A1A] text-[#5CB85C]">
                            <GoogleIcon />
                            Google
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-tajawal px-2.5 py-1 rounded-full bg-[#121212] border border-[#1A1A1A] text-[#8A8480]">
                            <AtSign size={10} />
                            بريد إلكتروني
                          </span>
                        )}
                      </td>

                      {/* ── تاريخ التسجيل ── */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} className="text-[#484542]" />
                          <span className="text-[11px] text-[#8A8480] font-tajawal">
                            {formatDate(user.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* ── الطلبات ── */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <ShoppingBag size={11} className="text-[#484542]" />
                          <span className={`text-[12px] font-bold font-tajawal ${user._count.orders > 0 ? "text-[#C9A86E]" : "text-[#484542]"}`}>
                            {user._count.orders}
                          </span>
                        </div>
                      </td>

                      {/* ── الحالة ── */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[10px] font-tajawal px-2.5 py-1 rounded-full border w-fit ${
                            user.role === "ADMIN"
                              ? "bg-[#1A1200] border-[#C9A86E]/30 text-[#C9A86E]"
                              : "bg-[#121212] border-[#1A1A1A] text-[#484542]"
                          }`}>
                            {user.role === "ADMIN" ? "أدمن" : "عميل"}
                          </span>
                          {user.isBlocked && (
                            <span className="text-[10px] font-tajawal px-2.5 py-1 rounded-full border w-fit bg-red-950/40 border-red-900/30 text-red-400">
                              محظور
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ── إجراءات ── */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5">

                          {/* 1. إعادة تعيين كلمة المرور — فقط لمستخدمي البريد */}
                          {!isGoogle && (
                            <button
                              onClick={() => handleAction(
                                user.id,
                                "reset-password",
                                `إرسال رابط إعادة تعيين كلمة المرور إلى ${user.name ?? user.email}؟`
                              )}
                              disabled={!!actionLoading}
                              title="إعادة تعيين كلمة المرور"
                              className="p-1.5 rounded-lg hover:bg-[#1A1200] hover:text-[#C9A86E] text-[#484542] transition-all disabled:opacity-40"
                            >
                              {actionLoading === `${user.id}-reset-password`
                                ? <Loader2 size={13} className="animate-spin" />
                                : <KeyRound size={13} />
                              }
                            </button>
                          )}

                          {/* 2. حظر / إلغاء حظر */}
                          <button
                            onClick={() => handleAction(
                              user.id,
                              user.isBlocked ? "unblock" : "block",
                              user.isBlocked
                                ? `إلغاء حظر ${user.name ?? user.email}؟`
                                : `حظر ${user.name ?? user.email}؟ لن يتمكن من تسجيل الدخول.`
                            )}
                            disabled={!!actionLoading}
                            title={user.isBlocked ? "إلغاء الحظر" : "حظر المستخدم"}
                            className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${
                              user.isBlocked
                                ? "text-green-500 hover:bg-green-900/20 hover:text-green-400"
                                : "text-[#484542] hover:bg-red-900/20 hover:text-red-400"
                            }`}
                          >
                            {actionLoading === `${user.id}-${user.isBlocked ? "unblock" : "block"}`
                              ? <Loader2 size={13} className="animate-spin" />
                              : user.isBlocked
                                ? <ShieldCheck size={13} />
                                : <ShieldX size={13} />
                            }
                          </button>

                          {/* 3. تسجيل خروج إجباري */}
                          <button
                            onClick={() => handleAction(
                              user.id,
                              "signout",
                              `تسجيل خروج ${user.name ?? user.email} من جميع الأجهزة؟`
                            )}
                            disabled={!!actionLoading}
                            title="تسجيل خروج إجباري"
                            className="p-1.5 rounded-lg text-[#484542] hover:bg-blue-900/20 hover:text-blue-400 transition-all disabled:opacity-40"
                          >
                            {actionLoading === `${user.id}-signout`
                              ? <Loader2 size={13} className="animate-spin" />
                              : <LogOut size={13} />
                            }
                          </button>

                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-[13px] font-tajawal transition-all ${
                p === page
                  ? "bg-[#C9A86E] text-[#060606] font-bold"
                  : "bg-[#0D0D0D] border border-[#1A1A1A] text-[#8A8480] hover:border-[#C9A86E]/40"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
