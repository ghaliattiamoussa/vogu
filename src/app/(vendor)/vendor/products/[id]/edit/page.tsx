'use client';

import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Package,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
  Loader2,
  ImagePlus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useVendorSession } from '@/hooks/useVendorSession';

// ─── Light Theme Palette ──────────────────────────────────────
const C = {
  bg:   '#FAFAF8',
  surf: '#F5F3EF',
  card: '#FFFFFF',
  b1:   '#EAE7E1',
  b2:   '#DDD9D1',
  gold: '#A8823C',
  goldL:'#C9A86E',
  t1:   '#1A1714',
  t2:   '#6B6560',
  t3:   '#A39E96',
  err:  '#C0504D',
  ok:   '#3D9960',
} as const;

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2Y', '4Y', '6Y', '8Y', '10Y'];

type SizeStock = { size: string; stock: number };
type Variant   = { color: string; colorHex: string; sizes: SizeStock[] };

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
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
    <div className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] text-[#6B6560] font-tajawal">
          لون {index + 1}
        </p>
        <button
          onClick={onRemove}
          className="text-[#A39E96] hover:text-[#C0504D] transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={variant.color}
          onChange={(e) => onChange({ ...variant, color: e.target.value })}
          placeholder="اسم اللون (عاجي)"
          className="flex-1 bg-[#F5F3EF] border border-[#EAE7E1] rounded-lg px-3 py-2 text-[12px] text-[#1A1714] placeholder-[#A39E96] font-tajawal outline-none focus:border-[#A8823C]/40"
          dir="rtl"
        />
        <div className="flex items-center gap-2 bg-[#F5F3EF] border border-[#EAE7E1] rounded-lg px-3 py-2">
          <input
            type="color"
            value={variant.colorHex}
            onChange={(e) => onChange({ ...variant, colorHex: e.target.value })}
            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
          />
          <span className="text-[11px] text-[#6B6560] font-mono">
            {variant.colorHex}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {SIZES.map((size) => {
          const active = variant.sizes.find((s) => s.size === size);
          return (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-tajawal border transition-all ${
                active
                  ? 'bg-[#A8823C]0D border-[#A8823C]/50 text-[#A8823C]'
                  : 'bg-[#F5F3EF] border-[#EAE7E1] text-[#6B6560] hover:border-[#DDD9D1]'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {variant.sizes.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {variant.sizes.map(({ size, stock }) => (
            <div key={size} className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#6B6560] font-tajawal w-8">{size}</span>
              <input
                type="number"
                value={stock}
                min={0}
                onChange={(e) => setStock(size, Number(e.target.value))}
                className="flex-1 bg-[#F5F3EF] border border-[#EAE7E1] rounded-lg px-2 py-1 text-[11px] text-[#1A1714] outline-none focus:border-[#A8823C]/40 text-center"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function VendorEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { vendor, loading: authLoading } = useVendorSession();

  // ── Form state ──
  const [nameAr,      setNameAr]      = useState('');
  const [nameEn,      setNameEn]      = useState('');
  const [brand,       setBrand]       = useState('');
  const [slug,        setSlug]        = useState('');
  const [description, setDescription] = useState('');
  const [categoryId,  setCategoryId]  = useState('women');
  const [price,       setPrice]       = useState('');
  const [origPrice,   setOrigPrice]   = useState('');
  const [tags,        setTags]        = useState('');
  const [variants,    setVariants]    = useState<Variant[]>([
    { color: '', colorHex: '#C4956A', sizes: [] },
  ]);
  const [imageUrls,   setImageUrls]   = useState<string[]>([]);
  const [imageUrl,    setImageUrl]    = useState('');
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  // Auto-generate slug
  useEffect(() => {
    if (nameEn) setSlug(toSlug(nameEn));
  }, [nameEn]);

  // ── Fetch product data ──
  useEffect(() => {
    if (!id || authLoading) return;

    fetch(`/api/vendor/products/${id}`)
      .then(async (r) => {
        if (!r.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const { product } = await r.json();

        setNameAr(product.nameAr ?? '');
        setNameEn(product.nameEn ?? '');
        setBrand(product.brand ?? '');
        setSlug(product.slug ?? '');
        setDescription(product.description ?? '');
        setCategoryId(product.categoryId ?? 'women');
        setPrice(product.price != null ? String(product.price) : '');
        setOrigPrice(product.origPrice != null ? String(product.origPrice) : '');
        setTags(Array.isArray(product.tags) ? product.tags.join(', ') : '');

        // Group variants
        const grouped: Record<string, Variant> = {};
        for (const v of product.variants ?? []) {
          const key = `${v.color}__${v.colorHex}`;
          if (!grouped[key]) {
            grouped[key] = { color: v.color, colorHex: v.colorHex, sizes: [] };
          }
          grouped[key].sizes.push({ size: v.size, stock: v.stock });
        }
        const groupedArr = Object.values(grouped);
        setVariants(groupedArr.length > 0 ? groupedArr : [{ color: '', colorHex: '#C4956A', sizes: [] }]);

        setImageUrls((product.images ?? []).map((img: any) => img.url));
        setLoading(false);
      })
      .catch(() => {
        setError('فشل تحميل بيانات المنتج');
        setLoading(false);
      });
  }, [id, authLoading]);

  // Redirect if not logged in as vendor
  if (!authLoading && !vendor) {
    router.push('/vendor/login');
    return null;
  }

  const addVariant = () => {
    setVariants((v) => [...v, { color: '', colorHex: '#8A8480', sizes: [] }]);
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
      setImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('يجب أن يكون الملف صورة');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('الحجم الأقصى 5 ميجابايت');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res  = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? 'فشل رفع الصورة');
        return;
      }

      setImageUrls((prev) => [...prev, data.url]);
    } catch {
      setUploadError('تعذر الاتصال بالخادم');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ─── Submit ────────────────────────────────────────────────
  const handleSave = async () => {
    setError('');

    if (!nameAr || !nameEn || !brand || !price || !categoryId) {
      setError('يرجى ملء جميع الحقول المطلوبة (*)');
      return;
    }
    if (variants.some((v) => !v.color || v.sizes.length === 0)) {
      setError('كل لون يجب أن يحتوي على اسم ومقاس واحد على الأقل');
      return;
    }
    if (imageUrls.length === 0) {
      setError('أضف صورة واحدة على الأقل للمنتج');
      return;
    }

    setSaving(true);

    const res = await fetch(`/api/vendor/products/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nameAr,
        nameEn,
        brand,
        slug:        slug || toSlug(nameEn),
        description,
        categoryId,
        price:       Number(price),
        origPrice:   origPrice ? Number(origPrice) : null,
        tags:        tags.split(',').map((t) => t.trim()).filter(Boolean),
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
      setError(data.error ?? 'حدث خطأ أثناء الحفظ');
      setSaving(false);
      return;
    }

    router.push('/vendor/products');
  };

  // ─── Render ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-[#A8823C] animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" dir="rtl">
        <p className="text-[#6B6560] font-tajawal text-sm">المنتج غير موجود</p>
        <Link
          href="/vendor/products"
          className="text-[#A8823C] text-[12px] font-tajawal hover:underline flex items-center gap-1"
        >
          <ChevronLeft size={14} />
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 24px', maxWidth: 900, minHeight: '100%' }} dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/vendor/products"
          className="text-[#6B6560] hover:text-[#1A1714] transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <p className="text-[#A8823C] text-[10px] tracking-[0.3em] font-tajawal uppercase mb-0.5">
            بوابة التجار
          </p>
          <h1 className="font-cormorant text-[30px] font-light text-[#1A1714]">
            تعديل المنتج
          </h1>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-[#C0504D]0D border border-[#C0504D]/30 rounded-xl px-4 py-3 mb-6">
          <X size={14} className="text-[#C0504D]" />
          <p className="text-[12px] text-[#C0504D] font-tajawal">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        {/* ── Basic Info ── */}
        <div className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl p-5">
          <h2 className="font-cormorant text-[17px] text-[#1A1714] mb-4">
            المعلومات الأساسية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'اسم المنتج بالعربي *', value: nameAr, set: setNameAr, placeholder: 'بليزر كتان واسع' },
              { label: 'اسم المنتج بالإنجليزي *', value: nameEn, set: setNameEn, placeholder: 'Oversized Linen Blazer' },
              { label: 'الماركة *', value: brand, set: setBrand, placeholder: 'VŌGU Studio' },
              { label: 'Slug', value: slug, set: setSlug, placeholder: 'oversized-linen-blazer' },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
                  {label}
                </label>
                <input
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl px-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] font-tajawal outline-none focus:border-[#A8823C]/40"
                  dir="rtl"
                />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
              الوصف
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف تفصيلي للمنتج..."
              rows={3}
              className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl px-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] font-tajawal outline-none focus:border-[#A8823C]/40 resize-none"
              dir="rtl"
            />
          </div>
        </div>

        {/* ── Category & Pricing ── */}
        <div className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl p-5">
          <h2 className="font-cormorant text-[17px] text-[#1A1714] mb-4">
            الفئة والسعر
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
                الفئة *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl px-3 py-2.5 text-[12px] text-[#1A1714] font-tajawal outline-none focus:border-[#A8823C]/40 cursor-pointer"
                dir="rtl"
              >
                <option value="women">نساء</option>
                <option value="men">رجال</option>
                <option value="kids">أطفال</option>
                <option value="sale">تخفيضات</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
                السعر (ج.م) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1299"
                className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl px-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] outline-none focus:border-[#A8823C]/40"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
                السعر الأصلي (قبل الخصم)
              </label>
              <input
                type="number"
                value={origPrice}
                onChange={(e) => setOrigPrice(e.target.value)}
                placeholder="1800"
                className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl px-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] outline-none focus:border-[#A8823C]/40"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-[11px] text-[#6B6560] font-tajawal mb-1 block">
              التاقات (مفصولة بفاصلة)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="blazer, summer, casual"
              className="w-full bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl px-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] font-tajawal outline-none focus:border-[#A8823C]/40"
            />
          </div>
        </div>

        {/* ── Variants ── */}
        <div className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cormorant text-[17px] text-[#1A1714]">
              الألوان والمقاسات
            </h2>
            <button
              onClick={addVariant}
              className="flex items-center gap-1.5 text-[11px] text-[#A8823C] font-tajawal border border-[#A8823C]/30 px-3 py-1.5 rounded-lg hover:bg-[#A8823C]0D transition-colors"
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
        <div className="bg-[#FFFFFF] border border-[#EAE7E1] rounded-2xl p-5">
          <h2 className="font-cormorant text-[17px] text-[#1A1714] mb-4">
            الصور *
          </h2>

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
            className="w-full flex items-center justify-center gap-2 bg-[#A8823C]0D border border-[#A8823C]/30 text-[#A8823C] px-4 py-3 rounded-xl text-[12px] font-tajawal hover:bg-[#A8823C]1A transition-colors disabled:opacity-60 mb-3"
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
            <p className="text-[11px] text-[#C0504D] font-tajawal mb-3">{uploadError}</p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-[#A39E96] font-tajawal whitespace-nowrap">أو رابط مباشر</span>
            <div className="h-px flex-1 bg-[#EAE7E1]" />
          </div>

          <div className="flex gap-2 mb-3">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="رابط الصورة (Cloudinary URL)"
              className="flex-1 bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl px-3 py-2.5 text-[12px] text-[#1A1714] placeholder-[#A39E96] font-tajawal outline-none focus:border-[#A8823C]/40"
              dir="rtl"
              onKeyDown={(e) => e.key === 'Enter' && addImageUrl()}
            />
            <button
              onClick={addImageUrl}
              className="flex items-center gap-1.5 bg-[#F5F3EF] border border-[#EAE7E1] text-[#1A1714] px-4 py-2 rounded-xl text-[12px] font-tajawal hover:border-[#A8823C] transition-colors"
            >
              <ImagePlus size={14} />
              إضافة
            </button>
          </div>

          {imageUrls.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#F5F3EF] border border-[#EAE7E1]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                    }}
                  />
                  {i === 0 && (
                    <span className="absolute bottom-0 inset-x-0 text-center text-[8px] bg-[#A8823C] text-white font-tajawal py-0.5">
                      رئيسية
                    </span>
                  )}
                  <button
                    onClick={() =>
                      setImageUrls((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center hover:bg-[#C0504D] transition-colors"
                  >
                    <X size={9} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-[10px] text-[#A39E96] font-tajawal mt-2">
            الصورة الأولى ستكون الصورة الرئيسية للمنتج
          </p>
        </div>

        {/* ── Save Button ── */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[#A8823C] text-white rounded-2xl py-4 text-[14px] font-bold font-tajawal hover:brightness-110 transition-all disabled:opacity-60 shadow-[0_8px_24px_rgba(168,130,60,0.3)]"
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

        <div className="bg-[#F5F3EF] border border-[#EAE7E1] rounded-xl p-4">
          <p className="text-[11px] text-[#6B6560] font-tajawal">
            ⚠️ بعد التعديل، سيعاد مراجعة المنتج من الإدمن. لن يكون مرئياً للعملاء حتى الموافقة الجديدة.
          </p>
        </div>
      </div>
    </div>
  );
}