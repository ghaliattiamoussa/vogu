// src/app/api/vendor/auth/login/route.ts
// POST /api/vendor/auth/login — تسجيل دخول 
import { NextRequest, NextResponse } from 'next/server';
import { prisma }                    from '@/lib/db';
import bcrypt                        from 'bcryptjs';
import { signVendorToken, setVendorCookie } from '@/lib/vendorAuth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // ── التحقق من البيانات ───────────────────────────────────
    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // ── البحث عن التاجر ──────────────────────────────────────
    const vendor = await prisma.vendor.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // ── التحقق من الحالة ─────────────────────────────────────
    if (vendor.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'تم تعليق حسابك. تواصل مع الإدارة.' },
        { status: 403 }
      );
    }

    // ── التحقق من كلمة المرور ───────────────────────────────
    const isValid = await bcrypt.compare(password, vendor.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // ── إنشاء التوكن وحفظه في الـ cookie ────────────────────
    const token = await signVendorToken({
      vendorId:     vendor.id,
      email:        vendor.email,
businessName: vendor.storeName,
      name:         vendor.contactName,
    });

    await setVendorCookie(token);

    return NextResponse.json({
      success:      true,
      vendorId:     vendor.id,
      name:         vendor.contactName,
businessName: vendor.storeName,
    });

  } catch (err) {
    console.error('[vendor/auth/login]', err);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}