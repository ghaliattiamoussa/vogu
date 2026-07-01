// src/app/api/admin/vendors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

// ── التحقق من صلاحية الأدمن ─────────────────────────────────
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session;
}

// ══════════════════════════════════════════════════════════════
// GET /api/admin/vendors — جلب كل التجار
// ══════════════════════════════════════════════════════════════
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q') ?? '';
  const status = searchParams.get('status'); // ACTIVE | SUSPENDED
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (q.trim()) {
    where.OR = [
      { contactName: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { storeName: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        contactName: true,
        email: true,
        storeName: true,
        phone: true,
        status: true,
        createdAt: true,
        _count: {
          select: { products: true, orderItems: true },
        },
      },
    }),
    prisma.vendor.count({ where }),
  ]);

  return NextResponse.json({
    vendors,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// ══════════════════════════════════════════════════════════════
// POST /api/admin/vendors — إنشاء تاجر جديد (الأدمن فقط)
// ══════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const { name, email, password, businessName, phone } = await req.json();

    // ── التحقق من البيانات ───────────────────────────────────
    if (!name?.trim() || !email?.trim() || !password || !businessName?.trim()) {
      return NextResponse.json(
        { error: 'الاسم والبريد وكلمة المرور واسم النشاط التجاري مطلوبة' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // ── التحقق من عدم التكرار ────────────────────────────────
    const existing = await prisma.vendor.findUnique({
      where: { email: emailLower },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'هذا البريد الإلكتروني مسجل بالفعل' },
        { status: 409 }
      );
    }

    // ── تشفير كلمة المرور وإنشاء التاجر ─────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    const vendor = await prisma.vendor.create({
      data: {
        contactName: name.trim(),
        email: emailLower,
        password: hashedPassword,
        storeName: businessName.trim(),
        phone: phone?.trim() ?? null,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        contactName: true,
        email: true,
        storeName: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ vendor }, { status: 201 });
  } catch (err) {
    console.error('[admin/vendors POST]', err);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}