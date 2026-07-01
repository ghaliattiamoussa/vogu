// POST /api/vendor/logout — تسجيل خروج التاجر
import { NextResponse }       from 'next/server';
import { clearVendorCookie }  from '@/lib/vendorAuth';

export async function POST() {
  await clearVendorCookie();
  return NextResponse.json({ success: true });
}