"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft, ImagePlus, Loader2,
  Plus, Save, Trash2, Upload, X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────
type Category = { id: string; slug: string; nameAr: string };
type SizeStock = { size: string; stock: number };
type Variant   = { color: string; colorHex: string; sizes: SizeStock[] };

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2Y", "4Y", "6Y", "8Y", "10Y"];

// ─── Slug generator ───────────────────────────────────────────
function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
}

// ─── Variant Builder ──────────────────────────────────────────
function VariantBuilder({
  variant,
  index,
  onChange,
  onRemove,
}: {
  variant: Variant;
  index: number;
  onChange: (v: Variant) => void;
  onRemove: () => void;
}) {
  const toggleSize = (size: string) => {
    const exists = variant.sizes.find((s) => s.size === size);
    if (exists) {
      onChange({ ...variant, sizes: variant.sizes.filter((s) => s.size !== size) });
    } else {
      onChange({ ...variant, sizes: [...variant.sizes, { size, stock: 10 }] });
    }
  };

  const setStock = (size: string, stock: number) => {
    onChange({
      ...variant,
      sizes: variant.sizes.map((s) => (s.size === size ? { ...s, stock } : s)),
    });
  };

  return (
    <div className="bg-[#121212] border border-[#1A1A1A] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] text-[#8A8480] font-tajawal">
          لون {index + 1}
        </p>
        <button
          onClick={onRemove}
          className="text-[#484542] hover:text-[#D07070] transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Color inputs */}
      <div className="flex gap-2 mb-3">
        <input
          value={variant.color}
          onChange={(e) => onChange({ ...variant, color: e.target.value })}
          placeholder="اسم اللون (عاجي)"
          className="flex-1 bg-[#0D0D0D] border border-[#1A1A1A] rounded-lg px-3 py-2 text-[12px] text-[#EDE8DF] placeholder-[#484542] font-tajawal outline-none focus:border-[#C9A86E]/40"
          dir="rtl"
        />
        <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#1A1A1A] rounded-lg px-3 py-2">
          <input
            type="color"
            value={variant.colorHex}
            onChange={(e) => onChange({ ...variant, colorHex: e.target.value })}
            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
          />
          <span className="text-[11px] text-[#8A8480] font-mono">
            {variant.colorHex}
          </span>
        </div>
      </div>

      {/* Size selector */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {SIZES.map((size) => {
          const active = variant.sizes.find((s) => s.size === size);
          return (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-tajawal border transition-all ${
                active
                  ? "bg-[#1A1200] border-[#C9A86E]/50 text-[#C9A86E]"
                  : "bg-[#0D0D0D] border-[#1A1A1A] text-[#484542] hover:border-[#262626]"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Stock per size */}
      {variant.sizes.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {variant.sizes.map(({ size, stock }) => (
            <div key={size} className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#8A8480] font-tajawal w-8">{size}</span>
              <input
                type="number"
                value={stock}
                min={0}
                onChange={(e) => setStock(size, Number(e.target.value))}
                className="flex-1 bg-[#0D0D0D] border border-[#1A1A1A] rounded-lg px-2 py-1 text-[11px] text-[#EDE8DF] outline-none focus:border-[#C9A86E]/40 text-center"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id     = params.id as string;

  // Form state
  const [nameAr,      setNameAr]      = useState("");
  const [nameEn,      setNameEn]      = useState("");
  const [brand,       setBrand]       = useState("");
  const [slug,        setSlug]        = useState("");
  const [description, setDescription] = useState("");
  const [categoryId,  setCategoryId]  = useState("");
  const [price,       setPrice]       = useState("");
  const [origPrice,   setOrigPrice]   = useState("");
  const [tags,        setTags]        = useState("");
  const [isNew,       setIsNew]       = useState(true);
  const [isBest,      setIsBest]      = useState(false);
  const [isActive,    setIsActive]    = useState(true);
  const [variants,    setVariants]    = useState<Variant[]>([
    { color: "", colorHex: "#C4956A", sizes: [] },
  ]);
  const [imageUrl,    setImageUrl]    = useState("");
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrls,   setImageUrls]   = useState<string[]>([]);

  const [categories,  setCategories]  = useState<Category[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [error,       setError]       = useState("");
  const [notFound,    setNotFound]    = useState(false);

  // تخطّي توليد الـ slug التلقائي عند أول تعبئة من بيانات المنتج
  const skipNextSlugGen = useRef(true);

  // ── توليد slug تلقائياً عند تغيير الاسم الإنجليزي (يدوياً فقط) ──
  useEffect(() => {
    if (skipNextSlugGen.current) {
      skipNextSlugGen.current = false;
      return;
    }
    if (nameEn) setSlug(toSlug(nameEn));
  }, [nameEn]);

  // ── جلب الفئات ──
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.categories?.length) setCategories(d.categories);
        else setCategories([
          { id: "women", slug: "women", nameAr: "نساء" },
          { id: "men",   slug: "men",   nameAr: "رجال" },
          { id: "kids",  slug: "kids",  nameAr: "أطفال" },
          { id: "sale",  slug: "sale",  nameAr: "تخفيضات" },
        ]);
      })
      .catch(() =>
        setCategories([
          { id: "women", slug: "women", nameAr: "نساء" },
          { id: "men",   slug: "men",   nameAr: "رجال" },
          { id: "kids",  slug: "kids",  nameAr: "أطفال" },
          { id: "sale",  slug: "sale",  nameAr: "تخفيضات" },
        ])
      );
  }, []);

  // ── جلب بيانات المنتج وتعبئة الفورم ──
  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/products/${id}`)
      .then(async (r) => {
        if (!r.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const { product } = await r.json();

        setNameAr(product.nameAr ?? "");

        // منع إعادة توليد الـ slug عند تعبئة الاسم الإنجليزي تلقائياً
        skipNextSlugGen.current = true;
        setNameEn(product.nameEn ?? "");

        setBrand(product.brand ?? "");
        setSlug(product.slug ?? "");
        setDescription(product.description ?? "");
        setCategoryId(product.categoryId ?? product.category?.id ?? "");
        setPrice(product.price != null ? String(product.price) : "");
        setOrigPrice(product.origPrice != null ? String(product.origPrice) : "");
        setTags(Array.isArray(product.tags) ? product.tags.join(", ") : "");
        setIsNew(!!product.isNew);
        setIsBest(!!product.isBest);
        setIsActive(product.isActive ?? true);

        // تجميع الـ variants (صفوف منفصلة لكل لون+مقاس) إلى مجموعات حسب اللون
        const grouped: Record<string, Variant> = {};
        for (const v of product.variants ?? []) {
          const key = `${v.color}__${v.colorHex}`;
          if (!grouped[key]) {
            grouped[key] = { color: v.color, colorHex: v.colorHex, sizes: [] };
          }
          grouped[key].sizes.push({ size: v.size, stock: v.stock });
        }
        const groupedArr = Object.values(grouped);
        setVariants(groupedArr.length > 0 ? groupedArr : [{ color: "", colorHex: "#C4956A", sizes: [] }]);

        // الصور (مرتبة حسب sortOrder من الـ API)
        setImageUrls((product.images ?? []).map((img: any) => img.url));

        setLoading(false);
      })
      .catch(() => {
        setError("فشل تحميل بيانات المنتج");
        setLoading(false);
      });
  }, [id]);

  const addVariant = () => {
    setVariants((v) => [...v, { color: "", colorHex: "#8A8480", sizes: [] }]);
  };

  const updateVariant = (i: number, v: Variant) => {
    setVariants((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  };

  const removeVariant = (i: number) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setImageUrls((prev) => [...prev, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");

    if (!file.type.startsWith("image/")) {
      setUploadError("يجب أن يكون الملف صورة");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("الحجم الأقصى 5 ميجابايت");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res  = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "فشل رفع الصورة");
        return;
      }

      setImageUrls((prev) => [...prev, data.url]);
    } catch {
      setUploadError("تعذر الاتصال بالخادم");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ─── Save ──────────────────────────────────────────────────
  const handleSave = async () => {
    setError("");

    if (!nameAr || !nameEn || !brand || !price || !categoryId) {
      setError("يرجى ملء جميع الحقول المطلوبة (*)");
      return;
    }
    if (variants.some((v) => !v.color || v.sizes.length === 0)) {
      setError("كل لون يجب أن يحتوي على اسم ومقاس واحد على الأقل");
      return;
    }

    setSaving(true);

    const res = await fetch(`/api/admin/products/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameAr,
        nameEn,
        brand,
        slug:        slug || toSlug(nameEn),
        description,
        categoryId,
        price:       Number(price),
        origPrice:   origPrice ? Number(origPrice) : null,
        tags:        tags.split(",").map((t) => t.trim()).filter(Boolean),
        isNew,
        isBest,
        isActive,
        variants:    variants.map((v) => ({
          color:    v.color,
          colorHex: v.colorHex,
          sizes:    v.sizes,
        })),
        images: imageUrls.map((url, i) => ({
          url,
          isPrimary: i === 0,
          sortOrder: i,
        })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "حدث خطأ أثناء الحفظ");
      setSaving(false);
      return;
    }

    router.push("/admin/products");
  };

  // ─── Delete ────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }

    setDeleting(true);
    setError("");

    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "فشل حذف المنتج");
      setDeleting(false);
      return;
    }

    router.push("/admin/products");
  };

  // ─── Loading / Not Found ──────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-[#C9A86E] animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" dir="rtl">
        <p className="text-[#8A8480] font-tajawal text-sm">المنتج غير موجود</p>
        <Link
          href="/admin/products"
          className="text-[#C9A86E] text-[12px] font-tajawal hover:underline flex items-center gap-1"
        >
          <ChevronLeft size={14} />
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 max-w-[900px]" dir="rtl">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/products"
          className="text-[#8A8480] hover:text-[#EDE8DF] transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <p className="text-[#C9A86E] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-0.5">
            لوحة التحكم
          </p>
          <h1 className="font-cormorant text-[30px] font-light text-[#EDE8DF]">
            تعديل المنتج
          </h1>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-[#1A0808] border border-[#D07070]/30 rounded-xl px-4 py-3 mb-6">
          <X size={14} className="text-[#D07070]" />
          <p className="text-[12px] text-[#D07070] font-tajawal">{error}</p>
        </div>
      )}

      <div className="space-y-5">

        {/* ── Basic Info ── */}
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5">
          <h2 className="font-cormorant text-[17px] text-[#EDE8DF] mb-4">
            المعلومات الأساسية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "اسم المنتج بالعربي *", value: nameAr, set: setNameAr, placeholder: "بليزر كتان واسع" },
              { label: "اسم المنتج بالإنجليزي *", value: nameEn, set: setNameEn, placeholder: "Oversized Linen Blazer" },
              { label: "الماركة *", value: brand, set: setBrand, placeholder: "VŌGU Studio" },
              { label: "Slug", value: slug, set: setSlug, placeholder: "oversized-linen-blazer" },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="text-[11px] text-[#8A8480] font-tajawal mb-1 block">
                  {label}
                </label>
                <input
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-[#121212] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-[12px] text-[#EDE8DF] placeholder-[#484542] font-tajawal outline-none focus:border-[#C9A86E]/40"
                  dir="rtl"
                />
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-3">
            <label className="text-[11px] text-[#8A8480] font-tajawal mb-1 block">
              الوصف
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف تفصيلي للمنتج..."
              rows={3}
              className="w-full bg-[#121212] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-[12px] text-[#EDE8DF] placeholder-[#484542] font-tajawal outline-none focus:border-[#C9A86E]/40 resize-none"
              dir="rtl"
            />
          </div>
        </div>

        {/* ── Category & Pricing ── */}
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5">
          <h2 className="font-cormorant text-[17px] text-[#EDE8DF] mb-4">
            الفئة والسعر
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Category */}
            <div>
              <label className="text-[11px] text-[#8A8480] font-tajawal mb-1 block">
                الفئة *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#121212] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-[12px] text-[#EDE8DF] font-tajawal outline-none focus:border-[#C9A86E]/40 cursor-pointer"
                dir="rtl"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameAr}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-[11px] text-[#8A8480] font-tajawal mb-1 block">
                السعر (ج.م) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1299"
                className="w-full bg-[#121212] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-[12px] text-[#EDE8DF] placeholder-[#484542] outline-none focus:border-[#C9A86E]/40"
              />
            </div>

            {/* Orig Price */}
            <div>
              <label className="text-[11px] text-[#8A8480] font-tajawal mb-1 block">
                السعر الأصلي (قبل الخصم)
              </label>
              <input
                type="number"
                value={origPrice}
                onChange={(e) => setOrigPrice(e.target.value)}
                placeholder="1800"
                className="w-full bg-[#121212] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-[12px] text-[#EDE8DF] placeholder-[#484542] outline-none focus:border-[#C9A86E]/40"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mt-3">
            <label className="text-[11px] text-[#8A8480] font-tajawal mb-1 block">
              التاقات (مفصولة بفاصلة)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="blazer, summer, casual"
              className="w-full bg-[#121212] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-[12px] text-[#EDE8DF] placeholder-[#484542] font-tajawal outline-none focus:border-[#C9A86E]/40"
            />
          </div>

          {/* Flags */}
          <div className="flex gap-4 mt-4">
            {[
              { label: "منتج جديد",      value: isNew,    set: setIsNew },
              { label: "الأكثر مبيعاً",  value: isBest,   set: setIsBest },
              { label: "نشط (مرئي)",     value: isActive, set: setIsActive },
            ].map(({ label, value, set }) => (
              <label
                key={label}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  onClick={() => set(!value)}
                  className={`w-10 h-5 rounded-full transition-all relative ${
                    value ? "bg-[#C9A86E]" : "bg-[#1A1A1A]"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                      value ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </div>
                <span className="text-[12px] text-[#8A8480] font-tajawal">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Variants ── */}
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cormorant text-[17px] text-[#EDE8DF]">
              الألوان والمقاسات
            </h2>
            <button
              onClick={addVariant}
              className="flex items-center gap-1.5 text-[11px] text-[#C9A86E] font-tajawal border border-[#C9A86E]/30 px-3 py-1.5 rounded-lg hover:bg-[#1A1200] transition-colors"
            >
              <Plus size={12} />
              إضافة لون
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, i) => (
              <VariantBuilder
                key={i}
                variant={v}
                index={i}
                onChange={(nv) => updateVariant(i, nv)}
                onRemove={() => removeVariant(i)}
              />
            ))}
          </div>
        </div>

        {/* ── Images ── */}
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5">
          <h2 className="font-cormorant text-[17px] text-[#EDE8DF] mb-4">
            الصور
          </h2>

          {/* رفع من الجهاز + الرابط كخيار ثانوي */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 bg-[#1A1200] border border-[#C9A86E]/30 text-[#C9A86E] px-4 py-3 rounded-xl text-[12px] font-tajawal hover:bg-[#1A1200]/70 transition-colors disabled:opacity-60 mb-3"
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                جاري الرفع إلى Cloudinary...
              </>
            ) : (
              <>
                <Upload size={14} />
                رفع صورة من الجهاز
              </>
            )}
          </button>

          {uploadError && (
            <p className="text-[11px] text-[#D07070] font-tajawal mb-3">{uploadError}</p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-[#484542] font-tajawal whitespace-nowrap">أو رابط مباشر</span>
            <div className="h-px flex-1 bg-[#1A1A1A]" />
          </div>

          <div className="flex gap-2 mb-3">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="رابط الصورة (Cloudinary URL)"
              className="flex-1 bg-[#121212] border border-[#1A1A1A] rounded-xl px-3 py-2.5 text-[12px] text-[#EDE8DF] placeholder-[#484542] font-tajawal outline-none focus:border-[#C9A86E]/40"
              dir="rtl"
              onKeyDown={(e) => e.key === "Enter" && addImageUrl()}
            />
            <button
              onClick={addImageUrl}
              className="flex items-center gap-1.5 bg-[#121212] border border-[#1A1A1A] text-[#EDE8DF] px-4 py-2 rounded-xl text-[12px] font-tajawal hover:border-[#C9A86E] transition-colors"
            >
              <ImagePlus size={14} />
              إضافة
            </button>
          </div>

          {/* Image previews */}
          {imageUrls.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#121212] border border-[#1A1A1A]"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                    }}
                  />
                  {i === 0 && (
                    <span className="absolute bottom-0 inset-x-0 text-center text-[8px] bg-[#C9A86E] text-[#060606] font-tajawal py-0.5">
                      رئيسية
                    </span>
                  )}
                  <button
                    onClick={() =>
                      setImageUrls((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center hover:bg-[#D07070] transition-colors"
                  >
                    <X size={9} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-[#484542] font-tajawal mt-2">
            الصورة الأولى ستكون الصورة الرئيسية للمنتج
          </p>
        </div>

        {/* ── Save / Delete Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving || deleting}
            className="flex-1 flex items-center justify-center gap-2 bg-[#C9A86E] text-[#060606] rounded-2xl py-4 text-[14px] font-bold font-tajawal hover:brightness-110 transition-all disabled:opacity-60 shadow-[0_8px_24px_#9A784840]"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Save size={16} />
                حفظ التعديلات
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            disabled={saving || deleting}
            className="flex items-center justify-center gap-2 bg-[#1A0808] border border-[#D07070]/30 text-[#D07070] rounded-2xl py-4 px-6 text-[14px] font-bold font-tajawal hover:bg-[#D07070]/10 transition-all disabled:opacity-60"
          >
            {deleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Trash2 size={16} />
                حذف المنتج
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}