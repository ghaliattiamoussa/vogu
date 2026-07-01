// src/app/admin/vendors/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Store,
  Mail,
  Phone,
  User,
  X,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
} as const;

type Vendor = {
  id: string;
  contactName: string;
  email: string;
  storeName: string;
  phone: string | null;
  status: string;
  createdAt: string;
  _count: { products: number; orderItems: number };
};

export default function AdminVendorsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ── Guard ──
  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [session, status, router]);

  // ── Fetch ──
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vendors");
      const data = await res.json();
      setVendors(data.vendors || []);
    } catch {
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchVendors();
    }
  }, [session]);

  const filtered = vendors.filter((v) =>
    v.storeName.includes(search) ||
    v.contactName.includes(search) ||
    v.email.includes(search)
  );

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-[#A8823C] animate-spin" />
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "ADMIN") return null;

  return (
    <div className="p-6 md:p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-[#A8823C] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1">
            لوحة التحكم
          </p>
          <h1 className="font-cormorant text-[34px] font-light text-[#1A1714]">
            التجار
            <span className="text-[18px] text-[#A39E96] font-tajawal mr-3">
              ({vendors.length})
            </span>
          </h1>
        </div>
        <Link
          href="/admin/vendors/new"
          className="flex items-center gap-2 bg-[#A8823C] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold font-tajawal hover:brightness-110 transition-all"
        >
          <Plus size={15} />
          إضافة تاجر جديد
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#EAE7E1] rounded-xl px-4 py-2.5 max-w-[340px] mb-6 focus-within:border-[#A8823C]/40 transition-colors">
        <Search size={13} className="text-[#A39E96]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث باسم التاجر أو البريد..."
          className="bg-transparent text-[12px] text-[#1A1714] placeholder-[#A39E96] outline-none flex-1 font-tajawal"
          dir="rtl"
        />
        {search && (
          <button onClick={() => setSearch("")}>
            <X size={11} className="text-[#A39E96] hover:text-[#1A1714]" />
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Store size={32} className="text-[#A39E96]" />
          <p className="text-[16px] font-bold text-[#1A1714] font-tajawal">
            {vendors.length === 0 ? "لا يوجد تجار مسجلين" : "لا توجد نتائج مطابقة"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((vendor) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl p-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#A8823C]0D border border-[#A8823C]/30 flex items-center justify-center">
                  <Store size={16} className="text-[#A8823C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#1A1714] font-tajawal truncate">
                    {vendor.storeName}
                  </p>
                  <p className="text-[10px] text-[#6B6560] font-tajawal">
                    {vendor.contactName}
                  </p>
                </div>
                <span
                  className={`text-[9px] font-tajawal px-2 py-0.5 rounded-full ${
                    vendor.status === "ACTIVE"
                      ? "bg-[#3D9960]0D text-[#3D9960] border border-[#3D9960]/30"
                      : "bg-[#C0504D]0D text-[#C0504D] border border-[#C0504D]/30"
                  }`}
                >
                  {vendor.status === "ACTIVE" ? "نشط" : "معلق"}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-[#6B6560] font-tajawal">
                <div className="flex items-center gap-2">
                  <Mail size={11} className="text-[#A39E96]" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                {vendor.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={11} className="text-[#A39E96]" />
                    <span>{vendor.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 pt-1 border-t border-[#EAE7E1] mt-1 text-[10px] text-[#A39E96]">
                  <span>📦 {vendor._count.products} منتج</span>
                  <span>🛒 {vendor._count.orderItems} طلب</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}