import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// GET /api/wishlist
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images:   { where: { isPrimary: true }, take: 1 },
          variants: { select: { color: true, colorHex: true }, distinct: ["color"] },
          category: { select: { slug: true, nameAr: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}

// POST /api/wishlist — toggle (add or remove)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 });

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId: session.user.id, productId } },
    });
    return NextResponse.json({ action: "removed" });
  }

  await prisma.wishlistItem.create({
    data: { userId: session.user.id, productId },
  });

  return NextResponse.json({ action: "added" }, { status: 201 });
}

// DELETE /api/wishlist — clear entire wishlist
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  await prisma.wishlistItem.deleteMany({ where: { userId: session.user.id } });
  return NextResponse.json({ success: true });
}