// src/app/api/vendor/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyVendorRequest } from '@/lib/vendorAuth';
import { prisma } from '@/lib/db';

// PATCH /api/vendor/orders/[id] — تحديث حالة شحن التاجر
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const vendor = await verifyVendorRequest(req);
  if (!vendor) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { vendorShipStatus } = await req.json();

  // التحقق من أن القيمة صالحة
  const validStatuses = ['AWAITING_VENDOR', 'SHIPPED_TO_ADMIN', 'RECEIVED_BY_ADMIN'];
  if (!validStatuses.includes(vendorShipStatus)) {
    return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 });
  }

  // التأكد أن عنصر الطلب يخص هذا التاجر
  const item = await prisma.orderItem.findFirst({
    where: { id: params.id, vendorId: vendor.vendorId },
  });

  if (!item) {
    return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 });
  }

  const updated = await prisma.orderItem.update({
    where: { id: params.id },
    data: { vendorShipStatus },
  });

  return NextResponse.json({ success: true, item: updated });
}