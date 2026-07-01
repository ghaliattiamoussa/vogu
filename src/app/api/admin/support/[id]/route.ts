import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function guard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// POST /api/admin/support/[id] — رد الأدمن على تذكرة
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await guard();
  if (authError) return authError;

  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'الرد مطلوب' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    const message = await prisma.supportMessage.create({
      data: {
        ticketId: params.id,
        sender: 'ADMIN',
        text: text.trim(),
      },
    });

    // إعادة فتح التذكرة إذا كانت مغلقة + تحديث updatedAt
    await prisma.supportTicket.update({
      where: { id: params.id },
      data: { status: 'OPEN', updatedAt: new Date() },
    });

    console.log(`📤 رد من الأدمن على التذكرة #${params.id}`);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/support/[id] error:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}

// PATCH /api/admin/support/[id] — تغيير حالة التذكرة (فتح/إغلاق)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await guard();
  if (authError) return authError;

  try {
    const { status } = await req.json();
    if (status !== 'OPEN' && status !== 'CLOSED') {
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('PATCH /api/admin/support/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}

// DELETE /api/admin/support/[id] — حذف تذكرة
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await guard();
  if (authError) return authError;

  try {
    await prisma.supportTicket.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 });
  }
}
