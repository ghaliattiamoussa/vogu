// src/app/api/admin/products/route.ts
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// ─── GET /api/admin/products?status=PENDING&vendorId=xxx ──────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") || undefined; // PENDING, APPROVED, REJECTED
  const vendorId = searchParams.get("vendorId") || undefined;

  const where: any = {};
  if (status) where.approvalStatus = status;
  if (vendorId) where.vendorId = vendorId;

  // إذا لم يحدد فلتر، نرجع المعلقة فقط (مناسب لصفحة المراجعة)
  if (!status && !vendorId) {
    where.approvalStatus = "PENDING";
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      vendor: {
        select: {
          storeName: true,
          contactName: true,
          email: true,
        },
      },
      category: { select: { nameAr: true } },
      images: { where: { isPrimary: true }, take: 1 },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

// ─── POST /api/admin/products — إنشاء منتج جديد (موجود بالفعل) ──
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const body = await req.json();

  const {
    nameAr, nameEn, brand, slug,
    description, categoryId,
    price, origPrice,
    tags, isNew, isBest, isActive,
    variants, images,
  } = body;

  // ─── Validate required fields ────────────────────────────
  if (!nameAr || !nameEn || !brand || !price || !categoryId) {
    return NextResponse.json(
      { error: "الحقول المطلوبة: nameAr, nameEn, brand, price, categoryId" },
      { status: 400 }
    );
  }

  // ─── Check slug uniqueness ───────────────────────────────
  const finalSlug = slug || nameEn.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
  if (existing) {
    return NextResponse.json(
      { error: `الـ slug "${finalSlug}" مستخدم بالفعل — جرب اسماً مختلفاً` },
      { status: 409 }
    );
  }

  // ─── Get category ID from slug if needed ─────────────────
  let resolvedCategoryId = categoryId;
  if (!categoryId.startsWith("c")) {
    const cat = await prisma.category.findFirst({
      where: { OR: [{ id: categoryId }, { slug: categoryId }] },
    });
    if (!cat)
      return NextResponse.json({ error: "الفئة غير موجودة" }, { status: 400 });
    resolvedCategoryId = cat.id;
  }

  // ─── Create product ───────────────────────────────────────
  const product = await prisma.product.create({
    data: {
      nameAr,
      nameEn,
      brand,
      slug:        finalSlug,
      description: description ?? null,
      categoryId:  resolvedCategoryId,
      price:       Number(price),
      origPrice:   origPrice ? Number(origPrice) : null,
      tags:        tags ?? [],
      isNew:       isNew  ?? false,
      isBest:      isBest ?? false,
      isActive:    isActive ?? true,

      // Variants
      variants: {
        create: (variants ?? []).flatMap((v: any) =>
          v.sizes.map((s: any) => ({
            color:    v.color,
            colorHex: v.colorHex,
            size:     s.size,
            stock:    Number(s.stock),
          }))
        ),
      },

      // Images
      images: {
        create: (images ?? []).map((img: any, i: number) => ({
          url:       img.url,
          publicId:  img.publicId ?? "",
          alt:       img.alt ?? nameAr,
          isPrimary: i === 0,
          sortOrder: i,
        })),
      },
    },
    include: {
      variants: true,
      images:   true,
      category: true,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}