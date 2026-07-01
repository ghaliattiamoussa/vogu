import type { CSSProperties } from "react";

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

export type TextAlign = "right" | "center" | "left";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

export interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textAlign: TextAlign;
  letterSpacing: number;
  lineHeight: number;
  textTransform: TextTransform;
  opacity: number;
  textShadow: TextShadow;
  stroke: TextStroke;
}

export interface FontOption {
  name: string;
  label: string;
  category: "arabic" | "english" | "display" | "classic";
  preview?: string;
}

export const DEFAULT_TEXT_SHADOW: TextShadow = {
  enabled: false,
  color: "#000000",
  blur: 6,
  offsetX: 2,
  offsetY: 3,
};

export const DEFAULT_TEXT_STROKE: TextStroke = {
  enabled: false,
  color: "#FFFFFF",
  width: 1.5,
};

export const DEFAULT_TEXT_STYLE: TextStyle = {
  bold: false,
  italic: false,
  underline: false,
  textAlign: "center",
  letterSpacing: 0,
  lineHeight: 1.25,
  textTransform: "none",
  opacity: 1,
  textShadow: DEFAULT_TEXT_SHADOW,
  stroke: DEFAULT_TEXT_STROKE,
};

export const TEXT_SHADOW_PRESETS: { id: string; label: string; shadow: TextShadow }[] = [
  { id: "none", label: "بدون", shadow: { ...DEFAULT_TEXT_SHADOW, enabled: false } },
  { id: "soft", label: "ناعم", shadow: { enabled: true, color: "rgba(0,0,0,0.35)", blur: 8, offsetX: 0, offsetY: 3 } },
  { id: "hard", label: "حاد", shadow: { enabled: true, color: "#000000", blur: 0, offsetX: 3, offsetY: 3 } },
  { id: "glow", label: "توهج", shadow: { enabled: true, color: "rgba(201,168,110,0.85)", blur: 14, offsetX: 0, offsetY: 0 } },
  { id: "deep", label: "عميق", shadow: { enabled: true, color: "rgba(0,0,0,0.55)", blur: 16, offsetX: 4, offsetY: 6 } },
];

export const CUSTOMIZE_FONTS: FontOption[] = [
  // ── English (priority) ──
  { name: "Inter, sans-serif", label: "Inter", category: "english", preview: "Ab" },
  { name: "Montserrat, sans-serif", label: "Montserrat", category: "english", preview: "Ab" },
  { name: "Poppins, sans-serif", label: "Poppins", category: "english", preview: "Ab" },
  { name: "Roboto, sans-serif", label: "Roboto", category: "english", preview: "Ab" },
  { name: "Open Sans, sans-serif", label: "Open Sans", category: "english", preview: "Ab" },
  { name: "Lato, sans-serif", label: "Lato", category: "english", preview: "Ab" },
  { name: "Raleway, sans-serif", label: "Raleway", category: "english", preview: "Ab" },
  { name: "Nunito, sans-serif", label: "Nunito", category: "english", preview: "Ab" },
  { name: "Ubuntu, sans-serif", label: "Ubuntu", category: "english", preview: "Ab" },
  { name: "Source Sans 3, sans-serif", label: "Source Sans", category: "english", preview: "Ab" },
  { name: "DM Sans, sans-serif", label: "DM Sans", category: "english", preview: "Ab" },
  { name: "Rubik, sans-serif", label: "Rubik", category: "english", preview: "Ab" },
  { name: "Work Sans, sans-serif", label: "Work Sans", category: "english", preview: "Ab" },
  { name: "Quicksand, sans-serif", label: "Quicksand", category: "english", preview: "Ab" },
  { name: "Josefin Sans, sans-serif", label: "Josefin", category: "english", preview: "Ab" },
  { name: "Outfit, sans-serif", label: "Outfit", category: "english", preview: "Ab" },
  { name: "Space Grotesk, sans-serif", label: "Space Grotesk", category: "english", preview: "Ab" },
  { name: "Sora, sans-serif", label: "Sora", category: "english", preview: "Ab" },
  { name: "Exo 2, sans-serif", label: "Exo 2", category: "english", preview: "Ab" },
  { name: "Barlow, sans-serif", label: "Barlow", category: "english", preview: "Ab" },
  { name: "Kanit, sans-serif", label: "Kanit", category: "english", preview: "Ab" },
  { name: "Mukta, sans-serif", label: "Mukta", category: "english", preview: "Ab" },
  { name: "Comfortaa, sans-serif", label: "Comfortaa", category: "english", preview: "Ab" },
  { name: "Merriweather, serif", label: "Merriweather", category: "english", preview: "Ab" },
  { name: "Libre Baskerville, serif", label: "Baskerville", category: "english", preview: "Ab" },
  { name: "Playfair Display, serif", label: "Playfair", category: "english", preview: "Ab" },
  { name: "Cinzel, serif", label: "Cinzel", category: "english", preview: "Ab" },
  { name: "Abril Fatface, serif", label: "Abril", category: "english", preview: "Ab" },
  // ── Display / Headlines ──
  { name: "Bebas Neue, sans-serif", label: "Bebas", category: "display", preview: "ABC" },
  { name: "Oswald, sans-serif", label: "Oswald", category: "display", preview: "ABC" },
  { name: "Anton, sans-serif", label: "Anton", category: "display", preview: "ABC" },
  { name: "Archivo Black, sans-serif", label: "Archivo", category: "display", preview: "ABC" },
  { name: "Fjalla One, sans-serif", label: "Fjalla", category: "display", preview: "ABC" },
  { name: "Righteous, sans-serif", label: "Righteous", category: "display", preview: "ABC" },
  { name: "Staatliches, sans-serif", label: "Staatliches", category: "display", preview: "ABC" },
  { name: "Orbitron, sans-serif", label: "Orbitron", category: "display", preview: "ABC" },
  { name: "Rajdhani, sans-serif", label: "Rajdhani", category: "display", preview: "ABC" },
  { name: "Teko, sans-serif", label: "Teko", category: "display", preview: "ABC" },
  { name: "Impact, Haettenschweiler, sans-serif", label: "Impact", category: "display", preview: "ABC" },
  { name: "Arial Black, sans-serif", label: "Arial Black", category: "display", preview: "ABC" },
  { name: "Pacifico, cursive", label: "Pacifico", category: "display", preview: "Ab" },
  { name: "Lobster, cursive", label: "Lobster", category: "display", preview: "Ab" },
  { name: "Bangers, cursive", label: "Bangers", category: "display", preview: "Ab" },
  { name: "Permanent Marker, cursive", label: "Marker", category: "display", preview: "Ab" },
  // ── Arabic ──
  { name: "Tajawal, sans-serif", label: "تجوال", category: "arabic", preview: "أبجد" },
  { name: "Cairo, sans-serif", label: "قاهرة", category: "arabic", preview: "أبجد" },
  { name: "Almarai, sans-serif", label: "المراعي", category: "arabic", preview: "أبجد" },
  { name: "Amiri, serif", label: "أميري", category: "arabic", preview: "أبجد" },
  { name: "Noto Kufi Arabic, sans-serif", label: "كوفي", category: "arabic", preview: "أبجد" },
  { name: "Changa, sans-serif", label: "شانجا", category: "arabic", preview: "أبجد" },
  { name: "Reem Kufi, sans-serif", label: "ريم كوفي", category: "arabic", preview: "أبجد" },
  { name: "Markazi Text, serif", label: "مركزي", category: "arabic", preview: "أبجد" },
  { name: "IBM Plex Sans Arabic, sans-serif", label: "IBM Plex", category: "arabic", preview: "أبجد" },
  { name: "Readex Pro, sans-serif", label: "Readex", category: "arabic", preview: "أبجد" },
  { name: "El Messiri, sans-serif", label: "المسيري", category: "arabic", preview: "أبجد" },
  { name: "Lemonada, cursive", label: "ليمونادا", category: "arabic", preview: "أبجد" },
  { name: "Scheherazade New, serif", label: "شهرزاد", category: "arabic", preview: "أبجد" },
  { name: "Aref Ruqaa, serif", label: "الرقaa", category: "arabic", preview: "أبجد" },
  { name: "Katibeh, serif", label: "Katibeh", category: "arabic", preview: "أبجد" },
  { name: "Harmattan, sans-serif", label: "Harmattan", category: "arabic", preview: "أبجد" },
  { name: "Lateef, serif", label: "Lateef", category: "arabic", preview: "أبجد" },
  // ── Classic ──
  { name: "var(--font-cormorant), serif", label: "VŌGU Classic", category: "classic", preview: "Ab" },
  { name: "Georgia, serif", label: "Georgia", category: "classic", preview: "Ab" },
];

export const TEXT_COLORS_EXTENDED = [
  "#FFFFFF", "#000000", "#1A1A1A", "#C9A86E", "#9A7848",
  "#EF4444", "#DC2626", "#F97316", "#EAB308", "#22C55E",
  "#16A34A", "#3B82F6", "#1E3A5F", "#8B5CF6", "#7C3AED",
  "#EC4899", "#F472B6", "#6B7280", "#94A3B8", "#F5F5F0",
];

type TextElementLike = Partial<TextStyle> & {
  bold?: boolean;
  fontFamily?: string;
  color?: string;
  fontSize?: number;
  content?: string;
};

export function resolveTextStyle(el: TextElementLike): TextStyle {
  return {
    bold: el.bold ?? DEFAULT_TEXT_STYLE.bold,
    italic: el.italic ?? DEFAULT_TEXT_STYLE.italic,
    underline: el.underline ?? DEFAULT_TEXT_STYLE.underline,
    textAlign: el.textAlign ?? DEFAULT_TEXT_STYLE.textAlign,
    letterSpacing: el.letterSpacing ?? DEFAULT_TEXT_STYLE.letterSpacing,
    lineHeight: el.lineHeight ?? DEFAULT_TEXT_STYLE.lineHeight,
    textTransform: el.textTransform ?? DEFAULT_TEXT_STYLE.textTransform,
    opacity: el.opacity ?? DEFAULT_TEXT_STYLE.opacity,
    textShadow: { ...DEFAULT_TEXT_SHADOW, ...(el.textShadow ?? {}) },
    stroke: { ...DEFAULT_TEXT_STROKE, ...(el.stroke ?? {}) },
  };
}

export function buildTextCss(el: TextElementLike & { color: string; fontSize: number; fontFamily: string; content?: string }) {
  const style = resolveTextStyle(el);

  const textShadow = style.textShadow.enabled
    ? `${style.textShadow.offsetX}px ${style.textShadow.offsetY}px ${style.textShadow.blur}px ${style.textShadow.color}`
    : undefined;

  const css: CSSProperties = {
    color: el.color,
    fontSize: el.fontSize,
    fontFamily: el.fontFamily,
    fontWeight: style.bold ? 700 : 400,
    fontStyle: style.italic ? "italic" : "normal",
    textDecoration: style.underline ? "underline" : "none",
    textAlign: style.textAlign,
    letterSpacing: `${style.letterSpacing}px`,
    lineHeight: style.lineHeight,
    textTransform: style.textTransform,
    opacity: style.opacity,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    textShadow,
  };

  if (style.stroke.enabled && style.stroke.width > 0) {
    css.WebkitTextStroke = `${style.stroke.width}px ${style.stroke.color}`;
    css.paintOrder = "stroke fill";
  }

  return css;
}

export function createTextElementPayload(input: {
  content: string;
  color: string;
  fontSize: number;
  fontFamily: string;
} & Partial<TextStyle>) {
  const style = resolveTextStyle(input);
  return {
    type: "text" as const,
    content: input.content,
    color: input.color,
    fontSize: input.fontSize,
    fontFamily: input.fontFamily,
    bold: style.bold,
    italic: style.italic,
    underline: style.underline,
    textAlign: style.textAlign,
    letterSpacing: style.letterSpacing,
    lineHeight: style.lineHeight,
    textTransform: style.textTransform,
    opacity: style.opacity,
    textShadow: style.textShadow,
    stroke: style.stroke,
  };
}
