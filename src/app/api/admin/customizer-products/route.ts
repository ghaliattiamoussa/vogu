import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Admin guard
async function guard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// GET /api/admin/customizer-products — جلب كل المنتجات مع أقسامها (للأدمن)
export async function GET() {
  const authError = await guard();
  if (authError) return authError;

  try {
    const products = await prisma.customizerProduct.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/admin/customizer-products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/admin/customizer-products — إنشاء منتج مخصص جديد
export async function POST(req: NextRequest) {
  const authError = await guard();
  if (authError) return authError;

  try {
    const body = await req.json();
    const { label, categoryId, svgType, frontImage, backImage, rightSleeveImage, leftSleeveImage,
            defaultColor, sizes, colors, printArea, price, isActive, sortOrder } = body;

    if (!label || !categoryId) {
      return NextResponse.json({ error: 'الاسم والقسم مطلوبان' }, { status: 400 });
    }

    const product = await prisma.customizerProduct.create({
      data: {
        label,
        categoryId,
        svgType: svgType || 'tshirt',
        frontImage: frontImage || null,
        backImage: backImage || null,
        rightSleeveImage: rightSleeveImage || null,
        leftSleeveImage: leftSleeveImage || null,
        defaultColor: defaultColor || '#F5F5F0',
        sizes: sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: colors || null,
        printArea: printArea || null,
        price: price || 299,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/admin/customizer-products error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'معرف المنتج مستخدم بالفعل' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
