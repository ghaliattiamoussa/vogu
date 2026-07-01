import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/customize — جلب المنتجات النشطة مع أقسامها (لصفحة التصميم)
// يدعم ?categoryId=slug لفلترة قسم معين
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    const where: any = { isActive: true };
    if (categoryId) {
      where.category = { slug: categoryId };
    }

    const products = await prisma.customizerProduct.findMany({
      where,
      include: { category: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    // أيضاً جلب الأقسام النشطة
    const categories = await prisma.customizerCategory.findMany({
      where: { products: { some: { isActive: true } } },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ products, categories });
  } catch (error) {
    console.error('GET /api/customize error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
