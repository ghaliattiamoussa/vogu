// src/app/api/checkout/route.ts
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { createNewOrderNotification } from '@/lib/createNotification';
import { OrderStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      shippingAddress,
      couponCode,
      paymentMethod = 'cash_on_delivery',
      transferRef,
      transferImage,
      senderAccount,
    } = body;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;

    if (userId && session?.user?.role === 'VENDOR') {
      return NextResponse.json(
        { error: 'حساب التاجر لا يمكنه إنشاء طلبات شراء. سجّل دخولك كعميل.' },
        { status: 403 }
      );
    }

    let dbUser: { id: string } | null = null;
    if (userId) {
      dbUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!dbUser) {
        return NextResponse.json(
          { error: 'جلسة غير صالحة، يرجى تسجيل الدخول مجدداً' },
          { status: 401 }
        );
      }
    }

    if (!dbUser && !shippingAddress) {
      return NextResponse.json(
        { error: 'يرجى إدخال عنوان الشحن' },
        { status: 400 }
      );
    }

    const cartItems: any[] = body.cartItems ?? body.items ?? [];

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'السلة فارغة' }, { status: 400 });
    }

    // ─── 2. فصل المنتجات المخصصة عن العادية ─────────────
    const customItems = cartItems.filter((i: any) => i.isCustom);
    const normalItems = cartItems.filter((i: any) => !i.isCustom);

    // نجيب المنتجات العادية من الداتا بيز بس
    const productIds = [...new Set(normalItems.map((i: any) => String(i.productId ?? i.id)))];

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { id: { in: productIds } },
          { nameAr: { in: normalItems.map((i: any) => i.nameAr).filter(Boolean) } },
        ],
        isActive: true,
      },
      include: {
        variants: true,
        images: { orderBy: { isPrimary: 'desc' }, take: 1 },
        vendor: {
          select: { id: true },
        },
      },
    });

    // ─── 3. بناء عناصر الطلب مع ربط التاجر ──────────────
    const orderLines: any[] = [];

    // أولاً: نضيف المنتجات المخصصة مباشرة بدون بحث في الداتا بيز
    for (const customItem of customItems) {
      const qty = customItem.quantity ?? 1;
      orderLines.push({
        productId: null,
        variantId: null,
        nameAr: customItem.nameAr,
        brand: customItem.brand || 'VŌGU Custom',
        size: customItem.size || null,
        color: customItem.color || null,
        price: customItem.price,
        qty,
        imageUrl: customItem.customDesignImage || customItem.image || null,
        designData: customItem.designData ?? null,
        vendorId: null,
      });
    }

    // ثانياً: نضيف المنتجات العادية (الكود القديم بتاعك)
    for (const cartItem of normalItems) {
      const itemId = String(cartItem.productId ?? cartItem.id ?? '');
      const product = products.find(
        (p) => p.id === itemId || p.nameAr === cartItem.nameAr
      );

      if (!product) {
        return NextResponse.json(
          { error: `منتج غير موجود: ${cartItem.nameAr ?? itemId}` },
          { status: 400 }
        );
      }

      const qty = cartItem.quantity ?? cartItem.qty ?? 1;

      let variant = product.variants.find(
        (v) => v.size === cartItem.size && v.color === cartItem.color
      );

      if (!variant && cartItem.size) {
        variant = product.variants.find(
          (v) => v.size === cartItem.size && (v.stock ?? 0) >= qty
        );
      }

      if (!variant) {
        variant = product.variants.find((v) => (v.stock ?? 0) >= qty);
      }

      const hasVariants = product.variants.length > 0;

      if (hasVariants && !variant) {
        return NextResponse.json(
          { error: `${product.nameAr}: المخزون غير كافٍ` },
          { status: 400 }
        );
      }

      if (variant && (variant.stock ?? 0) < qty) {
        return NextResponse.json(
          { error: `${product.nameAr}: المخزون غير كافٍ (متاح: ${variant.stock})` },
          { status: 400 }
        );
      }

      orderLines.push({
        productId: product.id,
        variantId: variant?.id ?? null,
        nameAr: product.nameAr,
        brand: product.brand ?? '',
        size: variant?.size ?? cartItem.size ?? null,
        color: variant?.color ?? cartItem.color ?? null,
        price: cartItem.price ?? product.price,
        qty,
        imageUrl: product.images[0]?.url ?? null,
        vendorId: product.vendor?.id ?? null,
      });
    }

    // ─── 4. حساب الإجماليات ────────────────────────────────
    const subtotal = orderLines.reduce((s, i) => s + i.price * i.qty, 0);
    const shippingCost = body.shippingCost ?? (subtotal >= 500 ? 0 : 49);
    let discount = 0;

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });

      if (coupon) {
        if (coupon.minOrder && subtotal < coupon.minOrder) {
          return NextResponse.json(
            { error: `الحد الأدنى للطلب ${coupon.minOrder} ج.م` },
            { status: 400 }
          );
        }
        discount = coupon.type === 'PERCENTAGE'
          ? Math.round(subtotal * (coupon.value / 100))
          : coupon.value;

        await prisma.coupon.update({
          where: { code: couponCode.toUpperCase() },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const total = Math.max(0, subtotal + shippingCost - discount);

    // ─── 5. إنشاء العنوان ──────────────────────────────────
    let addressId: string | null = null;

    if (shippingAddress && dbUser) {
      const address = await prisma.address.create({
        data: {
          userId: dbUser.id,
          fullName: shippingAddress.fullName ?? 'العميل',
          phone: shippingAddress.phone ?? '',
          street: shippingAddress.street ?? '',
          city: shippingAddress.city ?? '',
          state: shippingAddress.state ?? shippingAddress.city ?? '',
          country: shippingAddress.country ?? 'مصر',
          postalCode: shippingAddress.postalCode ?? null,
          label: 'طلب جديد',
        },
      });
      addressId = address.id;
    }

    // ─── 6. بناء الملاحظات ──────────────────────────────────
    const notesParts: string[] = [];
    if (!dbUser && shippingAddress) {
      notesParts.push(
        `[ضيف] ${shippingAddress.fullName} | ${shippingAddress.phone} | ${shippingAddress.street}, ${shippingAddress.city}`
      );
    }
    if (transferRef) notesParts.push(`رقم العملية: ${transferRef}`);
    if (senderAccount) notesParts.push(`رقم الحساب المرسل: ${senderAccount}`);
    if (transferImage) notesParts.push(`صورة التحويل: ${transferImage}`);
    const notes = notesParts.length > 0 ? notesParts.join('\n') : null;

    // ─── 7. تحديد حالة الطلب بناءً على طريقة الدفع ───────────
    const walletMethods = ['instapay', 'vodafone_cash', 'orange_money', 'etisalat_cash'];
    let orderStatus: OrderStatus = OrderStatus.CONFIRMED;
    if (walletMethods.includes(paymentMethod)) {
      orderStatus = OrderStatus.PENDING;
    }

    // ─── 8. إنشاء الطلب ────────────────────────────────────
    const order = await prisma.order.create({
      data: {
        userId: dbUser?.id ?? null,
        addressId,
        status: orderStatus,
        paymentStatus: 'UNPAID',
        paymentMethod,
        subtotal,
        shippingCost,
        discount,
        total,
        couponCode: couponCode ?? null,
        notes,
        items: {
          create: orderLines.map((line) => ({
            productId: line.productId,
            variantId: line.variantId,
            nameAr: line.nameAr,
            brand: line.brand,
            size: line.size,
            color: line.color,
            price: line.price,
            qty: line.qty,
            imageUrl: line.imageUrl,
            designData: line.designData ?? undefined,
            vendorId: line.vendorId,
            vendorShipStatus: line.vendorId ? 'AWAITING_VENDOR' : 'NOT_REQUIRED',
          })),
        },
      },
    });

    if (dbUser) {
      await createNewOrderNotification(dbUser.id, order.id);
    }

    // ─── 9. تحديث المخزون ──────────────────────────────────
    await Promise.all(
      orderLines
        .filter((line) => line.variantId)
        .map((line) =>
          prisma.productVariant.update({
            where: { id: line.variantId },
            data: { stock: { decrement: line.qty } },
          })
        )
    );

    return NextResponse.json({ success: true, orderId: order.id, total });
  } catch (error: any) {
    console.error('[checkout POST]', error);
    return NextResponse.json(
      { error: error?.message ?? 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}