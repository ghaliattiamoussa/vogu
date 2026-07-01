import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  AiDesignAction,
  AiDesignResponse,
  summarizeElementsForAi,
  type DesignElement,
} from "@/lib/customizeAi";

const PRODUCT_COLORS = [
  "#F5F5F0", "#EDE8D8", "#1A1A1A", "#6B7280", "#1E3A5F",
  "#3B82F6", "#DC2626", "#16A34A", "#EC4899", "#7C3AED",
];

const DESIGN_SYSTEM = `أنت مساعد تصميم أزياء ذكي لمتجر VŌGU. العميل يخصّص ملابسه ويريدك أن تنفّذ طلباته على التصميم مباشرة.

مهمتك:
- فهم طلب العميل بالعربية (إضافة نص، شعار، ستيكر، تغيير لون القماش، تعديل عنصر موجود، حذف، إلخ)
- إرجاع JSON فقط بدون أي نص خارج JSON
- تنفيذ الطلب عملياً عبر actions

ألوان القماش المتاحة: ${PRODUCT_COLORS.join(", ")}

أنواع actions المسموحة:
1. add_text — إضافة نص { type, content, color?, fontSize?, bold?, fontFamily?, x?, y?, scale?, rotation? }
2. add_sticker — إضافة إيموجي/رمز { type, content, fontSize?, x?, y?, scale?, rotation? }
3. set_product_color — تغيير لون المنتج { type, hex }
4. update_element — تعديل عنصر { type, target?: "selected"|"last", content?, color?, fontSize?, bold?, scale?, rotation?, x?, y? }
5. delete_selected — حذف العنصر المحدد { type }
6. delete_all — مسح كل التصميم { type }
7. set_view — تبديل الوجه { type, view: "front"|"back" }

قواعد مهمة:
- canvas تقريباً 380×480، مركز منطقة الطباعة x≈210 y≈220
- للنص العربي استخدم fontFamily: "Tajawal"
- للعناوين الكبيرة fontSize 36-48، للنص الفرعي 22-30
- إذا طلب "كبّر/صغّر" استخدم update_element مع scale (1 = 100%)
- إذا طلب "دوّر" استخدم rotation بالدرجات
- إذا طلب شعار أو رسم معقد لا يمكن نصاً، أضف نصاً مناسباً + ستيكر يعبّر عن الفكرة
- message: جملة عربية قصيرة ودافئة تشرح ما فعلته
- actions: مصفوفة واحدة أو أكثر
- لا تخترع action types غير المذكورة
- أرجع JSON بهذا الشكل بالضبط:
{"message":"...","actions":[...]}`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
  context: {
    productLabel: string;
    productColor: string;
    size: string;
    view: "front" | "back";
    elements: DesignElement[];
    selectedId: string | null;
  };
}

function buildUserPrompt(body: RequestBody) {
  const { context, message } = body;
  const selected = context.elements.find((el) => el.id === context.selectedId);

  return `المنتج: ${context.productLabel}
المقاس: ${context.size}
الوجه الحالي: ${context.view === "front" ? "أمامي" : "خلفي"}
لون القماش: ${context.productColor}
العنصر المحدد: ${
    selected
      ? `${selected.type} — "${selected.content}"`
      : "لا يوجد"
  }

عناصر التصميم الحالية:
${summarizeElementsForAi(context.elements)}

طلب العميل: ${message}`;
}

function parseAiResponse(raw: string): AiDesignResponse {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("invalid_json");

  const parsed = JSON.parse(jsonMatch[0]) as Partial<AiDesignResponse>;
  if (!parsed.message || !Array.isArray(parsed.actions)) {
    throw new Error("invalid_shape");
  }

  return {
    message: parsed.message,
    actions: parsed.actions as AiDesignAction[],
  };
}

function fallbackResponse(message: string, context: RequestBody["context"]): AiDesignResponse {
  if (/امسح|مسح|احذف\s*كل|شيل\s*كل|clear/i.test(message)) {
    return { message: "تم مسح التصميم بالكامل.", actions: [{ type: "delete_all" }] };
  }

  if (/احذف|شيل|امسح/i.test(message) && context.selectedId) {
    return { message: "تم حذف العنصر المحدد.", actions: [{ type: "delete_selected" }] };
  }

  if (/خلف|back/i.test(message)) {
    return { message: "تم التبديل للوجه الخلفي.", actions: [{ type: "set_view", view: "back" }] };
  }

  if (/أمام|front/i.test(message)) {
    return { message: "تم التبديل للوجه الأمامي.", actions: [{ type: "set_view", view: "front" }] };
  }

  const colorMap: Record<string, string> = {
    أبيض: "#F5F5F0",
    أسود: "#1A1A1A",
    أحمر: "#DC2626",
    أزرق: "#3B82F6",
    أخضر: "#16A34A",
    وردي: "#EC4899",
    بنفسج: "#7C3AED",
    كحلي: "#1E3A5F",
    رمادي: "#6B7280",
  };

  for (const [name, hex] of Object.entries(colorMap)) {
    if (message.includes(name)) {
      return {
        message: `تم تغيير لون القماش إلى ${name}.`,
        actions: [{ type: "set_product_color", hex }],
      };
    }
  }

  const cleaned = message.replace(/^(اعمل|اعملي|ضيف|ضيفي|اكتب|حط|حطي)\s+/i, "").trim();
  return {
    message: `تم إضافة "${cleaned || message}" على التصميم.`,
    actions: [
      {
        type: "add_text",
        content: cleaned || message,
        fontSize: 36,
        bold: true,
        color: "#1A1A1A",
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;

    if (!body.message?.trim()) {
      return NextResponse.json({ error: "اكتب طلبك أولاً" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(fallbackResponse(body.message, body.context));
    }

    const client = new Anthropic();
    const userPrompt = buildUserPrompt(body);

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 900,
      system: DESIGN_SYSTEM,
      messages: [
        ...(body.history ?? []).slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user" as const, content: userPrompt },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("empty_response");
    }

    try {
      return NextResponse.json(parseAiResponse(textBlock.text));
    } catch {
      return NextResponse.json(fallbackResponse(body.message, body.context));
    }
  } catch (err) {
    console.error("[/api/customize-ai]", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة الطلب" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
