'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import {
  Heart, ShoppingBag, Star, ChevronRight,
  Minus, Plus, Shield, RotateCcw, Truck,
  ChevronDown, Share2, Loader2
} from 'lucide-react'
import { useCartStore }     from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { formatPrice, calcDiscount, sortSizes, cn } from '@/lib/utils'
import ProductCard from '@/components/shop/ProductCard'

export default function ProductPage() {
  const params = useParams()
  const id     = params?.id as string

  const [product,        setProduct]        = useState<any>(null)
  const [related,        setRelated]        = useState<any[]>([])
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [notFound,       setNotFound]       = useState(false)
  const [activeImg,      setActiveImg]      = useState(0)
  const [selectedColor,  setSelectedColor]  = useState('')
  const [selectedSize,   setSelectedSize]   = useState<string | null>(null)
  const [quantity,       setQuantity]       = useState(1)
  const [adding,         setAdding]         = useState(false)
  const [detailsOpen,    setDetailsOpen]    = useState(true)
  const [shippingOpen,   setShippingOpen]   = useState(false)
  const [copied,         setCopied]         = useState(false)

  const addItem      = useCartStore((s) => s.addItem)
  const openCart     = useCartStore((s) => s.openCart)
  const toggleWish   = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => s.isInList(id as any))

  useEffect(() => {
    if (!id) return
    setLoadingProduct(true)
    setNotFound(false)

    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoadingProduct(false); return null }
        return r.json()
      })
      .then((res) => {
        if (!res?.product) { setNotFound(true); setLoadingProduct(false); return }
        const p = res.product
        setProduct(p)
        if (p.variants?.length > 0) setSelectedColor(p.variants[0].color)
        setRelated((res.related ?? []).map((rp: any) => ({
          id: rp.id, nameAr: rp.nameAr, nameEn: rp.nameEn,
          brand: rp.brand, price: rp.price,
          originalPrice: rp.originalPrice ?? undefined,
          rating: rp.rating ?? 0, reviewCount: rp.reviewCount ?? 0,
          isNew: rp.isNew, isSale: rp.isSale,
          images:   (rp.images ?? []).map((img: any) => ({ url: img.url, alt: img.alt ?? rp.nameAr })),
          variants: (rp.variants ?? []).map((v: any) => ({ size: v.size, color: v.color, colorHex: v.colorHex, stock: v.stock })),
        })))
        setLoadingProduct(false)
      })
      .catch(() => { setNotFound(true); setLoadingProduct(false) })
  }, [id])

  // ── Loading ──
  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin" />
          <p className="text-gray-400 font-tajawal text-sm">جاري تحميل المنتج...</p>
        </div>
      </div>
    )
  }

  // ── Not Found ──
  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <span className="text-6xl opacity-20">👗</span>
        <p className="text-gray-500 font-tajawal text-lg">المنتج غير موجود</p>
        <Link
          href="/shop"
          className="px-6 py-2 bg-gray-900 text-white font-tajawal font-bold text-sm rounded-full hover:bg-gray-700 transition-all"
        >
          العودة للمتجر
        </Link>
      </div>
    )
  }

  const p = product

  const colors = [...new Map(
    (p.variants ?? []).map((v: any) => [v.color, { color: v.color, hex: v.colorHex }])
  ).values()] as { color: string; hex: string }[]

  const availableSizes = sortSizes(
    (p.variants ?? [])
      .filter((v: any) => v.color === selectedColor)
      .map((v: any) => v.size)
  )

  const selectedVariant = (p.variants ?? []).find(
    (v: any) => v.color === selectedColor && v.size === selectedSize
  )
  const inStock  = selectedVariant ? selectedVariant.stock > 0 : false
  const discount = p.originalPrice ? calcDiscount(p.originalPrice, p.price) : 0
  const avgRating = p.reviews?.length > 0
    ? p.reviews.reduce((s: number, r: any) => s + r.rating, 0) / p.reviews.length
    : (p.rating ?? 0)

  const handleAddToCart = async () => {
    if (!selectedSize || !inStock || !selectedVariant) return
    setAdding(true)
    addItem({
      id: p.id, nameAr: p.nameAr, nameEn: p.nameEn, brand: p.brand,
      price: p.price, grad: p.images?.[0]?.url ?? '',
      size: selectedSize, color: selectedColor,
      colorHex: selectedVariant?.colorHex ?? '#000', quantity,
    })
    await new Promise((r) => setTimeout(r, 800))
    setAdding(false)
    openCart()
  }

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-[11px] font-tajawal text-gray-400 mb-8">
          <Link href="/"     className="hover:text-gray-700 transition-colors">الرئيسية</Link>
          <ChevronRight size={12} className="rotate-180" />
          <Link href="/shop" className="hover:text-gray-700 transition-colors">المتجر</Link>
          <ChevronRight size={12} className="rotate-180" />
          {p.category && (
            <>
              <Link
                href={`/shop?cat=${p.category.slug}`}
                className="hover:text-gray-700 transition-colors"
              >
                {p.category.nameAr}
              </Link>
              <ChevronRight size={12} className="rotate-180" />
            </>
          )}
          <span className="text-gray-600 line-clamp-1">{p.nameAr}</span>
        </nav>

        {/* ══ المحتوى الرئيسي ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 mb-20">

          {/* ════ الصور ════ */}
          <div className="flex gap-3">

            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-16 shrink-0">
              {(p.images ?? []).map((img: any, i: number) => (
                <button
                  key={img.id ?? i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                    activeImg === i
                      ? 'border-gray-800'
                      : 'border-gray-200 hover:border-gray-400'
                  )}
                >
                  {img.url ? (
                    <Image src={img.url} alt={img.alt ?? p.nameAr} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <span className="text-lg">👗</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* الصورة الرئيسية */}
            <div className="flex-1">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">

                {p.images?.[activeImg]?.url ? (
                  <Image
                    src={p.images[activeImg].url}
                    alt={p.images[activeImg].alt ?? p.nameAr}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <span className="text-8xl opacity-10">👗</span>
                    <span className="text-gray-400 font-tajawal text-sm">{p.nameEn}</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {p.isNew && (
                    <span className="px-3 py-1 bg-gray-900 text-white text-[11px] font-tajawal font-bold rounded-full">
                      جديد
                    </span>
                  )}
                  {p.isSale && discount > 0 && (
                    <span className="px-3 py-1 bg-red-500 text-white text-[11px] font-tajawal font-bold rounded-full">
                      -{discount}٪
                    </span>
                  )}
                </div>

                {/* زر الـ wishlist فوق الصورة */}
                <button
                  onClick={() => toggleWish(id as any)}
                  className={cn(
                    'absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center transition-all border',
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-white/80 backdrop-blur-sm border-gray-200 text-gray-400 hover:text-red-500'
                  )}
                >
                  <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="absolute bottom-4 left-4 w-9 h-9 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <Share2 size={15} />
                </button>
                {copied && (
                  <div className="absolute bottom-14 left-4 px-3 py-1 bg-green-50 border border-green-200 text-green-600 text-[11px] font-tajawal rounded-full">
                    تم النسخ ✓
                  </div>
                )}
              </div>

              {/* Dots Mobile */}
              <div className="flex justify-center gap-1.5 mt-3 md:hidden">
                {(p.images ?? []).map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      'rounded-full transition-all',
                      activeImg === i ? 'w-4 h-1.5 bg-gray-800' : 'w-1.5 h-1.5 bg-gray-300'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ════ المعلومات ════ */}
          <div className="flex flex-col gap-5">

            {/* البراند + الاسم + التقييم */}
            <div>
              <p className="text-[11px] text-gray-400 font-tajawal tracking-widest uppercase mb-1">
                {p.brand}
              </p>
              <h1 className="font-tajawal text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {p.nameAr}
              </h1>
              <p className="text-gray-400 font-cormorant text-base italic mb-4">
                {p.nameEn}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill="currentColor"
                      className={i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}
                    />
                  ))}
                </div>
                <span className="text-[12px] text-gray-400 font-tajawal">
                  ({p.reviews?.length ?? 0} تقييم)
                </span>
              </div>
            </div>

            {/* السعر */}
            <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
              <span className="font-tajawal font-bold text-3xl text-gray-900">
                {formatPrice(p.price)}
              </span>
              {p.originalPrice && p.originalPrice > p.price && (
                <>
                  <span className="font-tajawal text-gray-400 text-lg line-through">
                    {formatPrice(p.originalPrice)}
                  </span>
                  <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[12px] font-tajawal font-bold rounded-full border border-red-100">
                    -{discount}٪
                  </span>
                </>
              )}
            </div>

            {/* الألوان */}
            {colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-800 font-tajawal font-semibold text-sm">
                    اللون: <span className="font-normal text-gray-500">{selectedColor}</span>
                  </h3>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(({ color, hex }) => (
                    <button
                      key={color}
                      onClick={() => { setSelectedColor(color); setSelectedSize(null) }}
                      title={color}
                      className={cn(
                        'w-9 h-9 rounded-full border-2 transition-all hover:scale-110',
                        selectedColor === color
                          ? 'border-gray-800 scale-110 shadow-[0_0_0_3px_rgba(0,0,0,0.1)]'
                          : 'border-gray-200 hover:border-gray-400'
                      )}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* الأحجام */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-800 font-tajawal font-semibold text-sm">المقاس</h3>
                <button className="text-gray-400 font-tajawal text-[11px] hover:text-gray-700 transition-colors underline">
                  دليل المقاسات
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map((size) => {
                  const variant = (p.variants ?? []).find(
                    (v: any) => v.size === size && v.color === selectedColor
                  )
                  const isOut = !variant || variant.stock === 0
                  return (
                    <button
                      key={size}
                      onClick={() => !isOut && setSelectedSize(size)}
                      disabled={isOut}
                      className={cn(
                        'w-12 h-12 rounded-xl border text-[12px] font-tajawal font-semibold transition-all',
                        isOut
                          ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through'
                          : selectedSize === size
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-800 hover:text-gray-900'
                      )}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>

              {selectedVariant && selectedVariant.stock <= 3 && selectedVariant.stock > 0 && (
                <p className="text-red-500 text-[11px] font-tajawal mt-2">
                  ⚠️ آخر {selectedVariant.stock} قطع فقط!
                </p>
              )}
            </div>

            {/* الكمية + أزرار */}
            <div className="flex gap-3">

              {/* الكمية */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-3 text-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-gray-900 font-tajawal font-bold text-sm min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock ?? 10, q + 1))}
                  className="px-3 py-3 text-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* أضف للسلة */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || adding || !inStock}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl',
                  'font-tajawal font-bold text-sm transition-all active:scale-95',
                  !selectedSize
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : !inStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : adding
                    ? 'bg-green-50 text-green-600 border border-green-200'
                    : 'bg-gray-900 text-white hover:bg-gray-700'
                )}
              >
                {adding ? (
                  <><Loader2 size={16} className="animate-spin" /> جاري الإضافة...</>
                ) : !selectedSize ? (
                  <><ShoppingBag size={16} /> اختر المقاس أولاً</>
                ) : !inStock ? (
                  'نفذ المخزون'
                ) : (
                  <><ShoppingBag size={16} /> أضف للسلة</>
                )}
              </button>
            </div>

            {/* مزايا */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Truck size={14} />,     text: 'شحن مجاني\nفوق ٥٠٠ ج.م' },
                { icon: <RotateCcw size={14} />, text: 'إرجاع مجاني\nخلال ٣٠ يوم' },
                { icon: <Shield size={14} />,    text: 'جودة\nمضمونة' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 border border-gray-100 rounded-xl text-center"
                >
                  <div className="text-gray-500">{item.icon}</div>
                  <p className="text-gray-500 font-tajawal text-[10px] leading-relaxed whitespace-pre-line">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* تفاصيل المنتج */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">

              <button
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-800 font-tajawal font-semibold text-sm">وصف المنتج</span>
                <ChevronDown size={16} className={cn('text-gray-400 transition-transform', detailsOpen && 'rotate-180')} />
              </button>

              {detailsOpen && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <p className="text-gray-500 font-tajawal text-sm leading-relaxed pt-4 mb-4">
                    {p.description}
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {[
                      { label: 'الفئة',    value: p.category?.nameAr },
                      { label: 'الماركة', value: p.brand },
                      { label: 'الكود',   value: p.slug ?? p.id?.slice(-8).toUpperCase() },
                    ].filter((d) => d.value).map((d) => (
                      <div key={d.label} className="flex gap-2">
                        <span className="text-gray-400 font-tajawal text-[11px] shrink-0">{d.label}:</span>
                        <span className="text-gray-600 font-tajawal text-[11px]">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShippingOpen(!shippingOpen)}
                className="w-full flex items-center justify-between px-5 py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-800 font-tajawal font-semibold text-sm">الشحن والإرجاع</span>
                <ChevronDown size={16} className={cn('text-gray-400 transition-transform', shippingOpen && 'rotate-180')} />
              </button>

              {shippingOpen && (
                <div className="px-5 pb-5 pt-4 border-t border-gray-100 space-y-2">
                  {[
                    'شحن مجاني على الطلبات فوق 1200 ج.م',
                    'التوصيل خلال ٢–٤ أيام عمل',
                    'إرجاع مجاني خلال ٣٠ يوم من الاستلام',
                    'يجب أن يكون المنتج في حالته الأصلية',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">✓</span>
                      <p className="text-gray-500 font-tajawal text-[12px]">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ التقييمات ══ */}
        {p.reviews?.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-tajawal text-2xl font-bold text-gray-900">آراء العملاء</h2>
                <p className="text-gray-400 font-tajawal text-[12px] mt-1">
                  {p.reviews.length} تقييم · متوسط {avgRating.toFixed(1)} من ٥
                </p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill="currentColor"
                    className={i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {p.reviews.map((review: any) => (
                <div key={review.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-tajawal font-bold text-sm">
                        {(review.user?.name ?? review.name ?? 'ع')[0]}
                      </div>
                      <div>
                        <p className="text-gray-800 font-tajawal text-[12px] font-semibold">
                          {review.user?.name ?? review.name ?? 'عميل'}
                        </p>
                        <p className="text-gray-400 font-tajawal text-[10px]">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString('ar-EG')
                            : review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          fill="currentColor"
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-500 font-tajawal text-[12px] leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ منتجات مشابهة ══ */}
        {related.length > 0 && (
          <section className="border-t border-gray-100 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-tajawal text-2xl font-bold text-gray-900">قد يعجبك أيضاً</h2>
              <Link
                href="/shop"
                className="text-[12px] text-gray-400 font-tajawal hover:text-gray-800 transition-colors"
              >
                عرض الكل
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}