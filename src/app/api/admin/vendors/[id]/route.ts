// src/app/api/admin/vendors/[id]/route.ts
// إدارة تاجر واحد — تعليق / إعادة تفعيل / تغيير كلمة المرور

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession }          from 'next-auth';
import { authOptions }               from '@/lib/auth';
import { prisma }                    from '@/lib/db';
import bcrypt                        from 'bcryptjs';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session;
}

// ══════════════════════════════════════════════════════════════
// GET /api/admin/vendors/[id] — تفاصيل تاجر واحد
// ══════════════════════════════════════════════════════════════
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });

  const vendor = await prisma.vendor.findUnique({
    where: { id: params.id },
    select: {
      id:           true,
      name:         true,
      email:        true,
      businessName: true,
      phone:        true,
      status:       true,
      createdAt:    true,
      _count: { select: { products: true, orderItems: true } },
    },
  });

  if (!vendor)
    return NextResponse.json({ error: 'التاجر غير موجود' }, { status: 404 });

  return NextResponse.json({ vendor });
}

// ══════════════════════════════════════════════════════════════
// PATCH /api/admin/vendors/[id] — تحديث الحالة أو كلمة المرور
// ══════════════════════════════════════════════════════════════
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });

  try {
    const body = await req.json();
    const data: any = {};

    // تغيير الحالة
    if (body.status) {
      if (!['ACTIVE', 'SUSPENDED'].includes(body.status)) {
        return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 });
      }
      data.status = body.status;
    }

    // إعادة تعيين كلمة المرور
    if (body.newPassword) {
      if (body.newPassword.length < 8) {
        return NextResponse.json(
          { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
          { status: 400 }
        );
      }
      data.password = await bcrypt.hash(body.newPassword, 12);
    }

    // تحديث البيانات الأساسية
    if (body.name)         data.name         = body.name.trim();
    if (body.phone)        data.phone        = body.phone.trim();
    if (body.businessName) data.businessName = body.businessName.trim();

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'لا توجد بيانات للتحديث' },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.update({
      where: { id: params.id },
      data,
      select: {
        id:           true,
        name:         true,
        email:        true,
        businessName: true,
        phone:        true,
        status:       true,
      },
    });

    return NextResponse.json({ vendor });

  } catch (err) {
    console.error('[admin/vendors PATCH]', err);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

// ══════════════════════════════════════════════════════════════
// DELETE /api/admin/vendors/[id] — حذف تاجر
// ══════════════════════════════════════════════════════════════
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });

  try {
    await prisma.vendor.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/vendors DELETE]', err);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}