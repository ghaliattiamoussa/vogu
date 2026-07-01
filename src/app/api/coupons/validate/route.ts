import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/coupons/validate?code=VOGU2025&total=1200
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code  = searchParams.get("code")?.toUpperCase();
  const total = Number(searchParams.get("total") ?? 0);

  if (!code) {
    return NextResponse.json({ valid: false, error: "الكود مطلوب" }, { status: 400 });
  }

  const coupon = await prisma.coupon.findFirst({
    where: {
      code,
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });

  if (!coupon) {
    return NextResponse.json({ valid: false, error: "كود الخصم غير صحيح أو منتهي الصلاحية" });
  }

  // Check max uses
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ valid: false, error: "تم استخدام هذا الكود بالحد الأقصى" });
  }

  // Check minimum order
  if (coupon.minOrder && total < coupon.minOrder) {
    return NextResponse.json({
      valid: false,
      error: `الحد الأدنى للطلب ${coupon.minOrder.toLocaleString("ar-EG")} ج.م`,
    });
  }

  // Calculate discount
  const discount =
    coupon.type === "PERCENTAGE"
      ? Math.round(total * (coupon.value / 100))
      : Math.min(coupon.value, total);

  return NextResponse.json({
    valid:    true,
    discount,
    type:     coupon.type,
    value:    coupon.value,
    message:  coupon.type === "PERCENTAGE"
      ? `خصم ${coupon.value}% — وفّرت ${discount.toLocaleString("ar-EG")} ج.م`
      : `خصم ${coupon.value.toLocaleString("ar-EG")} ج.م ثابت`,
  });
}