'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Package, Plus, Trash2, Save, X, Palette, Upload, Loader2, ChevronDown, Tag, Check, Download, ZoomIn } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface CustomColor { name: string; hex: string }
interface PrintArea { top: number; left: number; width: number; height: number }

interface CustomizerProduct {
  id: string;
  label: string;
  categoryId: string;
  svgType: string;
  frontImage: string | null;
  backImage: string | null;
  rightSleeveImage: string | null;
  leftSleeveImage: string | null;
  defaultColor: string;
  sizes: string[];
  colors: CustomColor[] | null;
  printArea: PrintArea | null;
  price: number;
  isActive: boolean;
  sortOrder: number;
  category?: { id: string; label: string; emoji: string; slug: string };
}

interface Category {
  id: string;
  slug: string;
  label: string;
  emoji: string;
  sortOrder: number;
  _count?: { products: number };
}

const SVG_TYPES = [
  { value: 'tshirt',     label: 'تيشرت',     emoji: '👕' },
  { value: 'hoodie',     label: 'هودي',       emoji: '🧥' },
  { value: 'polo',       label: 'بولو',       emoji: '🎽' },
  { value: 'longsleeve', label: 'لونج سليف',  emoji: '👘' },
  { value: 'pants',      label: 'بنطلون',     emoji: '👖' },
  { value: 'shorts',     label: 'شورت',       emoji: '🩳' },
  { value: 'jacket',     label: 'جاكيت',      emoji: '🧤' },
  { value: 'cap',        label: 'كاب',        emoji: '🧢' },
];

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'FREE SIZE'];

// لوحة ألوان جاهزة احترافية للاختيار السريع
const COLOR_PRESETS = [
  { name: 'أبيض',     hex: '#F5F5F0' }, { name: 'كريمي',     hex: '#EDE8D8' },
  { name: 'شمبانيا',  hex: '#F5E6CC' }, { name: 'بيج',       hex: '#D4B896' },
  { name: 'بني فاتح', hex: '#A78B5F' }, { name: 'بني',       hex: '#78503A' },
  { name: 'بني داكن', hex: '#4A2C1A' }, { name: 'أسود',      hex: '#1A1A1A' },
  { name: 'رمادي فاتح', hex: '#D1D5DB' }, { name: 'رمادي',   hex: '#6B7280' },
  { name: 'رمادي داكن', hex: '#374151' }, { name: 'حبري',    hex: '#1E293B' },
  { name: 'كحلي',     hex: '#1E3A5F' }, { name: 'نيلي',       hex: '#4338CA' },
  { name: 'سماوي',    hex: '#3B82F6' }, { name: 'تركوازي',   hex: '#06B6D4' },
  { name: 'أزرق سماوي', hex: '#7DD3FC' }, { name: 'أخضر فاتح', hex: '#86EFAC' },
  { name: 'فستقي',    hex: '#34D399' }, { name: 'أخضر',      hex: '#16A34A' },
  { name: 'أخضر زيتي', hex: '#4A5240' }, { name: 'زيتي داكن', hex: '#3F4A2E' },
  { name: 'ليموني',   hex: '#A3E635' }, { name: 'أصفر فاتح', hex: '#FEF08A' },
  { name: 'خوخي',     hex: '#FBBF24' }, { name: 'برتقالي',   hex: '#F97316' },
  { name: 'بردقان',   hex: '#C2410C' }, { name: 'كورال',     hex: '#FB7185' },
  { name: 'أحمر',     hex: '#DC2626' }, { name: 'عنابي',     hex: '#7F1D1D' },
  { name: 'روز',      hex: '#FDA4AF' }, { name: 'وردي',      hex: '#EC4899' },
  { name: 'وردي داكن', hex: '#9D174D' }, { name: 'بنفسجي',   hex: '#7C3AED' },
  { name: 'لافندر',   hex: '#A78BFA' }, { name: 'ذهبي',      hex: '#C9A86E' },
  { name: 'فضي',      hex: '#94A3B8' },
];

const SIDE_FIELDS = [
  { key: 'frontImage',       label: 'الأمامي',       hint: 'Front' },
  { key: 'backImage',        label: 'الخلفي',        hint: 'Back' },
  { key: 'rightSleeveImage', label: 'كم يمين',       hint: 'Right Sleeve' },
  { key: 'leftSleeveImage',  label: 'كم شمال',       hint: 'Left Sleeve' },
] as const;

export default function CustomizerProductsPage() {
  const [products, setProducts] = useState<CustomizerProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editing, setEditing] = useState<CustomizerProduct | null>(null);
  const [showNew, setShowNew] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/admin/customizer-products'),
        fetch('/api/admin/customizer-categories'),
      ]);
      const prods = await prodRes.json();
      const cats = await catRes.json();
      setProducts(prods);
      setCategories(cats);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category?.slug === activeCategory);

  return (
    <div className="min-h-screen bg-[#070707] text-[#EDE8DF]" dir="rtl">
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-cormorant text-3xl text-[#EDE8DF] mb-1">منتجات التخصيص</h1>
            <p className="text-[#8A8480] text-sm font-tajawal">
              أضف وعدّل أي منتج قابل للتخصيص — الصور، الألوان، منطقة الطباعة، المقاسات والأسعار.
            </p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 bg-gradient-to-l from-[#C9A86E] to-[#9A7848] text-[#070707] px-5 py-2.5 rounded-xl font-tajawal font-bold text-sm hover:opacity-90 transition shadow-lg shadow-[#C9A86E]/20"
          >
            <Plus size={16} /> منتج جديد
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <CatChip active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} label="الكل" emoji="✨" count={products.length} />
          {categories.map(c => (
            <CatChip
              key={c.id}
              active={activeCategory === c.slug}
              onClick={() => setActiveCategory(c.slug)}
              label={c.label}
              emoji={c.emoji}
              count={c._count?.products ?? 0}
            />
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#C9A86E]" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#8A8480] font-tajawal">
            <Package size={48} className="mx-auto mb-3 opacity-40" />
            لا توجد منتجات في هذا القسم بعد
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => setEditing(p)} />
            ))}
          </div>
        )}
      </div>

      {/* New product modal */}
      {showNew && (
        <ProductEditor
          categories={categories}
          onClose={() => setShowNew(false)}
          onSaved={() => { setShowNew(false); fetchAll(); }}
        />
      )}

      {/* Edit product modal */}
      {editing && (
        <ProductEditor
          categories={categories}
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchAll(); }}
          onDelete={() => { setEditing(null); fetchAll(); }}
        />
      )}
    </div>
  );
}

// ─── Category Chip ────────────────────────────────────────
function CatChip({ active, onClick, label, emoji, count }: { active: boolean; onClick: () => void; label: string; emoji: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-tajawal whitespace-nowrap transition ${
        active ? 'bg-[#1A1200] text-[#C9A86E] border border-[#C9A86E]/30' : 'bg-[#0D0D0D] text-[#8A8480] border border-[#1A1A1A] hover:text-[#EDE8DF]'
      }`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-[#C9A86E]/20' : 'bg-[#1A1A1A]'}`}>{count}</span>
    </button>
  );
}

// ─── Product Card ─────────────────────────────────────────
function ProductCard({ product, onClick }: { product: CustomizerProduct; onClick: () => void }) {
  const img = product.frontImage;
  const sideCount = [product.frontImage, product.backImage, product.rightSleeveImage, product.leftSleeveImage].filter(Boolean).length;

  const downloadImage = async (url: string, filename: string) => {
    try {
      const res  = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch {
      window.open(url, "_blank");
    }
  };

  return (
    <div
      onClick={onClick}
      className="group text-right bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden hover:border-[#C9A86E]/40 transition shadow-sm hover:shadow-lg hover:shadow-[#C9A86E]/10 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#070707] overflow-hidden">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.label} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-cormorant text-6xl text-[#1A1A1A]">VŌGU</span>
          </div>
        )}
        {/* أزرار التحميل والتكبير */}
        {img && (
          <div className="absolute bottom-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); downloadImage(img, `${product.label}.png`); }}
              className="p-2 rounded-lg bg-[#1A1200] border border-[#C9A86E]/30 text-[#C9A86E] hover:bg-[#C9A86E]/30 transition-colors"
              title="تحميل الصورة"
            >
              <Download size={14} />
            </button>
            <a
              href={img}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg bg-[#001018] border border-[#7EB8D4]/30 text-[#7EB8D4] hover:bg-[#7EB8D4]/30 transition-colors"
              title="فتح بحجم كامل"
            >
              <ZoomIn size={14} />
            </a>
          </div>
        )}
        {/* badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {!product.isActive && (
            <span className="text-[10px] bg-[#1A0808] text-[#D07070] border border-[#D07070]/30 px-2 py-0.5 rounded-full font-tajawal">مخفي</span>
          )}
          {product.colors && product.colors.length > 0 && (
            <span className="text-[10px] bg-[#1A1A1A]/80 text-[#C9A86E] px-2 py-0.5 rounded-full font-tajawal flex items-center gap-1">
              <Palette size={9} /> {product.colors.length}
            </span>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className="text-[10px] bg-[#1A1A1A]/80 text-[#EDE8DF] px-2 py-0.5 rounded-full font-tajawal">{sideCount}/4 جوانب</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-tajawal font-bold text-[#EDE8DF] text-sm">{product.label}</h3>
          <span className="font-cormorant text-[#C9A86E] text-lg">{product.price.toLocaleString('ar-EG')}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#8A8480] font-tajawal">
          <span>{product.category?.emoji} {product.category?.label}</span>
          <span>•</span>
          <span>{product.sizes.length} مقاسات</span>
        </div>
      </div>
    </div>
  );
}

// ─── Field wrapper ─────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-tajawal font-bold text-[#EDE8DF] mb-2">{label}</p>
      {children}
    </div>
  );
}

// ─── Product Editor Modal ─────────────────────────────────
function ProductEditor({
  categories, product, onClose, onSaved, onDelete,
}: {
  categories: Category[];
  product?: CustomizerProduct;
  onClose: () => void;
  onSaved: () => void;
  onDelete?: () => void;
}) {
  const isEdit = !!product;
  const [label, setLabel] = useState(product?.label ?? '');
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? '');
  const [svgType, setSvgType] = useState(product?.svgType ?? 'tshirt');
  const [price, setPrice] = useState(product?.price ?? 299);
  const [defaultColor, setDefaultColor] = useState(product?.defaultColor ?? '#F5F5F0');
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? ['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  const [colors, setColors] = useState<CustomColor[]>(product?.colors ?? []);
  const [printArea, setPrintArea] = useState<PrintArea>(product?.printArea ?? { top: 24, left: 24, width: 52, height: 46 });
  const [images, setImages] = useState<Record<string, string | null>>({
    frontImage: product?.frontImage ?? null,
    backImage: product?.backImage ?? null,
    rightSleeveImage: product?.rightSleeveImage ?? null,
    leftSleeveImage: product?.leftSleeveImage ?? null,
  });

  const [saving, setSaving] = useState(false);
  const [uploadingSide, setUploadingSide] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'images' | 'colors' | 'details'>('images');

  const uploadImage = async (side: string, file: File) => {
    setUploadingSide(side);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      const url = data.url || data.secure_url;
      if (!url) throw new Error('Upload failed');
      setImages(prev => ({ ...prev, [side]: url }));
    } catch {
      alert('فشل رفع الصورة');
    } finally {
      setUploadingSide(null);
    }
  };

  const handleSave = async () => {
    if (!label.trim() || !categoryId) {
      alert('الاسم والقسم مطلوبان');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        label, categoryId, svgType, price: Number(price), defaultColor, isActive,
        sizes, colors, printArea,
        frontImage: images.frontImage,
        backImage: images.backImage,
        rightSleeveImage: images.rightSleeveImage,
        leftSleeveImage: images.leftSleeveImage,
      };

      const url = isEdit ? `/api/admin/customizer-products/${product!.id}` : '/api/admin/customizer-products';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Save failed');
      }
      onSaved();
    } catch (e: any) {
      alert(e.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !onDelete) return;
    if (!confirm(`هل تريد حذف "${product!.label}" نهائياً؟`)) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/customizer-products/${product!.id}`, { method: 'DELETE' });
      onDelete();
    } catch {
      alert('فشل الحذف');
    } finally {
      setSaving(false);
    }
  };

  const toggleSize = (s: string) => {
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const addColor = (c: CustomColor) => {
    setColors(prev => prev.find(x => x.hex === c.hex) ? prev : [...prev, c]);
  };
  const removeColor = (hex: string) => {
    setColors(prev => prev.filter(c => c.hex !== hex));
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" dir="rtl">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1A1A1A]">
          <h2 className="font-cormorant text-2xl text-[#EDE8DF]">{isEdit ? 'تعديل المنتج' : 'منتج جديد'}</h2>
          <button onClick={onClose} className="text-[#8A8480] hover:text-[#EDE8DF] transition p-1">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4">
          {([['images', 'الصور (الجوانب الأربعة)'], ['colors', 'الألوان'], ['details', 'التفاصيل']] as const).map(([key, lbl]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-t-lg text-sm font-tajawal transition ${
                activeTab === key ? 'bg-[#1A1200] text-[#C9A86E] border-t border-x border-[#C9A86E]/30' : 'text-[#8A8480] hover:text-[#EDE8DF]'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 flex-1">
          {/* IMAGES TAB */}
          {activeTab === 'images' && (
            <div>
              <p className="text-xs text-[#8A8480] font-tajawal mb-4">
                ارفع صور الجوانب الأربعة (PNG شفاف مستحب). الجوانب اللي بدون صورة هتستخدم رسم SVG افتراضي في صفحة التصميم.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {SIDE_FIELDS.map(({ key, label: sideLabel, hint }) => (
                  <div key={key} className="bg-[#070707] border border-[#1A1A1A] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-tajawal font-bold text-[#EDE8DF]">{sideLabel}</span>
                      <span className="text-[10px] text-[#484542] font-mono">{hint}</span>
                    </div>
                    <div className="relative aspect-square bg-[#0D0D0D] rounded-lg overflow-hidden border border-[#1A1A1A] mb-2">
                      {images[key] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={images[key]!} alt={sideLabel} className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#2A2A2A]">
                          <Package size={32} />
                        </div>
                      )}
                      {uploadingSide === key && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader2 className="animate-spin text-[#C9A86E]" size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 bg-[#1A1200] text-[#C9A86E] border border-[#C9A86E]/30 rounded-lg py-1.5 text-xs font-tajawal hover:bg-[#2A2000] transition">
                        <Upload size={12} />
                        {images[key] ? 'تغيير' : 'رفع'}
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(key, e.target.files[0])} />
                      </label>
                      {images[key] && (
                        <button
                          onClick={() => setImages(prev => ({ ...prev, [key]: null }))}
                          className="bg-[#1A0808] text-[#D07070] border border-[#D07070]/30 rounded-lg px-2 hover:bg-[#2A0F0F] transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COLORS TAB */}
          {activeTab === 'colors' && (
            <div>
              <div className="mb-5">
                <p className="text-xs font-tajawal font-bold text-[#EDE8DF] mb-2">اللون الافتراضي للمنتج</p>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={defaultColor}
                    onChange={e => setDefaultColor(e.target.value)}
                    className="w-12 h-10 rounded-lg bg-transparent border border-[#1A1A1A] cursor-pointer"
                  />
                  <span className="text-xs font-mono text-[#8A8480]">{defaultColor}</span>
                </div>
              </div>

              <div className="h-px bg-[#1A1A1A] my-5" />

              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-tajawal font-bold text-[#EDE8DF]">ألوان متاحة للمنتج ({colors.length})</p>
              </div>

              {/* Selected colors */}
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {colors.map(c => (
                    <div key={c.hex} className="group flex items-center gap-1.5 bg-[#070707] border border-[#1A1A1A] rounded-full pr-1 pl-3 py-1">
                      <span className="w-5 h-5 rounded-full border border-[#2A2A2A]" style={{ background: c.hex }} />
                      <span className="text-[11px] font-tajawal text-[#EDE8DF]">{c.name}</span>
                      <button onClick={() => removeColor(c.hex)} className="text-[#8A8480] hover:text-[#D07070] transition">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Preset palette */}
              <p className="text-[11px] text-[#8A8480] font-tajawal mb-2">اختر من اللوحة الجاهزة:</p>
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
                {COLOR_PRESETS.map(c => {
                  const selected = colors.find(x => x.hex === c.hex);
                  return (
                    <button
                      key={c.hex}
                      onClick={() => selected ? removeColor(c.hex) : addColor(c)}
                      title={`${c.name} — ${c.hex}`}
                      className="relative aspect-square rounded-lg border transition"
                      style={{
                        background: c.hex,
                        borderColor: selected ? '#C9A86E' : '#1A1A1A',
                        transform: selected ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      {selected && (
                        <Check size={12} className="absolute inset-0 m-auto drop-shadow text-white mix-blend-difference" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom color */}
              <div className="mt-4 flex items-center gap-2 bg-[#070707] border border-[#1A1A1A] rounded-xl p-3">
                <Palette size={14} className="text-[#C9A86E]" />
                <span className="text-xs font-tajawal text-[#8A8480]">لون مخصص:</span>
                <input
                  type="color"
                  onChange={e => {
                    const hex = e.target.value;
                    if (!colors.find(x => x.hex === hex)) addColor({ name: 'مخصص', hex });
                  }}
                  className="w-9 h-8 rounded bg-transparent border border-[#1A1A1A] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* DETAILS TAB */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              <Field label="اسم المنتج">
                <input
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="مثال: تيشرت كلاسيك"
                  className="input-dark"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="القسم">
                  <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="input-dark">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                  </select>
                </Field>
                <Field label="نوع المنتج (SVG)">
                  <select value={svgType} onChange={e => setSvgType(e.target.value)} className="input-dark">
                    {SVG_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="السعر (ج.م)">
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="input-dark"
                />
              </Field>

              {/* Sizes */}
              <div>
                <p className="text-xs font-tajawal font-bold text-[#EDE8DF] mb-2">المقاسات المتاحة</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map(s => {
                    const on = sizes.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-tajawal transition ${
                          on ? 'bg-[#C9A86E] text-[#070707] font-bold' : 'bg-[#070707] text-[#8A8480] border border-[#1A1A1A]'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Print area */}
              <div>
                <p className="text-xs font-tajawal font-bold text-[#EDE8DF] mb-2">
                  منطقة الطباعة (%) <span className="text-[#8A8480] font-normal">— المنطقة المسموح بطباعة التصميم فيها</span>
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {(['top', 'left', 'width', 'height'] as const).map(key => (
                    <div key={key} className="bg-[#070707] border border-[#1A1A1A] rounded-lg p-2">
                      <label className="text-[10px] text-[#8A8480] font-tajawal block mb-1">
                        {key === 'top' ? 'من أعلى' : key === 'left' ? 'من اليمين' : key === 'width' ? 'العرض' : 'الارتفاع'}
                      </label>
                      <input
                        type="number"
                        value={printArea[key]}
                        onChange={e => setPrintArea(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                        className="w-full bg-transparent text-[#EDE8DF] text-sm outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setIsActive(v => !v)}
                  className={`relative w-11 h-6 rounded-full transition ${isActive ? 'bg-[#C9A86E]' : 'bg-[#1A1A1A]'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${isActive ? 'left-0.5' : 'left-5'}`} />
                </button>
                <span className="text-sm font-tajawal text-[#EDE8DF]">ظاهر في صفحة التصميم</span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-[#1A1A1A]">
          <div>
            {isEdit && onDelete && (
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-2 text-[#D07070] text-sm font-tajawal hover:text-[#FF9090] transition disabled:opacity-50"
              >
                <Trash2 size={14} /> حذف المنتج
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-5 py-2 rounded-xl text-[#8A8480] text-sm font-tajawal hover:text-[#EDE8DF] transition">
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-l from-[#C9A86E] to-[#9A7848] text-[#070707] px-6 py-2 rounded-xl font-tajawal font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              حفظ
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-dark {
          width: 100%;
          background: #070707;
          border: 1px solid #1A1A1A;
          border-radius: 0.5rem;
          padding: 0.55rem 0.75rem;
          color: #EDE8DF;
          font-size: 0.875rem;
          font-family: 'Tajawal', sans-serif;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-dark:focus { border-color: #C9A86E; }
      `}</style>
    </div>
  );
}
