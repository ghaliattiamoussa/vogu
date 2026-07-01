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

// GET /api/admin/customizer-products/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await guard();
  if (authError) return authError;

  try {
    const product = await prisma.customizerProduct.findUnique({
      where: { id: params.id },
      include: { category: true },
    });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PATCH /api/admin/customizer-products/[id] — تحديث أي حقل في المنتج
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await guard();
  if (authError) return authError;

  try {
    const body = await req.json();
    const { label, categoryId, svgType, frontImage, backImage, rightSleeveImage, leftSleeveImage,
            defaultColor, sizes, colors, printArea, price, isActive, sortOrder } = body;

    const updateData: any = {};
    if (label !== undefined) updateData.label = label;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (svgType !== undefined) updateData.svgType = svgType;
    if (frontImage !== undefined) updateData.frontImage = frontImage;
    if (backImage !== undefined) updateData.backImage = backImage;
    if (rightSleeveImage !== undefined) updateData.rightSleeveImage = rightSleeveImage;
    if (leftSleeveImage !== undefined) updateData.leftSleeveImage = leftSleeveImage;
    if (defaultColor !== undefined) updateData.defaultColor = defaultColor;
    if (sizes !== undefined) updateData.sizes = sizes;
    if (colors !== undefined) updateData.colors = colors;
    if (printArea !== undefined) updateData.printArea = printArea;
    if (price !== undefined) updateData.price = price;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const product = await prisma.customizerProduct.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('PATCH /api/admin/customizer-products/[id] error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/admin/customizer-products/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await guard();
  if (authError) return authError;

  try {
    await prisma.customizerProduct.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
