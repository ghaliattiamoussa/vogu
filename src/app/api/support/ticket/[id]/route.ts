import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ══════════════════════════════════════════════════════════════
// GET /api/support/ticket/[id] — يجلب رسائل تذكرة معينة للعميل
// الهدف: العميل يتعقّب ردود الأدمن بدون إعادة تحميل الصفحة (polling).
// نرجّع آخر رد ADMIN + كل الرسائل + حالة التذكرة.
// ══════════════════════════════════════════════════════════════

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "التذكرة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({
      ticketId: ticket.id,
      status: ticket.status,
      messages: ticket.messages.map((m) => ({
        id: m.id,
        sender: m.sender,        // USER | ADMIN
        text: m.text,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/support/ticket/[id] error:", error);
    return NextResponse.json({ error: "فشل جلب الرسائل" }, { status: 500 });
  }
}
