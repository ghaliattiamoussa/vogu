"use client";

import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import {
  MapPin,
  Phone,
  User,
  Home,
  Hash,
  Building,
  ChevronLeft,
  Lock,
  Tag,
  Loader2,
  CheckCircle2,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import PaymentForm, { type PayMethod } from "@/components/checkout/PaymentForm";

// ─── Light theme palette ───────────────────────────────
const C = {
  bg: "#FAFAF8",
  surf: "#F5F3EF",
  card: "#FFFFFF",
  b1: "#EAE7E1",
  b2: "#DDD9D1",
  gold: "#A8823C",
  t1: "#1A1714",
  t2: "#6B6560",
  t3: "#A39E96",
  err: "#C0504D",
  ok: "#3F8F5F",
} as const;

const GOLD_GRADIENT = "linear-gradient(135deg, #C9A86E, #A8823C, #8A6830)";

// ─── Types ───────────────────────────────────────────────────
interface CheckoutFormData {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// ─── Steps ───────────────────────────────────────────────────
const STEPS = ["عنوان الشحن", "طريقة الدفع", "تأكيد الطلب"];

function StepsBar({ current }: { current: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
      }}
      dir="ltr"
    >
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: done ? C.gold : active ? "#fff" : C.card,
                  border: `2px solid ${done || active ? C.gold : C.b2}`,
                  color: done ? "#fff" : active ? C.gold : C.t3,
                  fontFamily: "Tajawal, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  transition: "all 0.3s",
                }}
              >
                {done ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "Tajawal, sans-serif",
                  whiteSpace: "nowrap",
                  color: active ? C.gold : done ? C.t2 : C.t3,
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 64,
                  height: 1,
                  margin: "0 8px",
                  marginBottom: 20,
                  background: i < current ? C.gold : C.b1,
                  transition: "background 0.5s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Input component ─────────────────────────────────────────
const Input = forwardRef<HTMLInputElement, any>(
  (
    {
      label,
      icon,
      error,
      required: req,
      placeholder,
      type = "text",
      dir: d = "rtl",
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: C.t2,
            fontFamily: "Tajawal, sans-serif",
          }}
        >
          {icon && <span style={{ color: C.gold }}>{icon}</span>}
          {label}
          {req && <span style={{ color: C.err }}>*</span>}
        </label>
        <input
          type={type}
          dir={d}
          placeholder={placeholder}
          ref={ref}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={{
            width: "100%",
            background: C.card,
            border: `1px solid ${error ? C.err : focused ? C.gold : C.b2}`,
            borderRadius: 12,
            padding: "12px 16px",
            color: C.t1,
            fontSize: 13,
            fontFamily: "Tajawal, sans-serif",
            outline: "none",
            direction: d as "ltr" | "rtl",
            transition: "border-color 0.2s",
          }}
        />
        {error && (
          <p
            style={{
              fontSize: 11,
              color: C.err,
              fontFamily: "Tajawal, sans-serif",
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// ─── Order Summary ────────────────────────────────────────────
function OrderSummary({
  items,
  coupon,
  discount,
}: {
  items: any[];
  coupon: string;
  discount: number;
}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal - discount + shipping;

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.b1}`,
        borderRadius: 18,
        padding: 24,
        position: "sticky",
        top: 96,
        boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
      }}
      dir="rtl"
    >
      <h3
        style={{
          fontFamily: "'Cormorant Garant', serif",
          fontSize: 18,
          fontWeight: 400,
          color: C.t1,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ShoppingBag size={16} style={{ color: C.gold }} />
        ملخص الطلب ({items.length})
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 20,
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 64,
                borderRadius: 10,
                background: C.surf,
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.nameAr}
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Cormorant Garant', serif",
                    fontSize: 18,
                    color: C.t3,
                  }}
                >
                  V
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  top: -4,
                  left: -4,
                  width: 17,
                  height: 17,
                  borderRadius: "50%",
                  background: C.gold,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {item.quantity}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 12,
                  color: C.t1,
                  fontFamily: "Tajawal, sans-serif",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.nameAr}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: C.t3,
                  fontFamily: "Tajawal, sans-serif",
                  marginTop: 2,
                }}
              >
                {item.size} · {item.color}
              </p>
            </div>
            <span
              style={{
                fontSize: 13,
                color: C.gold,
                fontWeight: 700,
                fontFamily: "Tajawal, sans-serif",
                flexShrink: 0,
              }}
            >
              {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: C.b1, marginBottom: 16 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            fontFamily: "Tajawal, sans-serif",
            color: C.t2,
          }}
        >
          <span>المجموع الفرعي</span>
          <span>{subtotal.toLocaleString("ar-EG")} ج.م</span>
        </div>
        {discount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              fontFamily: "Tajawal, sans-serif",
              color: C.ok,
            }}
          >
            <span>خصم {coupon && `(${coupon})`}</span>
            <span>− {discount.toLocaleString("ar-EG")} ج.م</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            fontFamily: "Tajawal, sans-serif",
          }}
        >
          <span style={{ color: C.t2 }}>الشحن</span>
          <span style={{ color: shipping === 0 ? C.ok : C.t1 }}>
            {shipping === 0 ? "مجاني 🎉" : `${shipping} ج.م`}
          </span>
        </div>
        <div style={{ height: 1, background: C.b1 }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span
            style={{ fontWeight: 700, color: C.t1, fontFamily: "Tajawal, sans-serif" }}
          >
            الإجمالي
          </span>
          <span
            style={{
              fontFamily: "'Cormorant Garant', serif",
              fontSize: 20,
              color: C.gold,
            }}
          >
            {total.toLocaleString("ar-EG")} ج.م
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 20,
          background: C.surf,
          border: `1px solid ${C.b1}`,
          borderRadius: 12,
          padding: "10px 12px",
        }}
      >
        <Lock size={12} style={{ color: C.ok, flexShrink: 0 }} />
        <p style={{ fontSize: 11, color: C.t2, fontFamily: "Tajawal, sans-serif" }}>
          دفع آمن ومشفر بتقنية SSL
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(
    null
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>("cod");
  const [transferRef, setTransferRef] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [senderAccount, setSenderAccount] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: { country: "مصر" },
    reValidateMode: "onChange",
  });
  const [savedAddressId, setSavedAddressId] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  // ── جلب العنوان المحفوظ وملء الحقول تلقائياً ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/addresses");
        if (!res.ok) return;
        const data = await res.json();
        const def = data.addresses?.[0];
        if (def) {
          setValue("fullName", def.fullName);
          setValue("phone", def.phone);
          setValue("street", def.street);
          setValue("city", def.city);
          setValue("postalCode", def.postalCode ?? "");
          setValue("country", def.country ?? "مصر");
          setSavedAddressId(def.id);
        }
      } catch {
        // تجاهل
      } finally {
        setLoadingAddress(false);
      }
    })();
  }, [setValue]);

  // ─── Coupon ────────────────────────────────────────────────
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const res = await fetch(
        `/api/coupons/validate?code=${couponCode.toUpperCase()}&total=${subtotal}`
      );
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount);
        setCouponMsg({ ok: true, text: `✓ ${data.message}` });
      } else {
        setCouponMsg({ ok: false, text: data.error ?? "كود غير صالح" });
      }
    } catch {
      setCouponMsg({ ok: false, text: "خطأ في التحقق" });
    }
  };

  const mapPayMethod = (m: PayMethod): string => {
    const MAP: Record<PayMethod, string> = {
      cod: "cash_on_delivery",
      card: "stripe",
      instapay: "instapay",
      vodafone_cash: "vodafone_cash",
      orange_money: "orange_money",
      etisalat_cash: "etisalat_cash",
      fawry: "fawry",
      valu: "valu",
    };
    return MAP[m] ?? m;
  };

  // ─── Submit ─────────────────────────────────────────────────
  const onSubmit = async (data: CheckoutFormData) => {
    const wallets = ["instapay", "vodafone_cash", "orange_money", "etisalat_cash"];
    if (wallets.includes(payMethod) && !transferRef.trim() && !uploadedImage) {
      setApiError("يرجى إدخال رقم العملية أو رفع صورة التحويل");
      return;
    }

    setLoading(true);
    setApiError(null);
    try {
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const shippingCost = subtotal >= 500 ? 0 : 50;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: data,
          couponCode: couponCode || undefined,
          paymentMethod: mapPayMethod(payMethod),
          transferRef: transferRef || undefined,
          transferImage: uploadedImage || undefined,
          senderAccount: senderAccount || undefined,
          shippingCost,
          cartItems: items.map((i) => ({
            id: i.id,
            nameAr: i.nameAr,
            nameEn: i.nameEn,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
            colorHex: i.colorHex,
            isCustom: i.isCustom ?? false,
            image: i.customDesignImage ?? i.image ?? null,
            customDesignImage: i.customDesignImage ?? i.image ?? null,
            designData: i.designData ?? null,
          })),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setApiError(
          typeof result?.error === "string"
            ? result.error
            : "حدث خطأ أثناء تنفيذ الطلب"
        );
        return;
      }

      if (result.orderId) {
        if (!savedAddressId) {
          fetch("/api/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName: data.fullName,
              phone: data.phone,
              street: data.street,
              city: data.city,
              state: data.city,
              country: data.country,
              postalCode: data.postalCode,
              isDefault: true,
            }),
          }).catch(() => {});
        }

        clearCart();

        // ✅ تأخير بسيط لضمان حفظ الطلب في قاعدة البيانات
        setTimeout(() => {
          router.push(`/orders/${result.orderId}?success=true`);
        }, 300);
      } else {
        setApiError("حدث خطأ أثناء تنفيذ الطلب، حاول مرة أخرى");
      }
    } catch (e) {
      console.error(e);
      setApiError("تعذر الاتصال بالخادم، تحقق من الاتصال وحاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  // ─── Empty cart ─────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          background: C.bg,
        }}
        dir="rtl"
      >
        <ShoppingBag size={48} style={{ color: C.t3 }} />
        <p
          style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 26,
            color: C.t1,
          }}
        >
          السلة فارغة
        </p>
        <button
          onClick={() => router.push("/shop")}
          style={{
            background: GOLD_GRADIENT,
            color: "#fff",
            border: "none",
            padding: "13px 32px",
            borderRadius: 999,
            fontFamily: "Tajawal, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: `0 8px 24px ${C.gold}40`,
          }}
        >
          تسوق الآن
        </button>
      </div>
    );
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = subtotal >= 500 ? 0 : 50;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const summaryItems = items.map((i) => ({
    nameAr: i.nameAr,
    price: i.price,
    quantity: i.quantity,
    size: i.size,
    color: i.color,
    image: i.image ?? "",
  }));

  return (
    <div
      style={{ minHeight: "100vh", background: C.bg, padding: "40px 16px" }}
      dir="rtl"
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.35em",
              color: C.gold,
              fontFamily: "Tajawal, sans-serif",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            VŌGU
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garant', serif",
              fontSize: 34,
              fontWeight: 300,
              color: C.t1,
            }}
          >
            إتمام الشراء
          </h1>
        </div>

        <StepsBar current={step} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
            alignItems: "start",
          }}
          className="lg:grid-cols-[1fr_340px]"
        >
          <div>
            {/* ── Step 0: Address ── */}
            {step === 0 && (
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.b1}`,
                  borderRadius: 18,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Cormorant Garant', serif",
                    fontSize: 22,
                    fontWeight: 400,
                    color: C.t1,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <MapPin size={18} style={{ color: C.gold }} />
                  عنوان الشحن
                </h2>
                {savedAddressId && !loadingAddress && (
                  <p
                    style={{
                      fontSize: 11,
                      color: C.ok,
                      fontFamily: "Tajawal, sans-serif",
                      background: `${C.ok}10`,
                      border: `1px solid ${C.ok}30`,
                      borderRadius: 10,
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    ✓ تم ملء العنوان تلقائياً من بياناتك المحفوظة
                  </p>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                  className="sm:grid-cols-2"
                >
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Input
                      label="الاسم الكامل"
                      icon={<User size={12} />}
                      required
                      placeholder="محمد أحمد"
                      error={errors.fullName?.message}
                      {...register("fullName", { required: "الاسم الكامل مطلوب" })}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Input
                      label="رقم الهاتف"
                      icon={<Phone size={12} />}
                      required
                      placeholder="01xxxxxxxxx"
                      type="tel"
                      dir="ltr"
                      error={errors.phone?.message}
                      {...register("phone", {
                        required: "رقم الهاتف مطلوب",
                        pattern: {
                          value: /^(\+20|0)?1[0-2,5]{1}[0-9]{8}$/,
                          message: "رقم غير صالح",
                        },
                      })}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Input
                      label="العنوان التفصيلي"
                      icon={<Home size={12} />}
                      required
                      placeholder="رقم الشارع، الحي، المبنى..."
                      error={errors.street?.message}
                      {...register("street", {
                        required: "العنوان التفصيلي مطلوب",
                      })}
                    />
                  </div>
                  <Input
                    label="المدينة"
                    icon={<Building size={12} />}
                    required
                    placeholder="القاهرة"
                    error={errors.city?.message}
                    {...register("city", { required: "المدينة مطلوبة" })}
                  />
                  <Input
                    label="الرمز البريدي"
                    icon={<Hash size={12} />}
                    placeholder="12345"
                    {...register("postalCode")}
                  />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        color: C.t2,
                        fontFamily: "Tajawal, sans-serif",
                        marginBottom: 6,
                      }}
                    >
                      <MapPin size={12} style={{ color: C.gold }} />
                      الدولة
                    </label>
                    <select
                      {...register("country")}
                      style={{
                        width: "100%",
                        background: C.card,
                        border: `1px solid ${C.b2}`,
                        borderRadius: 12,
                        padding: "12px 16px",
                        color: C.t1,
                        fontSize: 13,
                        fontFamily: "Tajawal, sans-serif",
                        outline: "none",
                        cursor: "pointer",
                      }}
                      dir="rtl"
                    >
                      <option value="مصر">🇪🇬 مصر</option>
                      <option value="السعودية">🇸🇦 السعودية</option>
                      <option value="الإمارات">🇦🇪 الإمارات</option>
                      <option value="الكويت">🇰🇼 الكويت</option>
                      <option value="قطر">🇶🇦 قطر</option>
                    </select>
                  </div>
                </div>

                {/* Coupon */}
                <div style={{ borderTop: `1px solid ${C.b1}`, paddingTop: 20 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      color: C.t2,
                      fontFamily: "Tajawal, sans-serif",
                      marginBottom: 12,
                    }}
                  >
                    <Tag size={12} style={{ color: C.gold }} />
                    كود الخصم (اختياري)
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponMsg(null);
                      }}
                      placeholder="VOGU2025"
                      style={{
                        flex: 1,
                        background: C.card,
                        border: `1px solid ${C.b2}`,
                        borderRadius: 12,
                        padding: "12px 16px",
                        color: C.t1,
                        fontSize: 13,
                        fontFamily: "Tajawal, sans-serif",
                        outline: "none",
                        letterSpacing: "0.1em",
                      }}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      style={{
                        background: C.surf,
                        border: `1px solid ${C.b2}`,
                        borderRadius: 12,
                        padding: "0 20px",
                        color: C.gold,
                        fontSize: 13,
                        fontFamily: "Tajawal, sans-serif",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      تطبيق
                    </button>
                  </div>
                  {couponMsg && (
                    <p
                      style={{
                        fontSize: 11,
                        fontFamily: "Tajawal, sans-serif",
                        marginTop: 8,
                        color: couponMsg.ok ? C.ok : C.err,
                      }}
                    >
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit(() => setStep(1))}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: GOLD_GRADIENT,
                    color: "#fff",
                    borderRadius: 14,
                    border: "none",
                    padding: "16px",
                    fontSize: 14,
                    fontFamily: "Tajawal, sans-serif",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: `0 8px 24px ${C.gold}40`,
                  }}
                >
                  <ChevronLeft size={17} />
                  التالي: طريقة الدفع
                </button>
              </div>
            )}

            {/* ── Step 1: Payment ── */}
            {step === 1 && (
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.b1}`,
                  borderRadius: 18,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Cormorant Garant', serif",
                    fontSize: 22,
                    fontWeight: 400,
                    color: C.t1,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <CreditCard size={18} style={{ color: C.gold }} />
                  طريقة الدفع
                </h2>

                <PaymentForm
                  total={total}
                  selectedMethod={payMethod}
                  onMethodChange={(m) => {
                    setPayMethod(m);
                    setApiError(null);
                  }}
                  transferRef={transferRef}
                  onRefChange={setTransferRef}
                  senderAccount={senderAccount}
                  onSenderAccountChange={setSenderAccount}
                  onUploadChange={(url) => setUploadedImage(url || null)}
                />

                {apiError && (
                  <p
                    style={{
                      fontSize: 12,
                      fontFamily: "Tajawal, sans-serif",
                      textAlign: "center",
                      background: `${C.err}10`,
                      border: `1px solid ${C.err}30`,
                      borderRadius: 12,
                      padding: "10px 12px",
                      color: C.err,
                    }}
                  >
                    {apiError}
                  </p>
                )}

                <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    style={{
                      flex: 1,
                      border: `1px solid ${C.b2}`,
                      color: C.t2,
                      borderRadius: 14,
                      padding: "14px",
                      fontSize: 13,
                      fontFamily: "Tajawal, sans-serif",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    ← العودة للعنوان
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit, () => setStep(0))}
                    disabled={loading}
                    style={{
                      flex: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: loading ? `${C.gold}99` : GOLD_GRADIENT,
                      color: "#fff",
                      borderRadius: 14,
                      border: "none",
                      padding: "14px",
                      fontSize: 14,
                      fontFamily: "Tajawal, sans-serif",
                      fontWeight: 700,
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: `0 8px 24px ${C.gold}40`,
                    }}
                  >
                    {loading ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 size={17} /> تأكيد الطلب
                      </>
                    )}
                  </button>
                </div>

                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontSize: 11,
                    color: C.t3,
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  <Lock size={11} />
                  جميع بياناتك محمية ومشفرة
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <OrderSummary
            items={summaryItems}
            coupon={couponCode}
            discount={discount}
          />
        </div>
      </div>
    </div>
  );
}