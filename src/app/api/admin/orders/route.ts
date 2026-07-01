// src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// ─── GET /api/admin/orders ─────────────────────────────────────
// يدعم الفلاتر: status, q (بحث), vendorId (لجلب طلبات التجار)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const q = searchParams.get("q") ?? "";
    const vendorId = searchParams.get("vendorId"); // "has-vendor" أو ID معين
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = 20;
    const skip = (page - 1) * limit;

    // ── بناء فلتر WHERE ──
    const where: any = {};

    // فلتر حالة الطلب
    if (status && status !== "ALL") {
      where.status = status;
    }

    // فلتر البحث (رقم الطلب أو اسم/بريد العميل)
    if (q) {
      where.OR = [
        { id: { contains: q } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { user: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    // ── فلتر طلبات التجار ──
    if (vendorId === "has-vendor") {
      // يجيب الطلبات اللي فيها على الأقل عنصر واحد مرتبط بتاجر
      where.items = { some: { vendorId: { not: null } } };
    } else if (vendorId) {
      // يجيب الطلبات اللي فيها عناصر من تاجر معين
      where.items = { some: { vendorId } };
    }

    // ── تنفيذ الاستعلام ──
    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              phone: true,
            },
          },
          address: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  nameAr: true,
                  nameEn: true,
                  brand: true,
                  slug: true,
                },
              },
              variant: {
                select: {
                  size: true,
                  color: true,
                  colorHex: true,
                },
              },
              // ✅ بيانات التاجر المرتبط بهذا العنصر (إن وجد)
              vendor: {
                select: {
                  id: true,
                  storeName: true,
                  contactName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    // ── إعادة النتيجة ──
    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الطلبات" },
      { status: 500 }
    );
  }
}