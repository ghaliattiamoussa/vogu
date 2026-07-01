import { NextRequest, NextResponse } from 'next/server';
import { verifyVendorRequest } from '@/lib/vendorAuth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const vendor = await verifyVendorRequest(req);
  if (!vendor) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [productsCount, pendingProducts, ordersCount, awaitingShipment, revenueAgg] = await Promise.all([
      prisma.product.count({ where: { vendorId: vendor.vendorId } }),
      prisma.product.count({ where: { vendorId: vendor.vendorId, approvalStatus: 'PENDING' } }),
      prisma.orderItem.count({ where: { vendorId: vendor.vendorId } }),
      prisma.orderItem.count({ where: { vendorId: vendor.vendorId, vendorShipStatus: 'AWAITING_VENDOR' } }),
      prisma.orderItem.aggregate({
        where: { vendorId: vendor.vendorId, order: { paymentStatus: 'PAID' } },
        _sum: { price: true },
      }),
    ]);

    return NextResponse.json({
      products: { total: productsCount, pending: pendingProducts },
      orders: { total: ordersCount, awaitingShipment },
      revenue: { total: Math.round(revenueAgg._sum.price || 0) },
    });
  } catch (err) {
    console.error('[vendor/stats]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}