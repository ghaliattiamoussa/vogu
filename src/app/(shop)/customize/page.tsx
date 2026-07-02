"use client";
import ProductCatalogModal, { CatalogProduct } from '@/components/customize/ProductCatalogModal';
import CustomizeAiPanel from '@/components/customize/CustomizeAiPanel';
import TextToolPanel, {
  buildTextPayloadFromState,
  createDefaultTextToolState,
  textToolStateFromElement,
  type TextToolState,
} from '@/components/customize/TextToolPanel';
import '@/components/customize/customize-fonts.css';
import { applyAiActions, type DesignElement } from '@/lib/customizeAi';
import { buildTextCss, TEXT_COLORS_EXTENDED } from '@/lib/textStyles';
import { STICKER_PACKS, STICKER_CATEGORIES, type StickerItem } from '@/lib/stickerLibrary';
import { PRODUCT_COLORS_EXTENDED, resolveCatalogProduct, DEFAULT_FALLBACK_PRODUCT, type CatalogProductFull } from '@/lib/customizerCatalog';
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─── useMediaQuery hook ───────────────────────────────────────
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
import {
  Type, Smile, Upload, RotateCcw, Trash2,
  ShoppingBag, Minus, Plus, RotateCw, Sparkles, Send, X,
  Copy, FlipHorizontal, ChevronsUp, ChevronsDown, Crosshair, Layers,
  Lock, Unlock, ZoomIn, ZoomOut, Move, Edit3, ChevronUp
} from "lucide-react";

/* ═══ ملاحظة مهمة: أضف flipX?: boolean إلى DesignElement في ملف customizeAi.ts ═══ */
type SafeElement = DesignElement & { flipX?: boolean };

// ─── Fabric Texture Filter ─────────────────────────────────
const FABRIC_DEFS = `
  <defs>
    <filter id="fabric" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.82 0.72" numOctaves="4" seed="7" result="noise"/>
      <feColorMatrix type="matrix"
        values="0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0.10 0" in="noise" result="tex"/>
      <feBlend in="SourceGraphic" in2="tex" mode="overlay"/>
    </filter>
    <filter id="shadow-soft" x="-15%" y="-5%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000" flood-opacity="0.08"/>
    </filter>
  </defs>`;

// ─── REALISTIC SVGs ───────────────────────────────────────
const TSHIRT_FRONT = (color: string) => `
<svg viewBox="0 0 420 500" xmlns="http://www.w3.org/2000/svg">
  ${FABRIC_DEFS}
  <defs>
    <radialGradient id="tf-light" cx="42%" cy="20%" r="58%">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.22"/>
      <stop offset="40%"  stop-color="#fff" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.0"/>
    </radialGradient>
    <linearGradient id="tf-side" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.28"/>
      <stop offset="12%"  stop-color="#000" stop-opacity="0.10"/>
      <stop offset="42%"  stop-color="#fff" stop-opacity="0.05"/>
      <stop offset="58%"  stop-color="#fff" stop-opacity="0.05"/>
      <stop offset="88%"  stop-color="#000" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.28"/>
    </linearGradient>
    <linearGradient id="tf-bot" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.16"/>
    </linearGradient>
    <linearGradient id="sl-l" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.30"/>
    </linearGradient>
    <linearGradient id="sl-r" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.30"/>
    </linearGradient>
  </defs>
  <ellipse cx="210" cy="494" rx="128" ry="8" fill="#000" fill-opacity="0.08"/>
  <path d="M152 40 L88 18 L10 92 L60 142 L94 106" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M268 40 L332 18 L410 92 L360 142 L326 106" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40 C262 68 238 90 210 90 C182 90 158 68 152 40 Z" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40 C262 68 238 90 210 90 C182 90 158 68 152 40 Z" fill="url(#tf-side)" filter="url(#fabric)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40 C262 68 238 90 210 90 C182 90 158 68 152 40 Z" fill="url(#tf-light)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40 C262 68 238 90 210 90 C182 90 158 68 152 40 Z" fill="url(#tf-bot)"/>
  <path d="M152 40 L88 18 L10 92 L60 142 L94 106" fill="url(#sl-l)" filter="url(#fabric)"/>
  <path d="M268 40 L332 18 L410 92 L360 142 L326 106" fill="url(#sl-r)" filter="url(#fabric)"/>
  <path d="M154 40 C157 70 180 90 210 90 C240 90 263 70 266 40" fill="none" stroke="#00000020" stroke-width="3" stroke-linecap="round"/>
  <path d="M163 46 C166 72 185 87 210 87 C235 87 254 72 257 46" fill="none" stroke="#00000010" stroke-width="2"/>
  <path d="M152 40 Q124 72 94 106"  fill="none" stroke="#00000018" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M268 40 Q296 72 326 106" fill="none" stroke="#00000018" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="94"  y1="106" x2="78"  y2="440" stroke="#00000012" stroke-width="1.5"/>
  <line x1="326" y1="106" x2="342" y2="440" stroke="#00000012" stroke-width="1.5"/>
  <line x1="82"  y1="431" x2="338" y2="431" stroke="#00000014" stroke-width="2"/>
  <line x1="82"  y1="436" x2="338" y2="436" stroke="#0000000a" stroke-width="1.5"/>
</svg>`;

const TSHIRT_BACK = (color: string) => `
<svg viewBox="0 0 420 500" xmlns="http://www.w3.org/2000/svg">
  ${FABRIC_DEFS}
  <defs>
    <radialGradient id="tb-light" cx="58%" cy="15%" r="55%">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.0"/>
    </radialGradient>
    <linearGradient id="tb-side" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.26"/>
      <stop offset="15%"  stop-color="#000" stop-opacity="0.09"/>
      <stop offset="50%"  stop-color="#fff" stop-opacity="0.04"/>
      <stop offset="85%"  stop-color="#000" stop-opacity="0.09"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.26"/>
    </linearGradient>
  </defs>
  <ellipse cx="210" cy="494" rx="128" ry="8" fill="#000" fill-opacity="0.08"/>
  <path d="M152 40 L88 18 L10 92 L60 142 L94 106" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M268 40 L332 18 L410 92 L360 142 L326 106" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40 C262 68 238 86 210 86 C182 86 158 68 152 40 Z" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40 C262 68 238 86 210 86 C182 86 158 68 152 40 Z" fill="url(#tb-side)" filter="url(#fabric)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40 C262 68 238 86 210 86 C182 86 158 68 152 40 Z" fill="url(#tb-light)"/>
  <path d="M172 40 C175 55 192 65 210 65 C228 65 245 55 248 40" fill="none" stroke="#00000018" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="210" y1="65" x2="210" y2="440" stroke="#00000012" stroke-width="1.5"/>
  <path d="M152 40 Q124 72 94 106"  fill="none" stroke="#00000018" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M268 40 Q296 72 326 106" fill="none" stroke="#00000018" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="94"  y1="106" x2="78"  y2="440" stroke="#00000012" stroke-width="1.5"/>
  <line x1="326" y1="106" x2="342" y2="440" stroke="#00000012" stroke-width="1.5"/>
  <line x1="82"  y1="431" x2="338" y2="431" stroke="#00000014" stroke-width="2"/>
</svg>`;

// ─── Product definitions ──────────────────────────────────
type DesignView = "front" | "back" | "rightSleeve" | "leftSleeve";

// المنتجات بتُحمَّل الآن من قاعدة البيانات عبر /api/customize
// DEFAULT_FALLBACK_PRODUCT يُستخدم فقط لو فشل التحميل (لا يوجد DB).
const FALLBACK = DEFAULT_FALLBACK_PRODUCT;

// ─── Pricing ──────────────────────────────────────────────
const DEFAULT_CUSTOMIZER_PRICING = {
  basePrice: 299,
  extraPrintAreaPrice: 45,
  textElementPrice: 15,
  imageElementPrice: 35,
  stickerElementPrice: 20,
  sizePriceDeltas: { XS: 0, S: 0, M: 0, L: 0, XL: 25, XXL: 40, "FREE SIZE": 0 } as Record<string, number>,
};

type CustomizerPricing = typeof DEFAULT_CUSTOMIZER_PRICING;

// لوحة الألوان تُحدَّث ديناميكياً حسب المنتج المختار من الـDB
// (انظر setProductColors أدناه). القيمة الافتراضية = اللوحة الموسّعة.
const PRODUCT_COLORS = PRODUCT_COLORS_EXTENDED;

const SIZE_SCALE: Record<string, number> = {
  XS: 0.88, S: 0.93, M: 1.0, L: 1.07, XL: 1.14, XXL: 1.20, "FREE SIZE": 1.0,
};

const DESIGN_VIEWS: DesignView[] = ["front", "back", "rightSleeve", "leftSleeve"];
const VIEW_LABELS: Record<DesignView, string> = {
  front: "الأمامي",
  back: "الخلفي",
  rightSleeve: "كم يمين",
  leftSleeve: "كم شمال",
};

const getPrintAreaForView = (view: DesignView, product: CatalogProductFull) => {
	  if (view === "front") return product.frontPrintArea;
	  if (view === "back") return product.backPrintArea;
	  if (view === "rightSleeve") return product.rightSleevePrintArea;
	  if (view === "leftSleeve") return product.leftSleevePrintArea;
	  return product.frontPrintArea;
	};

// ─── Icon button style ────────────────────────────────────
const iconBtn: React.CSSProperties = {
  width:32, height:32, borderRadius:8,
  background:"#FFFFFF", border:"1px solid #E5E7EB",
  display:"flex", alignItems:"center", justifyContent:"center",
  color:"#6B7280", cursor:"pointer",
  transition:"all 0.2s ease",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize:9, color:"#9CA3AF", letterSpacing:"0.1em",
        textTransform:"uppercase", marginBottom:10, fontFamily:"Tajawal, sans-serif" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function CustomizePage() {

  // ── Responsive detection ──
  const isMobile = useMediaQuery("(max-width: 768px)");

  // ── تحميل المنتجات من قاعدة البيانات ──
  const [allProducts, setAllProducts] = useState<CatalogProductFull[]>([]);
  // المنتج الحالي المعروض — يبدأ بالـfallback ويُحدّث لأول منتج بصور حقيقية
  const [product, setProduct] = useState<CatalogProductFull>(FALLBACK);
  const [prodColor,  setProdColor]  = useState("#F5F5F0");
  const [view,       setView]       = useState<DesignView>("front");
  const [size,       setSize]       = useState("M");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/customize');
        const data = await res.json();
        const products: CatalogProductFull[] = (data.products || []).map(resolveCatalogProduct);
        if (products.length === 0) {
          // لا توجد منتجات — استخدم fallback
          return;
        }
        setAllProducts(products);
        // ✅ ابدأ بأول منتج له صورة أمامية حقيقية، وإلا بأول منتج
        const withFrontImage = products.find(p => p.frontImage);
        const first = withFrontImage ?? products[0];
        setProduct(first);
        setProdColor(first.defaultColor || "#F5F5F0");
        if (!first.sizes.includes("M") && first.sizes.length > 0) {
          setSize(first.sizes[0]);
        }
      } catch (error) {
        console.error("Could not fetch customizer products", error);
      }
    };
    loadProducts();
  }, []);

  const router    = useRouter();
  const addToCart = useCartStore((s) => s.addItem);

  const [designByView, setDesignByView] = useState<Record<DesignView, DesignElement[]>>({ front: [], back: [], rightSleeve: [], leftSleeve: [] });
  const [selected,   setSelected]   = useState<string | null>(null);
  const [tool,       setTool]       = useState<"select"|"text"|"sticker"|"upload"|"ai">("select");
  const [history,    setHistory]    = useState<DesignElement[][]>([[]]);
  const [histIdx,    setHistIdx]    = useState(0);
  const [stickerPack,setStickerPack]= useState(STICKER_CATEGORIES[0]);
  const [stickerSearch,setStickerSearch]= useState("");
  const [stickerPage,setStickerPage]= useState(1);
  // showGuide removed — print area is now always visible
  const [customizerPricing, setCustomizerPricing] = useState<CustomizerPricing>(DEFAULT_CUSTOMIZER_PRICING);

  const [textTool, setTextTool] = useState<TextToolState>(createDefaultTextToolState);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const dragging  = useRef<{ id:string; ox:number; oy:number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  // ── refs للتحكم بالبنصرين (pinch-to-zoom) ──
  const pinchRef = useRef<{ active: boolean; startDist: number; startScale: number; id: string } | null>(null);
  // ── مراجع DOM للعناصر لقياس الأبعاد المعروضة (لاستخدامها في التثبيت داخل منطقة الطباعة) ──
  const elementRefs = useRef<Map<string, HTMLElement>>(new Map());
  // ── مرجع لتحريك مقابض التكبير/التدوير ──
  const handleDragRef = useRef<{
    type: 'resize' | 'rotate';
    id: string;
    startX: number;
    startY: number;
    startScale: number;
    startRotation: number;
    centerX: number;
    centerY: number;
    startDist: number;
  } | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);

  // ── Context menu (right-click / long-press) ──
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string } | null>(null);
  const longPressRef = useRef<{ timer: number | null; startX: number; startY: number } | null>(null);

  // ── Bottom Sheet state (mobile only) ──
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] = useState<"tools"|"size"|"color"|"text"|"sticker"|"upload"|"ai"|"selected">("tools");
  const [viewsStripOpen, setViewsStripOpen] = useState(false);

  const sizeScale = SIZE_SCALE[size] ?? 1.0;
  const activePrintArea = getPrintAreaForView(view, product);
  const elements = designByView[view] ?? [];

  // ── Canvas responsive sizing ──
  const canvasBaseW = isMobile ? 280 : 380;
  const canvasBaseH = isMobile ? 350 : 480;

  // الألوان المعروضة = ألوان المنتج الحالي (من الـDB) أو اللوحة الموسّعة
  const activeProductColors = product.colors.length > 0 ? product.colors : PRODUCT_COLORS_EXTENDED;

  const setElements = useCallback((nextOrUpdater: DesignElement[] | ((prev: DesignElement[]) => DesignElement[])) => {
    setDesignByView((prev) => {
      const current = prev[view] ?? [];
      const next = typeof nextOrUpdater === "function" ? nextOrUpdater(current) : nextOrUpdater;
      return { ...prev, [view]: next };
    });
  }, [view]);

  const usedPrintAreas = DESIGN_VIEWS.filter((area) => (designByView[area] ?? []).length > 0);
  const allDesignElements = DESIGN_VIEWS.flatMap((area) => designByView[area] ?? []);
  const designElementCounts = allDesignElements.reduce((acc, el) => {
    acc[el.type] = (acc[el.type] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const liveTotalPrice = Math.round(
    (customizerPricing.basePrice || product.price) +
    Math.max(0, usedPrintAreas.length - 1) * customizerPricing.extraPrintAreaPrice +
    (designElementCounts.text ?? 0) * customizerPricing.textElementPrice +
    (designElementCounts.image ?? 0) * customizerPricing.imageElementPrice +
    (designElementCounts.sticker ?? 0) * customizerPricing.stickerElementPrice +
    (customizerPricing.sizePriceDeltas[size] ?? 0)
  );

  const pushHistory = useCallback((els: DesignElement[]) => {
    setHistory(h => {
      const next = [...h.slice(0, histIdx + 1), [...els]];
      setHistIdx(next.length - 1);
      return next;
    });
  }, [histIdx]);

  const undo = () => { if (histIdx > 0) { setHistIdx(i => i - 1); setElements([...history[histIdx - 1]]); } };
  const redo = () => { if (histIdx < history.length - 1) { setHistIdx(i => i + 1); setElements([...history[histIdx + 1]]); } };

  const addElement = (el: Omit<DesignElement, "id"|"x"|"y"|"rotation"|"scale">) => {
    const newEl: DesignElement = { ...el, id: Date.now().toString(), x: 210, y: 220, rotation: 0, scale: 1 };
    const next = [...elements, newEl];
    setElements(next); pushHistory(next); setSelected(newEl.id); setTool("select");
  };

  const addText = () => {
    if (!textTool.textInput.trim()) return;
    addElement(buildTextPayloadFromState(textTool));
  };

  const applyTextToSelected = () => {
    if (!selected || !textTool.textInput.trim()) return;
    const payload = buildTextPayloadFromState(textTool);
    const next = elements.map((el) =>
      el.id === selected && el.type === "text" ? { ...el, ...payload } : el,
    );
    setElements(next);
    pushHistory(next);
  };

  const updateTextTool = (patch: Partial<TextToolState> & { style?: Partial<TextToolState["style"]> }) => {
    setTextTool((prev) => ({
      ...prev,
      ...patch,
      style: patch.style ? { ...prev.style, ...patch.style } : prev.style,
    }));
  };

  /* ═══════════════════════════════════════════════════════
     ✅ addSticker الآن يستقبل StickerItem ويحفظ SVG في content
     ═══════════════════════════════════════════════════════ */
  const addSticker = (sticker: StickerItem) => {
    addElement({
      type: "sticker",
      content: sticker.svg,
      color: "#1A1A1A",
      fontSize: 48,
      bold: false,
      fontFamily: "",
    });
  };

  /* ═══════════════════════════════════════════════════════
     ✅ تصميم جاهز يستخدم SVG stickers حقيقية
     ═══════════════════════════════════════════════════════ */
  const addQuickDesign = () => {
    const voguBold = STICKER_PACKS["شعارات VOGU"]?.find(s => s.id === "vogu-bold");
    const voguLine = STICKER_PACKS["شعارات VOGU"]?.find(s => s.id === "vogu-line");
    const voguStamp = STICKER_PACKS["شعارات VOGU"]?.find(s => s.id === "vogu-stamp");
    if (!voguBold || !voguLine || !voguStamp) return;

    const now = Date.now();
    const preset: DesignElement[] = [
      { id: `preset-${now}-1`, type:"sticker", content: voguBold.svg, color:"#1A1A1A", fontSize: 60, bold:false, fontFamily:"", x:210, y:175, rotation:0, scale:1 },
      { id: `preset-${now}-2`, type:"sticker", content: voguLine.svg, color:"#1A1A1A", fontSize: 50, bold:false, fontFamily:"", x:210, y:220, rotation:0, scale:0.9 },
      { id: `preset-${now}-3`, type:"sticker", content: voguStamp.svg, color:"#1A1A1A", fontSize: 36, bold:false, fontFamily:"", x:210, y:310, rotation:0, scale:0.6 },
    ];
    const next = [...elements, ...preset];
    setElements(next);
    pushHistory(next);
    setSelected(preset[0].id);
    setTool("select");
  };

  const deleteSelected = () => { const next = elements.filter(e => e.id !== selected); setElements(next); pushHistory(next); setSelected(null); };
  const clearAll = () => { setElements([]); pushHistory([]); setSelected(null); };

  const getPrintBounds = () => {
    const canvasW = canvasBaseW * sizeScale;
    const canvasH = canvasBaseH * sizeScale;
    return {
      minX: (activePrintArea.left / 100) * canvasW,
      minY: (activePrintArea.top / 100) * canvasH,
      maxX: ((activePrintArea.left + activePrintArea.width) / 100) * canvasW,
      maxY: ((activePrintArea.top + activePrintArea.height) / 100) * canvasH,
    };
  };

  // ── نصف أبعاد العنصر المعروضة فعلياً (بعد الـ scale) ──
  // نقرأ أبعاد العنصر غير المُكبّر من DOM ثم نضربها في scale.
  // overrideScale: عند تمريره نستخدمه بدل el.scale (مفيد عند حساب التثبيت
  // بقيمة scale جديدة قبل أن يُعاد رسم الـ DOM).
  const getElementHalfSize = (id: string, overrideScale?: number): { halfW: number; halfH: number } => {
    const node = elementRefs.current.get(id);
    if (!node) return { halfW: 0, halfH: 0 };
    const el = elements.find((x) => x.id === id);
    const scale = overrideScale ?? el?.scale ?? 1;
    return {
      halfW: (node.offsetWidth / 2) * scale,
      halfH: (node.offsetHeight / 2) * scale,
    };
  };

  // ── تثبيت مركز العنصر بحيث يبقى الصندوق المحيط بالكامل داخل منطقة الطباعة ──
  // (نتجاهل التدوير ونأخذ الصندوق المحيط غير المُدوّر كتقريب عملي)
  const clampCenterToPrintArea = (id: string, x: number, y: number, overrideScale?: number) => {
    const b = getPrintBounds();
    const { halfW, halfH } = getElementHalfSize(id, overrideScale);
    // إذا كان العنصر أكبر من منطقة الطباعة، نثبّت مركزه في منتصف المنطقة
    // (تجنّب NaN أو قلب الحدود).
    const regionW = Math.max(0, b.maxX - b.minX);
    const regionH = Math.max(0, b.maxY - b.minY);
    if (2 * halfW >= regionW) {
      x = (b.minX + b.maxX) / 2;
    } else {
      x = Math.max(b.minX + halfW, Math.min(b.maxX - halfW, x));
    }
    if (2 * halfH >= regionH) {
      y = (b.minY + b.maxY) / 2;
    } else {
      y = Math.max(b.minY + halfH, Math.min(b.maxY - halfH, y));
    }
    return { x, y };
  };

  // إعادة تثبيت عنصر معيّن داخل منطقة الطباعة (بعد التكبير/القلب مثلاً)
  const reclampElement = (id: string) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== id) return el;
        const pos = clampCenterToPrintArea(id, el.x, el.y);
        return { ...el, x: pos.x, y: pos.y };
      }),
    );
  };

  // ── Pointer events تعمل مع الماوس واللمس والقلم ──
  const onPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setSelected(id);
    const el = elements.find(x => x.id === id)!;
    dragging.current = { id, ox: e.clientX - el.x, oy: e.clientY - el.y };
    // ── long-press للوحة سياق على اللمس (الموبايل) ──
    if (e.pointerType === "touch") {
      longPressRef.current = { timer: null, startX: e.clientX, startY: e.clientY };
      longPressRef.current.timer = window.setTimeout(() => {
        setContextMenu({ x: longPressRef.current!.startX, y: longPressRef.current!.startY, id });
        dragging.current = null;
        longPressRef.current = null;
      }, 520);
    }
  };

  // ── بدء تحريك مقبض التكبير/التدوير ──
  const startHandleDrag = (e: React.PointerEvent, el: DesignElement, type: 'resize' | 'rotate', corner?: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.pointerType === "touch") {
      // ألغِ الـ long-press
      if (longPressRef.current?.timer) clearTimeout(longPressRef.current.timer);
      longPressRef.current = null;
    }
    // احصل على المركز الفعلي للعنصر على الشاشة
    const node = elementRefs.current.get(el.id);
    const rect = node?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : el.x;
    const cy = rect ? rect.top + rect.height / 2 : el.y;
    const startDist = Math.max(20, Math.hypot(e.clientX - cx, e.clientY - cy));
    handleDragRef.current = {
      type, id: el.id,
      startX: e.clientX, startY: e.clientY,
      startScale: el.scale, startRotation: el.rotation,
      centerX: cx, centerY: cy, startDist,
      ...(corner ? { corner } as any : {}),
    };
    dragging.current = null; // أوقف السحب العادي
  };

  const onPointerMove = (e: React.PointerEvent) => {
		    // ألغِ الـ long-press لو في حركة واضحة
		    if (longPressRef.current) {
		      const dx = e.clientX - longPressRef.current.startX;
		      const dy = e.clientY - longPressRef.current.startY;
		      if (Math.hypot(dx, dy) > 8) {
		        if (longPressRef.current.timer) clearTimeout(longPressRef.current.timer);
		        longPressRef.current = null;
		      }
		    }
		    // ── تحريك مقابض التكبير/التدوير ──
		    if (handleDragRef.current) {
		      const h = handleDragRef.current;
		      if (h.type === 'rotate') {
		        const angle = Math.atan2(e.clientY - h.centerY, e.clientX - h.centerX);
		        const startAngle = Math.atan2(h.startY - h.centerY, h.startX - h.centerX);
		        let deg = h.startRotation + (angle - startAngle) * (180 / Math.PI);
		        deg = ((deg % 360) + 360) % 360;
		        setElements(prev => prev.map(el => el.id === h.id ? { ...el, rotation: deg } : el));
		      } else if (h.type === 'resize') {
		        const newDist = Math.max(20, Math.hypot(e.clientX - h.centerX, e.clientY - h.centerY));
		        const ratio = newDist / h.startDist;
		        const nextScale = Math.max(0.15, Math.min(5, h.startScale * ratio));
		        setElements(prev => prev.map(el => el.id === h.id ? { ...el, scale: nextScale } : el));
		      }
		      return;
		    }
		    if (!dragging.current) return;
		    const { id, ox, oy } = dragging.current;
		    const nextX = e.clientX - ox;
		    const nextY = e.clientY - oy;
		    setElements(prev => prev.map(el => el.id === id ? { ...el, x: nextX, y: nextY } : el ));
		  };

		  const onPointerUp = () => {
		    if (longPressRef.current?.timer) clearTimeout(longPressRef.current.timer);
		    longPressRef.current = null;
		    if (handleDragRef.current) {
		      pushHistory(elements);
		      handleDragRef.current = null;
		      return;
		    }
		    if (dragging.current) {
		      pushHistory(elements);
		      dragging.current = null;
		    }
		  };

  // ── قائمة السياق (كليك يمين) على العناصر ──
  const onElementContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(id);
    setContextMenu({ x: e.clientX, y: e.clientY, id });
  };

	  // ── Pinch-to-zoom بالبنصرين ──
	  const getTouchDist = (touches: React.TouchList) => {
	    const dx = touches[0].clientX - touches[1].clientX;
	    const dy = touches[0].clientY - touches[1].clientY;
	    return Math.hypot(dx, dy);
	  };

	  const onTouchStart = useCallback((e: React.TouchEvent) => {
	    if (e.touches.length === 2 && selected) {
	      // أوقف الـ long-press عند بدء الـ pinch
	      if (longPressRef.current?.timer) clearTimeout(longPressRef.current.timer);
	      longPressRef.current = null;
	      e.preventDefault();
	      pinchRef.current = {
	        active: true,
	        startDist: Math.max(20, getTouchDist(e.touches)),
	        startScale: elements.find(x => x.id === selected)?.scale ?? 1,
	        id: selected,
	      };
	      // أوقف السحب لما يبدأ الـ pinch
	      dragging.current = null;
	    }
	  }, [selected, elements]);

	  const onTouchMove = useCallback((e: React.TouchEvent) => {
	    if (!pinchRef.current || !pinchRef.current.active || e.touches.length < 2) return;
	    e.preventDefault();
	    const dist = Math.max(20, getTouchDist(e.touches));
	    const ratio = dist / pinchRef.current.startDist;
	    const nextScale = Math.max(0.15, Math.min(5, pinchRef.current.startScale * ratio));
	    const id = pinchRef.current.id;
	    setElements(prev => prev.map(el => el.id === id ? { ...el, scale: nextScale } : el));
	  }, []);

	  const onTouchEnd = useCallback(() => {
	    if (pinchRef.current?.active) {
	      pushHistory(elements);
	      pinchRef.current = null;
	    }
	  }, [elements, pushHistory]);

  const onWheel = useCallback((e: React.WheelEvent) => {
	    if (!selected) return;
	    e.preventDefault();
		    const delta = e.deltaY > 0 ? -0.04 : 0.04;
	    setElements(prev => prev.map(el => {
	      if (el.id !== selected) return el;
	      const nextScale = Math.max(0.15, Math.min(5, el.scale + delta));
	      return { ...el, scale: nextScale };
	    }));
	  }, [selected, setElements]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => addElement({ type:"image", content:ev.target?.result as string, color:"", fontSize:90, bold:false, fontFamily:"" });
    reader.readAsDataURL(file);
  };

  // ── تكبير/تدوير/قلب العنصر المحدد (بدون تثبيت) ──
	  const applyTransform = (id: string, mutate: (el: DesignElement) => Partial<DesignElement>) => {
	    setElements(prev => prev.map(el => {
	      if (el.id !== id) return el;
	      const patch = mutate(el);
	      return { ...el, ...patch };
	    }));
	  };

	  const scaleSelected = (delta: number) => {
	    if (!selected) return;
	    applyTransform(selected, (el) => ({ scale: Math.max(0.15, Math.min(5, el.scale + delta)) }));
	  };
	  const setScaleSelected = (nextScale: number) => {
	    if (!selected) return;
	    applyTransform(selected, () => ({ scale: Math.max(0.15, Math.min(5, nextScale)) }));
	  };
	  const rotateSelected = (deg: number) => {
	    if (!selected) return;
	    applyTransform(selected, (el) => ({ rotation: (el.rotation + deg + 360) % 360 }));
	  };

	  /* ✅ flipSelected يستخدم SafeElement عشان يتجنب خطأ TypeScript */
	  const flipSelected = () => {
	    if (!selected) return;
	    applyTransform(selected, (el) => {
	      const safe = el as SafeElement;
	      return { flipX: !safe.flipX } as Partial<DesignElement>;
	    });
	  };

  const duplicateSelected = () => {
    const el = elements.find(item => item.id === selected);
    if (!el) return;
    const copy = { ...el, id: `${Date.now()}`, x: el.x + 18, y: el.y + 18 };
    const next = [...elements, copy];
    setElements(next); pushHistory(next); setSelected(copy.id);
  };

  // ── ترتيب الطبقات (bring to front / send to back) ──
  const bringToFront = () => {
    if (!selected) return;
    const idx = elements.findIndex(e => e.id === selected);
    if (idx < 0 || idx === elements.length - 1) return;
    const next = [...elements];
    const [item] = next.splice(idx, 1);
    next.push(item);
    setElements(next); pushHistory(next);
  };
  const sendToBack = () => {
    if (!selected) return;
    const idx = elements.findIndex(e => e.id === selected);
    if (idx <= 0) return;
    const next = [...elements];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    setElements(next); pushHistory(next);
  };
  const centerSelected = () => {
    if (!selected) return;
    const b = getPrintBounds();
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    const next = elements.map(el => el.id === selected ? { ...el, x: cx, y: cy } : el);
    setElements(next); pushHistory(next);
  };

  const applyAiResult = useCallback((result: {
    elements: DesignElement[];
    selectedId: string | null;
    productColor?: string;
    view?: "front" | "back";
  }) => {
    setElements(result.elements);
    pushHistory(result.elements);
    setSelected(result.selectedId);
    if (result.productColor) setProdColor(result.productColor);
    if (result.view) setView(result.view);
    setTool("select");
  }, [pushHistory, setElements]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    const prompt = aiPrompt.trim();
    setAiPrompt("");
    try {
      const res = await fetch("/api/customize-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          context: { productLabel: product.label, productColor: prodColor, size, view: view === "back" ? "back" : "front", elements, selectedId: selected },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error);
      applyAiResult(applyAiActions({ productLabel: product.label, productColor: prodColor, size, view: view === "back" ? "back" : "front", elements, selectedId: selected }, data.actions));
    } catch {
      addElement({ type: "text", content: prompt, color: "#1A1A1A", fontSize: 36, bold: true, fontFamily: "Tajawal" });
    }
  };

  const handleAddToCart = async () => {
    let designImageUrl = currentImage || "";
    if (canvasRef.current) {
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(canvasRef.current, { backgroundColor: null, scale: 2, useCORS: true });
        const dataUrl = canvas.toDataURL('image/png');
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const formData = new FormData();
        formData.append('file', blob, `design-${Date.now()}.png`);
        const uploadRes = await fetch('/api/upload?type=design', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.url || uploadData.secure_url) {
          designImageUrl = uploadData.url || uploadData.secure_url;
        }
      } catch (error) {
        console.error("Error capturing design:", error);
      }
    }
    (addToCart as any)({
      id: Date.now(),
      productId: product.id,
      nameAr: `${product.label} مخصص`,
      nameEn: "Custom Item",
      brand: "VŌGU Custom",
      price: liveTotalPrice,
      grad: "from-[#C9A86E] to-[#9A7848]",
      image: designImageUrl,
      customDesignImage: designImageUrl,
      isCustom: true,
      designData: designByView,
      size,
      color: prodColor,
      colorHex: prodColor,
      quantity: 1,
    });
    router.push("/cart");
  };

  const handleExitCustomizer = () => {
    if (elements.length > 0) {
      const leave = window.confirm("لديك تعديلات لم تُضاف للسلة بعد. هل تريد الرجوع؟");
      if (!leave) return;
    }
    if (window.history.length > 1) router.back();
    else router.push("/shop");
  };

  const selectedEl = elements.find(e => e.id === selected) as SafeElement | undefined;

  /* ═══════════════════════════════════════════════════════
     ✅ الفلترة تعمل على StickerItem[] بدل string[]
     ═══════════════════════════════════════════════════════ */
  const STICKERS_PER_PAGE = 12;
  const activeStickerItems: StickerItem[] = (STICKER_PACKS[stickerPack] ?? []).filter((item) =>
    !stickerSearch.trim() || item.label.includes(stickerSearch.trim()) || item.id.includes(stickerSearch.trim().toLowerCase())
  );
  const visibleStickerItems = activeStickerItems.slice(0, stickerPage * STICKERS_PER_PAGE);

  useEffect(() => {
    const el = elements.find((e) => e.id === selected);
    if (el?.type === "text") {
      setTextTool(textToolStateFromElement(el));
      // لا نفتح أداة النص تلقائياً — الخصائص تظهر في الجهة اليمنى
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // ── الصورة/SVG حسب الجانب الحالي (الأربعة جوانب مدعومة) ──
  const currentImage =
    view === "front" ? product.frontImage :
    view === "back" ? product.backImage :
    view === "rightSleeve" ? product.rightSleeveImage :
    product.leftSleeveImage;

  const svgHtml =
    view === "front" ? product.frontSvg(prodColor) :
    view === "back" ? product.backSvg(prodColor) :
    view === "rightSleeve" ? product.rightSleeveSvg(prodColor) :
    product.leftSleeveSvg(prodColor);

  // معاينة مصغّرة لكل جانب
  const viewThumbSvg = (v: DesignView) => {
    const c = prodColor;
    const img =
      v === "front" ? product.frontImage :
      v === "back" ? product.backImage :
      v === "rightSleeve" ? product.rightSleeveImage :
      product.leftSleeveImage;
    // نُرجع نص SVG دائماً للمعاينة المصغّرة (الصور تُعرض داخل thumb بشكل منفصل)
    if (v === "front") return product.frontSvg(c);
    if (v === "back") return product.backSvg(c);
    if (v === "rightSleeve") return product.rightSleeveSvg(c);
    return product.leftSleeveSvg(c);
  };
  const viewThumbImage = (v: DesignView) =>
    v === "front" ? product.frontImage :
    v === "back" ? product.backImage :
    v === "rightSleeve" ? product.rightSleeveImage :
    product.leftSleeveImage;

  // ── دالة رسم محتوى العنصر (نص/استيكر/صورة) ──
  const renderElementContent = (el: DesignElement) => {
    if (el.type === "text") {
      return (
        <div style={{
          ...buildTextCss(el),
          // ✅ امنع الالتفاف عند الحواف — يبقى العنصر كما هو (لا يصبح عمودياً)
          whiteSpace: "pre",
          width: "max-content",
          minWidth: el.textAlign === "center" ? 40 : undefined,
        }}>{el.content}</div>
      );
    }
    if (el.type === "sticker") {
      return (
        <div
          style={{
            width: el.fontSize * 2,
            height: el.fontSize * 2,
            color: el.color || "#1A1A1A",
            opacity: el.opacity ?? 1,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
          }}
          dangerouslySetInnerHTML={{ __html: el.content }}
        />
      );
    }
    // image
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={el.content}
        style={{ width: el.fontSize * 2, height:"auto", pointerEvents:"none" }}
        alt="Design"
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]" dir="rtl" style={{ fontFamily:"Tajawal, sans-serif" }} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      onContextMenu={(e) => { /* امنع القائمة الافتراضية فقط داخل منطقة التصميم */ }}
    >

      {/* ═══ Header ═══ */}
      <div style={{
        borderBottom:"1px solid #E5E7EB",
        padding: isMobile ? "8px 12px" : "10px 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        flexWrap: isMobile ? "wrap" : "nowrap",
        gap: isMobile ? 8 : 0,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap: isMobile ? 8 : 14 }}>
          <button onClick={handleExitCustomizer} style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:5,
            background:"#FAF9F6", border:"1px solid #E5E7EB", color:"#6B7280",
            padding: isMobile ? "7px 10px" : "8px 14px", borderRadius:10,
            fontFamily:"Tajawal, sans-serif", fontWeight:700, fontSize: isMobile ? 11 : 12, cursor:"pointer",
            transition:"all 0.2s", minWidth: isMobile ? 34 : undefined,
          }}>
            {isMobile ? <span style={{fontSize:16}}>→</span> : "رجوع"}
          </button>
          <div>
            <p style={{ fontSize: isMobile ? 7 : 9, color:"#C9A86E", letterSpacing:"0.3em", marginBottom:1 }}>VŌGU CUSTOM</p>
            <h1 style={{ fontFamily:"'Cormorant Garant', serif", fontSize: isMobile ? 15 : 20, fontWeight:400, color:"#1A1A1A", lineHeight:1.2 }}>
              مصمّم الأزياء الشخصي
            </h1>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap: isMobile ? 6 : 8, flexWrap: isMobile ? "wrap" : "nowrap" }}>
          {/* زر تغيير المنتج — بدلاً من شريط الأمامي/الخلفي */}
          <button onClick={() => setCatalogOpen(true)} style={{
            display:"flex", alignItems:"center", gap:5,
            background:"#FAF9F6", border:"1px solid #E5E7EB", color:"#1A1A1A",
            padding: isMobile ? "7px 10px" : "8px 14px", borderRadius:10,
            fontFamily:"Tajawal, sans-serif", fontWeight:700, fontSize: isMobile ? 11 : 12, cursor:"pointer",
            transition:"all 0.2s",
          }}>
            🔄 {isMobile ? "المنتج" : "تغيير المنتج"}
          </button>

          {/* أزرار تراجع / تقدم */}
          <button onClick={undo} style={{
            display:"flex", alignItems:"center", justifyContent:"center",
            background: histIdx > 0 ? "#FAF9F6" : "#F9FAFB", border:"1px solid #E5E7EB",
            color: histIdx > 0 ? "#6B7280" : "#D1D5DB",
            padding: isMobile ? "7px" : "8px 10px", borderRadius:10, cursor: histIdx > 0 ? "pointer" : "default",
            transition:"all 0.2s",
          }} disabled={histIdx <= 0}>
            <RotateCcw size={isMobile ? 13 : 14}/>
          </button>
          <button onClick={redo} style={{
            display:"flex", alignItems:"center", justifyContent:"center",
            background: histIdx < history.length - 1 ? "#FAF9F6" : "#F9FAFB", border:"1px solid #E5E7EB",
            color: histIdx < history.length - 1 ? "#6B7280" : "#D1D5DB",
            padding: isMobile ? "7px" : "8px 10px", borderRadius:10, cursor: histIdx < history.length - 1 ? "pointer" : "default",
            transition:"all 0.2s",
          }} disabled={histIdx >= history.length - 1}>
            <RotateCw size={isMobile ? 13 : 14}/>
          </button>

          {/* زر إضافة للسلة بدلاً من السعر */}
          <button onClick={handleAddToCart} style={{
            display:"flex", alignItems:"center", gap:5,
            background:"linear-gradient(135deg, #C9A86E, #9A7848)",
            color:"#FFFFFF", border:"none",
            padding: isMobile ? "7px 12px" : "8px 18px", borderRadius:10,
            fontFamily:"Tajawal, sans-serif", fontWeight:700, fontSize: isMobile ? 11 : 12,
            cursor:"pointer", boxShadow:"0 4px 16px #C9A86E30",
            transition:"all 0.25s",
          }}>
            <ShoppingBag size={isMobile ? 13 : 14}/>
            {isMobile
              ? `${liveTotalPrice.toLocaleString("ar-EG")} ج.م`
              : `إضافة للسلة — ${liveTotalPrice.toLocaleString("ar-EG")} ج.م`}
          </button>
        </div>
      </div>

      <div style={{ display:"flex", height: isMobile ? "calc(100vh - 110px)" : "calc(100vh - 60px)" }}>

        {/* ═══ Left Panel — hidden on mobile (uses bottom sheet instead) ═══ */}
        {!isMobile && (
        <div style={{
          width:340, background:"#FFFFFF", borderLeft:"1px solid #E5E7EB",
          overflowY:"auto", flexShrink:0,
        }}>
          <div style={{ padding:14, display:"flex", flexDirection:"column", gap:18 }}>

            <button onClick={() => setCatalogOpen(true)} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "#FAF9F6", border: "1px solid #E5E7EB", borderRadius: 10,
              padding: "9px 12px", color: "#1A1A1A", fontSize: 12, fontFamily: "Tajawal, sans-serif",
              fontWeight: 600, cursor: "pointer", transition:"all 0.2s ease",
            }}>🔄 تغيير المنتج</button>

            <Section title="المقاس">
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)} style={{
                    padding:"5px 10px", borderRadius:7, cursor:"pointer",
                    background: size===s ? "#1A1A1A" : "#FAF9F6",
                    border:`1px solid ${size===s ? "#1A1A1A" : "#E5E7EB"}`,
                    color: size===s ? "#FFFFFF" : "#6B7280",
                    fontSize:11, fontFamily:"Tajawal, sans-serif", fontWeight: size===s ? 700 : 400,
                    transition:"all 0.2s ease",
                  }}>{s}</button>
                ))}
              </div>
            </Section>

            <Section title="لون المنتج">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6 }}>
                {activeProductColors.map(c => (
                  <button key={c.hex} onClick={() => setProdColor(c.hex)} title={c.name} style={{
                    width:30, height:30, borderRadius:"50%", background:c.hex, border:"none", cursor:"pointer",
                    outline: prodColor===c.hex ? "2.5px solid #C9A86E" : "2px solid #E5E7EB",
                    outlineOffset: prodColor===c.hex ? 2 : 0,
                    transform: prodColor===c.hex ? "scale(1.15)" : "scale(1)", transition:"all 0.2s",
                  }}/>
                ))}
              </div>
            </Section>

            <div style={{ height:1, background:"#E5E7EB" }}/>

            <Section title="أدوات التصميم">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {([
                  ["text",    "نص",       <Type size={13}/>   ],
                  ["sticker", "ستيكر",    <Smile size={13}/>  ],
                  ["upload",  "رفع صورة", <Upload size={13}/> ],
                  ["ai",      "AI مساعد", <Sparkles size={13}/> ],
                ] as const).map(([v, l, icon]) => (
                  <button key={v} onClick={() => {
                    setTool(v as any);
                    if (v === "ai") setAiPanelOpen(true);
                  }} style={{
                    display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                    padding:"8px 10px", borderRadius:9, cursor:"pointer",
                    background: tool===v ? "#1A1A1A" : "#FAF9F6",
                    border:`1px solid ${tool===v ? "#1A1A1A" : "#E5E7EB"}`,
                    color: tool===v ? "#FFFFFF" : "#6B7280",
                    fontSize:11, fontFamily:"Tajawal, sans-serif", fontWeight: tool===v ? 600 : 400,
                    transition:"all 0.2s ease",
                  }}>{icon}{l}</button>
                ))}
              </div>
            </Section>

            {/* ── AI Tool ── */}
            {tool==="ai" && (
              <div style={{ display:"flex", flexDirection:"column", gap:9, background:"#FEF3C7", padding:12, borderRadius:12, border:"1px solid #C9A86E30" }}>
                <p style={{fontSize: 11, color: "#92400E", margin: 0, fontWeight: 600}}>✨ مساعد الذكاء الاصطناعي</p>
                <p style={{fontSize: 10, color: "#B45309", margin: 0}}>اكتب وصف للتصميم أو الشعار اللي عايزه وهنعملهولك!</p>
                <textarea
                  value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                  rows={2} dir="rtl" placeholder="مثال: اعملي شعار فريق كرة قدم..."
                  style={{
                    background:"#FFFFFF", border:"1px solid #C9A86E50", borderRadius:9,
                    padding:"9px 11px", color:"#1A1A1A", fontSize:13,
                    fontFamily:"Tajawal, sans-serif", outline:"none", resize:"none", width:"100%", boxSizing:"border-box",
                  }}
                />
                <button onClick={handleAiGenerate} style={{
                  width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                  background:"linear-gradient(135deg,#C9A86E,#9A7848)",
                  color:"#FFFFFF", border:"none", borderRadius:9,
                  padding:"10px", fontSize:13, fontFamily:"Tajawal, sans-serif", fontWeight:700, cursor:"pointer",
                }}><Send size={14}/> توليد التصميم</button>
              </div>
            )}

            {/* ── Text Tool ── */}
            {tool==="text" && (
              <TextToolPanel
                state={textTool}
                onChange={updateTextTool}
                onAdd={addText}
                onApplySelected={applyTextToSelected}
                editingSelected={selectedEl?.type === "text"}
              />
            )}

            {/* ═══════════════════════════════════════════════
                ✅ Sticker Tool – يعرض SVG thumbnails حقيقية
                ═══════════════════════════════════════════════ */}
            {tool==="sticker" && (
              <div>
                <button onClick={addQuickDesign} style={{
                  width:"100%", marginBottom:10, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                  background:"linear-gradient(135deg,#1A1A1A,#3F3F46)", color:"#FFFFFF", border:"none", borderRadius:9,
                  padding:"9px 12px", fontSize:12, fontFamily:"Tajawal, sans-serif", fontWeight:700, cursor:"pointer",
                }}>✨ إضافة تصميم VOGU جاهز</button>

                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8, background:"#FAF9F6", border:"1px solid #E5E7EB", borderRadius:9, padding:"7px 9px" }}>
                  <span style={{ color:"#9CA3AF", fontSize:12 }}>⌕</span>
                  <input
                    value={stickerSearch}
                    onChange={(e) => { setStickerSearch(e.target.value); setStickerPage(1); }}
                    placeholder="ابحث عن استيكر..."
                    dir="rtl"
                    style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:12, color:"#1A1A1A", fontFamily:"Tajawal, sans-serif" }}
                  />
                </div>

                {/* ✅ فئات الاستيكرات */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:5, marginBottom:8 }}>
                  {STICKER_CATEGORIES.map(pack => (
                    <button key={pack} onClick={() => { setStickerPack(pack); setStickerPage(1); setStickerSearch(""); }} style={{
                      padding:"7px 8px", borderRadius:9, cursor:"pointer",
                      background: stickerPack===pack ? "#1A1A1A" : "#FAF9F6",
                      border:`1px solid ${stickerPack===pack ? "#1A1A1A" : "#E5E7EB"}`,
                      color: stickerPack===pack ? "#FFFFFF" : "#6B7280",
                      fontSize:10, fontFamily:"Tajawal, sans-serif", fontWeight: stickerPack===pack ? 700 : 400,
                    }}>{pack}</button>
                  ))}
                </div>

                {/* ✅ شبكة الاستيكرات تعرض SVG كـ thumbnail */}
                <div style={{
                  display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:5,
                  maxHeight:300, overflowY:"auto", paddingLeft:2,
                }}>
                  {visibleStickerItems.map(sticker => (
                    <button
                      key={sticker.id}
                      onClick={() => addSticker(sticker)}
                      title={sticker.label}
                      style={{
                        aspectRatio:"1", borderRadius:9, background:"#FAF9F6",
                        border:"1px solid #E5E7EB", cursor:"pointer",
                        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                        padding:4, transition:"all 0.15s", position:"relative", overflow:"hidden",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "#1A1A1A";
                        el.style.transform = "scale(1.08)";
                        el.style.borderColor = "#C9A86E";
                        // عكس لون الـ SVG عند الـ hover
                        const svgEl = el.querySelector("svg");
                        if (svgEl) svgEl.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "#FAF9F6";
                        el.style.transform = "scale(1)";
                        el.style.borderColor = "#E5E7EB";
                        const svgEl = el.querySelector("svg");
                        if (svgEl) svgEl.style.color = "#1A1A1A";
                      }}
                    >
                      <div
                        style={{ width:"100%", height:"70%", color:"#1A1A1A", transition:"color 0.15s" }}
                        dangerouslySetInnerHTML={{ __html: sticker.svg }}
                      />
                      <span style={{
                        fontSize:8, color:"#9CA3AF", marginTop:2, lineHeight:1,
                        fontFamily:"Tajawal, sans-serif", fontWeight:600,
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"100%",
                      }}>
                        {sticker.label}
                      </span>
                    </button>
                  ))}
                </div>

                {visibleStickerItems.length < activeStickerItems.length && (
                  <button onClick={() => setStickerPage(p => p + 1)} style={{
                    width:"100%", marginTop:8, border:"1px solid #E5E7EB", background:"#FAF9F6",
                    color:"#6B7280", borderRadius:9, padding:"8px", fontFamily:"Tajawal, sans-serif", fontSize:11, cursor:"pointer",
                  }}>عرض المزيد ({activeStickerItems.length - visibleStickerItems.length} متبقي)</button>
                )}
                {activeStickerItems.length === 0 && (
                  <p style={{ margin:0, color:"#9CA3AF", fontSize:11, textAlign:"center", fontFamily:"Tajawal, sans-serif" }}>لا توجد نتائج مطابقة</p>
                )}
              </div>
            )}

            {/* ── Upload Tool ── */}
            {tool==="upload" && (
              <div>
                <input ref={fileInput} type="file" accept="image/*" style={{ display:"none" }} onChange={handleImageUpload}/>
                <button onClick={() => fileInput.current?.click()} style={{
                  width:"100%", border:"2px dashed #E5E7EB", borderRadius:12,
                  padding:"28px 0", background:"none", display:"flex", flexDirection:"column",
                  alignItems:"center", gap:8, color:"#6B7280", cursor:"pointer", transition:"all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="#C9A86E"; (e.currentTarget as HTMLElement).style.color="#C9A86E"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="#E5E7EB"; (e.currentTarget as HTMLElement).style.color="#6B7280"; }}>
                  <Upload size={24}/>
                  <span style={{ fontSize:13, fontFamily:"Tajawal, sans-serif" }}>اضغط لرفع صورة</span>
                  <span style={{ fontSize:10, opacity:0.6 }}>PNG · JPG · SVG</span>
                </button>
              </div>
            )}

            {/* ── Selected Element Controls ── */}
            {selectedEl && (
              <div style={{ borderTop:"1px solid #E5E7EB", paddingTop:14, display:"flex", flexDirection:"column", gap:8 }}>
                <p style={{ fontSize:10, color:"#6B7280", fontFamily:"Tajawal, sans-serif" }}>
                  عنصر {selectedEl.type === "sticker" ? "ستيكر SVG" : selectedEl.type === "text" ? "نص" : "صورة"} ← اسحب لتحريكه
                </p>

                {/* ✅ لوحة خصائص الاستيكر */}
                {selectedEl.type === "sticker" && (
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {/* اللون — لوحة موسعة */}
                    <div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ fontSize:10, color:"#9CA3AF", fontFamily:"Tajawal, sans-serif" }}>لون الاستيكر</span>
                        <span style={{ fontSize:9, color:"#C9A86E", fontFamily:"monospace" }}>{selectedEl.color}</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
                        {TEXT_COLORS_EXTENDED.map(c => (
                          <button key={c} onClick={() => {
                            setElements(prev => prev.map(el => el.id === selected ? { ...el, color: c } : el));
                          }} title={c} style={{
                            aspectRatio:"1", borderRadius:"50%", background:c, border:"none", cursor:"pointer",
                            outline: selectedEl.color === c ? "2px solid #C9A86E" : "1.5px solid #E5E7EB",
                            outlineOffset:1, transition:"all 0.15s",
                            transform: selectedEl.color === c ? "scale(1.12)" : "scale(1)",
                          }}/>
                        ))}
                      </div>
                      {/* منتقي لون مخصص */}
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
                        <input
                          type="color"
                          value={selectedEl.color || "#1A1A1A"}
                          onChange={(e) => {
                            setElements(prev => prev.map(el => el.id === selected ? { ...el, color: e.target.value } : el));
                          }}
                          style={{ width:40, height:32, border:"1px solid #E5E7EB", borderRadius:8, cursor:"pointer", padding:2 }}
                        />
                        <span style={{ fontSize:10, color:"#6B7280", fontFamily:"Tajawal, sans-serif" }}>لون مخصص</span>
                      </div>
                    </div>

                    {/* الحجم — سلايدر دقيق */}
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color:"#9CA3AF", fontFamily:"Tajawal, sans-serif" }}>الحجم</span>
                        <span style={{ fontSize:10, color:"#6B7280" }}>{Math.round(selectedEl.scale * 100)}%</span>
                      </div>
                      <input
                        type="range" min={0.15} max={5} step={0.05}
                        value={selectedEl.scale}
                        onChange={(e) => setScaleSelected(Number(e.target.value))}
                        style={{ width:"100%", accentColor:"#C9A86E" }}
                      />
                    </div>

                    {/* الشفافية — سلايدر */}
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color:"#9CA3AF", fontFamily:"Tajawal, sans-serif" }}>الشفافية</span>
                        <span style={{ fontSize:10, color:"#6B7280" }}>{Math.round((selectedEl.opacity ?? 1) * 100)}%</span>
                      </div>
                      <input
                        type="range" min={0.1} max={1} step={0.05}
                        value={selectedEl.opacity ?? 1}
                        onChange={(e) => {
                          setElements(prev => prev.map(el => el.id === selected ? { ...el, opacity: Number(e.target.value) } : el));
                        }}
                        style={{ width:"100%", accentColor:"#C9A86E" }}
                      />
                    </div>
                  </div>
                )}

                {/* أزرار الحجم السريعة (للنص/الصورة) */}
                {selectedEl.type !== "sticker" && (
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <button onClick={() => scaleSelected(-0.05)} style={iconBtn}><Minus size={12}/></button>
                    <span style={{ flex:1, textAlign:"center", fontSize:11, color:"#6B7280", fontFamily:"Tajawal, sans-serif" }}>الحجم {Math.round(selectedEl.scale * 100)}%</span>
                    <button onClick={() => scaleSelected(0.05)} style={iconBtn}><Plus size={12}/></button>
                  </div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
	                  <button onClick={() => rotateSelected(-10)} style={iconBtn}><RotateCcw size={12}/></button>
	                  <span style={{ flex:1, textAlign:"center", fontSize:11, color:"#6B7280", fontFamily:"Tajawal, sans-serif" }}>{selectedEl.rotation}°</span>
	                  <button onClick={() => rotateSelected(10)} style={iconBtn}><RotateCw size={12}/></button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  <button onClick={flipSelected} style={{ ...iconBtn, width:"100%", fontSize:11, fontFamily:"Tajawal, sans-serif" }}>Flip</button>
                  <button onClick={duplicateSelected} style={{ ...iconBtn, width:"100%", fontSize:11, fontFamily:"Tajawal, sans-serif" }}>نسخ</button>
                </div>
                <button onClick={deleteSelected} style={{
                  width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                  border:"1px solid #FCA5A5", borderRadius:9, background:"#FFF5F5", padding:"8px",
                  color:"#DC2626", fontSize:12, fontFamily:"Tajawal, sans-serif", cursor:"pointer",
                  transition:"all 0.2s ease",
                }}>
                  <Trash2 size={12}/> حذف العنصر
                </button>
              </div>
            )}

          </div>
        </div>
        )}{/* end Left Panel desktop */}

        {/* ═══ Center: Canvas ═══ */}
        <div style={{
          flex:1, display:"flex", alignItems:"center", justifyContent:"center",
          background:"#F5F5F0", position:"relative", overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", inset:0, opacity:0.4,
            backgroundImage:`linear-gradient(#E5E7EB 1px,transparent 1px),linear-gradient(90deg,#E5E7EB 1px,transparent 1px)`,
            backgroundSize:"40px 40px",
          }}/>

          <CustomizeAiPanel
            collapsed={!aiPanelOpen}
            isMobile={isMobile}
            onToggleCollapse={() => setAiPanelOpen((open) => !open)}
            context={{
              productLabel: product.label, productColor: prodColor, size,
              view: view === "back" ? "back" : "front", elements, selectedId: selected,
            }}
            onApply={applyAiResult}
          />

          <div
            ref={canvasRef}
            style={{
              position:"relative",
              width: canvasBaseW * sizeScale,
              height: canvasBaseH * sizeScale,
              filter: isMobile ? "drop-shadow(0 12px 24px rgba(0,0,0,0.06))" : "drop-shadow(0 20px 40px rgba(0,0,0,0.08))",
              transition: "width 0.3s, height 0.3s"
            }}
            onWheel={onWheel}
            onClick={() => { setSelected(null); setContextMenu(null); }}
          >
            {/* ═══ طبقة قص (clip-path) — العناصر خارج منطقة الطباعة تُخفى بدون التفاف ═══ */}
            <div style={{
              position:"absolute", inset: 0,
              // ✅ clip-path يخفي الجزء الخارج بدون أن يُجبر المحتوى على الالتفاف
              clipPath: `polygon(${activePrintArea.left}% ${activePrintArea.top}%, ${activePrintArea.left + activePrintArea.width}% ${activePrintArea.top}%, ${activePrintArea.left + activePrintArea.width}% ${activePrintArea.top + activePrintArea.height}%, ${activePrintArea.left}% ${activePrintArea.top + activePrintArea.height}%)`,
              WebkitClipPath: `polygon(${activePrintArea.left}% ${activePrintArea.top}%, ${activePrintArea.left + activePrintArea.width}% ${activePrintArea.top}%, ${activePrintArea.left + activePrintArea.width}% ${activePrintArea.top + activePrintArea.height}%, ${activePrintArea.left}% ${activePrintArea.top + activePrintArea.height}%)`,
              zIndex: 4,
              pointerEvents: "none",
            }}>
            {/* العناصر تُرسم هنا */}
            {elements.map(el => {
              const safeEl = el as SafeElement;
              const isSelected = selected === el.id;
              return (
                <motion.div
                  key={el.id}
                  ref={(node) => {
                    if (node) elementRefs.current.set(el.id, node);
                    else elementRefs.current.delete(el.id);
                  }}
                  onPointerDown={e => onPointerDown(e, el.id)}
                  onContextMenu={e => onElementContextMenu(e, el.id)}
                  onClick={e => { e.stopPropagation(); setSelected(el.id); }}
                  style={{
                    position:"absolute",
                    left: el.x,
                    top: el.y,
                    width: "max-content",
                    height: "max-content",
                    transform:`translate(-50%,-50%) rotate(${el.rotation}deg) scale(${el.scale})${safeEl.flipX ? " scaleX(-1)" : ""}`,
                    cursor: dragging.current?.id === el.id ? "grabbing" : "grab",
                    touchAction:"none",
                    borderRadius: el.type==="image" ? 4 : 0,
                    userSelect:"none", zIndex: isSelected ? 10 : 5,
                    pointerEvents: "auto",
                    // ✅ إطار تحديد مثل customink
                    outline: isSelected ? "2px dashed #C9A86E" : "none",
                    outlineOffset: 6,
                  }}
                >
                  {renderElementContent(el)}
                  {/* ═══ مقابض التحكم (Resize Handles) — تظهر فقط للعنصر المحدد ═══ */}
                  {isSelected && (
                    <>
                      {/* الزاوية العلوية اليمنى */}
                      <div style={{
                        position:"absolute", top:-7, right:-7, width:14, height:14,
                        background:"#C9A86E", border:"2px solid #FFFFFF", borderRadius:3,
                        cursor:"nwse-resize", zIndex:20, pointerEvents:"auto", touchAction:"none",
                      }}
                        onPointerDown={e => { e.stopPropagation(); startHandleDrag(e, el, 'resize', 'tr'); }}
                      />
                      {/* الزاوية السفلية اليسرى */}
                      <div style={{
                        position:"absolute", bottom:-7, left:-7, width:14, height:14,
                        background:"#C9A86E", border:"2px solid #FFFFFF", borderRadius:3,
                        cursor:"nwse-resize", zIndex:20, pointerEvents:"auto", touchAction:"none",
                      }}
                        onPointerDown={e => { e.stopPropagation(); startHandleDrag(e, el, 'resize', 'bl'); }}
                      />
                      {/* الزاوية العلوية اليسرى */}
                      <div style={{
                        position:"absolute", top:-7, left:-7, width:14, height:14,
                        background:"#C9A86E", border:"2px solid #FFFFFF", borderRadius:3,
                        cursor:"nesw-resize", zIndex:20, pointerEvents:"auto", touchAction:"none",
                      }}
                        onPointerDown={e => { e.stopPropagation(); startHandleDrag(e, el, 'resize', 'tl'); }}
                      />
                      {/* الزاوية السفلية اليمنى */}
                      <div style={{
                        position:"absolute", bottom:-7, right:-7, width:14, height:14,
                        background:"#C9A86E", border:"2px solid #FFFFFF", borderRadius:3,
                        cursor:"nesw-resize", zIndex:20, pointerEvents:"auto", touchAction:"none",
                      }}
                        onPointerDown={e => { e.stopPropagation(); startHandleDrag(e, el, 'resize', 'br'); }}
                      />
                      {/* الحافة العلوية */}
                      <div style={{
                        position:"absolute", top:-5, left:"50%", transform:"translateX(-50%)",
                        width:28, height:10, background:"transparent",
                        cursor:"ns-resize", zIndex:20, pointerEvents:"auto", touchAction:"none",
                      }}
                        onPointerDown={e => { e.stopPropagation(); startHandleDrag(e, el, 'resize', 't'); }}
                      />
                      {/* الحافة السفلية */}
                      <div style={{
                        position:"absolute", bottom:-5, left:"50%", transform:"translateX(-50%)",
                        width:28, height:10, background:"transparent",
                        cursor:"ns-resize", zIndex:20, pointerEvents:"auto", touchAction:"none",
                      }}
                        onPointerDown={e => { e.stopPropagation(); startHandleDrag(e, el, 'resize', 'b'); }}
                      />
                      {/* الحافة اليمنى */}
                      <div style={{
                        position:"absolute", top:"50%", right:-5, transform:"translateY(-50%)",
                        width:10, height:28, background:"transparent",
                        cursor:"ew-resize", zIndex:20, pointerEvents:"auto", touchAction:"none",
                      }}
                        onPointerDown={e => { e.stopPropagation(); startHandleDrag(e, el, 'resize', 'r'); }}
                      />
                      {/* الحافة اليسرى */}
                      <div style={{
                        position:"absolute", top:"50%", left:-5, transform:"translateY(-50%)",
                        width:10, height:28, background:"transparent",
                        cursor:"ew-resize", zIndex:20, pointerEvents:"auto", touchAction:"none",
                      }}
                        onPointerDown={e => { e.stopPropagation(); startHandleDrag(e, el, 'resize', 'l'); }}
                      />
                      {/* مقبض التدوير (أعلى العنصر) */}
                      <div style={{
                        position:"absolute", top:-32, left:"50%", transform:"translateX(-50%)",
                        width:22, height:22, background:"#FFFFFF", border:"2px solid #C9A86E",
                        borderRadius:"50%", cursor:"crosshair", zIndex:20,
                        pointerEvents:"auto", touchAction:"none",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        boxShadow:"0 2px 6px rgba(0,0,0,0.15)",
                      }}
                        onPointerDown={e => { e.stopPropagation(); startHandleDrag(e, el, 'rotate'); }}
                      >
                        <RotateCw size={10} style={{color:"#C9A86E"}} />
                      </div>
                      {/* خط الربط بين العنصر ومقبض التدوير */}
                      <div style={{
                        position:"absolute", top:-20, left:"50%", transform:"translateX(-50%)",
                        width:1, height:14, background:"#C9A86E", zIndex:19, pointerEvents:"none",
                      }} />
                    </>
                  )}
                </motion.div>
              );
            })}
            </div>

            {/* Print Area Guide — always visible */}
            <div style={{
              position:"absolute",
              top: `${activePrintArea.top}%`, left: `${activePrintArea.left}%`,
              width: `${activePrintArea.width}%`, height: `${activePrintArea.height}%`,
              border:"2px dashed #C9A86E",
              borderRadius:4, opacity:0.5, pointerEvents:"none", zIndex:1,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <span style={{color:"#C9A86E", fontSize:10, background:"#F5F5F0", padding:"2px 6px", borderRadius:4}}>منطقة الطباعة</span>
            </div>

            {/* Product Image / SVG */}
            {currentImage ? (
              <img src={currentImage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Product" />
            ) : (
              <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: svgHtml }} />
            )}

            {/* ═══════════════════════════════════════════════
                ✅ العناصر تُرسم الآن داخل طبقة الـclip أعلاه.
                   هذا القسم مغلق (تم نقله إلى طبقة القص).
                ═══════════════════════════════════════════════ */}
          </div>
        </div>

        {/* ═══ Right Panel: Properties + View Thumbnails — desktop only ═══ */}
        {!isMobile && (
        <div style={{
          width:200, background:"#FFFFFF", borderRight:"1px solid #E5E7EB",
          padding:14, display:"flex", flexDirection:"column", gap:10,
          flexShrink:0, overflowY:"auto",
        }}>
          {/* ═══ خصائص العنصر المحدد ═══ */}
          <AnimatePresence>
          {selectedEl && (
            <motion.div
              key="props"
              initial={{ opacity:0, x:20 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:20 }}
              transition={{ duration:0.2 }}
              style={{ display:"flex", flexDirection:"column", gap:8 }}
            >
              <p style={{ fontSize:10, color:"#C9A86E", fontWeight:700, fontFamily:"Tajawal, sans-serif", letterSpacing:"0.05em" }}>
                ✏️ خصائص العنصر
              </p>

              {/* لون الاستيكر */}
              {selectedEl.type === "sticker" && (
                <div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:4 }}>
                    {TEXT_COLORS_EXTENDED.slice(0,10).map(c => (
                      <button key={c} onClick={() => {
                        setElements(prev => prev.map(el => el.id === selected ? { ...el, color: c } : el));
                      }} style={{
                        aspectRatio:"1", borderRadius:"50%", background:c, border:"none", cursor:"pointer",
                        outline: selectedEl.color === c ? "2px solid #C9A86E" : "1.5px solid #E5E7EB",
                        outlineOffset:1, transition:"all 0.15s",
                        transform: selectedEl.color === c ? "scale(1.15)" : "scale(1)",
                      }}/>
                    ))}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
                    <input type="color" value={selectedEl.color || "#1A1A1A"} onChange={(e) => {
                      setElements(prev => prev.map(el => el.id === selected ? { ...el, color: e.target.value } : el));
                    }} style={{ width:32, height:26, border:"1px solid #E5E7EB", borderRadius:6, cursor:"pointer", padding:1 }}/>
                    <span style={{ fontSize:9, color:"#9CA3AF", fontFamily:"Tajawal, sans-serif" }}>لون مخصص</span>
                  </div>
                </div>
              )}

              {/* التكبير */}
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <button onClick={() => scaleSelected(-0.05)} style={{...iconBtn, transition:"all 0.15s"}}><Minus size={12}/></button>
                <span style={{ flex:1, textAlign:"center", fontSize:10, color:"#6B7280", fontFamily:"Tajawal, sans-serif" }}>
                  {Math.round(selectedEl.scale * 100)}%
                </span>
                <button onClick={() => scaleSelected(0.05)} style={{...iconBtn, transition:"all 0.15s"}}><Plus size={12}/></button>
              </div>

              {/* الشفافية — للاستيكر */}
              {selectedEl.type === "sticker" && (
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:9, color:"#9CA3AF", fontFamily:"Tajawal, sans-serif" }}>شفافية</span>
                  <input type="range" min={0.1} max={1} step={0.05} value={selectedEl.opacity ?? 1} onChange={(e) => {
                    setElements(prev => prev.map(el => el.id === selected ? { ...el, opacity: Number(e.target.value) } : el));
                  }} style={{ flex:1, accentColor:"#C9A86E" }}/>
                  <span style={{ fontSize:9, color:"#6B7280" }}>{Math.round((selectedEl.opacity ?? 1) * 100)}%</span>
                </div>
              )}

              {/* التدوير */}
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <button onClick={() => rotateSelected(-10)} style={{...iconBtn, transition:"all 0.15s"}}><RotateCcw size={12}/></button>
                <span style={{ flex:1, textAlign:"center", fontSize:10, color:"#6B7280", fontFamily:"Tajawal, sans-serif" }}>
                  {Math.round(selectedEl.rotation)}°
                </span>
                <button onClick={() => rotateSelected(10)} style={{...iconBtn, transition:"all 0.15s"}}><RotateCw size={12}/></button>
              </div>

              {/* أزرار الإجراءات */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                <button onClick={flipSelected} style={{...iconBtn, width:"100%", fontSize:10, fontFamily:"Tajawal, sans-serif", padding:"7px 4px", transition:"all 0.15s"}}>Flip</button>
                <button onClick={duplicateSelected} style={{...iconBtn, width:"100%", fontSize:10, fontFamily:"Tajawal, sans-serif", padding:"7px 4px", transition:"all 0.15s"}}>نسخ</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                <button onClick={bringToFront} style={{...iconBtn, width:"100%", fontSize:10, fontFamily:"Tajawal, sans-serif", padding:"7px 4px", transition:"all 0.15s"}}>أمام</button>
                <button onClick={sendToBack} style={{...iconBtn, width:"100%", fontSize:10, fontFamily:"Tajawal, sans-serif", padding:"7px 4px", transition:"all 0.15s"}}>خلف</button>
              </div>
              <button onClick={centerSelected} style={{...iconBtn, width:"100%", fontSize:10, fontFamily:"Tajawal, sans-serif", padding:"7px 4px", transition:"all 0.15s"}}>
                <Crosshair size={10}/> توسيط
              </button>
              <button onClick={deleteSelected} style={{
                width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                border:"1px solid #FCA5A5", borderRadius:8, background:"#FFF5F5", padding:"7px",
                color:"#DC2626", fontSize:11, fontFamily:"Tajawal, sans-serif", cursor:"pointer",
                transition:"all 0.15s",
              }}>
                <Trash2 size={11}/> حذف
              </button>

              <div style={{ height:1, background:"#E5E7EB", margin:"2px 0" }}/>
            </motion.div>
          )}
          </AnimatePresence>

          <p style={{ fontSize:9, color:"#9CA3AF", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:2, fontFamily:"Tajawal, sans-serif" }}>المعاينة</p>

          {DESIGN_VIEWS.map(v => {
            const hasElements = (designByView[v] ?? []).length > 0;
            return (
              <button
                key={v}
                onClick={() => { setView(v); setSelected(null); }}
                style={{
                  background: view===v ? "#FEF3C7" : "#FAF9F6",
                  border: view===v ? "1.5px solid #C9A86E" : "1px solid #E5E7EB",
                  borderRadius:8, padding:5, cursor:"pointer",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                  transition:"all 0.2s", position:"relative",
                  transform: view===v ? "scale(1.03)" : "scale(1)",
                }}
              >
                <div style={{ width:72, height:90, position:"relative" }}>
                  {viewThumbImage(v) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={viewThumbImage(v)!} alt={v} style={{ width:"100%", height:"100%", objectFit:"contain" }} />
                  ) : (
                    <div style={{ width:"100%", height:"100%", color: prodColor }} dangerouslySetInnerHTML={{ __html: viewThumbSvg(v) }} />
                  )}
                </div>
                <span style={{ fontSize:9, color: view===v ? "#A8823C" : "#6B7280", fontFamily:"Tajawal, sans-serif", fontWeight: view===v ? 700 : 400 }}>
                  {VIEW_LABELS[v]}
                </span>
                {hasElements && (
                  <div style={{
                    position:"absolute", top:4, right:4,
                    width:8, height:8, borderRadius:"50%",
                    background:"#C9A86E",
                  }}/>
                )}
              </button>
            );
          })}

          <div style={{ height:1, background:"#E5E7EB", margin:"2px 0" }}/>

          <button onClick={clearAll} style={{
            width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:4,
            background:"#FFF5F5", border:"1px solid #FCA5A5", borderRadius:8,
            padding:"8px", color:"#DC2626", fontSize:11, fontFamily:"Tajawal, sans-serif", cursor:"pointer",
            transition:"all 0.2s",
          }}><Trash2 size={12}/> مسح الكل</button>

          <div style={{ flex:1 }}/>

          <div style={{
            background:"#FAF9F6", border:"1px solid #E5E7EB", borderRadius:8,
            padding:8, textAlign:"center",
          }}>
            <p style={{ fontSize:8, color:"#9CA3AF", margin:0, fontFamily:"Tajawal, sans-serif" }}>العناصر</p>
            <p style={{ fontSize:18, color:"#1A1A1A", margin:"2px 0 0", fontWeight:700, fontFamily:"Tajawal, sans-serif" }}>
              {allDesignElements.length}
            </p>
          </div>
        </div>
        )}{/* end Right Panel desktop */}
      </div> 

      {/* ═══════════════════════════════════════════════════════
          ✅ MOBILE: Bottom Toolbar + Bottom Sheet + Views Strip
          ═══════════════════════════════════════════════════════ */}
      {isMobile && (
        <>
          {/* ── Views Strip (سطر المعاينات الأفقي فوق شريط الأدوات) ── */}
          <div style={{
            position: "fixed", bottom: 60, right: 0, left: 0, zIndex: 40,
            background: "#FFFFFF", borderTop: "1px solid #E5E7EB",
            padding: "6px 8px", display: "flex", alignItems: "center", gap: 6,
            overflowX: "auto",
          }}>
            <span style={{ fontSize: 8, color: "#9CA3AF", flexShrink: 0, fontFamily: "Tajawal, sans-serif", letterSpacing: "0.1em" }}>المعاينة</span>
            {DESIGN_VIEWS.map(v => {
              const hasElements = (designByView[v] ?? []).length > 0;
              return (
                <motion.button
                  key={v}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => { setView(v); setSelected(null); }}
                  style={{
                    flexShrink: 0, background: view===v ? "#FEF3C7" : "#FAF9F6",
                    border: view===v ? "1.5px solid #C9A86E" : "1px solid #E5E7EB",
                    borderRadius: 7, padding: "3px 8px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4, position: "relative",
                    transform: view===v ? "scale(1.04)" : "scale(1)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ width: 22, height: 28, position: "relative" }}>
                    {viewThumbImage(v) ? (
                      <img src={viewThumbImage(v)!} alt={v} style={{ width:"100%", height:"100%", objectFit:"contain" }} />
                    ) : (
                      <div style={{ width:"100%", height:"100%", color: prodColor }} dangerouslySetInnerHTML={{ __html: viewThumbSvg(v) }} />
                    )}
                  </div>
                  <span style={{ fontSize: 9, color: view===v ? "#A8823C" : "#6B7280", fontFamily: "Tajawal, sans-serif", fontWeight: view===v ? 700 : 400 }}>
                    {VIEW_LABELS[v]}
                  </span>
                  {hasElements && (
                    <span style={{ position:"absolute", top:2, right:2, width:6, height:6, borderRadius:"50%", background:"#C9A86E" }} />
                  )}
                </motion.button>
              );
            })}
            {/* عرض السعر في الشريط */}
            <div style={{ flexShrink:0, marginRight:"auto", display:"flex", alignItems:"center", gap:4,
              background:"#FAF9F6", border:"1px solid #E5E7EB", borderRadius:7, padding:"3px 8px" }}>
              <span style={{ fontSize:9, color:"#9CA3AF", fontFamily:"Tajawal, sans-serif" }}>السعر</span>
              <span style={{ fontSize:11, color:"#A8823C", fontWeight:700, fontFamily:"Tajawal, sans-serif" }}>
                {liveTotalPrice.toLocaleString("ar-EG")} ج.م
              </span>
            </div>
          </div>

          {/* ── Bottom Toolbar (الأيقونات الثابتة) ── */}
          <div style={{
            position: "fixed", bottom: 0, right: 0, left: 0, zIndex: 50,
            background: "#FFFFFF", borderTop: "1px solid #E5E7EB",
            boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
            padding: "6px 4px calc(6px + env(safe-area-inset-bottom, 0px))",
            display: "flex", alignItems: "center", justifyContent: "space-around",
          }}>
            {([
              { key: "size",    label: "مقاس",  icon: <span style={{fontSize:16}}>📏</span>, active: false },
              { key: "color",   label: "لون",   icon: <span style={{fontSize:16}}>🎨</span>, active: false },
              { key: "text",    label: "نص",    icon: <Type size={17}/>, active: tool==="text" },
              { key: "sticker", label: "ستيكر", icon: <Smile size={17}/>, active: tool==="sticker" },
              { key: "upload",  label: "صورة",  icon: <Upload size={16}/>, active: tool==="upload" },
              { key: "ai",      label: "AI",    icon: <Sparkles size={16}/>, active: tool==="ai" },
            ] as const).map((item) => (
              <motion.button
                key={item.key}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => {
                  const k = item.key;
                  if (k === "text" || k === "sticker" || k === "upload" || k === "ai") {
                    setTool(k as any);
                    if (k === "ai") setAiPanelOpen(true);
                    setBottomSheetContent(k as any);
                  } else {
                    setBottomSheetContent(k as any);
                  }
                  setBottomSheetOpen(true);
                }}
                style={{
                  background: item.active ? "#1A1A1A" : "none",
                  color: item.active ? "#FFFFFF" : "#6B7280",
                  border: "none", borderRadius: 9, cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 2, padding: "4px 8px", minWidth: 46, minHeight: 44,
                  fontFamily: "Tajawal, sans-serif", fontSize: 9, fontWeight: item.active ? 700 : 500,
                  transition: "all 0.2s ease",
                }}
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* ── Bottom Sheet (المحتوى المنزلق) ── */}
          <AnimatePresence>
            {bottomSheetOpen && (
              <>
                {/* خلفية معتمة */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setBottomSheetOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.4)" }}
                />
                {/* الـ Sheet نفسه */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 320 }}
                  dir="rtl"
                  style={{
                    position: "fixed", bottom: 0, right: 0, left: 0, zIndex: 61,
                    background: "#FFFFFF", borderRadius: "16px 16px 0 0",
                    maxHeight: "70vh", display: "flex", flexDirection: "column",
                    boxShadow: "0 -8px 32px rgba(0,0,0,0.15)",
                    paddingBottom: "env(safe-area-inset-bottom, 0px)",
                  }}
                >
                  {/* Handle للسحب */}
                  <div
                    onClick={() => setBottomSheetOpen(false)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      padding: "8px 0 4px", cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    <div style={{ width: 40, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
                  </div>

                  {/* رأس الـ Sheet */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "4px 16px 10px", borderBottom: "1px solid #F3F4F6", flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", fontFamily: "Tajawal, sans-serif" }}>
                      {bottomSheetContent === "size" ? "المقاس" :
                       bottomSheetContent === "color" ? "لون المنتج" :
                       bottomSheetContent === "text" ? "أداة النص" :
                       bottomSheetContent === "sticker" ? "الستيكرات" :
                       bottomSheetContent === "upload" ? "رفع صورة" :
                       bottomSheetContent === "ai" ? "مساعد AI" : "العنصر المحدد"}
                    </span>
                    <button onClick={() => setBottomSheetOpen(false)} style={{
                      background: "#F3F4F6", border: "none", borderRadius: "50%",
                      width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "#6B7280",
                    }}>
                      <X size={14}/>
                    </button>
                  </div>

                  {/* محتوى الـ Sheet */}
                  <div style={{ overflowY: "auto", padding: 14, flex: 1 }}>
                    {/* ── المقاس ── */}
                    {bottomSheetContent === "size" && (
                      <>
                        <button onClick={() => setCatalogOpen(true)} style={{
                          width: "100%", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          background: "#FAF9F6", border: "1px solid #E5E7EB", borderRadius: 10,
                          padding: "10px", color: "#1A1A1A", fontSize: 12, fontFamily: "Tajawal, sans-serif",
                          fontWeight: 600, cursor: "pointer",
                        }}>🔄 تغيير المنتج</button>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          {product.sizes.map(s => (
                            <button key={s} onClick={() => setSize(s)} style={{
                              padding:"8px 14px", borderRadius:8, cursor:"pointer",
                              background: size===s ? "#1A1A1A" : "#FAF9F6",
                              border:`1px solid ${size===s ? "#1A1A1A" : "#E5E7EB"}`,
                              color: size===s ? "#FFFFFF" : "#6B7280",
                              fontSize:13, fontFamily:"Tajawal, sans-serif", fontWeight: size===s ? 700 : 500,
                            }}>{s}</button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* ── لون المنتج ── */}
                    {bottomSheetContent === "color" && (
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
                        {activeProductColors.map(c => (
                          <button key={c.hex} onClick={() => setProdColor(c.hex)} title={c.name} style={{
                            aspectRatio:"1", borderRadius:"50%", background:c.hex, border:"none", cursor:"pointer",
                            outline: prodColor===c.hex ? "2.5px solid #C9A86E" : "2px solid #E5E7EB",
                            outlineOffset: prodColor===c.hex ? 2 : 0,
                            transform: prodColor===c.hex ? "scale(1.12)" : "scale(1)", transition:"all 0.2s",
                          }}/>
                        ))}
                      </div>
                    )}

                    {/* ── النص ── */}
                    {bottomSheetContent === "text" && (
                      <TextToolPanel
                        state={textTool}
                        onChange={updateTextTool}
                        onAdd={(e?: any) => { if (e) e.preventDefault?.(); addText(); }}
                        onApplySelected={applyTextToSelected}
                        editingSelected={selectedEl?.type === "text"}
                      />
                    )}

                    {/* ── الستيكرات ── */}
                    {bottomSheetContent === "sticker" && (
                      <div>
                        <button onClick={addQuickDesign} style={{
                          width:"100%", marginBottom:10, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                          background:"linear-gradient(135deg,#1A1A1A,#3F3F46)", color:"#FFFFFF", border:"none", borderRadius:9,
                          padding:"9px 12px", fontSize:12, fontFamily:"Tajawal, sans-serif", fontWeight:700, cursor:"pointer",
                        }}>✨ إضافة تصميم VOGU جاهز</button>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8, background:"#FAF9F6", border:"1px solid #E5E7EB", borderRadius:9, padding:"7px 9px" }}>
                          <span style={{ color:"#9CA3AF", fontSize:12 }}>⌕</span>
                          <input
                            value={stickerSearch}
                            onChange={(e) => { setStickerSearch(e.target.value); setStickerPage(1); }}
                            placeholder="ابحث عن استيكر..."
                            dir="rtl"
                            style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:12, color:"#1A1A1A", fontFamily:"Tajawal, sans-serif" }}
                          />
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:8 }}>
                          {STICKER_CATEGORIES.map(pack => (
                            <button key={pack} onClick={() => { setStickerPack(pack); setStickerPage(1); setStickerSearch(""); }} style={{
                              padding:"7px 6px", borderRadius:9, cursor:"pointer",
                              background: stickerPack===pack ? "#1A1A1A" : "#FAF9F6",
                              border:`1px solid ${stickerPack===pack ? "#1A1A1A" : "#E5E7EB"}`,
                              color: stickerPack===pack ? "#FFFFFF" : "#6B7280",
                              fontSize:10, fontFamily:"Tajawal, sans-serif", fontWeight: stickerPack===pack ? 700 : 400,
                            }}>{pack}</button>
                          ))}
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, maxHeight:260, overflowY:"auto", paddingLeft:2 }}>
                          {visibleStickerItems.map(sticker => (
                            <button
                              key={sticker.id}
                              onClick={() => { addSticker(sticker); }}
                              title={sticker.label}
                              style={{
                                aspectRatio:"1", borderRadius:9, background:"#FAF9F6",
                                border:"1px solid #E5E7EB", cursor:"pointer",
                                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                                padding:4, transition:"all 0.15s", position:"relative", overflow:"hidden",
                              }}
                            >
                              <div style={{ width:"100%", height:"70%", color:"#1A1A1A" }} dangerouslySetInnerHTML={{ __html: sticker.svg }} />
                              <span style={{ fontSize:7, color:"#9CA3AF", marginTop:2, lineHeight:1, fontFamily:"Tajawal, sans-serif", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"100%" }}>
                                {sticker.label}
                              </span>
                            </button>
                          ))}
                        </div>
                        {visibleStickerItems.length < activeStickerItems.length && (
                          <button onClick={() => setStickerPage(p => p + 1)} style={{
                            width:"100%", marginTop:8, border:"1px solid #E5E7EB", background:"#FAF9F6",
                            color:"#6B7280", borderRadius:9, padding:"8px", fontFamily:"Tajawal, sans-serif", fontSize:11, cursor:"pointer",
                          }}>عرض المزيد ({activeStickerItems.length - visibleStickerItems.length} متبقي)</button>
                        )}
                      </div>
                    )}

                    {/* ── رفع صورة ── */}
                    {bottomSheetContent === "upload" && (
                      <div>
                        <input ref={fileInput} type="file" accept="image/*" style={{ display:"none" }} onChange={(e) => { handleImageUpload(e); setBottomSheetOpen(false); }}/>
                        <button onClick={() => fileInput.current?.click()} style={{
                          width:"100%", border:"2px dashed #E5E7EB", borderRadius:12,
                          padding:"36px 0", background:"none", display:"flex", flexDirection:"column",
                          alignItems:"center", gap:8, color:"#6B7280", cursor:"pointer", transition:"all 0.2s",
                        }}>
                          <Upload size={28}/>
                          <span style={{ fontSize:14, fontFamily:"Tajawal, sans-serif" }}>اضغط لرفع صورة</span>
                          <span style={{ fontSize:10, opacity:0.6 }}>PNG · JPG · SVG</span>
                        </button>
                      </div>
                    )}

                    {/* ── AI ── */}
                    {bottomSheetContent === "ai" && (
                      <div style={{ display:"flex", flexDirection:"column", gap:9, background:"#FEF3C7", padding:12, borderRadius:12, border:"1px solid #C9A86E30" }}>
                        <p style={{fontSize: 12, color: "#92400E", margin: 0, fontWeight: 600}}>✨ مساعد الذكاء الاصطناعي</p>
                        <p style={{fontSize: 10, color: "#B45309", margin: 0}}>اكتب وصف للتصميم أو الشعار اللي عايزه وهنعملهولك!</p>
                        <textarea
                          value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                          rows={3} dir="rtl" placeholder="مثال: اعملي شعار فريق كرة قدم..."
                          style={{
                            background:"#FFFFFF", border:"1px solid #C9A86E50", borderRadius:9,
                            padding:"10px 12px", color:"#1A1A1A", fontSize:13,
                            fontFamily:"Tajawal, sans-serif", outline:"none", resize:"none", width:"100%", boxSizing:"border-box",
                          }}
                        />
                        <button onClick={() => { handleAiGenerate(); setBottomSheetOpen(false); }} style={{
                          width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                          background:"linear-gradient(135deg,#C9A86E,#9A7848)",
                          color:"#FFFFFF", border:"none", borderRadius:9,
                          padding:"11px", fontSize:13, fontFamily:"Tajawal, sans-serif", fontWeight:700, cursor:"pointer",
                        }}><Send size={14}/> توليد التصميم</button>
                      </div>
                    )}

                    {/* ── العنصر المحدد (خصائص) ── */}
                    {bottomSheetContent === "selected" && selectedEl && (
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        <p style={{ fontSize:11, color:"#6B7280", fontFamily:"Tajawal, sans-serif", margin:0 }}>
                          عنصر {selectedEl.type === "sticker" ? "ستيكر" : selectedEl.type === "text" ? "نص" : "صورة"}
                        </p>

                        {selectedEl.type === "sticker" && (
                          <>
                            <div>
                              <span style={{ fontSize:10, color:"#9CA3AF", fontFamily:"Tajawal, sans-serif", display:"block", marginBottom:6 }}>لون الاستيكر</span>
                              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
                                {TEXT_COLORS_EXTENDED.map(c => (
                                  <button key={c} onClick={() => { setElements(prev => prev.map(el => el.id === selected ? { ...el, color: c } : el)); }} title={c} style={{
                                    aspectRatio:"1", borderRadius:"50%", background:c, border:"none", cursor:"pointer",
                                    outline: selectedEl.color === c ? "2px solid #C9A86E" : "1.5px solid #E5E7EB",
                                    outlineOffset:1, transition:"all 0.15s",
                                    transform: selectedEl.color === c ? "scale(1.12)" : "scale(1)",
                                  }}/>
                                ))}
                              </div>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
                                <input type="color" value={selectedEl.color || "#1A1A1A"} onChange={(e) => { setElements(prev => prev.map(el => el.id === selected ? { ...el, color: e.target.value } : el)); }} style={{ width:44, height:34, border:"1px solid #E5E7EB", borderRadius:8, cursor:"pointer", padding:2 }}/>
                                <span style={{ fontSize:10, color:"#6B7280", fontFamily:"Tajawal, sans-serif" }}>لون مخصص</span>
                              </div>
                            </div>
                            <div>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                <span style={{ fontSize:10, color:"#9CA3AF", fontFamily:"Tajawal, sans-serif" }}>الحجم</span>
                                <span style={{ fontSize:10, color:"#6B7280" }}>{Math.round(selectedEl.scale * 100)}%</span>
                              </div>
                              <input type="range" min={0.15} max={5} step={0.05} value={selectedEl.scale} onChange={(e) => setScaleSelected(Number(e.target.value))} style={{ width:"100%", accentColor:"#C9A86E" }}/>
                            </div>
                            <div>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                <span style={{ fontSize:10, color:"#9CA3AF", fontFamily:"Tajawal, sans-serif" }}>الشفافية</span>
                                <span style={{ fontSize:10, color:"#6B7280" }}>{Math.round((selectedEl.opacity ?? 1) * 100)}%</span>
                              </div>
                              <input type="range" min={0.1} max={1} step={0.05} value={selectedEl.opacity ?? 1} onChange={(e) => { setElements(prev => prev.map(el => el.id === selected ? { ...el, opacity: Number(e.target.value) } : el)); }} style={{ width:"100%", accentColor:"#C9A86E" }}/>
                            </div>
                          </>
                        )}

                        {selectedEl.type !== "sticker" && (
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <button onClick={() => scaleSelected(-0.05)} style={{...iconBtn, minWidth:40}}><Minus size={14}/></button>
                            <span style={{ flex:1, textAlign:"center", fontSize:12, color:"#6B7280", fontFamily:"Tajawal, sans-serif" }}>الحجم {Math.round(selectedEl.scale * 100)}%</span>
                            <button onClick={() => scaleSelected(0.05)} style={{...iconBtn, minWidth:40}}><Plus size={14}/></button>
                          </div>
                        )}
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <button onClick={() => rotateSelected(-10)} style={{...iconBtn, minWidth:40}}><RotateCcw size={14}/></button>
                          <span style={{ flex:1, textAlign:"center", fontSize:12, color:"#6B7280", fontFamily:"Tajawal, sans-serif" }}>{selectedEl.rotation}°</span>
                          <button onClick={() => rotateSelected(10)} style={{...iconBtn, minWidth:40}}><RotateCw size={14}/></button>
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                          <button onClick={flipSelected} style={{ ...iconBtn, width:"100%", fontSize:12, fontFamily:"Tajawal, sans-serif", padding:"8px" }}>قلب</button>
                          <button onClick={duplicateSelected} style={{ ...iconBtn, width:"100%", fontSize:12, fontFamily:"Tajawal, sans-serif", padding:"8px" }}>نسخ</button>
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                          <button onClick={undo} style={{ ...iconBtn, width:"100%", fontSize:11, fontFamily:"Tajawal, sans-serif", padding:"8px" }}>تراجع</button>
                          <button onClick={redo} style={{ ...iconBtn, width:"100%", fontSize:11, fontFamily:"Tajawal, sans-serif", padding:"8px" }}>إعادة</button>
                          <button onClick={() => { clearAll(); setBottomSheetOpen(false); }} style={{ width:"100%", fontSize:11, fontFamily:"Tajawal, sans-serif", padding:"8px", display:"flex", alignItems:"center", justifyContent:"center", gap:4, border:"1px solid #FCA5A5", borderRadius:8, background:"#FFF5F5", color:"#DC2626", cursor:"pointer" }}><Trash2 size={12}/>مسح</button>
                        </div>
                        <button onClick={() => { deleteSelected(); setBottomSheetOpen(false); }} style={{
                          width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                          border:"1px solid #FCA5A5", borderRadius:9, background:"#FFF5F5", padding:"10px",
                          color:"#DC2626", fontSize:13, fontFamily:"Tajawal, sans-serif", cursor:"pointer",
                        }}>
                          <Trash2 size={14}/> حذف العنصر
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ── زر عائم: خصائص العنصر المحدد ── */}
          {selectedEl && !bottomSheetOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              onClick={() => { setBottomSheetContent("selected"); setBottomSheetOpen(true); }}
              style={{
                position: "fixed", bottom: 124, left: 12, zIndex: 45,
                background: "linear-gradient(135deg,#C9A86E,#9A7848)", color: "#FFFFFF",
                border: "none", borderRadius: 12, padding: "9px 14px",
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 11, fontFamily: "Tajawal, sans-serif", fontWeight: 700,
                boxShadow: "0 4px 16px rgba(168,130,60,0.4)", cursor: "pointer",
              }}
            >
              <Sparkles size={13}/> خصائص
            </motion.button>
          )}
        </>
      )}

      {/* ═══ قائمة السياق (كليك يمين / ضغط مطوّل) مثل customink ═══ */}
      <AnimatePresence>
        {contextMenu && (() => {
          const cmEl = elements.find(e => e.id === contextMenu.id) as SafeElement | undefined;
          if (!cmEl) return null;
          // ضبط الموقع لمنع خروج القائمة من الشاشة
          const menuW = isMobile ? 200 : 220;
          const menuH = isMobile ? 380 : 420;
          const adjustedX = Math.min(contextMenu.x, window.innerWidth - menuW - 8);
          const adjustedY = Math.min(contextMenu.y, window.innerHeight - menuH - 8);
          return (
            <>
              {/* خلفية معتمة */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setContextMenu(null)}
                onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }}
                style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.15)" }}
              />
              {/* القائمة نفسها */}
              <motion.div
                initial={{ opacity:0, scale:0.92, y: -4 }}
                animate={{ opacity:1, scale:1, y:0 }}
                exit={{ opacity:0, scale:0.92, y:-4 }}
                transition={{ duration:0.15, ease:"easeOut" }}
                dir="rtl"
                style={{
                  position:"fixed",
                  left: adjustedX, top: adjustedY,
                  zIndex:101,
                  background:"#FFFFFF",
                  border:"1px solid #E5E7EB",
                  borderRadius:14,
                  boxShadow:"0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(201,168,110,0.1)",
                  padding:"6px",
                  minWidth: menuW,
                  maxHeight: menuH,
                  overflowY:"auto",
                  fontFamily:"Tajawal, sans-serif",
                }}
              >
                {/* رأس القائمة */}
                <div style={{
                  padding:"8px 10px 6px",
                  borderBottom:"1px solid #F3F4F6",
                  marginBottom:4,
                  display:"flex", alignItems:"center", gap:8,
                }}>
                  <div style={{
                    width:32, height:32, borderRadius:8,
                    background:"#FAF9F6", border:"1px solid #E5E7EB",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    {cmEl.type === "text" ? <Type size={14} style={{color:"#6B7280"}}/> :
                     cmEl.type === "sticker" ? <Smile size={14} style={{color:"#6B7280"}}/> :
                     <Upload size={14} style={{color:"#6B7280"}}/>}
                  </div>
                  <div>
                    <p style={{margin:0, fontSize:12, fontWeight:700, color:"#1A1A1A"}}>
                      {cmEl.type === "text" ? "عنصر نص" : cmEl.type === "sticker" ? "ستيكر" : "صورة"}
                    </p>
                    <p style={{margin:0, fontSize:9, color:"#9CA3AF"}}>
                      تكبير {Math.round(cmEl.scale * 100)}% · دوران {Math.round(cmEl.rotation)}°
                    </p>
                  </div>
                </div>

                {/* عنصر القائمة */}
                {([
                  { label:"نسخ العنصر",       icon:<Copy size={14}/>,        action:() => { duplicateSelected(); setContextMenu(null); }, color:"#1A1A1A" },
                  { label:"حذف العنصر",       icon:<Trash2 size={14}/>,      action:() => { deleteSelected(); setContextMenu(null); }, color:"#DC2626" },
                  { divider:true },
                  { label:"قلب أفقي",         icon:<FlipHorizontal size={14}/>, action:() => { flipSelected(); setContextMenu(null); }, color:"#1A1A1A" },
                  { label:"تدوير +10°",       icon:<RotateCw size={14}/>,     action:() => { rotateSelected(10); setContextMenu(null); }, color:"#1A1A1A" },
                  { label:"تدوير -10°",       icon:<RotateCcw size={14}/>,    action:() => { rotateSelected(-10); setContextMenu(null); }, color:"#1A1A1A" },
                  { divider:true },
                  { label:"تكبير أكبر",       icon:<ZoomIn size={14}/>,       action:() => { scaleSelected(0.1); setContextMenu(null); }, color:"#1A1A1A" },
                  { label:"تصغير أصغر",       icon:<ZoomOut size={14}/>,     action:() => { scaleSelected(-0.1); setContextMenu(null); }, color:"#1A1A1A" },
                  { divider:true },
                  { label:"نقل للأمام",       icon:<ChevronsUp size={14}/>,   action:() => { bringToFront(); setContextMenu(null); }, color:"#1A1A1A" },
                  { label:"نقل للخلف",       icon:<ChevronsDown size={14}/>, action:() => { sendToBack(); setContextMenu(null); }, color:"#1A1A1A" },
                  { label:"توسيط في المنطقة", icon:<Crosshair size={14}/>,   action:() => { centerSelected(); setContextMenu(null); }, color:"#1A1A1A" },
                ] as any[]).map((item, i) => {
                  if (item.divider) return <div key={i} style={{ height:1, background:"#F3F4F6", margin:"4px 8px" }} />;
                  return (
                    <button
                      key={i}
                      onClick={item.action}
                      style={{
                        display:"flex", alignItems:"center", gap:10,
                        padding:"9px 10px",
                        borderRadius:10,
                        border:"none",
                        background:"transparent",
                        cursor:"pointer",
                        width:"100%",
                        textAlign:"right",
                        fontFamily:"Tajawal, sans-serif",
                        fontSize: isMobile ? 12 : 12,
                        fontWeight:600,
                        color: item.color,
                        transition:"background 0.1s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#FAF9F6"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <span style={{
                        width:28, height:28, borderRadius:7,
                        background: item.color === "#DC2626" ? "#FEF2F2" : "#F3F4F6",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        flexShrink:0,
                      }}>
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>

      {/* ═══ Product Catalog Modal ═══ */}
      {catalogOpen && (
        <ProductCatalogModal
          open={catalogOpen}
          onClose={() => setCatalogOpen(false)}
          onSelect={(p: CatalogProduct, color) => {
            // ابحث عن المنتج المطابق في القائمة المحمّلة من الـDB
            const match = allProducts.find(fp => fp.id === p.id);
            if (match) {
              setProduct(match);
              setProdColor(color?.hex || match.defaultColor || "#F5F5F0");
              if (!match.sizes.includes(size) && match.sizes.length > 0) {
                setSize(match.sizes[0]);
              }
            }
            setCatalogOpen(false);
          }}
        />
      )}
    </div>
  );
}