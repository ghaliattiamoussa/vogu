"use client";

import { motion } from "framer-motion";
import { Loader2, Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STATUS_COLOR: Record<string, string> = {
  PENDING:    "text-[#C9A86E] bg-[#1A1200]",
  CONFIRMED:  "text-[#5CB87A] bg-[#001A08]",
  PROCESSING: "text-[#7EB8D4] bg-[#001018]",
  SHIPPED:    "text-[#A078D4] bg-[#0A0018]",
  DELIVERED:  "text-[#5CB87A] bg-[#001A08]",
  CANCELLED:  "text-[#D07070] bg-[#1A0808]",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING:    "انتظار",
  CONFIRMED:  "مؤكد",
  PROCESSING: "تجهيز",
  SHIPPED:    "شحن",
  DELIVERED:  "تسليم",
  CANCELLED:  "ملغي",
};

type OrderItem = {
  id: string;
  nameAr: string;
  brand: string;
  price: number;
  qty: number;
  imageUrl: string | null;
  productId: string | null;
  size: string | null;
  color: string | null;
};

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string | null; email: string | null } | null;
  items: OrderItem[];
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") return;
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-[#C9A86E] animate-spin" />
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") return null;

  return (
    <div className="p-6 md:p-8" dir="rtl">
      <div className="mb-8">
        <p className="text-[#C9A86E] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1">
          لوحة التحكم
        </p>
        <h1 className="font-cormorant text-[34px] font-light text-[#EDE8DF]">
          الطلبات
          <span className="text-[18px] text-[#8A8480] font-tajawal mr-3">
            ({orders.length})
          </span>
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl">
          <ShoppingBag size={40} className="text-[#484542] mx-auto mb-4" />
          <p className="text-[#8A8480] font-tajawal">لا توجد طلبات بعد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const customItems = order.items.filter((it) => !it.productId);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="block bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5 hover:border-[#262626] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[13px] text-[#EDE8DF] font-tajawal font-bold">
                        {order.user?.name ?? order.user?.email ?? "ضيف"}
                      </p>
                      <p className="text-[10px] text-[#484542] font-tajawal mt-0.5">
                        #{order.id.slice(-8).toUpperCase()} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <span
                        className={`text-[10px] font-tajawal px-2 py-0.5 rounded-full ${
                          STATUS_COLOR[order.status] ?? "text-[#8A8480] bg-[#121212]"
                        }`}
                      >
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                      <p className="text-[16px] text-[#C9A86E] font-cormorant mt-1">
                        {order.total.toLocaleString("ar-EG")} ج.م
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 bg-[#121212] border border-[#1A1A1A] rounded-xl p-2 min-w-[160px]"
                      >
                        <div className="w-12 h-14 rounded-lg bg-[#1A1A1A] overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.nameAr}
                              width={48}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Package size={16} className="text-[#484542]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] text-[#EDE8DF] font-tajawal truncate max-w-[120px]">
                            {item.nameAr}
                          </p>
                          {!item.productId && (
                            <span className="text-[9px] text-[#C9A86E] font-tajawal">
                              ✦ تصميم مخصص
                            </span>
                          )}
                          <p className="text-[10px] text-[#484542] font-tajawal">
                            ×{item.qty}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {customItems.length > 0 && (
                    <p className="text-[10px] text-[#C9A86E] font-tajawal mt-3">
                      🎨 يحتوي على {customItems.length} منتج مخصص — اضغط لعرض التصميم
                    </p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
