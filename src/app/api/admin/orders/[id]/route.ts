// src/app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// ── GET /api/admin/orders/[id] ────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const order = await db.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, image: true },
        },
        address: true,
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { isPrimary: "desc" }, take: 1 },
                category: true,
              },
            },
            variant: true,
            // ✅ إضافة بيانات التاجر المرتبط بكل عنصر طلب
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
    });

    if (!order) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    const enrichedOrder = {
      ...order,
      items: order.items.map((item: any) => ({
        ...item,
        imageUrl: item.imageUrl ?? item.product?.images?.[0]?.url ?? null,
        nameAr:   item.nameAr  ?? item.product?.nameAr ?? '',
        brand:    item.brand   ?? item.product?.brand  ?? '',
        // ✅ تأكد من وجود vendorShipStatus (موجود أصلاً في الـ item)
        // ✅ vendor موجود بفضل الـ include أعلاه
      })),
    };

    return NextResponse.json({ order: enrichedOrder });

  } catch (error) {
    console.error("GET /api/admin/orders/[id] error:", error);
    return NextResponse.json({ error: "خطأ في جلب الطلب" }, { status: 500 });
  }
}

// ── PATCH /api/admin/orders/[id] ─────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const body = await req.json();

    // ✅ استقبال الحقول الجديدة: orderItemId و vendorShipStatus
    const {
      status,
      paymentStatus,
      notes,
      orderItemId,        // ← معرف عنصر الطلب (OrderItem)
      vendorShipStatus,   // ← الحالة الجديدة (AWAITING_VENDOR, SHIPPED_TO_ADMIN, RECEIVED_BY_ADMIN)
    } = body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ];
    const validPayStatuses = ["UNPAID", "PAID", "REFUNDED", "PARTIAL"];
    const validVendorShipStatuses = [
      "AWAITING_VENDOR",
      "SHIPPED_TO_ADMIN",
      "RECEIVED_BY_ADMIN",
    ];

    // ── 1. تحديث حالة شحن التاجر (على مستوى OrderItem) ──
    if (orderItemId && vendorShipStatus) {
      if (!validVendorShipStatuses.includes(vendorShipStatus)) {
        return NextResponse.json(
          { error: "حالة شحن التاجر غير صالحة" },
          { status: 400 }
        );
      }

      // التأكد أن عنصر الطلب موجود
      const existingItem = await db.orderItem.findUnique({
        where: { id: orderItemId },
      });

      if (!existingItem) {
        return NextResponse.json(
          { error: "عنصر الطلب غير موجود" },
          { status: 404 }
        );
      }

      // تحديث حالة شحن التاجر
      await db.orderItem.update({
        where: { id: orderItemId },
        data: { vendorShipStatus },
      });
    }

    // ── 2. تحديث الطلب الرئيسي (status, paymentStatus, notes) ──
    const data: any = {};
    if (status && validStatuses.includes(status)) data.status = status;
    if (paymentStatus && validPayStatuses.includes(paymentStatus))
      data.paymentStatus = paymentStatus;
    if (notes !== undefined) data.notes = notes;

    let order = null;

    if (Object.keys(data).length > 0) {
      order = await db.order.update({
        where: { id: params.id },
        data,
        include: {
          user: { select: { name: true, email: true } },
          address: true,
          items: {
            include: {
              product: { select: { nameAr: true } },
              // ✅ جلب بيانات التاجر مع الرد
              vendor: { select: { storeName: true, contactName: true } },
            },
          },
        },
      });
    } else {
      // لو مفيش تغيير على الطلب الرئيسي، بس نجيب البيانات عشان نرجعها
      order = await db.order.findUnique({
        where: { id: params.id },
        include: {
          user: { select: { name: true, email: true } },
          address: true,
          items: {
            include: {
              product: { select: { nameAr: true } },
              vendor: { select: { storeName: true, contactName: true } },
            },
          },
        },
      });
    }

    return NextResponse.json({ order });

  } catch (error) {
    console.error("PATCH /api/admin/orders/[id] error:", error);
    return NextResponse.json({ error: "خطأ في تحديث الطلب" }, { status: 500 });
  }
}