// src/app/api/vendor/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyVendorRequest }        from '@/lib/vendorAuth';
import { prisma }                     from '@/lib/db';

// ── GET /api/vendor/products ─────────────────────────────────
export async function GET(req: NextRequest) {
  const vendor = await verifyVendorRequest(req);
  if (!vendor) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const products = await prisma.product.findMany({
    where:   { vendorId: vendor.vendorId },
    include: {
      category: { select: { nameAr: true } },
      images:   { where: { isPrimary: true }, take: 1 },
      variants: { select: { stock: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products });
}

// ── POST /api/vendor/products ────────────────────────────────
export async function POST(req: NextRequest) {
  const vendor = await verifyVendorRequest(req);
  if (!vendor) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const { nameAr, nameEn, brand, description, categoryId,
            price, origPrice, tags, variants, images } = await req.json();

    // ── التحقق من الحقول المطلوبة ──
    if (!nameAr || !nameEn || !brand || !categoryId || !price) {
      return NextResponse.json({ error: 'يرجى ملء جميع الحقول المطلوبة' }, { status: 400 });
    }

    // ── التحقق من وجود مقاسات وألوان ──
    if (!Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json({ error: 'يجب إضافة لون واحد على الأقل مع مقاساته' }, { status: 400 });
    }

    // ── البحث عن الفئة باستخدام الـ Slug أو الـ ID ──
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { id: categoryId },
          { slug: categoryId },
        ],
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'الفئة غير موجودة' }, { status: 400 });
    }

    // ── تحويل الألوان والمقاسات إلى صفوف متغيرات ──
    const variantRows: any[] = [];
    for (const v of variants) {
      const sizes = v.sizes || [];
      if (sizes.length === 0) {
        return NextResponse.json(
          { error: `اللون "${v.color}" لا يحتوي على أي مقاس` },
          { status: 400 }
        );
      }
      for (const s of sizes) {
        if (!s.size) {
          return NextResponse.json(
            { error: `أحد المقاسات في اللون "${v.color}" مفقود` },
            { status: 400 }
          );
        }
        variantRows.push({
          color: v.color,
          colorHex: v.colorHex || '#000000',
          size: s.size,
          stock: parseInt(String(s.stock)) || 0,
        });
      }
    }

    // ── إنشاء الـ Slug الفريد ──
    const baseSlug = nameEn
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Date.now()}`;

    // ── إنشاء المنتج ──
    const product = await prisma.product.create({
      data: {
        nameAr,
        nameEn,
        brand,
        slug,
        description: description || null,
        categoryId: category.id,
        price: parseFloat(String(price)),
        origPrice: origPrice ? parseFloat(String(origPrice)) : null,
        tags: Array.isArray(tags) ? tags : [],
        vendorId: vendor.vendorId,
        approvalStatus: 'PENDING',
        isActive: false,
        variants: {
          create: variantRows,
        },
        images: {
          create: (images ?? []).map((img: { url: string; alt?: string }, i: number) => ({
            url: img.url,
            publicId: img.url, // مؤقت
            alt: img.alt || nameAr,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error('[VENDOR_PRODUCT_POST]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}