import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ══════════════════════════════════════════════════════════════
// POST /api/support — استقبال رسائل الدعم/الشكاوى من العملاء
// يحفظ الرسالة في قاعدة البيانات (SupportTicket + SupportMessage)
// ══════════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "رسالة دعم";

    if (!message) {
      return NextResponse.json({ error: "الرسالة مطلوبة" }, { status: 400 });
    }

    const session   = await getServerSession(authOptions);
    const userId    = (session?.user as any)?.id ?? null;
    const userEmail = session?.user?.email ?? body?.email ?? "زائر (غير مسجل)";
    const userName  = session?.user?.name  ?? body?.name  ?? "زائر";

    // لو فيه ticketId سابق في الطلب، نضيف الرسالة لنفس التذكرة (نفس الجلسة)
    const existingTicketId = typeof body?.ticketId === "string" ? body.ticketId : null;
    let ticketId = existingTicketId;
    let ticket;

    if (existingTicketId) {
      // التحقق من وجود التذكرة
      const existing = await prisma.supportTicket.findUnique({
        where: { id: existingTicketId },
      });
      if (existing) {
        await prisma.supportMessage.create({
          data: { ticketId: existingTicketId, sender: "USER", text: message },
        });
        // إعادة فتح التذكرة لو مغلقة
        await prisma.supportTicket.update({
          where: { id: existingTicketId },
          data: { status: "OPEN", updatedAt: new Date() },
        });
        ticket = existing;
      }
    }

    if (!ticket) {
      // إنشاء تذكرة جديدة
      ticket = await prisma.supportTicket.create({
        data: {
          userId: userId ?? undefined,
          userName,
          userEmail,
          subject: subject.slice(0, 120),
          status: "OPEN",
          messages: {
            create: { sender: "USER", text: message },
          },
        },
        include: { messages: true },
      });
      ticketId = ticket.id;
    }

    console.log(`📩 تذكرة دعم #${ticketId} من ${userName} (${userEmail})`);

    return NextResponse.json({
      success: true,
      ticketId,
      lastMessageAt: new Date().toISOString(),
      message: "تم استلام رسالتك بنجاح، سيتم الرد عليك قريباً",
    });
  } catch (error) {
    console.error("POST /api/support error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء إرسال الرسالة" },
      { status: 500 }
    );
  }
}
