export type ElementType = "text" | "sticker" | "image";

export interface TextShadow {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

export interface TextStroke {
  enabled: boolean;
  color: string;
  width: number;
}

export interface DesignElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  content: string;
  color: string;
  fontSize: number;
  bold: boolean;
  fontFamily: string;
  rotation: number;
  scale: number;
  flipX?: boolean;        // ← أضف هذا السطر
  italic?: boolean;
  underline?: boolean;
  textAlign?: "right" | "center" | "left";
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  opacity?: number;
  textShadow?: TextShadow;
  stroke?: TextStroke;
}

export type AiDesignAction =
  | {
      type: "add_text";
      content: string;
      color?: string;
      fontSize?: number;
      bold?: boolean;
      fontFamily?: string;
      x?: number;
      y?: number;
      scale?: number;
      rotation?: number;
    }
  | {
      type: "add_sticker";
      content: string;
      fontSize?: number;
      x?: number;
      y?: number;
      scale?: number;
      rotation?: number;
    }
  | { type: "set_product_color"; hex: string }
  | {
      type: "update_element";
      target?: "selected" | "last";
      content?: string;
      color?: string;
      fontSize?: number;
      bold?: boolean;
      fontFamily?: string;
      scale?: number;
      rotation?: number;
      x?: number;
      y?: number;
    }
  | { type: "delete_selected" }
  | { type: "delete_all" }
  | { type: "set_view"; view: "front" | "back" };

export interface AiDesignResponse {
  message: string;
  actions: AiDesignAction[];
}

export interface CustomizeAiContext {
  productLabel: string;
  productColor: string;
  size: string;
  view: "front" | "back";
  elements: DesignElement[];
  selectedId: string | null;
}

export interface ApplyAiResult {
  elements: DesignElement[];
  selectedId: string | null;
  productColor?: string;
  view?: "front" | "back";
}

const DEFAULT_TEXT = {
  color: "#1A1A1A",
  fontSize: 32,
  bold: false,
  fontFamily: "Tajawal",
  x: 210,
  y: 220,
  scale: 1,
  rotation: 0,
};

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function resolveTargetId(
  elements: DesignElement[],
  selectedId: string | null,
  target: "selected" | "last" = "selected",
) {
  if (target === "last") return elements.at(-1)?.id ?? null;
  return selectedId;
}

export function applyAiActions(
  current: CustomizeAiContext,
  actions: AiDesignAction[],
): ApplyAiResult {
  let elements = [...current.elements];
  let selectedId = current.selectedId;
  let productColor = current.productColor;
  let view = current.view;

  for (const action of actions) {
    switch (action.type) {
      case "add_text": {
        const el: DesignElement = {
          id: newId(),
          type: "text",
          content: action.content,
          color: action.color ?? DEFAULT_TEXT.color,
          fontSize: action.fontSize ?? DEFAULT_TEXT.fontSize,
          bold: action.bold ?? DEFAULT_TEXT.bold,
          fontFamily: action.fontFamily ?? DEFAULT_TEXT.fontFamily,
          x: action.x ?? DEFAULT_TEXT.x,
          y: action.y ?? DEFAULT_TEXT.y,
          scale: action.scale ?? DEFAULT_TEXT.scale,
          rotation: action.rotation ?? DEFAULT_TEXT.rotation,
        };
        elements.push(el);
        selectedId = el.id;
        break;
      }

      case "add_sticker": {
        const el: DesignElement = {
          id: newId(),
          type: "sticker",
          content: action.content,
          color: "",
          fontSize: action.fontSize ?? 52,
          bold: false,
          fontFamily: "serif",
          x: action.x ?? DEFAULT_TEXT.x,
          y: action.y ?? DEFAULT_TEXT.y,
          scale: action.scale ?? 1,
          rotation: action.rotation ?? 0,
        };
        elements.push(el);
        selectedId = el.id;
        break;
      }

      case "set_product_color":
        productColor = action.hex;
        break;

      case "update_element": {
        const id = resolveTargetId(elements, selectedId, action.target);
        if (!id) break;
        elements = elements.map((el) =>
          el.id === id
            ? {
                ...el,
                ...(action.content !== undefined ? { content: action.content } : {}),
                ...(action.color !== undefined ? { color: action.color } : {}),
                ...(action.fontSize !== undefined ? { fontSize: action.fontSize } : {}),
                ...(action.bold !== undefined ? { bold: action.bold } : {}),
                ...(action.fontFamily !== undefined ? { fontFamily: action.fontFamily } : {}),
                ...(action.scale !== undefined ? { scale: action.scale } : {}),
                ...(action.rotation !== undefined ? { rotation: action.rotation } : {}),
                ...(action.x !== undefined ? { x: action.x } : {}),
                ...(action.y !== undefined ? { y: action.y } : {}),
              }
            : el,
        );
        break;
      }

      case "delete_selected":
        if (selectedId) {
          elements = elements.filter((el) => el.id !== selectedId);
          selectedId = null;
        }
        break;

      case "delete_all":
        elements = [];
        selectedId = null;
        break;

      case "set_view":
        view = action.view;
        break;
    }
  }

  return { elements, selectedId, productColor, view };
}

export function summarizeElementsForAi(elements: DesignElement[]) {
  if (!elements.length) return "لا يوجد عناصر على التصميم حالياً.";

  return elements
    .map((el, i) => {
      const pos = `(${Math.round(el.x)}, ${Math.round(el.y)})`;
      if (el.type === "text") {
        return `${i + 1}. نص: "${el.content}" | لون ${el.color} | حجم ${el.fontSize}px | موقع ${pos}`;
      }
      if (el.type === "sticker") {
        return `${i + 1}. ستيكر: ${el.content} | موقع ${pos}`;
      }
      return `${i + 1}. صورة مرفوعة | موقع ${pos}`;
    })
    .join("\n");
}
