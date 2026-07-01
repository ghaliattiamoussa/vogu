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

// GET /api/admin/customizer-categories
export async function GET() {
  const authError = await guard();
  if (authError) return authError;

  try {
    const categories = await prisma.customizerCategory.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/admin/customizer-categories
export async function POST(req: NextRequest) {
  const authError = await guard();
  if (authError) return authError;

  try {
    const { slug, label, emoji, sortOrder } = await req.json();
    if (!slug || !label) {
      return NextResponse.json({ error: 'الاسم والـslug مطلوبان' }, { status: 400 });
    }
    const category = await prisma.customizerCategory.create({
      data: { slug, label, emoji: emoji || '👕', sortOrder: sortOrder || 0 },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'هذا الـslug مستخدم بالفعل' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
