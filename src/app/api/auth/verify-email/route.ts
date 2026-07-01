// src/app/api/auth/verify-email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      new URL('/verify-email?error=missing-token', req.url),
    );
  }

  try {
    // ابحث عن التوكن في قاعدة البيانات
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL('/verify-email?error=invalid-token', req.url),
      );
    }

    // تحقق من انتهاء الصلاحية
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.redirect(
        new URL('/verify-email?error=expired-token', req.url),
      );
    }

    // فعّل الحساب
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data:  { emailVerified: new Date() },
    });

    // احذف التوكن بعد الاستخدام
    await prisma.verificationToken.delete({ where: { token } });

    // أعد التوجيه لصفحة النجاح
    return NextResponse.redirect(
      new URL('/verify-email?success=true', req.url),
    );

  } catch (err) {
    console.error('[verify-email]', err);
    return NextResponse.redirect(
      new URL('/verify-email?error=server-error', req.url),
    );
  }
}