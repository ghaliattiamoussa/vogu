import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products?category=women&sort=price_asc&q=بليزر&page=1&limit=12
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const category = searchParams.get("category");
    const q        = searchParams.get("q") ?? "";
    const sort     = searchParams.get("sort") ?? "featured";
    const page     = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit    = Math.min(48, Number(searchParams.get("limit") ?? 12));
    const skip     = (page - 1) * limit;

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sizes    = searchParams.get("sizes");
    const isNew    = searchParams.get("isNew");
    const onSale   = searchParams.get("onSale");

    // ─── WHERE ───────────────────────────────────────────────
    const where: any = { isActive: true };

    if (category && category !== "all") {
      where.category = { slug: category };
    }

    if (q) {
      where.OR = [
        { nameAr: { contains: q, mode: "insensitive" } },
        { nameEn: { contains: q, mode: "insensitive" } },
        { brand:  { contains: q, mode: "insensitive" } },
        { tags:   { has: q.toLowerCase() } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (sizes) {
      where.variants = {
        some: { size: { in: sizes.split(",") } },
      };
    }

    if (isNew === "true") where.isNew = true;
    if (onSale === "true") where.origPrice = { not: null };

    // ─── ORDER BY ────────────────────────────────────────────
    const orderBy: any =
      sort === "price_asc"  ? { price: "asc" }  :
      sort === "price_desc" ? { price: "desc" } :
      sort === "rating"     ? { reviews: { _count: "desc" } } :
      sort === "new"        ? { createdAt: "desc" } :
      { isBest: "desc" };

    // ─── QUERY ───────────────────────────────────────────────
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { slug: true, nameAr: true } },
          // جلب أول صورتين — الأولى للعرض والثانية لـ hover
          images:   { orderBy: { isPrimary: "desc" }, take: 2 },
          // ✅ كل الـ variants كاملة (كل الألوان × كل المقاسات)
          // شيلنا distinct:["color"] اللي كانت بترجع صف واحد بس لكل لون
          // (وبالتالي مقاس واحد بس)، عشان لوحة اختيار اللون/المقاس
          // في الكارد تقدر تعرض كل المقاسات المتاحة فعلياً لكل لون
          variants: {
            select: { size: true, color: true, colorHex: true, stock: true },
            orderBy: [{ color: "asc" }, { size: "asc" }],
          },
          _count: { select: { reviews: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // ─── تحويل images من objects إلى string[] ────────────────
    const mappedProducts = products.map((p) => ({
      ...p,
      // ProductCard يتوقع images: string[]
      images: p.images.map((img: any) => img.url).filter(Boolean),
      // بيانات مختصرة للبطاقة
      category:    p.category?.nameAr ?? null,
      categorySlug: p.category?.slug  ?? null,
      reviewCount: p._count.reviews,
      stock: p.variants.reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0),
      colors: [...new Map(
        p.variants.map((v: any) => [v.colorHex, { name: v.color, hex: v.colorHex }])
      ).values()],
    }));

    return NextResponse.json({
      products: mappedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[products GET]", error);
    return NextResponse.json({ error: "فشل تحميل المنتجات" }, { status: 500 });
  }
}