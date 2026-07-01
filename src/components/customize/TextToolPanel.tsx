"use client";

import { useState } from "react";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, ChevronDown, Circle,
  Italic, Minus, Palette, Plus, Rows3, Sparkles, Type, Underline,
} from "lucide-react";
import {
  buildTextCss,
  CUSTOMIZE_FONTS,
  DEFAULT_TEXT_STYLE,
  TEXT_COLORS_EXTENDED,
  TEXT_SHADOW_PRESETS,
  type TextAlign,
  type TextShadow,
  type TextStroke,
  type TextStyle,
  type TextTransform,
} from "@/lib/textStyles";

export interface TextToolState {
  textInput: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  style: TextStyle;
}

interface TextToolPanelProps {
  state: TextToolState;
  onChange: (patch: Partial<TextToolState> & { style?: Partial<TextStyle> }) => void;
  onAdd: () => void;
  onApplySelected?: () => void;
  editingSelected?: boolean;
}

type SectionId =
  | "content"
  | "font"
  | "style"
  | "size"
  | "spacing"
  | "color"
  | "shadow"
  | "outline";

const SECTIONS: {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  hint: string;
}[] = [
  { id: "content", label: "النص", icon: <Type size={14} />, hint: "اكتب المحتوى" },
  { id: "font", label: "الخط", icon: <span style={{ fontSize: 13, fontWeight: 700 }}>Aa</span>, hint: "نوع الخط" },
  { id: "style", label: "النمط", icon: <Bold size={14} />, hint: "عريض · مائل" },
  { id: "size", label: "الحجم", icon: <span style={{ fontSize: 11, fontWeight: 700 }}>24</span>, hint: "حجم الخط" },
  { id: "spacing", label: "التباعد", icon: <Rows3 size={14} />, hint: "حروف · أسطر" },
  { id: "color", label: "اللون", icon: <Palette size={14} />, hint: "لون النص" },
  { id: "shadow", label: "الظل", icon: <Sparkles size={14} />, hint: "ظل النص" },
  { id: "outline", label: "الحدود", icon: <Circle size={14} />, hint: "Outline" },
];

const iconBtn: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8,
  background: "#FFFFFF", border: "1px solid #E5E7EB",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "#6B7280", cursor: "pointer",
};

const toggleBtn = (active: boolean): React.CSSProperties => ({
  ...iconBtn,
  background: active ? "#1A1A1A" : "#FFFFFF",
  color: active ? "#FFFFFF" : "#6B7280",
  border: `1px solid ${active ? "#1A1A1A" : "#E5E7EB"}`,
});

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, color: "#9CA3AF", margin: "0 0 6px", fontFamily: "Tajawal, sans-serif" }}>
      {children}
    </p>
  );
}

function SliderRow({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  unit: string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <SubLabel>{label}</SubLabel>
        <span style={{ fontSize: 10, color: "#6B7280" }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#C9A86E" }}
      />
    </div>
  );
}

function SectionPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#FAF9F6", border: "1px solid #E5E7EB", borderRadius: 12,
      padding: 12, animation: "fadeIn 0.15s ease",
    }}>
      <p style={{
        margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#1A1A1A",
        fontFamily: "Tajawal, sans-serif", borderBottom: "1px solid #E5E7EB", paddingBottom: 8,
      }}>
        {title}
      </p>
      {children}
    </div>
  );
}

export default function TextToolPanel({
  state,
  onChange,
  onAdd,
  onApplySelected,
  editingSelected,
}: TextToolPanelProps) {
  const [openSection, setOpenSection] = useState<SectionId>("content");
  const [fontTab, setFontTab] = useState<"english" | "display" | "arabic" | "classic">("english");

  const patchStyle = (patch: Partial<TextStyle>) =>
    onChange({ style: { ...state.style, ...patch } });

  const patchShadow = (patch: Partial<TextShadow>) =>
    patchStyle({ textShadow: { ...state.style.textShadow, ...patch } });

  const patchStroke = (patch: Partial<TextStroke>) =>
    patchStyle({ stroke: { ...state.style.stroke, ...patch } });

  const toggleSection = (id: SectionId) =>
    setOpenSection((prev) => (prev === id ? prev : id));

  const previewCss = buildTextCss({
    content: state.textInput || "معاينة",
    color: state.textColor,
    fontSize: Math.min(state.fontSize, 26),
    fontFamily: state.fontFamily,
    ...state.style,
  });

  const currentFontLabel =
    CUSTOMIZE_FONTS.find((f) => f.name === state.fontFamily)?.label ?? "خط";

  const fontTabs = [
    { id: "english" as const, label: "إنجليزي" },
    { id: "display" as const, label: "عرض" },
    { id: "arabic" as const, label: "عربي" },
    { id: "classic" as const, label: "كلاسيك" },
  ];

  const filteredFonts = CUSTOMIZE_FONTS.filter((f) => f.category === fontTab);

  const renderSectionContent = () => {
    switch (openSection) {
      case "content":
        return (
          <SectionPanel title="محتوى النص">
            <textarea
              value={state.textInput}
              onChange={(e) => onChange({ textInput: e.target.value })}
              rows={3}
              dir="rtl"
              placeholder="اكتب نصك هنا..."
              style={{
                background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 9,
                padding: "10px 12px", color: "#1A1A1A", fontSize: 13,
                fontFamily: "Tajawal, sans-serif", outline: "none", resize: "none",
                width: "100%", boxSizing: "border-box",
              }}
            />
          </SectionPanel>
        );

      case "font":
        return (
          <SectionPanel title={`نوع الخط — ${currentFontLabel}`}>
            <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
              {fontTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFontTab(tab.id)}
                  style={{
                    padding: "5px 10px", borderRadius: 20, cursor: "pointer", fontSize: 10,
                    background: fontTab === tab.id ? "#C9A86E" : "#FFFFFF",
                    border: `1px solid ${fontTab === tab.id ? "#C9A86E" : "#E5E7EB"}`,
                    color: fontTab === tab.id ? "#FFFFFF" : "#6B7280",
                    fontFamily: "Tajawal, sans-serif", fontWeight: fontTab === tab.id ? 700 : 400,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5,
              maxHeight: 220, overflowY: "auto", paddingRight: 2,
            }}>
              {filteredFonts.map((f) => (
                <button
                  key={f.name}
                  onClick={() => onChange({ fontFamily: f.name })}
                  style={{
                    padding: "8px 10px", borderRadius: 9, cursor: "pointer", textAlign: "right",
                    background: state.fontFamily === f.name ? "#1A1A1A" : "#FFFFFF",
                    border: `1px solid ${state.fontFamily === f.name ? "#1A1A1A" : "#E5E7EB"}`,
                    color: state.fontFamily === f.name ? "#FFFFFF" : "#1A1A1A",
                    fontFamily: f.name, fontSize: 13, transition: "all 0.15s",
                  }}
                >
                  <span style={{ display: "block", fontSize: 9, opacity: 0.65, fontFamily: "Tajawal, sans-serif" }}>
                    {f.label}
                  </span>
                  <span>{f.preview ?? "Aa"}</span>
                </button>
              ))}
            </div>
          </SectionPanel>
        );

      case "style":
        return (
          <SectionPanel title="نمط النص">
            <SubLabel>الوزن والزخرفة</SubLabel>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
              <button onClick={() => patchStyle({ bold: !state.style.bold })} style={toggleBtn(state.style.bold)} title="عريض"><Bold size={13} /></button>
              <button onClick={() => patchStyle({ italic: !state.style.italic })} style={toggleBtn(state.style.italic)} title="مائل"><Italic size={13} /></button>
              <button onClick={() => patchStyle({ underline: !state.style.underline })} style={toggleBtn(state.style.underline)} title="تحته خط"><Underline size={13} /></button>
            </div>
            <SubLabel>المحاذاة</SubLabel>
            <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
              {([
                ["right", AlignRight, "يمين"],
                ["center", AlignCenter, "وسط"],
                ["left", AlignLeft, "يسار"],
              ] as const).map(([align, Icon, label]) => (
                <button
                  key={align}
                  onClick={() => patchStyle({ textAlign: align as TextAlign })}
                  style={{ ...toggleBtn(state.style.textAlign === align), flex: 1, width: "auto", gap: 4, fontSize: 10, fontFamily: "Tajawal" }}
                  title={label}
                >
                  <Icon size={13} />
                </button>
              ))}
            </div>
            <SubLabel>شكل الحروف</SubLabel>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {([
                ["none", "عادي"],
                ["uppercase", "CAPS"],
                ["lowercase", "small"],
                ["capitalize", "Capital"],
              ] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => patchStyle({ textTransform: val as TextTransform })}
                  style={{
                    padding: "5px 10px", borderRadius: 7, cursor: "pointer", fontSize: 10,
                    background: state.style.textTransform === val ? "#1A1A1A" : "#FFFFFF",
                    border: `1px solid ${state.style.textTransform === val ? "#1A1A1A" : "#E5E7EB"}`,
                    color: state.style.textTransform === val ? "#FFFFFF" : "#6B7280",
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </SectionPanel>
        );

      case "size":
        return (
          <SectionPanel title="حجم الخط">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <button onClick={() => onChange({ fontSize: Math.max(10, state.fontSize - 2) })} style={iconBtn}><Minus size={12} /></button>
              <div style={{
                flex: 1, textAlign: "center", fontSize: 22, fontWeight: 700,
                color: "#1A1A1A", fontFamily: "Tajawal, sans-serif",
              }}>
                {state.fontSize}
                <span style={{ fontSize: 11, fontWeight: 400, color: "#9CA3AF" }}> px</span>
              </div>
              <button onClick={() => onChange({ fontSize: Math.min(120, state.fontSize + 2) })} style={iconBtn}><Plus size={12} /></button>
            </div>
            <SliderRow
              label="حجم مخصص"
              value={state.fontSize}
              min={10} max={120} step={1} unit="px"
              onChange={(v) => onChange({ fontSize: v })}
            />
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {[18, 24, 32, 48, 64, 80].map((s) => (
                <button
                  key={s}
                  onClick={() => onChange({ fontSize: s })}
                  style={{
                    padding: "4px 8px", borderRadius: 6, fontSize: 10, cursor: "pointer",
                    background: state.fontSize === s ? "#C9A86E" : "#FFFFFF",
                    border: `1px solid ${state.fontSize === s ? "#C9A86E" : "#E5E7EB"}`,
                    color: state.fontSize === s ? "#FFFFFF" : "#6B7280",
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  {s}px
                </button>
              ))}
            </div>
          </SectionPanel>
        );

      case "spacing":
        return (
          <SectionPanel title="التباعد والشفافية">
            <SliderRow label="تباعد الحروف" value={state.style.letterSpacing} min={-2} max={20} step={0.5} unit="px" onChange={(v) => patchStyle({ letterSpacing: v })} />
            <SliderRow label="تباعد الأسطر" value={state.style.lineHeight} min={0.8} max={3} step={0.05} unit="" onChange={(v) => patchStyle({ lineHeight: v })} />
            <SliderRow label="الشفافية" value={Math.round(state.style.opacity * 100)} min={10} max={100} step={5} unit="%" onChange={(v) => patchStyle({ opacity: v / 100 })} />
          </SectionPanel>
        );

      case "color":
        return (
          <SectionPanel title="لون النص">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {TEXT_COLORS_EXTENDED.map((c) => (
                <button
                  key={c}
                  onClick={() => onChange({ textColor: c })}
                  title={c}
                  style={{
                    width: 26, height: 26, borderRadius: "50%", background: c, cursor: "pointer",
                    border: state.textColor === c ? "2.5px solid #C9A86E" : "2px solid #E5E7EB",
                    transform: state.textColor === c ? "scale(1.1)" : "scale(1)",
                    boxShadow: state.textColor === c ? "0 0 0 2px #C9A86E30" : "none",
                  }}
                />
              ))}
            </div>
            <SubLabel>لون مخصص</SubLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="color"
                value={state.textColor}
                onChange={(e) => onChange({ textColor: e.target.value })}
                style={{ width: 44, height: 36, border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer", padding: 2 }}
              />
              <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "monospace" }}>{state.textColor}</span>
            </div>
          </SectionPanel>
        );

      case "shadow":
        return (
          <SectionPanel title="ظل النص">
            <label style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 10, padding: "8px 10px", background: "#FFFFFF",
              borderRadius: 8, border: "1px solid #E5E7EB", cursor: "pointer",
              fontSize: 11, fontFamily: "Tajawal, sans-serif", color: "#1A1A1A",
            }}>
              <span>تفعيل الظل</span>
              <input
                type="checkbox"
                checked={state.style.textShadow.enabled}
                onChange={(e) => patchShadow({ enabled: e.target.checked })}
              />
            </label>
            <SubLabel>أنماط جاهزة</SubLabel>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
              {TEXT_SHADOW_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => patchStyle({ textShadow: preset.shadow })}
                  style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer",
                    background: "#FFFFFF", border: "1px solid #E5E7EB",
                    fontFamily: "Tajawal, sans-serif", color: "#6B7280",
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {state.style.textShadow.enabled && (
              <>
                <SliderRow label="الضبابية" value={state.style.textShadow.blur} min={0} max={30} step={1} unit="px" onChange={(v) => patchShadow({ blur: v })} />
                <SliderRow label="أفقي X" value={state.style.textShadow.offsetX} min={-20} max={20} step={1} unit="px" onChange={(v) => patchShadow({ offsetX: v })} />
                <SliderRow label="رأسي Y" value={state.style.textShadow.offsetY} min={-20} max={20} step={1} unit="px" onChange={(v) => patchShadow({ offsetY: v })} />
                <SubLabel>لون الظل</SubLabel>
                <input
                  type="color"
                  value={state.style.textShadow.color.startsWith("#") ? state.style.textShadow.color : "#000000"}
                  onChange={(e) => patchShadow({ color: e.target.value })}
                  style={{ width: "100%", height: 32, border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}
                />
              </>
            )}
          </SectionPanel>
        );

      case "outline":
        return (
          <SectionPanel title="حدود النص (Outline)">
            <label style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 10, padding: "8px 10px", background: "#FFFFFF",
              borderRadius: 8, border: "1px solid #E5E7EB", cursor: "pointer",
              fontSize: 11, fontFamily: "Tajawal, sans-serif", color: "#1A1A1A",
            }}>
              <span>تفعيل الحدود</span>
              <input
                type="checkbox"
                checked={state.style.stroke.enabled}
                onChange={(e) => patchStroke({ enabled: e.target.checked })}
              />
            </label>
            {state.style.stroke.enabled && (
              <>
                <SliderRow label="سمك الحد" value={state.style.stroke.width} min={0.5} max={6} step={0.5} unit="px" onChange={(v) => patchStroke({ width: v })} />
                <SubLabel>لون الحد</SubLabel>
                <input
                  type="color"
                  value={state.style.stroke.color}
                  onChange={(e) => patchStroke({ color: e.target.value })}
                  style={{ width: "100%", height: 32, border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}
                />
              </>
            )}
          </SectionPanel>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Live preview — always visible */}
      <div style={{
        background: "linear-gradient(135deg, #FAF9F6 0%, #FFFFFF 100%)",
        border: "1px solid #E5E7EB", borderRadius: 12,
        padding: "16px 12px", minHeight: 64, display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <div style={previewCss}>{state.textInput || "معاينة النص"}</div>
      </div>

      {/* Section nav buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
        {SECTIONS.map((sec) => {
          const active = openSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => toggleSection(sec.id)}
              title={sec.hint}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "8px 4px", borderRadius: 10, cursor: "pointer",
                background: active ? "#1A1A1A" : "#FAF9F6",
                border: `1px solid ${active ? "#1A1A1A" : "#E5E7EB"}`,
                color: active ? "#FFFFFF" : "#6B7280",
                transition: "all 0.15s",
              }}
            >
              {sec.icon}
              <span style={{ fontSize: 9, fontFamily: "Tajawal, sans-serif", fontWeight: active ? 700 : 500 }}>
                {sec.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active section indicator */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2px",
      }}>
        <span style={{ fontSize: 10, color: "#C9A86E", fontFamily: "Tajawal, sans-serif", fontWeight: 600 }}>
          {SECTIONS.find((s) => s.id === openSection)?.hint}
        </span>
        <ChevronDown size={12} color="#C9A86E" style={{ transform: "rotate(180deg)" }} />
      </div>

      {/* Expandable content */}
      {renderSectionContent()}

      {/* Action button */}
      {editingSelected && onApplySelected ? (
        <button
          onClick={onApplySelected}
          style={{
            width: "100%", background: "linear-gradient(135deg, #C9A86E, #9A7848)",
            color: "#FFFFFF", border: "none", borderRadius: 10, padding: "11px",
            fontSize: 13, fontFamily: "Tajawal, sans-serif", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(201,168,110,0.25)",
          }}
        >
          تطبيق على النص المحدد
        </button>
      ) : (
        <button
          onClick={onAdd}
          style={{
            width: "100%", background: "#1A1A1A", color: "#FFFFFF", border: "none",
            borderRadius: 10, padding: "11px", fontSize: 13,
            fontFamily: "Tajawal, sans-serif", fontWeight: 700, cursor: "pointer",
          }}
        >
          إضافة النص للتصميم
        </button>
      )}
    </div>
  );
}

export function createDefaultTextToolState(): TextToolState {
  return {
    textInput: "نصك هنا",
    textColor: "#1A1A1A",
    fontSize: 28,
    fontFamily: "Montserrat, sans-serif",
    style: { ...DEFAULT_TEXT_STYLE, textShadow: { ...DEFAULT_TEXT_STYLE.textShadow }, stroke: { ...DEFAULT_TEXT_STYLE.stroke } },
  };
}

export function textToolStateFromElement(el: {
  content: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic?: boolean;
  underline?: boolean;
  textAlign?: TextAlign;
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: TextTransform;
  opacity?: number;
  textShadow?: TextShadow;
  stroke?: TextStroke;
}): TextToolState {
  return {
    textInput: el.content,
    textColor: el.color,
    fontSize: el.fontSize,
    fontFamily: el.fontFamily,
    style: {
      bold: el.bold,
      italic: el.italic ?? false,
      underline: el.underline ?? false,
      textAlign: el.textAlign ?? "center",
      letterSpacing: el.letterSpacing ?? 0,
      lineHeight: el.lineHeight ?? 1.25,
      textTransform: el.textTransform ?? "none",
      opacity: el.opacity ?? 1,
      textShadow: { ...DEFAULT_TEXT_STYLE.textShadow, ...(el.textShadow ?? {}) },
      stroke: { ...DEFAULT_TEXT_STYLE.stroke, ...(el.stroke ?? {}) },
    },
  };
}

export function buildTextPayloadFromState(state: TextToolState) {
  return {
    type: "text" as const,
    content: state.textInput,
    color: state.textColor,
    fontSize: state.fontSize,
    fontFamily: state.fontFamily,
    bold: state.style.bold,
    italic: state.style.italic,
    underline: state.style.underline,
    textAlign: state.style.textAlign,
    letterSpacing: state.style.letterSpacing,
    lineHeight: state.style.lineHeight,
    textTransform: state.style.textTransform,
    opacity: state.style.opacity,
    textShadow: state.style.textShadow,
    stroke: state.style.stroke,
  };
}
