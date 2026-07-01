// src/app/api/vendor/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyVendorRequest } from '@/lib/vendorAuth';
import { prisma } from '@/lib/db';

// GET /api/vendor/orders — جلب طلبات التاجر (بدون بيانات العميل)
export async function GET(req: NextRequest) {
  const vendor = await verifyVendorRequest(req);
  if (!vendor) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const orderItems = await prisma.orderItem.findMany({
    where: { vendorId: vendor.vendorId },
    include: {
      order: {
        select: {
          id: true,
          status: true,        // حالة الطلب الكلي (PENDING, SHIPPED, DELIVERED...)
          createdAt: true,
        },
      },
      product: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          brand: true,
          images: { take: 1, where: { isPrimary: true } },
        },
      },
      variant: {
        select: {
          size: true,
          color: true,
          colorHex: true,
        },
      },
    },
    orderBy: { order: { createdAt: 'desc' } },
  });

  return NextResponse.json({ items: orderItems });
}