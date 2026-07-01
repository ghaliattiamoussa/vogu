import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// ─── Guard ────────────────────────────────────────────────────
async function guard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return null;
  return session;
}

// GET /api/admin/products/:id — جلب منتج واحد كاملاً للتعديل
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await guard()))
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      images:   { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: [{ color: "asc" }, { size: "asc" }] },
    },
  });

  if (!product)
    return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });

  return NextResponse.json({ product });
}

// PATCH /api/admin/products/:id — تعديل كامل للمنتج (يشمل الموافقة/الرفض)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await guard()))
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { id } = params;
  const body   = await req.json();

  const {
    nameAr, nameEn, brand, slug, description,
    categoryId, price, origPrice, tags,
    isNew, isBest, isActive,
    approvalStatus,       // ← جديد
    rejectionReason,      // ← جديد
    variants, images,
  } = body;

  // ── الحقول السطحية (scalar) — فقط الموجودة في الـ body ──
  const data: Record<string, unknown> = {};
  if (nameAr      !== undefined) data.nameAr      = nameAr;
  if (nameEn      !== undefined) data.nameEn      = nameEn;
  if (brand       !== undefined) data.brand       = brand;
  if (slug        !== undefined) data.slug        = slug;
  if (description !== undefined) data.description = description;
  if (categoryId  !== undefined) data.categoryId  = categoryId;
  if (price       !== undefined) data.price       = Number(price);
  if (origPrice   !== undefined) data.origPrice   = origPrice === null || origPrice === "" ? null : Number(origPrice);
  if (tags        !== undefined) data.tags        = tags;
  if (isNew       !== undefined) data.isNew       = isNew;
  if (isBest      !== undefined) data.isBest      = isBest;
  if (isActive    !== undefined) data.isActive    = isActive;

  // ✅ معالجة الموافقة / الرفض
  if (approvalStatus !== undefined) {
    data.approvalStatus = approvalStatus;
    if (approvalStatus === "APPROVED") {
      data.isActive = true;
    } else if (approvalStatus === "REJECTED") {
      data.isActive = false;
    }
  }
  if (rejectionReason !== undefined) {
    data.rejectionReason = rejectionReason;
  }

  try {
    const product = await prisma.$transaction(async (tx) => {
      // 1) تحديث الحقول الأساسية
      if (Object.keys(data).length > 0) {
        await tx.product.update({ where: { id }, data });
      }

      // 2) الألوان والمقاسات — استبدال كامل (حذف القديم + إنشاء الجديد)
      if (Array.isArray(variants)) {
        await tx.productVariant.deleteMany({ where: { productId: id } });

        const rows = variants.flatMap((v: any) =>
          (v.sizes ?? []).map((s: any) => ({
            productId: id,
            color:     v.color,
            colorHex:  v.colorHex,
            size:      s.size,
            stock:     Number(s.stock) || 0,
          }))
        );

        if (rows.length > 0) {
          await tx.productVariant.createMany({ data: rows });
        }
      }

      // 3) الصور — استبدال كامل
      if (Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId: id } });

        if (images.length > 0) {
          await tx.productImage.createMany({
           data: images.map((img: any, i: number) => ({
  productId: id,
  url:       img.url,
  publicId:  img.publicId ?? "",
  isPrimary: img.isPrimary ?? i === 0,
  sortOrder: img.sortOrder ?? i,
  alt:       (nameAr as string) ?? "",
})),
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          images:   { orderBy: { sortOrder: "asc" } },
          variants: { orderBy: [{ color: "asc" }, { size: "asc" }] },
        },
      });
    }, {
      timeout: 20000,
      maxWait: 10000,
    });

    return NextResponse.json({ product });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "الـ Slug مستخدم من قبل، اختر slug آخر" },
        { status: 400 }
      );
    }
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }
    if (err?.code === "P2028") {
      return NextResponse.json(
        { error: "العملية أخدت وقت أطول من المتوقع (مشكلة اتصال بقاعدة البيانات)، حاول تاني" },
        { status: 503 }
      );
    }
    console.error("PATCH /api/admin/products/[id]", err);
    return NextResponse.json({ error: "حدث خطأ أثناء التعديل" }, { status: 500 });
  }
}

// DELETE /api/admin/products/:id — حذف منتج
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await guard()))
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { id } = params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product)
    return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}