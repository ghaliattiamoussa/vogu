import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// GET /api/orders/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      // العميل يرى طلباته فقط — الأدمن يرى الكل
      ...((session.user as any).role !== "ADMIN"
        ? { userId: session.user.id }
        : {}),
    },
    include: {
      address: true,
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          variant: true,
        },
      },
      user: {
        select: { name: true, email: true, image: true },
      },
    },
  });

  if (!order)
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });

  // Format items to match what the page expects
  const formattedOrder = {
    ...order,
    items: order.items.map((item) => ({
      id:       item.id,
      nameAr:   item.nameAr,
      brand:    item.brand,
      imageUrl: item.imageUrl ?? item.product.images[0]?.url ?? null,
      price:    item.price,
      qty:      item.qty,
      size:     item.size,
      color:    item.color,
    })),
  };

  return NextResponse.json({ order: formattedOrder });
}