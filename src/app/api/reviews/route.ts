import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// GET /api/reviews?productId=xxx&page=1
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const productId = searchParams.get("productId");
  const page  = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = 10;
  const skip  = (page - 1) * limit;

  if (!productId) {
    return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 });
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  // Rating distribution
  const dist = await prisma.review.groupBy({
    by: ["rating"],
    where: { productId },
    _count: { rating: true },
  });

  return NextResponse.json({
    reviews,
    total,
    totalPages: Math.ceil(total / limit),
    distribution: dist,
  });
}

// POST /api/reviews — submit a review (must be logged in)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { productId, rating, title, body } = await req.json();

  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "بيانات التقييم غير صحيحة" }, { status: 400 });
  }

  // Check if user purchased the product (verified badge)
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId: session.user.id, paymentStatus: "PAID" },
    },
  });

  const review = await prisma.review.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: { rating, title, body },
    create: {
      userId:     session.user.id,
      productId,
      rating,
      title,
      body,
      isVerified: !!hasPurchased,
    },
    include: { user: { select: { name: true, image: true } } },
  });

  return NextResponse.json({ review }, { status: 201 });
}