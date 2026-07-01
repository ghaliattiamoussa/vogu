// src/components/customize/garmentSvgs.ts
// ─────────────────────────────────────────────────────────────
// رسومات SVG واقعية للمنتجات — نفس الدوال المستخدمة في CustomizePage.tsx
// تم فصلها هنا في ملف مشترك عشان نقدر نستخدمها في ProductCatalogModal
// كمعاينة حقيقية للمنتج، بدل المستطيل الملوّن + كلمة VŌGU
// ─────────────────────────────────────────────────────────────

export const FABRIC_DEFS = `
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
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>`;

export const TSHIRT_FRONT = (color: string) => `
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

  <ellipse cx="210" cy="494" rx="128" ry="8" fill="#000" fill-opacity="0.12"/>
  <path d="M152 40 L88 18 L10 92 L60 142 L94 106" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M268 40 L332 18 L410 92 L360 142 L326 106" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40
    C262 68 238 90 210 90 C182 90 158 68 152 40 Z"
    fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40
    C262 68 238 90 210 90 C182 90 158 68 152 40 Z"
    fill="url(#tf-side)" filter="url(#fabric)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40
    C262 68 238 90 210 90 C182 90 158 68 152 40 Z"
    fill="url(#tf-light)"/>
  <path d="M94 106 L78 440 L342 440 L326 106 L268 40
    C262 68 238 90 210 90 C182 90 158 68 152 40 Z"
    fill="url(#tf-bot)"/>
  <path d="M152 40 L88 18 L10 92 L60 142 L94 106" fill="url(#sl-l)" filter="url(#fabric)"/>
  <path d="M268 40 L332 18 L410 92 L360 142 L326 106" fill="url(#sl-r)" filter="url(#fabric)"/>
  <path d="M154 40 C157 70 180 90 210 90 C240 90 263 70 266 40"
    fill="none" stroke="#00000020" stroke-width="3" stroke-linecap="round"/>
  <path d="M163 46 C166 72 185 87 210 87 C235 87 254 72 257 46"
    fill="none" stroke="#00000010" stroke-width="2"/>
  <path d="M152 40 Q124 72 94 106"  fill="none" stroke="#00000018" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M268 40 Q296 72 326 106" fill="none" stroke="#00000018" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="94"  y1="106" x2="78"  y2="440" stroke="#00000012" stroke-width="1.5"/>
  <line x1="326" y1="106" x2="342" y2="440" stroke="#00000012" stroke-width="1.5"/>
  <line x1="82"  y1="431" x2="338" y2="431" stroke="#00000014" stroke-width="2"/>
  <line x1="82"  y1="436" x2="338" y2="436" stroke="#0000000a" stroke-width="1.5"/>
  <path d="M138 210 C142 228 136 244 140 260" fill="none" stroke="#00000008" stroke-width="3" stroke-linecap="round"/>
  <path d="M282 220 C278 238 284 254 280 270" fill="none" stroke="#00000008" stroke-width="3" stroke-linecap="round"/>
  <path d="M195 320 C199 338 193 350 197 365"  fill="none" stroke="#00000007" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M58 100 C62 114 56 126 60 138" fill="none" stroke="#00000012" stroke-width="2" stroke-linecap="round"/>
  <path d="M362 100 C358 114 364 126 360 138" fill="none" stroke="#00000012" stroke-width="2" stroke-linecap="round"/>
</svg>`;

export const HOODIE_FRONT = (color: string) => `
<svg viewBox="0 0 440 520" xmlns="http://www.w3.org/2000/svg">
  ${FABRIC_DEFS}
  <defs>
    <radialGradient id="hf-light" cx="40%" cy="18%" r="60%">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.0"/>
    </radialGradient>
    <linearGradient id="hf-side" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.32"/>
      <stop offset="16%"  stop-color="#000" stop-opacity="0.10"/>
      <stop offset="50%"  stop-color="#fff" stop-opacity="0.06"/>
      <stop offset="84%"  stop-color="#000" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.32"/>
    </linearGradient>
  </defs>

  <ellipse cx="220" cy="514" rx="136" ry="8" fill="#000" fill-opacity="0.14"/>
  <path d="M156 80 L80 50 L4 140 L70 180 L104 138" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M284 80 L360 50 L436 140 L370 180 L336 138" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M104 138 L88 462 L352 462 L336 138 L284 80
    C276 76 258 68 244 60 C236 52 228 38 220 36
    C212 38 204 52 196 60 C182 68 164 76 156 80 Z"
    fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M104 138 L88 462 L352 462 L336 138 L284 80
    C276 76 258 68 244 60 C236 52 228 38 220 36
    C212 38 204 52 196 60 C182 68 164 76 156 80 Z"
    fill="url(#hf-side)" filter="url(#fabric)"/>
  <path d="M104 138 L88 462 L352 462 L336 138 L284 80
    C276 76 258 68 244 60 C236 52 228 38 220 36
    C212 38 204 52 196 60 C182 68 164 76 156 80 Z"
    fill="url(#hf-light)"/>
  <path d="M156 80 L80 50 L4 140 L70 180 L104 138" fill="#00000020" filter="url(#fabric)"/>
  <path d="M284 80 L360 50 L436 140 L370 180 L336 138" fill="#00000020" filter="url(#fabric)"/>
  <path d="M156 80 C164 76 182 68 196 60 C204 52 212 38 220 36
    C228 38 236 52 244 60 C258 68 276 76 284 80
    C270 50 250 28 220 26 C190 28 170 50 156 80 Z"
    fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M156 80 C164 76 182 68 196 60 C204 52 212 38 220 36
    C228 38 236 52 244 60 C258 68 276 76 284 80
    C270 50 250 28 220 26 C190 28 170 50 156 80 Z"
    fill="#00000025" filter="url(#fabric)"/>
  <path d="M174 74 C185 65 202 54 220 50 C238 54 255 65 266 74"
    fill="none" stroke="#00000022" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="220" y1="80" x2="220" y2="300" stroke="#00000015" stroke-width="2"/>
  <path d="M148 310 C148 290 158 278 220 278 C282 278 292 290 292 310 L292 370 C292 378 284 384 220 384 C156 384 148 378 148 370 Z"
    fill="none" stroke="#00000018" stroke-width="2"/>
  <line x1="220" y1="278" x2="220" y2="384" stroke="#00000012" stroke-width="1.5"/>
  <rect x="88" y="452" width="264" height="10" rx="2" fill="#00000018"/>
  ${[455,458,461].map(y => `<line x1="92" y1="${y}" x2="348" y2="${y}" stroke="#00000008" stroke-width="1"/>`).join("")}
  <line x1="92" y1="138" x2="88" y2="462" stroke="#00000012" stroke-width="1.5"/>
  <line x1="348" y1="138" x2="352" y2="462" stroke="#00000012" stroke-width="1.5"/>
  <path d="M144 240 C148 260 142 276 146 294" fill="none" stroke="#00000008" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M296 250 C292 270 298 286 294 304" fill="none" stroke="#00000008" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

export const POLO_FRONT = (color: string) => `
<svg viewBox="0 0 420 480" xmlns="http://www.w3.org/2000/svg">
  ${FABRIC_DEFS}
  <defs>
    <radialGradient id="pf-light" cx="42%" cy="22%" r="56%">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.0"/>
    </radialGradient>
    <linearGradient id="pf-side" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.28"/>
      <stop offset="14%"  stop-color="#000" stop-opacity="0.09"/>
      <stop offset="50%"  stop-color="#fff" stop-opacity="0.05"/>
      <stop offset="86%"  stop-color="#000" stop-opacity="0.09"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.28"/>
    </linearGradient>
  </defs>

  <ellipse cx="210" cy="474" rx="125" ry="8" fill="#000" fill-opacity="0.12"/>
  <path d="M152 52 L88 26 L18 96 L62 136 L96 104" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M268 52 L332 26 L402 96 L358 136 L324 104" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M96 104 L80 428 L340 428 L324 104 L268 52
    C262 76 240 94 210 94 C180 94 158 76 152 52 Z"
    fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M96 104 L80 428 L340 428 L324 104 L268 52
    C262 76 240 94 210 94 C180 94 158 76 152 52 Z"
    fill="url(#pf-side)" filter="url(#fabric)"/>
  <path d="M96 104 L80 428 L340 428 L324 104 L268 52
    C262 76 240 94 210 94 C180 94 158 76 152 52 Z"
    fill="url(#pf-light)"/>
  <path d="M152 52 L88 26 L18 96 L62 136 L96 104" fill="#00000020" filter="url(#fabric)"/>
  <path d="M268 52 L332 26 L402 96 L358 136 L324 104" fill="#00000020" filter="url(#fabric)"/>
  <path d="M162 52 L188 74 L210 62 L232 74 L258 52 L210 56 Z" fill="${color}"/>
  <path d="M162 52 L188 74 L210 62 L232 74 L258 52 L210 56 Z" fill="#00000022" filter="url(#fabric)"/>
  <path d="M162 52 L188 74 L210 62" fill="none" stroke="#00000020" stroke-width="2"/>
  <path d="M258 52 L232 74 L210 62" fill="none" stroke="#00000020" stroke-width="2"/>
  <path d="M162 52 C172 64 190 72 210 72 C230 72 248 64 258 52"
    fill="none" stroke="#00000018" stroke-width="3" stroke-linecap="round"/>
  <line x1="210" y1="72" x2="210" y2="190" stroke="#00000018" stroke-width="3"/>
  ${[88,106,124,142,160].map(y =>
    `<circle cx="210" cy="${y}" r="3" fill="${color}" stroke="#00000030" stroke-width="1.5"/>`
  ).join("")}
  <line x1="82"  y1="419" x2="338" y2="419" stroke="#00000014" stroke-width="2.5"/>
  <line x1="96"  y1="104" x2="80"  y2="428" stroke="#00000012" stroke-width="1.5"/>
  <line x1="324" y1="104" x2="340" y2="428" stroke="#00000012" stroke-width="1.5"/>
  <path d="M152 52 Q126 76 96 104"  fill="none" stroke="#00000018" stroke-width="2.5"/>
  <path d="M268 52 Q294 76 324 104" fill="none" stroke="#00000018" stroke-width="2.5"/>
</svg>`;

export const LONGSLEEVE_FRONT = (color: string) => `
<svg viewBox="0 0 420 500" xmlns="http://www.w3.org/2000/svg">
  ${FABRIC_DEFS}
  <defs>
    <radialGradient id="ls-light" cx="42%" cy="20%" r="58%">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.0"/>
    </radialGradient>
    <linearGradient id="ls-side" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.30"/>
      <stop offset="14%"  stop-color="#000" stop-opacity="0.10"/>
      <stop offset="50%"  stop-color="#fff" stop-opacity="0.05"/>
      <stop offset="86%"  stop-color="#000" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.30"/>
    </linearGradient>
    <linearGradient id="sl-long-l" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.06"/>
      <stop offset="50%"  stop-color="#000" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.32"/>
    </linearGradient>
    <linearGradient id="sl-long-r" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.06"/>
      <stop offset="50%"  stop-color="#000" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.32"/>
    </linearGradient>
  </defs>

  <ellipse cx="210" cy="494" rx="128" ry="8" fill="#000" fill-opacity="0.12"/>
  <path d="M152 40 L82 22 L8 70 L18 110 L28 330 L82 370 L96 108" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M268 40 L338 22 L412 70 L402 110 L392 330 L338 370 L324 108" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M96 108 L80 440 L340 440 L324 108 L268 40
    C262 68 238 88 210 88 C182 88 158 68 152 40 Z"
    fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M96 108 L80 440 L340 440 L324 108 L268 40
    C262 68 238 88 210 88 C182 88 158 68 152 40 Z"
    fill="url(#ls-side)" filter="url(#fabric)"/>
  <path d="M96 108 L80 440 L340 440 L324 108 L268 40
    C262 68 238 88 210 88 C182 88 158 68 152 40 Z"
    fill="url(#ls-light)"/>
  <path d="M152 40 L82 22 L8 70 L18 110 L28 330 L82 370 L96 108" fill="url(#sl-long-l)" filter="url(#fabric)"/>
  <path d="M268 40 L338 22 L412 70 L402 110 L392 330 L338 370 L324 108" fill="url(#sl-long-r)" filter="url(#fabric)"/>
  <path d="M154 40 C157 68 180 88 210 88 C240 88 263 68 266 40"
    fill="none" stroke="#00000020" stroke-width="3" stroke-linecap="round"/>
  <rect x="20"  y="330" width="62" height="40" rx="6" fill="#00000018"/>
  <rect x="338" y="330" width="62" height="40" rx="6" fill="#00000018"/>
  ${[338,342,346,350,354,358,362,366].map(y =>
    `<line x1="22"  y1="${y}" x2="80"  y2="${y}" stroke="#00000010" stroke-width="0.8"/>
     <line x1="340" y1="${y}" x2="398" y2="${y}" stroke="#00000010" stroke-width="0.8"/>`
  ).join("")}
  <path d="M152 40 Q126 74 96 108"  fill="none" stroke="#00000018" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M268 40 Q294 74 324 108" fill="none" stroke="#00000018" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="96"  y1="108" x2="80"  y2="440" stroke="#00000012" stroke-width="1.5"/>
  <line x1="324" y1="108" x2="340" y2="440" stroke="#00000012" stroke-width="1.5"/>
  <line x1="82"  y1="431" x2="338" y2="431" stroke="#00000014" stroke-width="2"/>
  <path d="M140 210 C144 230 138 248 142 264" fill="none" stroke="#00000008" stroke-width="3" stroke-linecap="round"/>
  <path d="M280 220 C276 240 282 258 278 274" fill="none" stroke="#00000008" stroke-width="3" stroke-linecap="round"/>
</svg>`;

export const CAP_SVG = (color: string) => `
<svg viewBox="0 0 420 340" xmlns="http://www.w3.org/2000/svg">
  ${FABRIC_DEFS}
  <defs>
    <radialGradient id="cap-light" cx="40%" cy="20%" r="65%">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.24"/>
      <stop offset="60%"  stop-color="#fff" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.0"/>
    </radialGradient>
    <radialGradient id="cap-bot" cx="50%" cy="100%" r="55%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.0"/>
    </radialGradient>
    <linearGradient id="brim-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.30"/>
    </linearGradient>
  </defs>

  <ellipse cx="210" cy="330" rx="120" ry="10" fill="#000" fill-opacity="0.14"/>
  <path d="M90 220 C90 240 148 268 210 268 C272 268 330 240 330 220
    L330 236 C330 256 272 284 210 284 C148 284 90 256 90 236 Z"
    fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M44 220 C44 244 118 276 210 276 C302 276 376 244 376 220
    L376 238 C376 262 302 294 210 294 C118 294 44 262 44 238 Z"
    fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M44 220 C44 244 118 276 210 276 C302 276 376 244 376 220
    L376 238 C376 262 302 294 210 294 C118 294 44 262 44 238 Z"
    fill="url(#brim-grad)" filter="url(#fabric)"/>
  <path d="M210 40 C190 40 150 80 100 110 C70 128 60 160 60 190
    C60 210 80 220 100 220 L210 220 Z"
    fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M210 40 C230 40 270 80 320 110 C350 128 360 160 360 190
    C360 210 340 220 320 220 L210 220 Z"
    fill="${color}" filter="url(#shadow-soft)"/>
  <ellipse cx="210" cy="220" rx="150" ry="20" fill="${color}" filter="url(#shadow-soft)"/>
  <path d="M210 40 C190 40 150 80 100 110 C70 128 60 160 60 190 C60 210 80 220 100 220 L210 220 Z"
    fill="#00000022" filter="url(#fabric)"/>
  <path d="M210 40 C230 40 270 80 320 110 C350 128 360 160 360 190 C360 210 340 220 320 220 L210 220 Z"
    fill="#00000010" filter="url(#fabric)"/>
  <ellipse cx="210" cy="220" rx="150" ry="20" fill="url(#cap-light)" filter="url(#fabric)"/>
  <ellipse cx="210" cy="220" rx="150" ry="20" fill="url(#cap-bot)"/>
  <line x1="210" y1="40" x2="210" y2="220" stroke="#00000022" stroke-width="2"/>
  <path d="M210 40 Q145 130 100 220" fill="none" stroke="#00000015" stroke-width="1.5"/>
  <path d="M210 40 Q275 130 320 220" fill="none" stroke="#00000015" stroke-width="1.5"/>
  <path d="M64 200 C90 210 148 218 210 218 C272 218 330 210 356 200"
    fill="none" stroke="#00000018" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="210" cy="42" r="8" fill="${color}" stroke="#00000025" stroke-width="2"/>
  <circle cx="210" cy="42" r="4" fill="#00000020"/>
</svg>`;

// ─── خريطة موحّدة: نوع المنتج ← دالة الرسم ──────────────────────
// ⚠️ المفاتيح هنا لازم تطابق بالضبط PRODUCTS keys في CustomizePage.tsx
// (tshirt | hoodie | polo | longsleeve | cap) — أي مفتاح زيادة هنا
// (pants/shorts/jacket) لسه مفيش رسم ليه، فمتعمدين عدم إضافته
export const GARMENT_SVGS: Record<string, (color: string) => string> = {
  tshirt:     TSHIRT_FRONT,
  hoodie:     HOODIE_FRONT,
  polo:       POLO_FRONT,
  longsleeve: LONGSLEEVE_FRONT,
  cap:        CAP_SVG,
};