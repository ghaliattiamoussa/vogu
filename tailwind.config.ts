import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── ألوان VŌGU — ثيم فاتح (Light Theme) ──────────────────
      colors: {
        vogu: {
          bg:    "#FAFAF8",   // خلفية الصفحة (أبيض دافئ خفيف)
          surf:  "#F5F3EF",   // خلفية surface (كريمي فاتح)
          card:  "#FFFFFF",   // خلفية الكارد (أبيض نقي)
          cardH: "#F7F5F1",   // كارد عند hover (لمسة كريمي خفيفة)
          b1:    "#EAE7E1",   // border خفيف
          b2:    "#DDD9D1",   // border متوسط
          gold:  "#A8823C",   // الذهبي الرئيسي (أغمق ليبان على الأبيض)
          goldL: "#C9A86E",   // ذهبي فاتح (كان الأساسي في الثيم الغامق)
          goldD: "#8A6830",   // ذهبي داكن (تأكيد/hover)
          t1:    "#1A1714",   // نص رئيسي (أسود دافئ)
          t2:    "#6B6560",   // نص ثانوي
          t3:    "#A39E96",   // نص خافت
          ok:    "#3D9960",   // أخضر (نجاح)
          err:   "#C0504D",   // أحمر (خطأ)
        },
      },

      // ── الخطوط ───────────────────────────────────────────────
      fontFamily: {
        tajawal: ["Tajawal", "sans-serif"],
        logo:    ["Cormorant Garant", "serif"],
      },

      // ── الحركات ──────────────────────────────────────────────
      keyframes: {
        "slide-r": {
          from: { transform: "translateX(100%)" },
          to:   { transform: "translateX(0)" },
        },
        "slide-l": {
          from: { transform: "translateX(-100%)" },
          to:   { transform: "translateX(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "slide-r":  "slide-r 0.35s cubic-bezier(0.22,1,0.36,1)",
        "slide-l":  "slide-l 0.35s cubic-bezier(0.22,1,0.36,1)",
        "fade-up":  "fade-up 0.5s ease forwards",
        "fade-in":  "fade-in 0.3s ease",
        marquee:    "marquee 28s linear infinite",
      },

      // ── Border Radius ─────────────────────────────────────────
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      // ── Box Shadow (مخفّفة لتناسب الخلفية الفاتحة) ───────────
      boxShadow: {
        gold:      "0 8px 20px rgba(138,104,48,0.28)",
        "gold-lg": "0 14px 28px rgba(138,104,48,0.38)",
        dark:      "0 10px 28px rgba(26,23,20,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;