import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

async function guard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return null;
  return session;
}

// GET /api/admin/orders/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await guard()))
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: { name: true, email: true, image: true, phone: true },
      },
      address: true,
      items: {
        include: {
          product: {
            select: { nameAr: true, nameEn: true, brand: true, slug: true },
          },
          variant: {
            select: { size: true, color: true, colorHex: true },
          },
        },
      },
    },
  });

  if (!order)
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });

  return NextResponse.json({ order });
}

// PATCH /api/admin/orders/[id] — تحديث الحالة
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await guard()))
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { status, paymentStatus } = await req.json();

  const data: any = {};
  if (status)        data.status        = status;
  if (paymentStatus) data.paymentStatus = paymentStatus;

  const order = await db.order.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ order });
}