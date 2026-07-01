// ============================================================
//  VŌGU Store — Customizer Seed
//  ينشئ الأقسام والمنتجات الافتراضية للتخصيص
//  تشغيل: npx tsx prisma/seed-customizer.ts
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: "tshirts", label: "تيشرتات", emoji: "👕", sortOrder: 0 },
  { slug: "hoodies", label: "هوديز", emoji: "🧥", sortOrder: 1 },
  { slug: "polo",    label: "بولو",   emoji: "🎽", sortOrder: 2 },
  { slug: "longsleeve", label: "لونج سليف", emoji: "👘", sortOrder: 3 },
  { slug: "pants",   label: "بناطيل", emoji: "👖", sortOrder: 4 },
  { slug: "shorts",  label: "شورتات", emoji: "🩳", sortOrder: 5 },
  { slug: "jackets", label: "جاكيتات", emoji: "🧤", sortOrder: 6 },
];

const TSHIRT_COLORS = [
  { name: "أبيض",   hex: "#F5F5F0" },
  { name: "كريمي",  hex: "#EDE8D8" },
  { name: "أسود",   hex: "#1A1A1A" },
  { name: "رمادي",  hex: "#6B7280" },
  { name: "رمادي فاتح", hex: "#D1D5DB" },
  { name: "كحلي",   hex: "#1E3A5F" },
  { name: "سماوي",  hex: "#3B82F6" },
  { name: "أحمر",   hex: "#DC2626" },
  { name: "أحمر عنابي", hex: "#7F1D1D" },
  { name: "أخضر",   hex: "#16A34A" },
  { name: "أخضر زيتي", hex: "#4A5240" },
  { name: "وردي",   hex: "#EC4899" },
  { name: "بنفسجي", hex: "#7C3AED" },
  { name: "بيج",    hex: "#D4B896" },
  { name: "بني",    hex: "#78503A" },
  { name: "زيتي",   hex: "#4A5240" },
  { name: "برتقالي", hex: "#F97316" },
  { name: "أصفر فاتح", hex: "#FEF08A" },
  { name: "خوخي",   hex: "#FBBF24" },
  { name: "فستقي",  hex: "#34D399" },
  { name: "ليموني",  hex: "#A3E635" },
  { name: "تركوازي", hex: "#06B6D4" },
  { name: "نيلي",   hex: "#4338CA" },
  { name: "روز",    hex: "#FDA4AF" },
  { name: "كورال",   hex: "#FB7185" },
  { name: "شمبانيا", hex: "#F5E6CC" },
  { name: "حبري",   hex: "#1E293B" },
  { name: "فضي",    hex: "#94A3B8" },
];

const HOODIE_COLORS = [
  { name: "أسود",   hex: "#1A1A1A" },
  { name: "رمادي",   hex: "#6B7280" },
  { name: "كحلي",   hex: "#1E3A5F" },
  { name: "أبيض",   hex: "#F5F5F0" },
  { name: "بيج",    hex: "#D4B896" },
  { name: "أخضر زيتي", hex: "#4A5240" },
  { name: "بردقان", hex: "#C2410C" },
  { name: "أحمر",   hex: "#DC2626" },
  { name: "وردي",   hex: "#EC4899" },
  { name: "بنفسجي", hex: "#7C3AED" },
  { name: "برتقالي", hex: "#F97316" },
  { name: "تركوازي", hex: "#06B6D4" },
  { name: "نيلي",   hex: "#4338CA" },
];

const PANTS_COLORS = [
  { name: "أسود",   hex: "#1A1A1A" },
  { name: "رمادي",   hex: "#6B7280" },
  { name: "كحلي",   hex: "#1E3A5F" },
  { name: "زيتي",   hex: "#4A5240" },
  { name: "بيج",    hex: "#D4B896" },
  { name: "بني",    hex: "#78503A" },
  { name: "أبيض",   hex: "#F5F5F0" },
  { name: "حبري",   hex: "#1E293B" },
  { name: "كاكي",   hex: "#8B7355" },
  { name: "رمادي فاتح", hex: "#D1D5DB" },
];

const SHORTS_COLORS = [
  { name: "أسود",   hex: "#1A1A1A" },
  { name: "رمادي",   hex: "#6B7280" },
  { name: "كحلي",   hex: "#1E3A5F" },
  { name: "أبيض",   hex: "#F5F5F0" },
  { name: "أخضر",   hex: "#22C55E" },
  { name: "أحمر",   hex: "#EF4444" },
  { name: "أزرق",   hex: "#3B82F6" },
  { name: "زيتي",   hex: "#4A5240" },
  { name: "بيج",    hex: "#D4B896" },
  { name: "برتقالي", hex: "#F97316" },
];

const JACKET_COLORS = [
  { name: "أسود",   hex: "#1A1A1A" },
  { name: "زيتي",   hex: "#4A5240" },
  { name: "كحلي",   hex: "#1E3A5F" },
  { name: "بيج",    hex: "#C4A882" },
  { name: "أحمر",   hex: "#DC2626" },
  { name: "بني",    hex: "#78503A" },
  { name: "رمادي فاتح", hex: "#D1D5DB" },
  { name: "أبيض",   hex: "#F5F5F0" },
];

const PRODUCTS_DATA = [
  // تيشرتات
  { id: "tshirt-classic", label: "تيشرت كلاسيك", categorySlug: "tshirts", svgType: "tshirt", price: 249, sizes: ["XS","S","M","L","XL","XXL"], printArea: { top: 24, left: 24, width: 52, height: 46 }, colors: TSHIRT_COLORS },
  { id: "tshirt-oversized", label: "تيشرت أوفرسايز", categorySlug: "tshirts", svgType: "tshirt", price: 299, sizes: ["S","M","L","XL","XXL"], printArea: { top: 22, left: 22, width: 56, height: 50 }, colors: TSHIRT_COLORS },
  { id: "tshirt-vneck", label: "تيشرت V-نك", categorySlug: "tshirts", svgType: "tshirt", price: 269, sizes: ["XS","S","M","L","XL","XXL"], printArea: { top: 26, left: 24, width: 52, height: 46 }, colors: TSHIRT_COLORS },
  { id: "tshirt-cropped", label: "تيشرت كروب", categorySlug: "tshirts", svgType: "tshirt", price: 259, sizes: ["XS","S","M","L","XL"], printArea: { top: 20, left: 24, width: 52, height: 40 }, colors: TSHIRT_COLORS },

  // هوديز
  { id: "hoodie-pullover", label: "هودي بدون زيبر", categorySlug: "hoodies", svgType: "hoodie", price: 499, sizes: ["XS","S","M","L","XL","XXL"], printArea: { top: 22, left: 26, width: 48, height: 40 }, colors: HOODIE_COLORS },
  { id: "hoodie-zip", label: "هودي بزيبر كامل", categorySlug: "hoodies", svgType: "hoodie", price: 549, sizes: ["XS","S","M","L","XL","XXL"], printArea: { top: 22, left: 26, width: 48, height: 40 }, colors: HOODIE_COLORS },
  { id: "hoodie-crop", label: "هودي كروب نسائي", categorySlug: "hoodies", svgType: "hoodie", price: 449, sizes: ["XS","S","M","L","XL"], printArea: { top: 22, left: 26, width: 48, height: 36 }, colors: HOODIE_COLORS },

  // بولو
  { id: "polo-classic", label: "بولو كلاسيك", categorySlug: "polo", svgType: "polo", price: 349, sizes: ["S","M","L","XL","XXL"], printArea: { top: 28, left: 24, width: 52, height: 44 }, colors: TSHIRT_COLORS },

  // لونج سليف
  { id: "longsleeve-basic", label: "لونج سليف أساسي", categorySlug: "longsleeve", svgType: "longsleeve", price: 319, sizes: ["XS","S","M","L","XL","XXL"], printArea: { top: 24, left: 24, width: 52, height: 46 }, colors: TSHIRT_COLORS },

  // بناطيل
  { id: "pants-jogger", label: "بنطال جوجر", categorySlug: "pants", svgType: "tshirt", price: 399, sizes: ["XS","S","M","L","XL","XXL"], printArea: { top: 10, left: 30, width: 40, height: 30 }, colors: PANTS_COLORS },
  { id: "pants-cargo", label: "بنطال كارجو", categorySlug: "pants", svgType: "tshirt", price: 449, sizes: ["S","M","L","XL","XXL"], printArea: { top: 10, left: 30, width: 40, height: 30 }, colors: PANTS_COLORS },

  // شورتات
  { id: "shorts-basic", label: "شورت أساسي", categorySlug: "shorts", svgType: "tshirt", price: 199, sizes: ["S","M","L","XL","XXL"], printArea: { top: 8, left: 28, width: 44, height: 28 }, colors: SHORTS_COLORS },

  // جاكيتات
  { id: "jacket-bomber", label: "جاكيت بومبر", categorySlug: "jackets", svgType: "tshirt", price: 649, sizes: ["S","M","L","XL","XXL"], printArea: { top: 22, left: 24, width: 52, height: 40 }, colors: JACKET_COLORS },
  { id: "jacket-varsity", label: "جاكيت فارسيتي", categorySlug: "jackets", svgType: "tshirt", price: 699, sizes: ["S","M","L","XL","XXL"], printArea: { top: 22, left: 24, width: 52, height: 40 }, colors: JACKET_COLORS },
];

async function main() {
  console.log("🌱 بدء زراعة بيانات التخصيص...");

  // إنشاء الأقسام
  for (const cat of CATEGORIES) {
    await prisma.customizerCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    console.log(`  ✅ قسم: ${cat.emoji} ${cat.label}`);
  }

  // إنشاء المنتجات
  for (const prod of PRODUCTS_DATA) {
    const category = await prisma.customizerCategory.findUnique({ where: { slug: prod.categorySlug } });
    if (!category) continue;

    await prisma.customizerProduct.upsert({
      where: { id: prod.id },
      update: {
        label: prod.label,
        categoryId: category.id,
        svgType: prod.svgType,
        price: prod.price,
        sizes: prod.sizes,
        colors: prod.colors,
        printArea: prod.printArea,
        isActive: true,
      },
      create: {
        id: prod.id,
        label: prod.label,
        categoryId: category.id,
        svgType: prod.svgType,
        price: prod.price,
        sizes: prod.sizes,
        colors: prod.colors,
        printArea: prod.printArea,
        defaultColor: "#F5F5F0",
        isActive: true,
      },
    });
    console.log(`  ✅ منتج: ${prod.label}`);
  }

  console.log("🎉 انتهت زراعة بيانات التخصيص بنجاح!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
