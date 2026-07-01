"use client";

import {
  BarChart3,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Users,
  Store,
  Truck,
  MessageCircle,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// ─── Nav items ────────────────────────────────────────────────
const NAV = [
  { href: "/admin",               label: "الرئيسية",      icon: LayoutDashboard },
  { href: "/admin/customizer-products", label: "منتجات التخصيص", icon: Package },
  { href: "/admin/orders",        label: "الطلبات",       icon: ShoppingBag },
  { href: "/admin/products",      label: "المنتجات",      icon: Package },
  { href: "/admin/vendor-products", label: "منتجات التجار", icon: Store },
  { href: "/admin/vendor-orders",  label: "طلبات التجار",  icon: Truck },
  { href: "/admin/vendors",        label: "التجار",        icon: Users },
  { href: "/admin/users",         label: "العملاء",       icon: Users },
  { href: "/admin/support",       label: "الدعم والشكاوى", icon: MessageCircle },
  { href: "/admin/stats",         label: "الإحصائيات",    icon: BarChart3 },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router   = usePathname();
  const navigate = useRouter();

  // Guard — redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "ADMIN") {
      navigate.replace("/");
    }
  }, [session, status, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] border-t-[#C9A86E] animate-spin" />
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-[#070707] flex" dir="rtl">

      {/* ── Sidebar ── */}
      <aside className="w-[220px] flex-shrink-0 bg-[#0D0D0D] border-l border-[#1A1A1A] flex flex-col sticky top-0 h-screen">

        {/* Logo */}
        <div className="px-5 py-6 border-b border-[#1A1A1A]">
          <Link href="/" className="flex items-center gap-2 group">
            <p className="font-cormorant text-[20px] tracking-[0.15em] text-[#EDE8DF]">
              V<span className="text-[#C9A86E]">Ō</span>GU
            </p>
            <span className="text-[9px] bg-[#1A1200] text-[#C9A86E] border border-[#C9A86E]/30 px-1.5 py-0.5 rounded font-tajawal">
              Admin
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive = router === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-tajawal transition-all ${
                  isActive
                    ? "bg-[#1A1200] text-[#C9A86E] border border-[#C9A86E]/20"
                    : "text-[#8A8480] hover:text-[#EDE8DF] hover:bg-[#121212]"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-[#1A1A1A] space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-tajawal text-[#8A8480] hover:text-[#EDE8DF] hover:bg-[#121212] transition-all"
          >
            <ChevronLeft size={14} />
            العودة للمتجر
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-tajawal text-[#484542] hover:text-[#D07070] hover:bg-[#1A0808] transition-all"
          >
            <LogOut size={14} />
            تسجيل الخروج
          </button>
        </div>

        {/* Admin info */}
        <div className="px-4 py-3 border-t border-[#1A1A1A]">
          <p className="text-[11px] text-[#EDE8DF] font-tajawal truncate">
            {session.user?.name ?? "Admin"}
          </p>
          <p className="text-[10px] text-[#484542] font-tajawal truncate">
            {session.user?.email}
          </p>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>

    </div>
  );
}
