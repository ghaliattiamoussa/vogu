// src/lib/vendorAuth.ts
// نظام مصادقة مستقل للتجار — JWT في cookie منفصل عن NextAuth

import { SignJWT, jwtVerify } from 'jose';
import { cookies }           from 'next/headers';
import { NextRequest }       from 'next/server';

const SECRET = new TextEncoder().encode(
  process.env.VENDOR_JWT_SECRET ?? 'vogu-vendor-secret-change-in-production'
);

const COOKIE_NAME = 'vogu_vendor_token';
const MAX_AGE     = 60 * 60 * 24 * 7; // 7 أيام

// ── بيانات التاجر المخزنة في التوكن ─────────────────────────
export interface VendorPayload {
  vendorId:     string;
  email:        string;
  businessName: string;
  name:         string;
}

// ── إنشاء توكن جديد ──────────────────────────────────────────
export async function signVendorToken(payload: VendorPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

// ── التحقق من التوكن ─────────────────────────────────────────
export async function verifyVendorToken(
  token: string
): Promise<VendorPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as VendorPayload;
  } catch {
    return null;
  }
}

// ── حفظ التوكن في الـ cookie ─────────────────────────────────
export async function setVendorCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   MAX_AGE,
    path:     '/',
  });
}

// ── حذف الـ cookie (logout) ──────────────────────────────────
export async function clearVendorCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

// ── جلب بيانات التاجر من الـ cookie (Server Component / Route Handler) ──
export async function getVendorSession(): Promise<VendorPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyVendorToken(token);
}

// ── جلب التوكن من طلب API (Middleware / Route Handler) ──────
export function getVendorTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value ?? null;
}

// ── التحقق من طلب API ────────────────────────────────────────
export async function verifyVendorRequest(
  req: NextRequest
): Promise<VendorPayload | null> {
  const token = getVendorTokenFromRequest(req);
  if (!token) return null;
  return verifyVendorToken(token);
}