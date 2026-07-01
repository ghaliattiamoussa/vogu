import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// ─── Guard ───────────────────────────────────────────────────
async function guard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

// GET /api/admin/orders?status=PENDING&page=1&q=
export async function GET(req: NextRequest) {
  if (!(await guard())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const q      = searchParams.get("q") ?? "";
  const page   = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit  = 20;
  const skip   = (page - 1) * limit;

  const where: any = {};
  if (status && status !== "ALL") where.status = status;
  if (q) {
    where.OR = [
      { id: { contains: q } },
      { user: { email: { contains: q, mode: "insensitive" } } },
      { user: { name:  { contains: q, mode: "insensitive" } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user:    { select: { name: true, email: true, image: true } },
        address: true,
        items:   { include: { product: true, variant: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({
    orders,
    pagination: { page, total, totalPages: Math.ceil(total / limit) },
  });
}

// PATCH /api/admin/orders — update order status or payment status
export async function PATCH(req: NextRequest) {
  if (!(await guard())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { orderId, status, paymentStatus } = await req.json();
  if (!orderId) return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });

  const data: any = {};
  if (status)        data.status        = status;
  if (paymentStatus) data.paymentStatus = paymentStatus;

  const order = await prisma.order.update({
    where: { id: orderId },
    data,
    include: { user: { select: { email: true, name: true } } },
  });

  // TODO: send email notification to customer when status changes
  // await sendOrderStatusEmail(order)

  return NextResponse.json({ order });
}