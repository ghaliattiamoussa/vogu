import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";

// PATCH /api/admin/users/[id]
// body: { action: "block" | "unblock" | "reset-password" | "signout" }
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { action } = await req.json();
  const { id: userId } = params;

  // ← لا تعدل على حسابك أنت
  if (userId === (session.user as any).id)
    return NextResponse.json(
      { error: "لا يمكنك تعديل حسابك الخاص" },
      { status: 400 }
    );

  const user = await db.user.findUnique({
    where:  { id: userId },
    select: { email: true, name: true, isBlocked: true },
  });
  if (!user)
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });

  // ══════════════════════════════════════════════
  // 1. حظر / إلغاء حظر
  // ══════════════════════════════════════════════
  if (action === "block" || action === "unblock") {
    const updated = await db.user.update({
      where: { id: userId },
      data:  { isBlocked: action === "block" },
      select: { id: true, isBlocked: true },
    });
    return NextResponse.json({
      success: true,
      user:    updated,
      message: action === "block" ? "تم حظر المستخدم" : "تم إلغاء الحظر",
    });
  }

  // ══════════════════════════════════════════════
  // 2. إرسال رابط إعادة تعيين كلمة المرور
  // ══════════════════════════════════════════════
  if (action === "reset-password") {
    if (!user.email)
      return NextResponse.json(
        { error: "المستخدم ليس لديه بريد إلكتروني" },
        { status: 400 }
      );

    const token      = crypto.randomBytes(32).toString("hex");
    const expires    = new Date(Date.now() + 60 * 60 * 1000); // ساعة واحدة
    const identifier = `reset:${user.email}`;

    // احذف أي token قديم لنفس الإيميل وأنشئ جديد
    await db.verificationToken.deleteMany({ where: { identifier } });
    await db.verificationToken.create({ data: { identifier, token, expires } });

    await sendPasswordResetEmail(
      user.email,
      user.name ?? "عزيزي العميل",
      token
    );

    return NextResponse.json({
      success: true,
      message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني",
    });
  }

  // ══════════════════════════════════════════════
  // 3. تسجيل خروج إجباري
  // ══════════════════════════════════════════════
  if (action === "signout") {
    // حذف جميع الـ sessions من قاعدة البيانات
    await db.session.deleteMany({ where: { userId } });

    return NextResponse.json({
      success: true,
      message: "تم تسجيل الخروج من جميع الأجهزة",
    });
  }

  return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
}