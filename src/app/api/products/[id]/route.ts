import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products/:id  (id can be cuid OR slug)
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Support both cuid and slug lookup
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: { orderBy: [{ color: "asc" }, { size: "asc" }] },
        reviews: {
          include: {
            user: { select: { name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        _count: { select: { reviews: true, wishlist: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    // ─── Calculate average rating ────────────────────────────
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    // ─── Related products (same category, excluding self) ────
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { select: { color: true, colorHex: true }, distinct: ["color"] },
      },
    });

    return NextResponse.json({
      product: { ...product, avgRating: Math.round(avgRating * 10) / 10 },
      related,
    });
  } catch (error) {
    console.error("[product GET]", error);
    return NextResponse.json({ error: "فشل تحميل المنتج" }, { status: 500 });
  }
}