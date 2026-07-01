import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// ─── GET /api/cart ────────────────────────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: { where: { isPrimary: true }, take: 1 },
        },
      },
      variant: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  return NextResponse.json({ items, subtotal });
}

// ─── POST /api/cart — add item ────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { productId, variantId, qty = 1 } = await req.json();

  if (!productId || !variantId) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  // Check stock
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });
  if (!variant || variant.stock < qty) {
    return NextResponse.json({ error: "المخزون غير كافٍ" }, { status: 400 });
  }

  const item = await prisma.cartItem.upsert({
    where: { userId_variantId: { userId: session.user.id, variantId } },
    update: { qty: { increment: qty } },
    create: { userId: session.user.id, productId, variantId, qty },
    include: {
      product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
      variant: true,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}

// ─── PUT /api/cart — update qty ───────────────────────────────
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { variantId, qty } = await req.json();

  if (qty < 1) {
    // qty 0 → remove item
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id, variantId },
    });
    return NextResponse.json({ removed: true });
  }

  const item = await prisma.cartItem.update({
    where: { userId_variantId: { userId: session.user.id, variantId } },
    data: { qty },
  });

  return NextResponse.json({ item });
}

// ─── DELETE /api/cart — remove item or clear cart ────────────
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { variantId } = await req.json().catch(() => ({}));

  if (variantId) {
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id, variantId },
    });
  } else {
    // Clear entire cart
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
  }

  return NextResponse.json({ success: true });
}