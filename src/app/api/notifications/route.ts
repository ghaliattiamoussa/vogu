// src/app/api/notifications/route.ts

import { prisma }           from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions }      from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/notifications — جلب إشعارات المستخدم
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ notifications: [], unreadCount: 0 });

  const notifications = await prisma.notification.findMany({
    where:   { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take:    20,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return NextResponse.json({ notifications, unreadCount });
}

// PATCH /api/notifications — تعليم كقروء (كل أو واحد)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await req.json().catch(() => ({}));

  if (id) {
    // تعليم إشعار واحد كمقروء
    await prisma.notification.updateMany({
      where: { id, userId: session.user.id },
      data:  { isRead: true },
    });
  } else {
    // تعليم الكل كمقروء
    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data:  { isRead: true },
    });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/notifications — حذف المقروءة
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  await prisma.notification.deleteMany({
    where: { userId: session.user.id, isRead: true },
  });

  return NextResponse.json({ success: true });
}