import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// GET /api/orders — fetch current user's orders
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const page  = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = 10;
  const skip  = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({
    orders,
    pagination: {
      page,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}