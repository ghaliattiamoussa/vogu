// src/middleware.ts
// دمج: حماية NextAuth للعملاء + حماية JWT مستقل للتجار + دعم NextAuth للتجار

import { getToken }                  from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify }                 from 'jose';

const VENDOR_SECRET = new TextEncoder().encode(
  process.env.VENDOR_JWT_SECRET ?? 'vogu-vendor-secret-change-in-production'
);

// ── المسارات العامة للتاجر (لا تحتاج توكن) ──────────────────
const PUBLIC_VENDOR_PATHS = [
  '/vendor/login',
  '/api/vendor/auth/login',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ══════════════════════════════════════════════════════════
  // 1️⃣ مسارات التاجر /vendor/* و /api/vendor/*
  // ══════════════════════════════════════════════════════════
  if (pathname.startsWith('/vendor') || pathname.startsWith('/api/vendor')) {

    // السماح للمسارات العامة (صفحة الدخول + API الدخول)
    const isPublic = PUBLIC_VENDOR_PATHS.some((p) => pathname.startsWith(p));
    if (isPublic) return NextResponse.next();

    // ✅ 1. التحقق من جلسة NextAuth (للتجار الذين سجلوا عبر /login)
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
if ((session?.user as any)?.role === 'VENDOR') {
      return NextResponse.next(); // ✅ allowed
    }

    // ✅ 2. التحقق من التوكن المخصص (للتجار الذين سجلوا عبر /vendor/login القديم)
    const vendorToken = req.cookies.get('vogu_vendor_token')?.value;
    if (vendorToken) {
      try {
        await jwtVerify(vendorToken, VENDOR_SECRET);
        return NextResponse.next(); // ✅ مسموح
      } catch {
        // التوكن غير صالح، نستمر للأسفل
      }
    }

    // ❌ إذا لم ينجح أي من التحققين → غير مصرح
    if (pathname.startsWith('/api/vendor')) {
      return NextResponse.json(
        { error: 'غير مصرح — سجّل دخولك أولاً' },
        { status: 401 }
      );
    }

    // إعادة التوجيه إلى صفحة الدخول الموحدة (/login) مع حفظ مسار العودة
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ══════════════════════════════════════════════════════════
  // 2️⃣ باقي المسارات — نفس منطق NextAuth الأصلي
  // ══════════════════════════════════════════════════════════
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ── المسارات العامة للعملاء — دايماً مسموح ───────────────
  const publicPaths = ['/', '/shop', '/product', '/login', '/register'];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  // ── يحتاج تسجيل دخول ─────────────────────────────────────
  const authRequired = ['/account', '/orders', '/wishlist'];
  const needsAuth = authRequired.some((p) => pathname.startsWith(p));
  if (needsAuth && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── يحتاج صلاحية ADMIN ───────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!token)
      return NextResponse.redirect(new URL('/login', req.url));
    if (token.role !== 'ADMIN')
      return NextResponse.redirect(new URL('/', req.url));
  }

  // ── تحويل المسجّلين بعيداً عن صفحات الدخول ──────────────
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      // ✅ إذا كان تاجراً → يذهب للوحة التجار
if ((token?.role as string) === 'VENDOR') {
        return NextResponse.redirect(new URL('/vendor/dashboard', req.url));
      }
      // ✅ إذا كان عميلاً أو أدمن → يذهب للرئيسية
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|fonts|images).*)',
  ],
};