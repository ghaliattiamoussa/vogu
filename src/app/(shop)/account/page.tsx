"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2, LogOut, MapPin, Package,
  Plus, Save, ShoppingBag, Trash2, User, X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ── ألوان الثيم الفاتح — مطابقة لـ Navbar.tsx ───────────────────
const C = {
  bg:   "#FAFAF8",
  surf: "#F5F3EF",
  b1:   "#EAE7E1",
  b2:   "#DDD9D1",
  gold: "#A8823C",
  t1:   "#1A1714",
  t2:   "#6B6560",
  t3:   "#A39E96",
  err:  "#C0504D",
  ok:   "#3F8557",
} as const;

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
};

// ─── قراءة JSON بأمان — متتعطلش لو الرد فاضي أو مش JSON صالح ──
async function safeJson(res: Response) {
  try {
    if (!res.ok) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

// ─── Address Card ─────────────────────────────────────────────
function AddressCard({
  addr,
  onDelete,
  onSetDefault,
}: {
  addr: Address;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}) {
  return (
    <div
      className="relative p-4 rounded-xl border transition-all"
      style={{
        borderColor: addr.isDefault ? `${C.gold}55` : C.b1,
        background:  addr.isDefault ? `${C.gold}0D` : "#FFFFFF",
      }}
    >
      {addr.isDefault && (
        <span
          className="absolute top-3 left-3 text-[9px] font-tajawal px-2 py-0.5 rounded-full border"
          style={{ color: C.gold, background: `${C.gold}14`, borderColor: `${C.gold}40` }}
        >
          افتراضي
        </span>
      )}

      <div className="flex items-start gap-2 mb-2">
        <MapPin size={13} style={{ color: C.gold }} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[12px] font-bold font-tajawal" style={{ color: C.t1 }}>{addr.label}</p>
          <p className="text-[11px] font-tajawal mt-0.5" style={{ color: C.t2 }}>
            {addr.fullName} · {addr.phone}
          </p>
          <p className="text-[11px] font-tajawal" style={{ color: C.t2 }}>
            {addr.street}، {addr.city}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: C.b1 }}>
        {!addr.isDefault && (
          <button
            onClick={() => onSetDefault(addr.id)}
            className="text-[10px] font-tajawal transition-colors"
            style={{ color: C.t2 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.t2)}
          >
            تعيين كافتراضي
          </button>
        )}
        <button
          onClick={() => onDelete(addr.id)}
          className="mr-auto flex items-center gap-1 text-[10px] font-tajawal transition-colors"
          style={{ color: C.t3 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.err)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.t3)}
        >
          <Trash2 size={11} />
          حذف
        </button>
      </div>
    </div>
  );
}

// ─── Add Address Form ─────────────────────────────────────────
function AddAddressForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [form, setForm]     = useState({ label: "المنزل", fullName: "", phone: "", street: "", city: "" });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.fullName || !form.phone || !form.street || !form.city) return;
    setSaving(true);
    try {
      await fetch("/api/addresses", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
    } finally {
      setSaving(false);
      onSave();
    }
  };

  return (
    <div className="rounded-xl p-4 space-y-3 border" style={{ background: "#FFFFFF", borderColor: `${C.gold}33` }}>
      <div className="grid grid-cols-2 gap-3">
        {[
          { k: "label",    placeholder: "التسمية (المنزل / العمل)" },
          { k: "fullName", placeholder: "الاسم الكامل *" },
          { k: "phone",    placeholder: "رقم الهاتف *" },
          { k: "city",     placeholder: "المدينة *" },
        ].map(({ k, placeholder }) => (
          <input
            key={k}
            value={(form as any)[k]}
            onChange={(e) => set(k, e.target.value)}
            placeholder={placeholder}
            className="rounded-lg px-3 py-2.5 text-[12px] font-tajawal outline-none border transition-colors"
            style={{ background: C.surf, borderColor: C.b2, color: C.t1 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${C.gold}66`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.b2)}
            dir="rtl"
          />
        ))}
        <input
          value={form.street}
          onChange={(e) => set("street", e.target.value)}
          placeholder="العنوان التفصيلي *"
          className="col-span-2 rounded-lg px-3 py-2.5 text-[12px] font-tajawal outline-none border transition-colors"
          style={{ background: C.surf, borderColor: C.b2, color: C.t1 }}
          onFocus={(e) => (e.currentTarget.style.borderColor = `${C.gold}66`)}
          onBlur={(e) => (e.currentTarget.style.borderColor = C.b2)}
          dir="rtl"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold font-tajawal hover:brightness-110 transition-all disabled:opacity-60"
          style={{ background: C.gold, color: "#FFFFFF" }}
        >
          <Save size={13} />
          {saving ? "جاري الحفظ..." : "حفظ"}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-tajawal border transition-colors"
          style={{ borderColor: C.b1, color: C.t2 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.t1)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.t2)}
        >
          <X size={13} />
          إلغاء
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AccountPage() {
  const { data: session } = useSession();

  const [addresses, setAddresses]       = useState<Address[]>([]);
  const [orderCount, setOrderCount]     = useState(0);
  const [showAddForm, setShowAddForm]   = useState(false);
  const [saved, setSaved]               = useState(false);

  const fetchAddresses = async () => {
    try {
      const res  = await fetch("/api/addresses");
      const data = await safeJson(res);
      setAddresses(data?.addresses ?? []);
    } catch {
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetch("/api/orders?page=1&limit=1")
      .then(safeJson)
      .then((d) => setOrderCount(d?.pagination?.total ?? 0))
      .catch(() => setOrderCount(0));
  }, []);

  const deleteAddress = async (id: string) => {
    await fetch("/api/addresses", {
      method:  "DELETE",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id }),
    });
    fetchAddresses();
  };

  const setDefault = async (id: string) => {
    await fetch("/api/addresses", {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id, isDefault: true }),
    });
    fetchAddresses();
  };

  if (!session) return null;

  return (
    <div className="max-w-[860px] mx-auto px-4 py-10" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] font-tajawal uppercase mb-1" style={{ color: C.gold }}>
          VŌGU
        </p>
        <h1 className="font-cormorant text-[36px] font-light" style={{ color: C.t1 }}>حسابي</h1>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 mb-6 border"
        style={{ background: "#FFFFFF", borderColor: C.b1 }}
      >
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border-2"
            style={{ background: `${C.gold}14`, borderColor: `${C.gold}4D` }}
          >
            {session.user?.image ? (
              <Image src={session.user.image} alt="avatar" width={64} height={64} className="object-cover" />
            ) : (
              <User size={26} style={{ color: C.gold }} />
            )}
          </div>

          <div className="flex-1">
            <h2 className="font-cormorant text-[22px]" style={{ color: C.t1 }}>
              {session.user?.name ?? "عميل VŌGU"}
            </h2>
            <p className="text-[12px] font-tajawal mt-0.5" style={{ color: C.t2 }}>
              {session.user?.email}
            </p>
            {saved && (
              <p className="flex items-center gap-1 text-[11px] font-tajawal mt-1" style={{ color: C.ok }}>
                <CheckCircle2 size={12} /> تم الحفظ
              </p>
            )}
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-tajawal border transition-all"
            style={{ borderColor: C.b1, color: C.t3 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.err; e.currentTarget.style.borderColor = `${C.err}4D`; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.b1; }}
          >
            <LogOut size={13} />
            تسجيل الخروج
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link href="/orders">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-5 transition-colors cursor-pointer group border"
            style={{ background: "#FFFFFF", borderColor: C.b1 }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${C.gold}55`)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.b1)}
          >
            <ShoppingBag size={20} style={{ color: C.gold }} className="mb-3" />
            <p className="font-cormorant text-[32px] leading-none" style={{ color: C.t1 }}>{orderCount}</p>
            <p
              className="text-[11px] font-tajawal mt-1 transition-colors"
              style={{ color: C.t2 }}
            >
              طلباتي ←
            </p>
          </motion.div>
        </Link>

        <Link href="/wishlist">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl p-5 transition-colors cursor-pointer group border"
            style={{ background: "#FFFFFF", borderColor: C.b1 }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${C.gold}55`)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.b1)}
          >
            <Package size={20} style={{ color: C.gold }} className="mb-3" />
            <p className="font-cormorant text-[32px] leading-none" style={{ color: C.t1 }}>
              {addresses.length}
            </p>
            <p className="text-[11px] font-tajawal mt-1 transition-colors" style={{ color: C.t2 }}>
              المفضلة ←
            </p>
          </motion.div>
        </Link>
      </div>

      {/* Addresses */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-5 border"
        style={{ background: "#FFFFFF", borderColor: C.b1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-cormorant text-[18px]" style={{ color: C.t1 }}>عناويني</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 text-[11px] font-tajawal px-3 py-1.5 rounded-lg border transition-colors"
            style={{ color: C.gold, borderColor: `${C.gold}4D` }}
            onMouseEnter={(e) => (e.currentTarget.style.background = `${C.gold}14`)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Plus size={12} />
            إضافة عنوان
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4">
            <AddAddressForm
              onSave={() => { setShowAddForm(false); fetchAddresses(); }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {addresses.length === 0 && !showAddForm ? (
          <div className="text-center py-8">
            <MapPin size={28} style={{ color: C.t3 }} className="mx-auto mb-3" />
            <p className="text-[12px] font-tajawal" style={{ color: C.t2 }}>
              لا توجد عناوين محفوظة بعد
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                addr={addr}
                onDelete={deleteAddress}
                onSetDefault={setDefault}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}