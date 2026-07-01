// src/app/api/stylist/route.ts
//
// ✅ هذا الملف يعمل على الـ Server فقط — المفتاح لا يُرسل للمتصفح أبداً
// ✅ يدعم Streaming → النص يظهر تدريجياً مثل ChatGPT

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// ── System Prompt لمستشار الأزياء ────────────────────────
const STYLIST_SYSTEM = `أنت مستشار أزياء محترف لمتجر VŌGU الفاخر المتخصص في الملابس العصرية الراقية.

شخصيتك:
- أسلوبك ودود وراقٍ ومحترف
- تتحدث باللغة العربية الفصحى البسيطة
- تستخدم الإيموجي بحكمة لإضافة الدفء

مهمتك:
- مساعدة العملاء في اختيار الملابس المناسبة لمناسباتهم
- تقديم توصيات محددة وعملية بناءً على احتياجاتهم
- اقتراح تنسيقات (outfits) متكاملة وأنيقة
- مراعاة الميزانية والمناخ والمناسبة

تشكيلات المتجر المتاحة:
• نساء: بليزر كتان واسع (١٢٩٩ ج.م) | فستان حرير أنيق (٢١٩٩ ج.م) | بنطلون واسع الساق (٨٩٩ ج.م) | سويتر كشمير (٣٤٩٩ ج.م) | حقيبة يد هيكلية (٢٤٩٩ ج.م) | طقم محبوك (١٤٩٩ ج.م) | تنورة مطوية (٧٩٩ ج.م)
• رجال: قميص رسمي (٦٩٩ ج.م) | معطف صوف فاخر (٤٩٩٩ ج.م) | بنطلون شينو (٥٩٩ ج.م) | جاكيت بدلة (٣٩٩٩ ج.م)
• أطفال: فستان بالزهور (٣٤٩ ج.م) | جاكيت جينز (٤٩٩ ج.م)
• تخفيضات: فستان سهرة فاخر (٥٩٩٩ ج.م — كان ٨٥٠٠) | بولو رياضي (٤٤٩ ج.م)
• إكسسوارات: حزام جلد (٢٩٩ ج.م)

قواعد مهمة:
- اجعل إجاباتك مختصرة ومفيدة (٣-٥ جمل عادةً)
- قدّم ٢-٣ خيارات محددة مع ذكر السعر
- إذا سأل عن مناسبة، اقترح outfit متكامل
- شجّع على الشحن المجاني عند الطلبات فوق ٥٠٠ ج.م`;

// ── نوع الرسالة ──────────────────────────────────────────
interface ChatMessage {
  role:    'user' | 'assistant';
  content: string;
}

// ══════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];

    // ── التحقق الأساسي ──
    if (!messages.length) {
      return NextResponse.json(
        { error: 'لا توجد رسائل' },
        { status: 400 },
      );
    }

    // ── نحذف رسالة الـ assistant الأولى (رسالة الترحيب) من التاريخ
    //    لأنها ليست من Claude بل كتبناها نحن
    const history = messages.filter((m) => !(m.role === 'assistant' && messages.indexOf(m) === 0));

    // ── تهيئة Anthropic Client ──
    // المفتاح يُقرأ من ANTHROPIC_API_KEY في .env.local تلقائياً
    const client = new Anthropic();

    // ── إنشاء Stream ──────────────────────────────────────
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // استدعاء Claude بـ Streaming
          const anthropicStream = await client.messages.stream({
            model:      'claude-sonnet-4-6',
            max_tokens: 800,
            system:     STYLIST_SYSTEM,
            messages:   history.map((m) => ({
              role:    m.role,
              content: m.content,
            })),
          });

          // أرسل كل قطعة نص فور وصولها
          for await (const event of anthropicStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const chunk = JSON.stringify({ text: event.delta.text });
              controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
            }
          }

          // أعلم الـ client أن الـ stream انتهى
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

        } catch (streamError) {
          const msg = streamError instanceof Error
            ? streamError.message
            : 'خطأ في الاتصال بـ Claude';

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`),
          );
          controller.close();
        }
      },
    });

    // ── أعد الـ Stream كـ Response ──
    return new Response(stream, {
      headers: {
        'Content-Type':  'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection':    'keep-alive',
        'X-Accel-Buffering': 'no', // مهم لـ Nginx
      },
    });

  } catch (err) {
    console.error('[/api/stylist]', err);
    return NextResponse.json(
      { error: 'خطأ في الخادم، حاول مجدداً' },
      { status: 500 },
    );
  }
}

// ── منع GET requests ──────────────────────────────────────
export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}