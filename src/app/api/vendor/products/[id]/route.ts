import { NextRequest, NextResponse } from 'next/server';
import { verifyVendorRequest }        from '@/lib/vendorAuth';
import { prisma }                     from '@/lib/db';

type Ctx = { params: { id: string } };

// ── GET ──────────────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: Ctx) {
  const vendor = await verifyVendorRequest(req);
  if (!vendor) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const product = await prisma.product.findFirst({
    where:   { id: params.id, vendorId: vendor.vendorId },
    include: {
      variants: { orderBy: { size: 'asc' } },
      images:   { orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!product) return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });

  return NextResponse.json({ product });
}

// ── PUT ──────────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: Ctx) {
  const vendor = await verifyVendorRequest(req);
  if (!vendor) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const existing = await prisma.product.findFirst({
    where: { id: params.id, vendorId: vendor.vendorId },
  });
  if (!existing) return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });

  try {
    const { nameAr, nameEn, brand, description, categoryId,
            price, origPrice, tags, variants, images } = await req.json();

    if (!nameAr || !nameEn || !brand || !categoryId || !price)
      return NextResponse.json({ error: 'يرجى ملء جميع الحقول المطلوبة' }, { status: 400 });

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        nameAr, nameEn, brand,
        description: description || null,
        categoryId,
        price:        parseFloat(String(price)),
        origPrice:    origPrice ? parseFloat(String(origPrice)) : null,
        tags:         Array.isArray(tags) ? tags : [],
        approvalStatus: 'PENDING',   // إعادة مراجعة بعد التعديل
        isActive:     false,
        variants: {
          deleteMany: {},
          create: (variants ?? []).map((v: {
            size: string; color: string; colorHex: string;
            stock: string | number; sku?: string;
          }) => ({
            size: v.size, color: v.color,
            colorHex: v.colorHex || '#000000',
            stock: parseInt(String(v.stock)) || 0,
            sku:   v.sku || null,
          })),
        },
        images: {
          deleteMany: {},
          create: (images ?? []).map((img: { url: string; alt?: string }, i: number) => ({
            url:       img.url,
            publicId:  img.url,
            alt:       img.alt || nameAr,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
      },
    });
    return NextResponse.json({ product });
  } catch (err) {
    console.error('[VENDOR_PRODUCT_PUT]', err);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// ── DELETE ───────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const vendor = await verifyVendorRequest(req);
  if (!vendor) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const existing = await prisma.product.findFirst({
    where:   { id: params.id, vendorId: vendor.vendorId },
    include: { orderItems: { take: 1 } },
  });
  if (!existing) return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });

  if (existing.orderItems.length > 0)
    return NextResponse.json(
      { error: 'لا يمكن حذف منتج مرتبط بطلبات موجودة' },
      { status: 400 }
    );

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}