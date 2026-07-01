import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// GET /api/admin/users?q=&page=1&limit=20
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const q     = searchParams.get("q")     ?? "";
  const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));
  const skip  = (page - 1) * limit;

  const where: any = {};
  if (q) {
    where.OR = [
      { name:  { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id:        true,
        name:      true,
        email:     true,
        image:     true,
        role:      true,
        isBlocked: true,
        createdAt: true,
        // ← عشان نعرف طريقة التسجيل
        accounts: {
          select: { provider: true },
        },
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.user.count({ where }),
  ]);

  return NextResponse.json({
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}