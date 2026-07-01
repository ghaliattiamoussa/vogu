// src/components/checkout/PaymentForm.tsx
"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/constants";
import { Copy, Check, AlertCircle, Upload, X, Loader2, Image } from "lucide-react";

// ─── Light theme palette ──────────────────────────────
const C = {
  card: "#FFFFFF",
  surf: "#F5F3EF",
  b1:   "#EAE7E1",
  b2:   "#DDD9D1",
  gold: "#A8823C",
  goldSoft: "#A8823C0D",
  t1:   "#1A1714",
  t2:   "#6B6560",
  t3:   "#A39E96",
  err:  "#C0504D",
  ok:   "#3D9960",
} as const;

const ACCOUNT_NUMBERS = {
  instapay:       "01XXXXXXXXX",
  vodafone_cash:  "01XXXXXXXXX",
  orange_money:   "01XXXXXXXXX",
  etisalat_cash:  "01XXXXXXXXX",
} as const;

export type PayMethod =
  | "instapay" | "vodafone_cash" | "orange_money" | "etisalat_cash"
  | "fawry" | "valu" | "cod" | "card";

interface PaymentFormProps {
  total:           number;
  onMethodChange?: (method: PayMethod) => void;
  selectedMethod?: PayMethod;
  transferRef?:    string;
  onRefChange?:    (ref: string) => void;
  senderAccount?:  string;
  onSenderAccountChange?: (value: string) => void;
  onUploadChange?: (imageUrl: string | null) => void;
}

// ── تعريف طرق الدفع ───────────────────────────────────
const GROUPS = [
  {
    label: "المحافظ الإلكترونية",
    methods: [
      { id: "instapay" as PayMethod,      label: "InstaPay",       icon: "⚡", desc: "تحويل فوري عبر InstaPay" },
      { id: "vodafone_cash" as PayMethod, label: "Vodafone Cash",  icon: "📱", desc: "محفظة فودافون كاش" },
      { id: "orange_money" as PayMethod,  label: "Orange Money",  icon: "🟠", desc: "محفظة أورانج موني" },
      { id: "etisalat_cash" as PayMethod, label: "Etisalat / WE", icon: "💚", desc: "محفظة اتصالات / WE" },
    ],
  },
  {
    label: "طرق أخرى",
    methods: [
      { id: "cod" as PayMethod,   label: "الدفع عند الاستلام", icon: "💵", desc: "كاش عند التسليم" },
      { id: "fawry" as PayMethod, label: "فوري",                icon: "🏪", desc: "ادفع في أقرب نقطة فوري" },
      { id: "valu" as PayMethod,  label: "ValU تقسيط",          icon: "🔄", desc: "قسّم على 6 أو 12 شهر" },
    ],
  },
  {
    label: "بطاقة ائتمان",
    methods: [
      { id: "card" as PayMethod, label: "فيزا / ماستر كارت", icon: "💳", desc: "قريباً — Stripe", disabled: true },
    ],
  },
];

// ── نسخ الرقم ─────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      style={{
        display: "flex", alignItems: "center", gap: 4, fontSize: 11,
        color: C.gold, fontFamily: "Tajawal, sans-serif", background: "none",
        border: "none", cursor: "pointer",
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "تم النسخ" : "نسخ"}
    </button>
  );
}

// ─── المكوّن الرئيسي ──────────────────────────────────
export function PaymentForm({
  total,
  onMethodChange,
  selectedMethod = "instapay",
  transferRef = "",
  onRefChange,
  senderAccount = "",
  onSenderAccountChange,
  onUploadChange,
}: PaymentFormProps) {
  const isWallet = ["instapay", "vodafone_cash", "orange_money", "etisalat_cash"].includes(selectedMethod);
  const accountNumber = isWallet
    ? ACCOUNT_NUMBERS[selectedMethod as keyof typeof ACCOUNT_NUMBERS]
    : null;

  // ── حالة رفع الصورة ──
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    if (!file.type.startsWith("image/")) {
      setUploadError("يرجى اختيار صورة فقط (JPG, PNG, WEBP)");
      setUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("حجم الصورة يجب أن لا يتجاوز 5 ميجابايت");
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "فشل رفع الصورة");
        setUploading(false);
        return;
      }

      setUploadedImage(data.url);
      onUploadChange?.(data.url);
    } catch {
      setUploadError("حدث خطأ أثناء رفع الصورة، حاول مجدداً");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    onUploadChange?.(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }} dir="rtl">

      {/* ── اختيار طريقة الدفع ── */}
      {GROUPS.map((group) => (
        <div key={group.label}>
          <p style={{
            fontSize: 10, color: C.t3, fontFamily: "Tajawal, sans-serif",
            letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12,
          }}>
            {group.label}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {group.methods.map((m) => {
              const isSelected = selectedMethod === m.id;
              const disabled   = (m as any).disabled;
              return (
                <button
                  key={m.id}
                  disabled={disabled}
                  onClick={() => !disabled && onMethodChange?.(m.id)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6,
                    padding: 14, borderRadius: 12, textAlign: "right", position: "relative",
                    transition: "all 0.2s",
                    border: `2px solid ${disabled ? C.b1 : isSelected ? C.gold : C.b1}`,
                    background: disabled ? C.surf : isSelected ? C.goldSoft : C.card,
                    opacity: disabled ? 0.45 : 1,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.borderColor = C.b2; }}
                  onMouseLeave={(e) => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.borderColor = C.b1; }}
                >
                  {disabled && (
                    <span style={{
                      position: "absolute", top: 8, left: 8, fontSize: 9,
                      color: C.t3, fontFamily: "Tajawal, sans-serif",
                      background: C.b1, padding: "2px 6px", borderRadius: 20,
                    }}>
                      قريباً
                    </span>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <span style={{ fontSize: 18 }}>{m.icon}</span>
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: `2px solid ${isSelected && !disabled ? C.gold : C.b2}`,
                      background: isSelected && !disabled ? C.gold : "transparent",
                    }}>
                      {isSelected && !disabled && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                      )}
                    </div>
                  </div>
                  <p style={{
                    fontSize: 11, fontWeight: 700, fontFamily: "Tajawal, sans-serif", lineHeight: 1.3,
                    color: isSelected && !disabled ? C.gold : C.t1,
                  }}>
                    {m.label}
                  </p>
                  <p style={{ fontSize: 10, color: C.t3, fontFamily: "Tajawal, sans-serif" }}>{m.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── تفاصيل طريقة الدفع المختارة ── */}

      {/* محافظ إلكترونية */}
      {isWallet && accountNumber && (
        <div style={{
          background: C.surf, border: `1px solid ${C.gold}30`, borderRadius: 14,
          padding: 16, display: "flex", flexDirection: "column", gap: 16,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.t1, fontFamily: "Tajawal, sans-serif", marginBottom: 4 }}>
              خطوات الدفع:
            </p>
            {[
              `حوّل مبلغ ${formatPrice(total)} على الرقم أدناه`,
              "احفظ رقم العملية (Transaction ID)",
              "أدخل رقم العملية في الحقل أدناه (اختياري)",
              "ارفع صورة من تطبيق البنك أو المحفظة كدليل تحويل",
              "اضغط تأكيد الطلب — سيتم التحقق خلال ساعة",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                  background: C.goldSoft, border: `1px solid ${C.gold}50`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: C.gold, fontWeight: 700,
                }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: 11, color: C.t2, fontFamily: "Tajawal, sans-serif" }}>{step}</p>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.b2}`, borderRadius: 10, padding: 12 }}>
            <p style={{ fontSize: 10, color: C.t3, fontFamily: "Tajawal, sans-serif", marginBottom: 4 }}>
              الرقم المخصص للتحويل
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: C.gold, fontFamily: "monospace", letterSpacing: "0.05em" }}>
                {accountNumber}
              </span>
              <CopyButton text={accountNumber} />
            </div>
          </div>

          {/* ── حقل رقم العملية ── */}
          <div>
            <label style={{ fontSize: 11, color: C.t1, fontFamily: "Tajawal, sans-serif", display: "block", marginBottom: 6 }}>
              رقم العملية (Transaction ID) <span style={{ color: C.t3, fontSize: 10 }}>(اختياري)</span>
            </label>
            <input
              type="text"
              value={transferRef}
              onChange={(e) => onRefChange?.(e.target.value)}
              placeholder="مثال: TXN123456789"
              dir="ltr"
              style={{
                width: "100%", background: C.card, border: `1px solid ${C.b2}`,
                borderRadius: 10, padding: "10px 12px", fontSize: 12,
                color: C.t1, fontFamily: "monospace", outline: "none",
              }}
              onFocus={(e) => ((e.target as HTMLElement).style.borderColor = C.gold)}
              onBlur={(e)  => ((e.target as HTMLElement).style.borderColor = C.b2)}
            />
          </div>

          {/* ── رقم الحساب المرسل ── */}
          <div>
            <label style={{ fontSize: 11, color: C.t1, fontFamily: "Tajawal, sans-serif", display: "block", marginBottom: 6 }}>
              رقم الحساب / المحفظة الذي حولت منه <span style={{ color: C.t3, fontSize: 10 }}>(اختياري)</span>
            </label>
            <input
              type="text"
              value={senderAccount}
              onChange={(e) => onSenderAccountChange?.(e.target.value)}
              placeholder="مثال: 01012345678 أو رقم الحساب البنكي"
              dir="ltr"
              style={{
                width: "100%", background: C.card, border: `1px solid ${C.b2}`,
                borderRadius: 10, padding: "10px 12px", fontSize: 12,
                color: C.t1, fontFamily: "Tajawal, sans-serif", outline: "none",
              }}
              onFocus={(e) => ((e.target as HTMLElement).style.borderColor = C.gold)}
              onBlur={(e)  => ((e.target as HTMLElement).style.borderColor = C.b2)}
            />
            <p style={{ fontSize: 9, color: C.t3, fontFamily: "Tajawal, sans-serif", marginTop: 4 }}>
              سيساعدنا هذا في تأكيد هوية المحول بسرعة
            </p>
          </div>

          {/* ── رفع صورة التحويل ── */}
          <div>
            <label style={{ fontSize: 11, color: C.t1, fontFamily: "Tajawal, sans-serif", display: "block", marginBottom: 6 }}>
              صورة إثبات التحويل <span style={{ color: C.err, fontSize: 10 }}>*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />

            {uploadedImage ? (
              <div style={{
                position: "relative",
                background: C.card,
                border: `1px solid ${C.ok}40`,
                borderRadius: 10,
                padding: 12,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  overflow: "hidden",
                  flexShrink: 0,
                  background: C.surf,
                  border: `1px solid ${C.b1}`,
                }}>
                  <img
                    src={uploadedImage}
                    alt="إثبات التحويل"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.ok, fontFamily: "Tajawal, sans-serif" }}>
                    ✓ تم رفع الصورة
                  </p>
                  <p style={{ fontSize: 10, color: C.t3, fontFamily: "Tajawal, sans-serif" }}>
                    تم رفع إثبات التحويل بنجاح
                  </p>
                </div>

                <button
                  onClick={removeImage}
                  style={{
                    background: C.err + "0D",
                    border: `1px solid ${C.err}30`,
                    borderRadius: 8,
                    padding: 6,
                    cursor: "pointer",
                    color: C.err,
                    display: "flex",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.background = C.err + "20")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.background = C.err + "0D")}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "20px 16px",
                  background: C.card,
                  border: `2px dashed ${uploadError ? C.err : C.b2}`,
                  borderRadius: 10,
                  cursor: uploading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: uploading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!uploading) ((e.target as HTMLElement).style.borderColor = C.gold);
                }}
                onMouseLeave={(e) => {
                  if (!uploading) ((e.target as HTMLElement).style.borderColor = C.b2);
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" style={{ color: C.gold }} />
                    <span style={{ fontSize: 11, color: C.t2, fontFamily: "Tajawal, sans-serif" }}>
                      جاري رفع الصورة...
                    </span>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: C.goldSoft,
                      border: `1px solid ${C.gold}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Image size={18} style={{ color: C.gold }} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 12, color: C.t1, fontFamily: "Tajawal, sans-serif", fontWeight: 600 }}>
                        اضغط لرفع صورة إثبات التحويل
                      </p>
                      <p style={{ fontSize: 10, color: C.t3, fontFamily: "Tajawal, sans-serif", marginTop: 2 }}>
                        JPG, PNG, WEBP — الحد الأقصى 5 ميجابايت
                      </p>
                    </div>
                  </>
                )}
              </button>
            )}

            {uploadError && (
              <p style={{ fontSize: 11, color: C.err, fontFamily: "Tajawal, sans-serif", marginTop: 6 }}>
                ⚠ {uploadError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── الدفع عند الاستلام ── */}
      {selectedMethod === "cod" && (
        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 14, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <AlertCircle size={14} style={{ color: C.gold, marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.t1, fontFamily: "Tajawal, sans-serif" }}>
                الدفع نقداً عند الاستلام
              </p>
              <p style={{ fontSize: 11, color: C.t2, fontFamily: "Tajawal, sans-serif", marginTop: 4, lineHeight: 1.7 }}>
                ستدفع <span style={{ color: C.gold, fontWeight: 700 }}>{formatPrice(total)}</span> نقداً
                لمندوب التوصيل عند استلام طلبك. تأكد من توفر المبلغ كاملاً.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── فوري ── */}
      {selectedMethod === "fawry" && (
        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 14, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🏪</span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.t1, fontFamily: "Tajawal, sans-serif" }}>
                الدفع عبر فوري
              </p>
              <p style={{ fontSize: 11, color: C.t2, fontFamily: "Tajawal, sans-serif", marginTop: 4, lineHeight: 1.7 }}>
                بعد تأكيد الطلب ستحصل على <span style={{ color: C.gold, fontWeight: 700 }}>كود فوري</span> لدفع{" "}
                <span style={{ color: C.gold, fontWeight: 700 }}>{formatPrice(total)}</span>{" "}
                في أقرب نقطة فوري أو من خلال التطبيق. الكود صالح لمدة 48 ساعة.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── ValU ── */}
      {selectedMethod === "valu" && (
        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 14, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔄</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.t1, fontFamily: "Tajawal, sans-serif" }}>
                التقسيط عبر ValU
              </p>
              <p style={{ fontSize: 11, color: C.t2, fontFamily: "Tajawal, sans-serif", marginTop: 4, lineHeight: 1.7 }}>
                قسّم <span style={{ color: C.gold, fontWeight: 700 }}>{formatPrice(total)}</span> على 6 أو 12 شهر
                بدون فوائد. تحتاج لتطبيق ValU مفعّل ومربوط ببطاقتك.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                {[
                  { months: 6,  amount: Math.round(total / 6)  },
                  { months: 12, amount: Math.round(total / 12) },
                ].map(({ months, amount }) => (
                  <div key={months} style={{
                    background: C.card, border: `1px solid ${C.b2}`, borderRadius: 10,
                    padding: 10, textAlign: "center",
                  }}>
                    <p style={{ fontSize: 12, color: C.gold, fontWeight: 700, fontFamily: "'Cormorant Garant', serif" }}>
                      {formatPrice(amount)}
                    </p>
                    <p style={{ fontSize: 9, color: C.t3, fontFamily: "Tajawal, sans-serif" }}>× {months} شهر</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PaymentForm;