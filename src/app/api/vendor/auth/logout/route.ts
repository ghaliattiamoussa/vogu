// src/app/api/vendor/auth/logout/route.ts
// POST /api/vendor/auth/logout — تسجيل خروج التاجر

import { NextResponse }       from 'next/server';
import { clearVendorCookie }  from '@/lib/vendorAuth';

export async function POST() {
  await clearVendorCookie();
  return NextResponse.json({ success: true });
}