import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// GET /api/admin/stats — dashboard overview (admin only)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
  const now      = new Date();
  const start30  = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const startMon = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    ordersThisMonth,
    totalRevenue,
    revenueThisMonth,
    totalCustomers,
    newCustomers30d,
    totalProducts,
    lowStock,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    // Total orders
    prisma.order.count(),

    // Orders this month
    prisma.order.count({ where: { createdAt: { gte: startMon } } }),

    // Total revenue (paid orders)
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),

    // Revenue this month
    prisma.order.aggregate({
      where: { paymentStatus: "PAID", createdAt: { gte: startMon } },
      _sum: { total: true },
    }),

    // Total customers
    prisma.user.count({ where: { role: "CUSTOMER" } }),

    // New customers last 30 days
    prisma.user.count({
      where: { role: "CUSTOMER", createdAt: { gte: start30 } },
    }),

    // Total active products
    prisma.product.count({ where: { isActive: true } }),

    // Low stock (≤ 5 units)
    prisma.productVariant.count({ where: { stock: { lte: 5 } } }),

    // Recent 5 orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { items: true } },
      },
    }),

    // Top 5 products by order count (exclude custom items with null productId)
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: { productId: { not: null } },
      _sum: { qty: true },
      orderBy: { _sum: { qty: "desc" } },
      take: 5,
    }),
  ]);

  const topProductsWithNames = await Promise.all(
    topProducts
      .filter((tp) => tp.productId)
      .map(async (tp) => {
      const product = await prisma.product.findUnique({
        where: { id: tp.productId! },
        select: { nameAr: true, brand: true },
      });
      return { ...tp, product };
    })
  );

  return NextResponse.json({
    orders: {
      total: totalOrders,
      thisMonth: ordersThisMonth,
    },
    revenue: {
      total: totalRevenue._sum.total ?? 0,
      thisMonth: revenueThisMonth._sum.total ?? 0,
    },
    customers: {
      total: totalCustomers,
      new30d: newCustomers30d,
    },
    products: {
      total: totalProducts,
      lowStock,
    },
    recentOrders,
    topProducts: topProductsWithNames,
  });
  } catch (error) {
    console.error("[admin/stats GET]", error);
    return NextResponse.json({ error: "فشل جلب الإحصائيات" }, { status: 500 });
  }
}