import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// GET /api/addresses
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ addresses: [] });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("[addresses GET]", error);
    return NextResponse.json({ addresses: [] });
  }
}

// POST /api/addresses — add new address
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json();
  const { label, fullName, phone, street, city, state, country, postalCode, isDefault } = body;

  if (!fullName || !phone || !street || !city) {
    return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 });
  }

  // If new address is default → unset others
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data:  { isDefault: false },
    });
  }

  // If this is the first address → make it default
  const count = await prisma.address.count({ where: { userId: session.user.id } });

 const address = await prisma.address.create({
  data: {
    userId:     session.user.id,   // ← الصح
    label:      label      ?? "المنزل",
    fullName,
    phone,
    street,
    city,
    state:      state      ?? city,
    country:    country    ?? "مصر",
    postalCode: postalCode ?? null,
    isDefault:  isDefault  || count === 0,
  },
});


  return NextResponse.json({ address }, { status: 201 });
}

// PUT /api/addresses — update address or set as default
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id, isDefault, ...fields } = await req.json();
  if (!id) return NextResponse.json({ error: "معرف العنوان مطلوب" }, { status: 400 });

  // Verify ownership
  const existing = await prisma.address.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing)
    return NextResponse.json({ error: "العنوان غير موجود" }, { status: 404 });

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data:  { isDefault: false },
    });
  }

  const address = await prisma.address.update({
    where: { id },
    data:  { ...fields, ...(isDefault !== undefined ? { isDefault } : {}) },
  });

  return NextResponse.json({ address });
}

// DELETE /api/addresses
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "معرف العنوان مطلوب" }, { status: 400 });

  // Verify ownership
  const existing = await prisma.address.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing)
    return NextResponse.json({ error: "العنوان غير موجود" }, { status: 404 });

  await prisma.address.delete({ where: { id } });

  // If deleted address was default → set newest as default
  if (existing.isDefault) {
  const next = await prisma.address.findFirst({
  where:   { userId: session.user.id },
  orderBy: { id: "desc" },          // ← موجود دائماً
});
    if (next) {
      await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }

  return NextResponse.json({ success: true });
}