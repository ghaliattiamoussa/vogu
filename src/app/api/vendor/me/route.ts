import { NextRequest, NextResponse } from 'next/server';
import { verifyVendorRequest } from '@/lib/vendorAuth';

export async function GET(req: NextRequest) {
  const vendor = await verifyVendorRequest(req);
  
  if (!vendor) {
    return NextResponse.json({ error: 'غير مُصَرَّح' }, { status: 401 });
  }
  
  return NextResponse.json({ vendor });
}