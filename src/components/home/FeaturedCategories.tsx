// src/components/home/FeaturedCategories.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "نساء",       slug: "women",       image: "/images/cat-women.jpg",       span: "col-span-2 row-span-2" },
  { label: "رجال",       slug: "men",         image: "/images/cat-men.jpg",         span: "col-span-1 row-span-1" },
  { label: "أطفال",      slug: "kids",        image: "/images/cat-kids.jpg",        span: "col-span-1 row-span-1" },
  { label: "إكسسوارات", slug: "accessories", image: "/images/cat-accessories.jpg", span: "col-span-1 row-span-1" },
  { label: "تخفيضات",   slug: "sale",        image: "/images/cat-sale.jpg",        span: "col-span-1 row-span-1" },
];

export function FeaturedCategories() {
  return (
    <section className="py-16 px-4 sm:px-6" dir="rtl">
      {/* العنوان */}
      <div className="text-center mb-10">
        <p className="text-xs text-[#C9A86E] font-[Tajawal] tracking-[0.3em] uppercase mb-2">
          تسوق حسب الفئة
        </p>
        <h2 className="text-3xl font-bold text-[#EDE8DF]" style={{ fontFamily: "'Cormorant Garant', serif" }}>
          اكتشف كولكشناتنا
        </h2>
      </div>

      {/* الشبكة */}
      <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-2 gap-3 max-w-5xl mx-auto h-[500px] sm:h-[420px]">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className={cn(
              "relative rounded-2xl overflow-hidden group bg-[#121212]",
              cat.span
            )}
          >
            {/* الصورة */}
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#262626]" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/80 via-transparent to-transparent group-hover:from-[#070707]/60 transition-all duration-300" />

            {/* النص */}
            <div className="absolute bottom-0 inset-x-0 p-4">
              <p className="text-sm font-bold text-[#EDE8DF] font-[Tajawal] mb-1">{cat.label}</p>
              <p className="text-xs text-[#C9A86E] font-[Tajawal] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                تسوق الآن ←
              </p>
            </div>

            {/* Border glow on hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#C9A86E]/30 transition-all duration-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCategories;
