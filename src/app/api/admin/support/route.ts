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

// GET /api/admin/support — جلب كل التذاكر
// يدعم ?status=OPEN|CLOSED و ?search=
export async function GET(req: NextRequest) {
  const authError = await guard();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // OPEN | CLOSED
    const search = searchParams.get('search');

    const where: any = {};
    if (status === 'OPEN' || status === 'CLOSED') where.status = status;
    if (search) {
      where.OR = [
        { userName: { contains: search, mode: 'insensitive' } },
        { userEmail: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('GET /api/admin/support error:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}
