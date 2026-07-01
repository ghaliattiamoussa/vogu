// ============================================================
//  VŌGU Store — Database Seed
//  يملأ قاعدة البيانات بالفئات والمنتجات الأولية
//  تشغيل: npm run db:seed
// ============================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Categories ─────────────────────────────────────────────
const CATEGORIES = [
  { slug: "women", nameAr: "نساء", nameEn: "Women", sortOrder: 1 },
  { slug: "men",   nameAr: "رجال", nameEn: "Men",   sortOrder: 2 },
  { slug: "kids",  nameAr: "أطفال", nameEn: "Kids", sortOrder: 3 },
  { slug: "sale",  nameAr: "تخفيضات", nameEn: "Sale", sortOrder: 4 },
];

// ─── Products (mirrored from vogu-store.jsx) ─────────────────
const PRODUCTS_DATA = [
  {
    nameAr: "بليزر كتان واسع",
    nameEn: "Oversized Linen Blazer",
    brand: "VŌGU Studio",
    price: 1299,
    origPrice: null,
    catSlug: "women",
    isNew: true,
    isBest: true,
    slug: "oversized-linen-blazer",
    tags: ["blazer", "linen", "summer"],
    variants: [
      { size: "XS",  color: "عاجي",  colorHex: "#EDE5D8", stock: 10 },
      { size: "S",   color: "عاجي",  colorHex: "#EDE5D8", stock: 15 },
      { size: "M",   color: "عاجي",  colorHex: "#EDE5D8", stock: 12 },
      { size: "L",   color: "عاجي",  colorHex: "#EDE5D8", stock: 8  },
      { size: "XL",  color: "عاجي",  colorHex: "#EDE5D8", stock: 5  },
      { size: "XS",  color: "كاميل", colorHex: "#C4956A", stock: 10 },
      { size: "S",   color: "كاميل", colorHex: "#C4956A", stock: 13 },
      { size: "M",   color: "كاميل", colorHex: "#C4956A", stock: 11 },
      { size: "XS",  color: "أسود",  colorHex: "#1C1C1C", stock: 9  },
      { size: "S",   color: "أسود",  colorHex: "#1C1C1C", stock: 14 },
    ],
  },
  {
    nameAr: "فستان حرير أنيق",
    nameEn: "Silk Slip Dress",
    brand: "VŌGU Couture",
    price: 2199,
    origPrice: 2800,
    catSlug: "women",
    isNew: false,
    isBest: true,
    slug: "silk-slip-dress",
    tags: ["dress", "silk", "evening"],
    variants: [
      { size: "XS", color: "وردي",    colorHex: "#D4A5A5", stock: 6  },
      { size: "S",  color: "وردي",    colorHex: "#D4A5A5", stock: 10 },
      { size: "M",  color: "وردي",    colorHex: "#D4A5A5", stock: 8  },
      { size: "XS", color: "شمبانيا", colorHex: "#E8D5A3", stock: 7  },
      { size: "S",  color: "شمبانيا", colorHex: "#E8D5A3", stock: 9  },
      { size: "XS", color: "أسود",    colorHex: "#1C1C1C", stock: 12 },
      { size: "S",  color: "أسود",    colorHex: "#1C1C1C", stock: 14 },
    ],
  },
  {
    nameAr: "بنطلون واسع الساق",
    nameEn: "Wide-Leg Trousers",
    brand: "VŌGU Studio",
    price: 899,
    origPrice: null,
    catSlug: "women",
    isNew: true,
    isBest: false,
    slug: "wide-leg-trousers",
    tags: ["trousers", "wide-leg", "casual"],
    variants: [
      { size: "XS",  color: "كريمي", colorHex: "#F0E8D8", stock: 15 },
      { size: "S",   color: "كريمي", colorHex: "#F0E8D8", stock: 18 },
      { size: "M",   color: "كريمي", colorHex: "#F0E8D8", stock: 14 },
      { size: "XS",  color: "كحلي",  colorHex: "#1E2B4A", stock: 12 },
      { size: "S",   color: "كحلي",  colorHex: "#1E2B4A", stock: 16 },
      { size: "M",   color: "بني",   colorHex: "#8B5E3C", stock: 10 },
    ],
  },
  {
    nameAr: "سويتر كشمير فاخر",
    nameEn: "Cashmere Crew Neck",
    brand: "VŌGU Luxe",
    price: 3499,
    origPrice: null,
    catSlug: "women",
    isNew: false,
    isBest: true,
    slug: "cashmere-crew-neck",
    tags: ["sweater", "cashmere", "winter", "luxury"],
    variants: [
      { size: "S",  color: "كاميل", colorHex: "#C4956A", stock: 8  },
      { size: "M",  color: "كاميل", colorHex: "#C4956A", stock: 10 },
      { size: "S",  color: "عاجي",  colorHex: "#F5F0E8", stock: 7  },
      { size: "M",  color: "رمادي", colorHex: "#9E8A7E", stock: 9  },
    ],
  },
  {
    nameAr: "قميص رسمي سليم فيت",
    nameEn: "Slim Fit Dress Shirt",
    brand: "VŌGU Men",
    price: 699,
    origPrice: 950,
    catSlug: "men",
    isNew: false,
    isBest: true,
    slug: "slim-fit-dress-shirt",
    tags: ["shirt", "formal", "slim-fit"],
    variants: [
      { size: "S",   color: "أبيض",  colorHex: "#F8F8F8", stock: 20 },
      { size: "M",   color: "أبيض",  colorHex: "#F8F8F8", stock: 25 },
      { size: "L",   color: "أبيض",  colorHex: "#F8F8F8", stock: 18 },
      { size: "M",   color: "أزرق",  colorHex: "#7BA7C4", stock: 15 },
      { size: "L",   color: "رمادي", colorHex: "#6B7E8C", stock: 12 },
    ],
  },
  {
    nameAr: "معطف صوف فاخر",
    nameEn: "Wool Overcoat",
    brand: "VŌGU Men",
    price: 4999,
    origPrice: null,
    catSlug: "men",
    isNew: true,
    isBest: false,
    slug: "wool-overcoat",
    tags: ["coat", "wool", "winter", "luxury"],
    variants: [
      { size: "M",   color: "فحمي", colorHex: "#3C3C3C", stock: 8  },
      { size: "L",   color: "فحمي", colorHex: "#3C3C3C", stock: 10 },
      { size: "XL",  color: "كاميل", colorHex: "#C4956A", stock: 7  },
      { size: "XXL", color: "كحلي",  colorHex: "#1A1A2E", stock: 5  },
    ],
  },
  {
    nameAr: "فستان صغير بالزهور",
    nameEn: "Mini Floral Dress",
    brand: "VŌGU Kids",
    price: 349,
    origPrice: null,
    catSlug: "kids",
    isNew: true,
    isBest: false,
    slug: "kids-mini-floral-dress",
    tags: ["kids", "dress", "summer"],
    variants: [
      { size: "2Y", color: "وردي", colorHex: "#F5C5C5", stock: 15 },
      { size: "4Y", color: "وردي", colorHex: "#F5C5C5", stock: 18 },
      { size: "6Y", color: "أزرق", colorHex: "#C5D5F5", stock: 14 },
      { size: "8Y", color: "أزرق", colorHex: "#C5D5F5", stock: 10 },
    ],
  },
  {
    nameAr: "فستان سهرة فاخر",
    nameEn: "Maxi Evening Gown",
    brand: "VŌGU Couture",
    price: 5999,
    origPrice: 8500,
    catSlug: "sale",
    isNew: false,
    isBest: false,
    slug: "maxi-evening-gown",
    tags: ["gown", "evening", "luxury", "sale"],
    variants: [
      { size: "XS", color: "زمردي", colorHex: "#2D7A5A", stock: 3 },
      { size: "S",  color: "زمردي", colorHex: "#2D7A5A", stock: 4 },
      { size: "XS", color: "أسود",  colorHex: "#1A1A2E", stock: 5 },
    ],
  },
];

// ─────────────────────────────────────────────────────────
//  SEED FUNCTION
// ─────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Starting VŌGU database seed...\n");

  // 1. Admin user
  const hashedPw = await bcrypt.hash("Admin@VOGU2025!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@vogu.com" },
    update: {},
    create: {
      email: "admin@vogu.com",
      name: "VŌGU Admin",
      password: hashedPw,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`✅  Admin user: ${admin.email}`);

  // 2. Categories
  const catMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    catMap[cat.slug] = created.id;
    console.log(`✅  Category: ${cat.nameAr}`);
  }

  // 3. Products + Variants
  for (const prod of PRODUCTS_DATA) {
    const { variants, catSlug, ...productData } = prod;

    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        categoryId: catMap[catSlug],
        description: `${productData.nameAr} — قطعة فاخرة من مجموعة ${productData.brand}`,
      },
    });

    // Create variants
    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: {
          productId_size_color: {
            productId: product.id,
            size: v.size,
            color: v.color,
          },
        },
        update: { stock: v.stock },
        create: { ...v, productId: product.id },
      });
    }

    console.log(`✅  Product: ${product.nameAr} (${variants.length} variants)`);
  }

  // 4. Sample coupon
  await prisma.coupon.upsert({
    where: { code: "VOGU2025" },
    update: {},
    create: {
      code: "VOGU2025",
      type: "PERCENTAGE",
      value: 15,
      minOrder: 500,
      maxUses: 100,
      isActive: true,
    },
  });
  console.log("✅  Coupon: VOGU2025 (15% off)");

  console.log("\n🎉  Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });