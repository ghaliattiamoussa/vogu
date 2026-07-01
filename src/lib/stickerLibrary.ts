export interface StickerItem {
  id: string;
  label: string;
  category: string;
  svg: string;
}

/* ═════════════════════════════════════════════════════════════════════════════════
   VŌGU STICKER LIBRARY — 200+ Professional SVG Stickers
   كل SVG: fill="currentColor" · silhouette style · جاهز للطباعة على الملابس
   ═════════════════════════════════════════════════════════════════════════════════ */

export const STICKER_PACKS: Record<string, StickerItem[]> = {

  /* ══════════════════════════════════════════════════════════════
     الأكثر استخداماً — Top Picks مثل CustomInk
     ══════════════════════════════════════════════════════════════ */
  "الأكثر استخداماً": [
    {
      id: "top-heart-flag", label: "قلب وعلم", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M60 88C35 68 8 50 8 30C8 14 20 4 34 4C43 4 52 9 60 18C68 9 77 4 86 4C100 4 112 14 112 30C112 50 85 68 60 88Z"/><rect x="30" y="22" width="60" height="40" rx="2" fill="white" opacity="0.15"/><line x1="30" y1="32" x2="90" y2="32" stroke="white" stroke-width="2" opacity="0.15"/><line x1="30" y1="42" x2="90" y2="42" stroke="white" stroke-width="2" opacity="0.15"/><line x1="30" y1="52" x2="90" y2="52" stroke="white" stroke-width="2" opacity="0.15"/><line x1="42" y1="22" x2="42" y2="62" stroke="white" stroke-width="2" opacity="0.15"/><line x1="54" y1="22" x2="54" y2="62" stroke="white" stroke-width="2" opacity="0.15"/><line x1="66" y1="22" x2="66" y2="62" stroke="white" stroke-width="2" opacity="0.15"/><line x1="78" y1="22" x2="78" y2="62" stroke="white" stroke-width="2" opacity="0.15"/></svg>`
    },
    {
      id: "top-crown", label: "تاج ملكي", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10 70L10 35L30 50L50 15L60 45L70 15L90 50L110 35L110 70Z"/><rect x="10" y="70" width="100" height="12" rx="3" fill="currentColor"/><circle cx="30" cy="50" r="4" fill="white" opacity="0.3"/><circle cx="50" cy="20" r="4" fill="white" opacity="0.3"/><circle cx="70" cy="20" r="4" fill="white" opacity="0.3"/><circle cx="90" cy="50" r="4" fill="white" opacity="0.3"/><rect x="48" y="70" width="24" height="12" rx="2" fill="white" opacity="0.15"/></svg>`
    },
    {
      id: "top-i-love", label: "I ❤", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 180 70" xmlns="http://www.w3.org/2000/svg"><text x="40" y="52" text-anchor="middle" font-family="Arial Black,Impact,sans-serif" font-size="48" font-weight="900" fill="currentColor">I</text><path fill="currentColor" d="M100 52C88 42 72 34 72 22C72 14 78 8 86 8C91 8 96 11 100 16C104 11 109 8 114 8C122 8 128 14 128 22C128 34 112 42 100 52Z"/><text x="155" y="52" text-anchor="middle" font-family="Arial Black,Impact,sans-serif" font-size="30" font-weight="900" fill="currentColor">NY</text></svg>`
    },
    {
      id: "top-est-badge", label: "EST. 2026 بادج", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="70" r="64" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="70" cy="70" r="56" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="70" y="52" text-anchor="middle" font-family="Georgia,serif" font-size="14" letter-spacing="6" fill="currentColor">ESTABLISHED</text><text x="70" y="82" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="32" font-weight="900" fill="currentColor">2026</text><line x1="30" y1="92" x2="110" y2="92" stroke="currentColor" stroke-width="1.5"/><text x="70" y="108" text-anchor="middle" font-family="Georgia,serif" font-size="8" letter-spacing="3" fill="currentColor">ORIGINAL DESIGN</text></svg>`
    },
    {
      id: "top-star-badge", label: "نجمة بادج", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><polygon points="60,8 73,42 108,42 80,62 90,96 60,76 30,96 40,62 12,42 47,42" fill="currentColor"/><circle cx="60" cy="55" r="18" fill="white" opacity="0.15"/><text x="60" y="62" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="currentColor">★</text></svg>`
    },
    {
      id: "top-ribbon", label: "شريط تزييني", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M0 20L70 0L140 20L140 55L70 75L0 55Z"/><path fill="currentColor" opacity="0.85" d="M20 55L35 95L50 60"/><path fill="currentColor" opacity="0.85" d="M120 55L105 95L90 60"/><rect x="30" y="22" width="80" height="30" rx="2" fill="white" opacity="0.12"/><text x="70" y="44" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="currentColor">PREMIUM</text></svg>`
    },
    {
      id: "top-cross-shield", label: "صليب ودرع", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M50 5L92 22L92 60C92 85 72 105 50 115C28 105 8 85 8 60L8 22Z"/><path fill="white" opacity="0.15" d="M38 30L62 30L62 50L82 50L82 70L62 70L62 95L38 95L38 70L18 70L18 50L38 50Z"/></svg>`
    },
    {
      id: "top-vintage-label", label: "ملصق كلاسيكي", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="192" height="72" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><rect x="10" y="10" width="180" height="60" rx="2" fill="none" stroke="currentColor" stroke-width="1"/><text x="100" y="35" text-anchor="middle" font-family="Georgia,serif" font-size="20" font-weight="700" letter-spacing="4" fill="currentColor">ORIGINAL QUALITY</text><text x="100" y="55" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" letter-spacing="5" fill="currentColor">SINCE 2026</text><circle cx="18" cy="18" r="3" fill="currentColor"/><circle cx="182" cy="18" r="3" fill="currentColor"/><circle cx="18" cy="62" r="3" fill="currentColor"/><circle cx="182" cy="62" r="3" fill="currentColor"/></svg>`
    },
    {
      id: "top-laurel", label: "إكليل غار", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20 80C20 80 30 20 70 8C110 20 120 80 120 80"/><path fill="none" stroke="currentColor" stroke-width="2.5" d="M25 78C25 78 34 24 70 12C106 24 115 78 115 78"/><path fill="currentColor" opacity="0.6" d="M30 65C22 58 18 48 22 40C26 48 30 56 30 65Z"/><path fill="currentColor" opacity="0.6" d="M35 55C25 50 20 40 24 32C28 40 34 48 35 55Z"/><path fill="currentColor" opacity="0.6" d="M42 45C32 42 26 34 28 26C34 32 40 40 42 45Z"/><path fill="currentColor" opacity="0.6" d="M110 65C118 58 122 48 118 40C114 48 110 56 110 65Z"/><path fill="currentColor" opacity="0.6" d="M105 55C115 50 120 40 116 32C112 40 106 48 105 55Z"/><path fill="currentColor" opacity="0.6" d="M98 45C108 42 114 34 112 26C106 32 100 40 98 45Z"/><text x="70" y="62" text-anchor="middle" font-family="Georgia,serif" font-size="14" font-weight="700" letter-spacing="3" fill="currentColor">VOGU</text></svg>`
    },
    {
      id: "top-diamond-ring", label: "ماسة", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 85,30 50,105 15,30" fill="currentColor"/><line x1="15" y1="30" x2="85" y2="30" stroke="white" stroke-width="2" opacity="0.25"/><line x1="50" y1="5" x2="32" y2="30" stroke="white" stroke-width="1.5" opacity="0.2"/><line x1="50" y1="5" x2="68" y2="30" stroke="white" stroke-width="1.5" opacity="0.2"/><line x1="32" y1="30" x2="50" y2="105" stroke="white" stroke-width="1" opacity="0.15"/><line x1="68" y1="30" x2="50" y2="105" stroke="white" stroke-width="1" opacity="0.15"/><line x1="15" y1="30" x2="50" y2="60" stroke="white" stroke-width="1" opacity="0.1"/><line x1="85" y1="30" x2="50" y2="60" stroke="white" stroke-width="1" opacity="0.1"/></svg>`
    },
    {
      id: "top-anchor", label: "مرساة", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="18" r="14" fill="none" stroke="currentColor" stroke-width="5"/><line x1="50" y1="32" x2="50" y2="110" stroke="currentColor" stroke-width="5"/><line x1="20" y1="60" x2="80" y2="60" stroke="currentColor" stroke-width="5"/><path fill="currentColor" d="M20 60L8 78L20 72Z"/><path fill="currentColor" d="M80 60L92 78L80 72Z"/><path fill="currentColor" d="M50 110L38 95L50 100L62 95Z"/></svg>`
    },
    {
      id: "top-wings", label: "أجنحة", category: "الأكثر استخداماً",
      svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M100 50C90 50 75 35 55 20C35 5 15 5 5 15C15 20 25 30 30 40C20 35 10 35 2 40C12 45 22 48 32 50C22 52 12 55 2 60C10 65 20 65 30 60C25 70 15 80 5 85C15 95 35 95 55 80C75 65 90 50 100 50Z"/><path fill="currentColor" d="M100 50C110 50 125 35 145 20C165 5 185 5 195 15C185 20 175 30 170 40C180 35 190 35 198 40C188 45 178 48 168 50C178 52 188 55 198 60C190 65 180 65 170 60C175 70 185 80 195 85C185 95 165 95 145 80C125 65 110 50 100 50Z"/><path fill="white" opacity="0.1" d="M100 50C92 50 80 40 65 28C55 20 42 15 32 18C40 22 48 30 52 38C44 34 36 33 28 36C36 40 44 44 52 46C44 48 36 52 28 56C36 58 44 58 52 55C48 62 40 70 32 74C42 78 55 75 65 66C80 54 92 50 100 50Z"/></svg>`
    },
  ],

  /* ══════════════════════════════════════════════════════════════
     حيوانات — Animal Silhouettes (مفصّلة)
     ══════════════════════════════════════════════════════════════ */
  "حيوانات": [
    {
      id: "anim-lion", label: "أسد", category: "حيوانات",
      svg: `<svg viewBox="0 0 140 130" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M70 15C55 15 42 22 36 32C30 26 20 22 12 25C8 26 6 30 8 34C10 38 15 40 20 39C16 44 14 50 15 56C10 55 5 56 2 60C0 64 2 68 6 69C10 70 15 68 18 65C20 72 25 78 32 82C28 86 26 92 28 97C30 101 35 102 38 100C41 98 42 94 41 90C46 93 52 95 58 95L58 120L65 108L72 120L72 95C78 95 84 93 89 90C88 94 89 98 92 100C95 102 100 101 102 97C104 92 102 86 98 82C105 78 110 72 112 65C115 68 120 70 124 69C128 68 130 64 128 60C125 56 120 55 115 56C116 50 114 44 110 39C115 40 120 38 122 34C124 30 122 26 118 25C110 22 100 26 94 32C88 22 75 15 70 15Z"/><ellipse cx="58" cy="52" rx="4" ry="5" fill="white" opacity="0.2"/><ellipse cx="82" cy="52" rx="4" ry="5" fill="white" opacity="0.2"/><ellipse cx="70" cy="65" rx="10" ry="6" fill="white" opacity="0.1"/><path d="M62 72Q70 78 78 72" fill="none" stroke="white" stroke-width="1.5" opacity="0.15"/></svg>`
    },
    {
      id: "anim-eagle", label: "نسر", category: "حيوانات",
      svg: `<svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M80 18C76 18 68 22 64 28C58 22 50 20 44 24C40 26 38 32 40 36C36 34 30 34 26 38C22 42 24 48 28 50C22 52 16 56 14 62C12 68 16 72 22 72C20 78 22 84 28 88C24 90 22 96 26 100C30 104 36 102 38 98C42 104 48 108 56 108C54 112 56 118 62 120C68 122 72 118 72 114C74 118 78 120 82 118C88 116 90 110 88 106C96 106 104 102 108 96C112 100 118 100 122 96C126 92 124 86 120 84C126 80 130 74 130 66C134 68 140 66 142 62C144 58 140 54 136 52C140 48 142 42 138 38C134 34 128 34 124 36C126 32 124 26 120 24C114 20 106 22 100 28C96 22 88 18 80 18Z"/><circle cx="68" cy="45" r="4" fill="white" opacity="0.25"/><circle cx="92" cy="45" r="4" fill="white" opacity="0.25"/><path d="M74 56L80 62L86 56" fill="none" stroke="white" stroke-width="2" opacity="0.2"/><path d="M50 100L42 118L56 106" fill="currentColor"/><path d="M110 100L118 118L104 106" fill="currentColor"/></svg>`
    },
    {
      id: "anim-wolf", label: "ذئب", category: "حيوانات",
      svg: `<svg viewBox="0 0 130 140" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M65 8L52 32L30 14L38 42L12 38L28 58L8 62L30 68L18 88L40 80L48 102L60 86L65 92L70 86L82 102L90 80L112 88L100 68L122 62L102 58L118 38L92 42L100 14L78 32Z"/><path fill="currentColor" d="M50 52C50 52 55 45 65 45C75 45 80 52 80 52C80 52 82 65 80 75C78 85 72 90 65 90C58 90 52 85 50 75C48 65 50 52 50 52Z"/><ellipse cx="55" cy="58" rx="3.5" ry="4" fill="white" opacity="0.25"/><ellipse cx="75" cy="58" rx="3.5" ry="4" fill="white" opacity="0.25"/><ellipse cx="65" cy="70" rx="6" ry="4" fill="white" opacity="0.1"/><path d="M58 76Q65 82 72 76" fill="none" stroke="white" stroke-width="1.5" opacity="0.15"/><path d="M62 80L65 84L68 80" fill="none" stroke="white" stroke-width="1" opacity="0.12"/></svg>`
    },
    {
      id: "anim-dragon", label: "تنين", category: "حيوانات",
      svg: `<svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M45 25L30 5L42 22L38 8L48 20L50 10L55 22L62 6L60 24L75 12L68 30L88 20L78 36C90 38 100 45 105 55L115 52L112 62L120 58L116 68L125 65L118 75C122 82 120 92 114 100L108 108L100 102L95 110L88 100L82 112L78 100C70 105 60 105 52 100L46 108L42 98L35 105L34 95C28 88 26 78 30 68L22 72L28 62L18 64L26 56L18 55L28 50L22 42L34 46L30 36L42 40Z"/><circle cx="58" cy="48" r="4" fill="white" opacity="0.25"/><circle cx="74" cy="46" r="3.5" fill="white" opacity="0.25"/><path d="M60 56L66 62L72 56" fill="none" stroke="white" stroke-width="2" opacity="0.2"/><path d="M8 52L2 46L6 55L0 54L8 58" fill="currentColor"/><path d="M130 48L138 42L134 52L140 50L132 56" fill="currentColor"/><path d="M15 75L5 72L10 80L2 78L12 84" fill="currentColor"/><path d="M128 72L138 68L132 78L140 76L130 82" fill="currentColor"/></svg>`
    },
    {
      id: "anim-tiger", label: "نمر", category: "حيوانات",
      svg: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M70 12C58 12 48 18 42 28L28 10L36 32L18 18L28 38L10 30L24 48C14 58 10 72 14 86C18 100 30 110 46 114L50 130L58 118L62 132L66 118L70 132L74 118L78 130L82 114C98 110 110 100 114 86C118 72 114 58 104 48L118 30L100 38L110 18L92 32L100 10L86 28C80 18 78 12 70 12Z"/><circle cx="56" cy="52" r="5" fill="white" opacity="0.2"/><circle cx="84" cy="52" r="5" fill="white" opacity="0.2"/><ellipse cx="70" cy="68" rx="8" ry="5" fill="white" opacity="0.1"/><path d="M60 78Q70 86 80 78" fill="none" stroke="white" stroke-width="2.5" opacity="0.15"/><path d="M45 38L40 22" stroke="white" stroke-width="3" opacity="0.12" stroke-linecap="round"/><path d="M95 38L100 22" stroke="white" stroke-width="3" opacity="0.12" stroke-linecap="round"/><path d="M35 55L22 50" stroke="white" stroke-width="3" opacity="0.12" stroke-linecap="round"/><path d="M105 55L118 50" stroke="white" stroke-width="3" opacity="0.12" stroke-linecap="round"/><path d="M38 72L24 72" stroke="white" stroke-width="2.5" opacity="0.1" stroke-linecap="round"/><path d="M102 72L116 72" stroke="white" stroke-width="2.5" opacity="0.1" stroke-linecap="round"/></svg>`
    },
    {
      id: "anim-bear", label: "دب", category: "حيوانات",
      svg: `<svg viewBox="0 0 130 140" xmlns="http://www.w3.org/2000/svg"><ellipse cx="65" cy="80" rx="48" ry="50" fill="currentColor"/><circle cx="28" cy="32" r="22" fill="currentColor"/><circle cx="102" cy="32" r="22" fill="currentColor"/><circle cx="22" cy="28" r="10" fill="white" opacity="0.12"/><circle cx="108" cy="28" r="10" fill="white" opacity="0.12"/><ellipse cx="48" cy="68" r="6" ry="7" fill="white" opacity="0.2"/><ellipse cx="82" cy="68" r="6" ry="7" fill="white" opacity="0.2"/><ellipse cx="65" cy="85" rx="14" ry="10" fill="white" opacity="0.1"/><ellipse cx="58" cy="84" r="4" ry="3" fill="white" opacity="0.15"/><ellipse cx="72" cy="84" r="4" ry="3" fill="white" opacity="0.15"/><path d="M56 94Q65 102 74 94" fill="none" stroke="white" stroke-width="2" opacity="0.15"/><ellipse cx="65" cy="132" rx="30" ry="10" fill="currentColor"/></svg>`
    },
    {
      id: "anim-fox", label: "ثعلب", category: "حيوانات",
      svg: `<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M60 15L42 35L18 8L32 42L8 55L28 68L14 88L36 82L42 108L55 92L60 100L65 92L78 108L84 82L106 88L92 68L112 55L88 42L102 8L78 35Z"/><circle cx="46" cy="55" r="5" fill="white" opacity="0.25"/><circle cx="74" cy="55" r="5" fill="white" opacity="0.25"/><ellipse cx="60" cy="72" rx="8" ry="5" fill="white" opacity="0.12"/><path d="M52 80Q60 87 68 80" fill="none" stroke="white" stroke-width="1.5" opacity="0.15"/></svg>`
    },
    {
      id: "anim-shark", label: "قرش", category: "حيوانات",
      svg: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10 45C20 22 45 10 75 8L82 2L88 12C105 14 130 20 148 45C130 70 105 76 88 78L82 88L75 78C45 76 20 68 10 45Z"/><path fill="white" opacity="0.15" d="M80 20C65 22 50 30 42 42L80 45Z"/><circle cx="52" cy="38" r="4" fill="white" opacity="0.3"/><path d="M95 35L148 45L95 55" fill="white" opacity="0.08"/><path d="M75 8L70 18" stroke="white" stroke-width="1" opacity="0.2"/></svg>`
    },
    {
      id: "anim-horse", label: "حصان", category: "حيوانات",
      svg: `<svg viewBox="0 0 140 150" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M85 10L78 28L68 12L72 30L55 25L65 42L45 40L58 52L38 52L52 62L32 62L48 70L28 68L44 78L30 80L48 86L38 95L55 90L48 105L62 95L58 115L70 100L68 120L78 102L82 120L85 100L95 115L90 95L105 105L98 90L112 95L100 86L115 80L102 78L118 68L100 70L115 62L95 62L110 52L90 52L105 40L85 42L98 25L88 30L92 12Z"/></svg>`
    },
    {
      id: "anim-bull", label: "ثور", category: "حيوانات",
      svg: `<svg viewBox="0 0 140 130" xmlns="http://www.w3.org/2000/svg"><ellipse cx="70" cy="80" rx="52" ry="42" fill="currentColor"/><circle cx="70" cy="45" r="30" fill="currentColor"/><path d="M28 35Q12 18 8 5" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><path d="M112 35Q128 18 132 5" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><circle cx="58" cy="40" r="5" fill="white" opacity="0.2"/><circle cx="82" cy="40" r="5" fill="white" opacity="0.2"/><ellipse cx="70" cy="55" rx="16" ry="10" fill="white" opacity="0.08"/><ellipse cx="62" cy="53" r="5" ry="4" fill="white" opacity="0.15"/><ellipse cx="78" cy="53" r="5" ry="4" fill="white" opacity="0.15"/><path d="M62 65Q70 72 78 65" fill="none" stroke="white" stroke-width="2" opacity="0.12"/></svg>`
    },
    {
      id: "anim-cobra", label: "كوبرا", category: "حيوانات",
      svg: `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M50 5L42 35L12 22L20 48L2 55L22 62L8 82L28 75L32 100L44 88L50 110L56 88L68 100L72 75L92 82L78 62L98 55L80 48L88 22L58 35Z"/><circle cx="40" cy="48" r="4" fill="white" opacity="0.25"/><circle cx="60" cy="48" r="4" fill="white" opacity="0.25"/><ellipse cx="50" cy="60" rx="6" ry="4" fill="white" opacity="0.1"/><path d="M44 66Q50 72 56 66" fill="none" stroke="white" stroke-width="1.5" opacity="0.15"/></svg>`
    },
    {
      id: "anim-elephant", label: "فيل", category: "حيوانات",
      svg: `<svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M80 20C65 20 52 28 45 40C38 35 28 34 22 38C16 42 15 50 18 56C12 58 8 64 10 70C12 76 18 78 24 76C24 82 28 88 34 90L32 115L42 105L40 125L50 112L48 130L58 115L60 130L68 115L66 125L76 112L74 105L84 115L82 90C88 88 94 82 94 76C100 78 106 76 108 70C110 64 106 58 100 56C103 50 102 42 96 38C90 34 80 35 73 40C66 28 80 20 80 20Z"/><circle cx="34" cy="52" r="5" fill="white" opacity="0.2"/><path d="M18 56C16 65 18 75 22 82C18 80 14 75 14 68C14 62 16 58 18 56Z" fill="white" opacity="0.08"/></svg>`
    },
    {
      id: "anim-deer", label: "غزال", category: "حيوانات",
      svg: `<svg viewBox="0 0 130 140" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M65 30L58 8L55 25L48 5L50 22L42 10L48 28L40 18L48 35L35 28L45 42L30 40L42 50L28 55L42 58L32 68L46 65L42 80L55 72L52 88L62 78L65 92L68 78L78 88L75 72L88 80L84 65L98 68L88 58L102 55L88 50L100 40L85 42L95 28L82 35L90 18L82 28L88 10L80 22L82 5L75 25L72 8L65 30Z"/><circle cx="55" cy="52" r="4" fill="white" opacity="0.2"/><circle cx="75" cy="52" r="4" fill="white" opacity="0.2"/><ellipse cx="65" cy="62" rx="5" ry="3" fill="white" opacity="0.1"/><path d="M60 95L56 130L62 110L65 132L68 110L74 130L70 95" fill="currentColor"/><ellipse cx="65" cy="135" rx="22" ry="6" fill="currentColor"/></svg>`
    },
    {
      id: "anim-owl", label: "بومة", category: "حيوانات",
      svg: `<svg viewBox="0 0 110 120" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M55 8L42 28L22 12L32 35L10 30L28 48L8 52L28 58L18 75L38 68L42 90L52 78L55 92L58 78L68 90L72 68L92 75L82 58L102 52L82 48L100 30L78 35L88 12L68 28Z"/><circle cx="40" cy="50" r="12" fill="white" opacity="0.15"/><circle cx="70" cy="50" r="12" fill="white" opacity="0.15"/><circle cx="40" cy="50" r="6" fill="white" opacity="0.25"/><circle cx="70" cy="50" r="6" fill="white" opacity="0.25"/><circle cx="40" cy="49" r="3" fill="currentColor"/><circle cx="70" cy="49" r="3" fill="currentColor"/><path d="M52 65L55 70L58 65" fill="none" stroke="white" stroke-width="1.5" opacity="0.15"/></svg>`
    },
    {
      id: "anim-scorpion", label: "عقرب", category: "حيوانات",
      svg: `<svg viewBox="0 0 150 90" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M140 45C140 38 135 32 128 32C122 32 118 36 116 42L110 40L104 38L98 36L92 35L86 36L80 38L74 40L68 42C66 36 62 32 56 32C49 32 44 38 44 45C44 50 47 55 52 58L48 62L44 65L40 67L36 68L32 68L28 66C25 64 20 64 18 68C16 72 18 76 22 78L28 78L34 76L40 76L46 74L52 70L56 66L58 72L56 80L52 85L48 88L52 90L58 88L62 82L64 75L66 68L70 62L74 58L78 62L82 68L84 75L86 82L90 88L96 90L100 88L96 85L92 80L90 72L88 66L90 60L94 56L98 60L102 65L106 68L110 70L114 72L118 72L122 70L126 68C130 66 134 68 136 72C138 76 136 80 132 78L126 76L120 76L114 74L108 70L104 66L100 62L96 58C100 55 104 50 104 45C104 40 100 36 96 36C92 36 88 40 88 45C88 48 90 52 94 54L90 58L86 54L82 50L78 48L74 46L70 45L66 46L62 48L58 50L54 52L50 54L48 50C50 48 52 46 52 42Z"/></svg>`
    },
    {
      id: "anim-butterfly", label: "فراشة", category: "حيوانات",
      svg: `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M70 20C60 20 48 12 35 15C22 18 12 28 10 42C8 56 15 68 25 75C18 78 12 85 14 92C16 98 22 100 28 98C34 96 38 90 38 84C42 88 48 90 55 88C58 92 62 95 68 95L70 110L72 95C78 95 82 92 85 88C92 90 98 88 102 84C102 90 106 96 112 98C118 100 124 98 126 92C128 85 122 78 115 75C125 68 132 56 130 42C128 28 118 18 105 15C92 12 80 20 70 20Z"/><circle cx="38" cy="42" r="10" fill="white" opacity="0.12"/><circle cx="102" cy="42" r="10" fill="white" opacity="0.12"/><circle cx="30" cy="65" r="8" fill="white" opacity="0.1"/><circle cx="110" cy="65" r="8" fill="white" opacity="0.1"/><rect x="68" y="15" width="4" height="85" rx="2" fill="currentColor"/><path d="M68 15Q60 5 55 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M72 15Q80 5 85 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="55" cy="2" r="2.5" fill="currentColor"/><circle cx="85" cy="2" r="2.5" fill="currentColor"/></svg>`
    },
    {
      id: "anim-crocodile", label: "تمساح", category: "حيوانات",
      svg: `<svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10 40C10 28 22 18 38 18L148 18L155 25L148 32L140 25L132 32L124 25L116 32L108 25L100 32L92 25L84 32L76 25L68 32L60 25L52 32L44 25L38 30C32 32 28 36 26 40C28 46 32 50 38 52L44 58L52 55L60 62L68 58L76 65L84 62L92 68L100 65L108 70L116 68L124 72L132 70L140 72L148 68L155 62L148 55L140 62L132 58L124 62L116 58L108 62L100 58L92 62L84 58L76 62L68 58L60 62L52 58L44 62L38 55C30 55 18 50 10 40Z"/><circle cx="142" cy="26" r="3" fill="white" opacity="0.3"/><circle cx="134" cy="28" r="2.5" fill="white" opacity="0.25"/><path d="M10 40C8 42 6 44 8 46" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`
    },
    {
      id: "anim-phoenix", label: "طائر النار", category: "حيوانات",
      svg: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M70 25C62 25 54 30 50 38C44 32 35 30 28 34C22 38 20 46 24 52C18 54 14 60 16 66C18 72 24 74 30 72C32 80 38 86 46 88L42 105L52 95L48 115L58 102L55 120L65 108L70 125L75 108L85 120L82 102L92 115L88 95L98 105L94 88C102 86 108 80 110 72C116 74 122 72 124 66C126 60 122 54 116 52C120 46 118 38 112 34C105 30 96 32 90 38C86 30 78 25 70 25Z"/><path fill="white" opacity="0.08" d="M70 35C65 35 58 40 55 48C50 44 44 42 40 45C36 48 35 54 38 58C34 60 32 64 34 68C36 72 40 72 44 70L48 72L52 68L56 72L60 68L64 72L68 68L72 72L76 68L80 72L84 68L88 72L92 68L96 70C100 72 104 72 106 68C108 64 106 60 102 58C105 54 104 48 100 45C96 42 90 44 85 48C82 40 75 35 70 35Z"/><circle cx="60" cy="52" r="3.5" fill="white" opacity="0.25"/><circle cx="80" cy="52" r="3.5" fill="white" opacity="0.25"/><path d="M64 62L70 68L76 62" fill="none" stroke="white" stroke-width="1.5" opacity="0.18"/></svg>`
    },
    {
      id: "anim-rhino", label: "خرطوم", category: "حيوانات",
      svg: `<svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M30 50C30 32 44 18 62 18L140 18C145 18 148 22 148 28C148 34 145 38 140 38L130 38L135 45L140 38C145 38 148 42 148 48C148 54 145 58 140 58L125 58L130 65L135 58C140 58 143 62 143 68C143 74 140 78 135 78L60 78C44 78 32 68 30 50Z"/><circle cx="135" cy="28" r="3" fill="white" opacity="0.2"/><path d="M30 50C28 58 25 68 20 75L15 82L22 80L28 85L32 78" fill="currentColor"/><path d="M55 78L52 95L60 85L58 100L66 88" fill="currentColor"/><path d="M85 78L82 95L90 85L88 100L96 88" fill="currentColor"/></svg>`
    },
  ],

  /* ══════════════════════════════════════════════════════════════
     أشكال هندسية — Geometric Shapes
     ══════════════════════════════════════════════════════════════ */
  "أشكال هندسية": [
    {
      id: "geo-diamond", label: "ماسة مزدوجة", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 90,40 50,115 10,40" fill="currentColor"/><polygon points="50,25 75,40 50,90 25,40" fill="white" opacity="0.1"/><line x1="10" y1="40" x2="90" y2="40" stroke="white" stroke-width="2" opacity="0.2"/><line x1="50" y1="5" x2="30" y2="40" stroke="white" stroke-width="1" opacity="0.15"/><line x1="50" y1="5" x2="70" y2="40" stroke="white" stroke-width="1" opacity="0.15"/><line x1="30" y1="40" x2="50" y2="115" stroke="white" stroke-width="1" opacity="0.1"/><line x1="70" y1="40" x2="50" y2="115" stroke="white" stroke-width="1" opacity="0.1"/></svg>`
    },
    {
      id: "geo-hexagon", label: "سداسي مزدوج", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg"><polygon points="55,5 100,28 100,72 55,95 10,72 10,28" fill="currentColor"/><polygon points="55,18 88,35 88,65 55,82 22,65 22,35" fill="white" opacity="0.1"/></svg>`
    },
    {
      id: "geo-triangle", label: "مثلث متداخل", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 110 100" xmlns="http://www.w3.org/2000/svg"><polygon points="55,5 105,90 5,90" fill="currentColor"/><polygon points="55,25 85,80 25,80" fill="white" opacity="0.12"/><polygon points="55,42 72,72 38,72" fill="white" opacity="0.08"/></svg>`
    },
    {
      id: "geo-pentagon", label: "خماسي", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,38 78,90 22,90 5,38" fill="currentColor"/><polygon points="50,18 82,42 70,82 30,82 18,42" fill="white" opacity="0.1"/></svg>`
    },
    {
      id: "geo-cross", label: "صليب سميك", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M35 5L65 5L65 35L95 35L95 65L65 65L65 95L35 95L35 65L5 65L5 35L35 35Z"/></svg>`
    },
    {
      id: "geo-cross-thin", label: "صليب رفيع", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M42 5L58 5L58 42L95 42L95 58L58 58L58 95L42 95L42 58L5 58L5 42L42 42Z"/></svg>`
    },
    {
      id: "geo-arrow-right", label: "سهم يمين", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M5 28L65 28L65 8L115 40L65 72L65 52L5 52Z"/></svg>`
    },
    {
      id: "geo-arrow-up", label: "سهم لأعلى", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M28 115L28 55L8 55L40 5L72 55L52 55L52 115Z"/></svg>`
    },
    {
      id: "geo-lightning", label: "صاعقة مفصلة", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg"><polygon points="52,0 18,55 40,55 32,120 72,58 48,58" fill="currentColor"/><polygon points="52,8 24,52 42,52 36,110 66,60 48,60" fill="white" opacity="0.08"/></svg>`
    },
    {
      id: "geo-shield", label: "درع", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M50 5L90 22L90 55C90 80 72 100 50 110C28 100 10 80 10 55L10 22Z"/><path fill="white" opacity="0.08" d="M50 15L80 28L80 55C80 75 66 92 50 100C34 92 20 75 20 55L20 28Z"/></svg>`
    },
    {
      id: "geo-starburst", label: "انفجار نجمي", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><polygon points="60,0 68,40 110,20 82,50 120,60 82,70 110,100 68,80 60,120 52,80 10,100 38,70 0,60 38,50 10,20 52,40" fill="currentColor"/></svg>`
    },
    {
      id: "geo-octagon", label: "ثماني (وقف)", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="currentColor"/><polygon points="34,12 66,12 88,34 88,66 66,88 34,88 12,66 12,34" fill="white" opacity="0.1"/></svg>`
    },
    {
      id: "geo-circle-frame", label: "إطار دائري", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" stroke-width="2"/></svg>`
    },
    {
      id: "geo-rhombus", label: "إطار معين", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" stroke-width="5"/><polygon points="50,18 82,50 50,82 18,50" fill="none" stroke="currentColor" stroke-width="2"/></svg>`
    },
    {
      id: "geo-chevron", label: "شيفرون", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10 5L50 45L90 5L100 15L50 55L0 15Z"/></svg>`
    },
    {
      id: "geo-double-chevron", label: "شيفرون مزدوج", category: "أشكال هندسية",
      svg: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10 5L50 40L90 5L100 12L50 47L0 12Z" opacity="0.5"/><path fill="currentColor" d="M10 30L50 65L90 30L100 37L50 72L0 37Z"/></svg>`
    },
  ],

  /* ══════════════════════════════════════════════════════════════
     رياضة — Sports
     ══════════════════════════════════════════════════════════════ */
  "رياضة": [
    {
      id: "sport-soccer", label: "كرة قدم", category: "رياضة",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="46" fill="currentColor"/><polygon points="50,14 60,30 56,46 44,46 40,30" fill="white" opacity="0.18"/><polygon points="26,60 38,46 44,46 42,66" fill="white" opacity="0.18"/><polygon points="74,60 62,46 56,46 58,66" fill="white" opacity="0.18"/><polygon points="50,86 42,66 58,66" fill="white" opacity="0.18"/><polygon points="16,36 26,24 40,30 38,46 26,60" fill="white" opacity="0.18"/><polygon points="84,36 74,24 60,30 62,46 74,60" fill="white" opacity="0.18"/></svg>`
    },
    {
      id: "sport-basketball", label: "كرة سلة", category: "رياضة",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="46" fill="currentColor"/><path d="M50 4L50 96" stroke="white" stroke-width="2" opacity="0.25"/><path d="M4 50L96 50" stroke="white" stroke-width="2" opacity="0.25"/><path d="M12 22Q50 50 12 78" fill="none" stroke="white" stroke-width="2" opacity="0.25"/><path d="M88 22Q50 50 88 78" fill="none" stroke="white" stroke-width="2" opacity="0.25"/></svg>`
    },
    {
      id: "sport-trophy", label: "كأس كبير", category: "رياضة",
      svg: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M22 12L22 48C22 66 34 78 50 78C66 78 78 66 78 48L78 12Z"/><path fill="currentColor" d="M22 18L6 18L6 30C6 42 14 48 22 48" opacity="0.9"/><path fill="currentColor" d="M78 18L94 18L94 30C94 42 86 48 78 48" opacity="0.9"/><rect x="44" y="78" width="12" height="14" fill="currentColor"/><rect x="30" y="92" width="40" height="8" rx="3" fill="currentColor"/><rect x="22" y="100" width="56" height="7" rx="3" fill="currentColor"/><path fill="white" opacity="0.1" d="M30 20L30 46C30 60 38 70 50 72L50 20Z"/><text x="50" y="52" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-weight="700" fill="white" opacity="0.3">MVP</text></svg>`
    },
    {
      id: "sport-medal", label: "ميدالية", category: "رياضة",
      svg: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M32 5L50 28L68 5L62 35L85 35L65 50L78 75L50 60L22 75L35 50L15 35L38 35Z"/><circle cx="50" cy="72" r="28" fill="currentColor"/><circle cx="50" cy="72" r="20" fill="none" stroke="white" stroke-width="2" opacity="0.2"/><circle cx="50" cy="72" r="12" fill="none" stroke="white" stroke-width="1" opacity="0.15"/><text x="50" y="78" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="14" font-weight="900" fill="white" opacity="0.3">1</text></svg>`
    },
    {
      id: "sport-dumbbell", label: "دمبل", category: "رياضة",
      svg: `<svg viewBox="0 0 140 60" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="20" width="60" height="20" rx="5" fill="currentColor"/><rect x="15" y="5" width="28" height="50" rx="5" fill="currentColor"/><rect x="97" y="5" width="28" height="50" rx="5" fill="currentColor"/><rect x="5" y="12" width="12" height="36" rx="4" fill="currentColor"/><rect x="123" y="12" width="12" height="36" rx="4" fill="currentColor"/><rect x="15" y="10" width="28" height="4" rx="2" fill="white" opacity="0.1"/><rect x="97" y="10" width="28" height="4" rx="2" fill="white" opacity="0.1"/></svg>`
    },
    {
      id: "sport-runner", label: "عدّاء", category: "رياضة",
      svg: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><circle cx="62" cy="12" r="9" fill="currentColor"/><path fill="currentColor" d="M58 24L50 52L34 44L26 54L48 64L52 76L36 100L48 104L68 78L72 60L84 52L92 60L98 52L82 42L74 30Z"/><path fill="none" stroke="currentColor" stroke-width="2" d="M48 64L58 72L68 78" opacity="0.3"/></svg>`
    },
    {
      id: "sport-whistle", label: "صفّارة", category: "رياضة",
      svg: `<svg viewBox="0 0 110 70" xmlns="http://www.w3.org/2000/svg"><circle cx="38" cy="35" r="30" fill="currentColor"/><rect x="65" y="24" width="38" height="22" rx="5" fill="currentColor"/><circle cx="38" cy="35" r="12" fill="white" opacity="0.12"/><rect x="60" y="46" width="5" height="20" rx="2.5" fill="currentColor"/><circle cx="72" cy="35" r="3" fill="white" opacity="0.15"/></svg>`
    },
    {
      id: "sport-boxing-glove", label: "قفاز ملاكمة", category: "رياضة",
      svg: `<svg viewBox="0 0 90 110" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M45 8C38 8 32 12 30 18L25 15C20 12 14 14 12 20C10 26 12 32 18 35L15 38C10 40 8 46 10 52C12 58 18 60 24 58L22 62C18 66 18 72 22 76C26 80 32 80 36 76L38 82C36 88 38 95 44 98C50 101 56 98 58 92L60 98C62 104 68 106 72 102C76 98 76 92 72 88L70 82C74 80 78 76 78 70C78 64 74 60 68 58L72 52C78 50 80 44 78 38C76 32 70 30 64 32L68 25C72 20 70 12 64 10C58 8 52 10 50 16L48 22C46 18 44 8 45 8Z"/><line x1="38" y1="68" x2="52" y2="68" stroke="white" stroke-width="2" opacity="0.15"/></svg>`
    },
    {
      id: "sport-baseball-bat", label: "مضرب بيسبول", category: "رياضة",
      svg: `<svg viewBox="0 0 50 140" xmlns="http://www.w3.org/2000/svg"><ellipse cx="25" cy="28" rx="16" ry="25" fill="currentColor"/><rect x="18" y="48" width="14" height="72" rx="7" fill="currentColor"/><rect x="20" y="115" width="10" height="18" rx="4" fill="currentColor"/><ellipse cx="25" cy="28" rx="8" ry="14" fill="white" opacity="0.06"/></svg>`
    },
    {
      id: "sport-tennis", label: "مضرب تنس", category: "رياضة",
      svg: `<svg viewBox="0 0 60 120" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="35" rx="26" ry="32" fill="none" stroke="currentColor" stroke-width="4.5"/><line x1="30" y1="6" x2="30" y2="64" stroke="currentColor" stroke-width="1.5" opacity="0.4"/><line x1="7" y1="35" x2="53" y2="35" stroke="currentColor" stroke-width="1.5" opacity="0.4"/><line x1="12" y1="17" x2="48" y2="53" stroke="currentColor" stroke-width="1.5" opacity="0.4"/><line x1="48" y1="17" x2="12" y2="53" stroke="currentColor" stroke-width="1.5" opacity="0.4"/><rect x="26" y="64" width="8" height="48" rx="4" fill="currentColor"/></svg>`
    },
    {
      id: "sport-football", label: "كرة أمريكية", category: "رياضة",
      svg: `<svg viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="35" rx="55" ry="30" fill="currentColor"/><path d="M60 5L60 65" stroke="white" stroke-width="2" opacity="0.2"/><path d="M30 12Q28 35 30 58" fill="none" stroke="white" stroke-width="1.5" opacity="0.15"/><path d="M90 12Q92 35 90 58" fill="none" stroke="white" stroke-width="1.5" opacity="0.15"/><line x1="42" y1="8" x2="42" y2="15" stroke="white" stroke-width="2" opacity="0.15"/><line x1="78" y1="8" x2="78" y2="15" stroke="white" stroke-width="2" opacity="0.15"/><line x1="42" y1="55" x2="42" y2="62" stroke="white" stroke-width="2" opacity="0.15"/><line x1="78" y1="55" x2="78" y2="62" stroke="white" stroke-width="2" opacity="0.15"/></svg>`
    },
    {
      id: "sport-swimmer", label: "سبّاح", category: "رياضة",
      svg: `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg"><circle cx="95" cy="18" r="10" fill="currentColor"/><path fill="currentColor" d="M88 30L70 35L50 28L30 35L10 30L5 38L25 44L45 38L65 45L85 40L100 42L105 35Z"/><path fill="currentColor" d="M50 38L35 55L25 65L35 62L48 50L55 60L65 68L70 62L60 48Z" opacity="0.7"/></svg>`
    },
    {
      id: "sport-cyclist", label: "درّاج", category: "رياضة",
      svg: `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="65" r="18" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="92" cy="65" r="18" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="28" cy="65" r="3" fill="currentColor"/><circle cx="92" cy="65" r="3" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="3.5" d="M28 65L55 40L75 40L92 65"/><path fill="none" stroke="currentColor" stroke-width="3.5" d="M55 40L45 65L28 65"/><path fill="none" stroke="currentColor" stroke-width="3" d="M55 40L58 25L72 25"/><circle cx="60" cy="22" r="7" fill="currentColor"/></svg>`
    },
    {
      id: "sport-skateboard", label: "سكيت بورد", category: "رياضة",
      svg: `<svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="28" rx="52" ry="8" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="25" cy="38" r="6" fill="currentColor"/><circle cx="95" cy="38" r="6" fill="currentColor"/><circle cx="25" cy="38" r="2.5" fill="white" opacity="0.2"/><circle cx="95" cy="38" r="2.5" fill="white" opacity="0.2"/><rect x="30" y="26" width="60" height="4" rx="2" fill="white" opacity="0.08"/></svg>`
    },
  ],

  /* ══════════════════════════════════════════════════════════════
     طبيعة — Nature
     ══════════════════════════════════════════════════════════════ */
  "طبيعة": [
    {
      id: "nat-sun", label: "شمس مشعّة", category: "طبيعة",
      svg: `<svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg"><circle cx="55" cy="55" r="20" fill="currentColor"/><g fill="currentColor"><rect x="52" y="2" width="6" height="18" rx="3"/><rect x="52" y="90" width="6" height="18" rx="3"/><rect x="2" y="52" width="18" height="6" rx="3"/><rect x="90" y="52" width="18" height="6" rx="3"/><rect x="16" y="16" width="6" height="16" rx="3" transform="rotate(-45 19 24)"/><rect x="88" y="16" width="6" height="16" rx="3" transform="rotate(45 91 24)"/><rect x="16" y="78" width="6" height="16" rx="3" transform="rotate(45 19 86)"/><rect x="88" y="78" width="6" height="16" rx="3" transform="rotate(-45 91 86)"/></g><circle cx="55" cy="55" r="14" fill="white" opacity="0.08"/></svg>`
    },
    {
      id: "nat-moon", label: "هلال", category: "طبيعة",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M65 5C42 5 22 25 22 50C22 75 42 95 65 95C50 88 38 72 38 50C38 28 50 12 65 5Z"/><circle cx="80" cy="18" r="2" fill="currentColor" opacity="0.5"/><circle cx="90" cy="35" r="1.5" fill="currentColor" opacity="0.4"/><circle cx="85" cy="55" r="1" fill="currentColor" opacity="0.3"/></svg>`
    },
    {
      id: "nat-mountain-range", label: "سلسلة جبال", category: "طبيعة",
      svg: `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><polygon points="40,8 75,78 5,78" fill="currentColor"/><polygon points="90,18 130,78 50,78" fill="currentColor" opacity="0.85"/><polygon points="120,25 155,78 85,78" fill="currentColor" opacity="0.7"/><polygon points="60,25 72,10 84,25" fill="white" opacity="0.2"/><polygon points="108,35 118,22 128,35" fill="white" opacity="0.15"/></svg>`
    },
    {
      id: "nat-wave", label: "موجة محيط", category: "طبيعة",
      svg: `<svg viewBox="0 0 140 70" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M0 35Q17 10 35 30Q52 50 70 30Q87 10 105 30Q122 50 140 30L140 70L0 70Z"/><path fill="currentColor" opacity="0.5" d="M0 48Q17 28 35 42Q52 56 70 42Q87 28 105 42Q122 56 140 42L140 70L0 70Z"/><path fill="currentColor" opacity="0.3" d="M0 58Q17 45 35 52Q52 60 70 52Q87 45 105 52Q122 60 140 52L140 70L0 70Z"/></svg>`
    },
    {
      id: "nat-palm", label: "نخلة", category: "طبيعة",
      svg: `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg"><rect x="46" y="55" width="8" height="68" rx="4" fill="currentColor" transform="rotate(-2 50 90)"/><path fill="currentColor" d="M50 55Q18 32 5 8Q32 25 50 42Q38 14 25 -2Q42 16 50 38Q55 12 70 -2Q60 14 50 38Q68 16 95 -2Q78 14 50 42Q72 25 95 8Q82 32 50 55Z"/><path fill="white" opacity="0.06" d="M50 55Q30 40 20 20Q35 32 50 45Z"/></svg>`
    },
    {
      id: "nat-flower", label: "زهرة", category: "طبيعة",
      svg: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="28" rx="16" ry="20" fill="currentColor" transform="rotate(0 50 28)"/><ellipse cx="50" cy="28" rx="16" ry="20" fill="currentColor" transform="rotate(60 50 28)"/><ellipse cx="50" cy="28" rx="16" ry="20" fill="currentColor" transform="rotate(120 50 28)"/><ellipse cx="50" cy="28" rx="16" ry="20" fill="currentColor" transform="rotate(180 50 28)"/><ellipse cx="50" cy="28" rx="16" ry="20" fill="currentColor" transform="rotate(240 50 28)"/><ellipse cx="50" cy="28" rx="16" ry="20" fill="currentColor" transform="rotate(300 50 28)"/><circle cx="50" cy="28" r="12" fill="white" opacity="0.12"/><rect x="48" y="45" width="4" height="55" rx="2" fill="currentColor"/><path fill="currentColor" d="M48 70L35 62L48 65Z"/><path fill="currentColor" d="M52 80L65 72L52 75Z"/></svg>`
    },
    {
      id: "nat-leaf", label: "ورقة", category: "طبيعة",
      svg: `<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M40 5C18 15 5 42 10 68C15 88 30 100 40 105C50 100 65 88 70 68C75 42 62 15 40 5Z"/><path d="M40 15L40 95" stroke="white" stroke-width="2" opacity="0.15"/><path d="M40 30L22 40" stroke="white" stroke-width="1.5" opacity="0.1"/><path d="M40 30L58 40" stroke="white" stroke-width="1.5" opacity="0.1"/><path d="M40 48L18 56" stroke="white" stroke-width="1.5" opacity="0.1"/><path d="M40 48L62 56" stroke="white" stroke-width="1.5" opacity="0.1"/><path d="M40 65L20 72" stroke="white" stroke-width="1.5" opacity="0.1"/><path d="M40 65L60 72" stroke="white" stroke-width="1.5" opacity="0.1"/></svg>`
    },
    {
      id: "nat-cloud", label: "سحابة", category: "طبيعة",
      svg: `<svg viewBox="0 0 140 75" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M30 58C12 58 0 48 0 35C0 22 12 12 28 12C30 5 40 0 52 0C68 0 80 8 82 22C84 20 88 18 92 18C105 18 115 28 115 40C115 52 105 58 92 58Z"/><path fill="white" opacity="0.06" d="M30 55C16 55 6 47 6 37C6 27 16 19 28 19C30 13 38 9 48 9C60 9 70 15 72 26C74 24 77 23 80 23C90 23 98 31 98 40C98 49 90 55 80 55Z"/></svg>`
    },
    {
      id: "nat-fire", label: "نار", category: "طبيعة",
      svg: `<svg viewBox="0 0 90 120" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M45 5C45 5 15 42 15 70C15 92 28 108 45 115C62 108 75 92 75 70C75 42 45 5 45 5Z"/><path fill="white" opacity="0.1" d="M45 30C45 30 28 55 28 70C28 84 35 94 45 98C55 94 62 84 62 70C62 55 45 30 45 30Z"/><path fill="white" opacity="0.08" d="M45 55C45 55 36 68 36 76C36 84 40 90 45 92C50 90 54 84 54 76C54 68 45 55 45 55Z"/></svg>`
    },
    {
      id: "nat-snowflake", label: "ندفة ثلج", category: "طبيعة",
      svg: `<svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="55" y1="5" x2="55" y2="105"/><line x1="8" y1="28" x2="102" y2="82"/><line x1="8" y1="82" x2="102" y2="28"/><line x1="55" y1="15" x2="44" y2="26"/><line x1="55" y1="15" x2="66" y2="26"/><line x1="55" y1="95" x2="44" y2="84"/><line x1="55" y1="95" x2="66" y2="84"/><line x1="18" y1="34" x2="22" y2="44"/><line x1="18" y1="34" x2="28" y2="30"/><line x1="92" y1="76" x2="88" y2="66"/><line x1="92" y1="76" x2="82" y2="80"/><line x1="92" y1="34" x2="88" y2="44"/><line x1="92" y1="34" x2="82" y2="30"/><line x1="18" y1="76" x2="22" y2="66"/><line x1="18" y1="76" x2="28" y2="80"/></g></svg>`
    },
    {
      id: "nat-cactus", label: "صبار", category: "طبيعة",
      svg: `<svg viewBox="0 0 90 120" xmlns="http://www.w3.org/2000/svg"><rect x="35" y="20" width="20" height="85" rx="10" fill="currentColor"/><path fill="currentColor" d="M35 50L15 50L15 30C15 22 22 18 28 18L35 18Z"/><path fill="currentColor" d="M55 65L75 65L75 85C75 93 68 97 62 97L55 97Z"/><rect x="22" y="102" width="46" height="10" rx="5" fill="currentColor"/><path d="M40 35L40 90" stroke="white" stroke-width="1" opacity="0.1"/><path d="M50 35L50 90" stroke="white" stroke-width="1" opacity="0.1"/></svg>`
    },
    {
      id: "nat-tree", label: "شجرة صنوبر", category: "طبيعة",
      svg: `<svg viewBox="0 0 90 120" xmlns="http://www.w3.org/2000/svg"><polygon points="45,5 70,40 58,40 78,70 12,70 32,40 20,40" fill="currentColor"/><rect x="37" y="70" width="16" height="42" rx="4" fill="currentColor"/><line x1="45" y1="20" x2="45" y2="70" stroke="white" stroke-width="1" opacity="0.08"/></svg>`
    },
    {
      id: "nat-volcano", label: "بركان", category: "طبيعة",
      svg: `<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg"><polygon points="20,90 70,15 120,90" fill="currentColor"/><path fill="currentColor" d="M55 15L60 0L65 15Z"/><path fill="white" opacity="0.08" d="M35 90L70 30L105 90Z"/><circle cx="62" cy="-5" r="4" fill="currentColor" opacity="0.5"/><circle cx="55" cy="-12" r="3" fill="currentColor" opacity="0.4"/><circle cx="70" cy="-8" r="2.5" fill="currentColor" opacity="0.3"/></svg>`
    },
    {
      id: "nat-ocean-wave", label: "موجة يابانية", category: "طبيعة",
      svg: `<svg viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M5 55C15 35 30 25 50 30C65 34 70 20 85 15C100 10 115 18 125 30C130 38 135 48 138 55L138 80L5 80Z"/><path fill="white" opacity="0.12" d="M20 55C28 40 40 32 55 35C68 38 72 28 82 24C92 20 102 25 110 34L110 55Z"/><path fill="none" stroke="white" stroke-width="1.5" opacity="0.15" d="M30 48C38 38 48 34 58 38C65 40 68 34 75 30"/><circle cx="100" cy="22" r="3" fill="white" opacity="0.15"/></svg>`
    },
  ],

  /* ══════════════════════════════════════════════════════════════
     قلوب ونجوم — Hearts & Stars
     ══════════════════════════════════════════════════════════════ */
  "قلوب ونجوم": [
    {
      id: "hs-heart", label: "قلب", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M50 88C25 68 5 50 5 32C5 16 18 5 32 5C40 5 47 10 50 16C53 10 60 5 68 5C82 5 95 16 95 32C95 50 75 68 50 88Z"/></svg>`
    },
    {
      id: "hs-heart-bandaid", label: "قلب مع لصقة", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 110 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M55 88C32 70 12 52 12 36C12 20 24 10 37 10C44 10 50 14 55 20C60 14 66 10 73 10C86 10 98 20 98 36C98 52 78 70 55 88Z"/><rect x="35" y="38" width="40" height="18" rx="4" fill="white" opacity="0.2"/><circle cx="42" cy="47" r="2" fill="white" opacity="0.15"/><circle cx="50" cy="47" r="2" fill="white" opacity="0.15"/><circle cx="58" cy="47" r="2" fill="white" opacity="0.15"/><circle cx="66" cy="47" r="2" fill="white" opacity="0.15"/></svg>`
    },
    {
      id: "hs-star-5", label: "نجمة خماسية", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 61,35 95,35 68,55 78,88 50,68 22,88 32,55 5,35 39,35" fill="currentColor"/></svg>`
    },
    {
      id: "hs-star-4", label: "نجمة رباعية", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 58,42 95,50 58,58 50,95 42,58 5,50 42,42" fill="currentColor"/></svg>`
    },
    {
      id: "hs-sparkle", label: "لمعة", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M50 5L55 40L90 50L55 60L50 95L45 60L10 50L45 40Z"/><path fill="currentColor" opacity="0.5" d="M18 5L20 18L33 20L20 22L18 35L16 22L3 20L16 18Z"/><path fill="currentColor" opacity="0.5" d="M82 68L84 78L94 80L84 82L82 92L80 82L70 80L80 78Z"/></svg>`
    },
    {
      id: "hs-heart-arrow", label: "قلب وسهم", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 110 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M55 85C34 68 15 52 15 36C15 22 26 12 38 12C44 12 50 16 55 22C60 16 66 12 72 12C84 12 95 22 95 36C95 52 76 68 55 85Z"/><line x1="12" y1="12" x2="98" y2="88" stroke="white" stroke-width="3.5" opacity="0.35"/><polygon points="98,88 82,80 88,72" fill="white" opacity="0.35"/></svg>`
    },
    {
      id: "hs-double-heart", label: "قلبين", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 110 90" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" opacity="0.55" d="M38 72C22 60 8 48 8 34C8 22 17 14 27 14C32 14 36 17 38 21C40 17 44 14 49 14C59 14 68 22 68 34C68 48 54 60 38 72Z"/><path fill="currentColor" d="M62 78C46 66 32 54 32 40C32 28 41 20 51 20C56 20 60 23 62 27C64 23 68 20 73 20C83 20 92 28 92 40C92 54 78 66 62 78Z"/></svg>`
    },
    {
      id: "hs-star-outline", label: "نجمة فارغة", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,8 60,36 92,36 66,54 76,84 50,66 24,84 34,54 8,36 40,36" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/></svg>`
    },
    {
      id: "hs-heart-outline", label: "قلب فارغ", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-width="5" d="M50 85C25 65 8 50 8 33C8 18 20 8 33 8C41 8 47 12 50 18C53 12 59 8 67 8C80 8 92 18 92 33C92 50 75 65 50 85Z"/></svg>`
    },
    {
      id: "hs-shooting-star", label: "نجمة ساقطة", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 130 80" xmlns="http://www.w3.org/2000/svg"><polygon points="95,8 100,30 122,35 100,40 95,62 90,40 68,35 90,30" fill="currentColor"/><line x1="80" y1="42" x2="8" y2="72" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" opacity="0.6"/><line x1="75" y1="46" x2="18" y2="68" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/></svg>`
    },
    {
      id: "hs-heart-pulse", label: "قلب نبض", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M30 60C14 48 2 38 2 26C2 14 12 6 22 6C28 6 32 9 35 14L35 6L45 14L55 6L65 14L75 6L75 14C78 9 82 6 88 6C98 6 108 14 108 26C108 38 96 48 80 60L55 78Z"/><path d="M10 45L30 45L38 25L50 55L62 35L70 45L110 45" fill="none" stroke="white" stroke-width="2.5" opacity="0.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
      id: "hs-star-cluster", label: "عنقود نجوم", category: "قلوب ونجوم",
      svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg"><polygon points="60,8 66,30 90,30 70,44 78,66 60,52 42,66 50,44 30,30 54,30" fill="currentColor"/><polygon points="25,45 28,55 38,55 30,62 33,72 25,65 17,72 20,62 12,55 22,55" fill="currentColor" opacity="0.6"/><polygon points="95,42 98,52 108,52 100,59 103,69 95,62 87,69 90,59 82,52 92,52" fill="currentColor" opacity="0.6"/><circle cx="15" cy="25" r="2.5" fill="currentColor" opacity="0.4"/><circle cx="105" cy="20" r="2" fill="currentColor" opacity="0.4"/><circle cx="60" cy="85" r="2" fill="currentColor" opacity="0.3"/></svg>`
    },
  ],

  /* ══════════════════════════════════════════════════════════════
     شعارات VOGU — Brand Logos
     ══════════════════════════════════════════════════════════════ */
  "شعارات VOGU": [
    {
      id: "vogu-bold", label: "VOGU عريض", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg"><text x="100" y="46" text-anchor="middle" font-family="Arial Black,Impact,sans-serif" font-size="46" font-weight="900" letter-spacing="8" fill="currentColor">VOGU</text></svg>`
    },
    {
      id: "vogu-outline", label: "VOGU محدد", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg"><text x="100" y="46" text-anchor="middle" font-family="Arial Black,Impact,sans-serif" font-size="46" font-weight="900" letter-spacing="8" fill="none" stroke="currentColor" stroke-width="1.5">VOGU</text></svg>`
    },
    {
      id: "vogu-badge-circle", label: "VOGU شارة دائرية", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg"><circle cx="65" cy="65" r="60" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="65" cy="65" r="52" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="65" y="58" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="24" font-weight="900" letter-spacing="5" fill="currentColor">VOGU</text><text x="65" y="78" text-anchor="middle" font-family="Georgia,serif" font-size="8" letter-spacing="3" fill="currentColor">ORIGINAL</text></svg>`
    },
    {
      id: "vogu-arch", label: "VOGU مقوّس", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><path id="arch" d="M20 70Q100 -15 180 70" fill="none"/><text font-family="Arial Black,sans-serif" font-size="34" font-weight="900" letter-spacing="6" fill="currentColor"><textPath href="#arch" startOffset="50%" text-anchor="middle">VOGU</textPath></text></svg>`
    },
    {
      id: "vogu-stacked", label: "VOGU متراكب", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg"><text x="100" y="40" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="38" font-weight="900" letter-spacing="10" fill="currentColor">VOGU</text><line x1="38" y1="50" x2="162" y2="50" stroke="currentColor" stroke-width="1.5"/><text x="100" y="70" text-anchor="middle" font-family="Georgia,serif" font-size="11" letter-spacing="6" fill="currentColor">CLOTHING CO.</text></svg>`
    },
    {
      id: "vogu-minimal", label: "VOGU بسيط", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 180 50" xmlns="http://www.w3.org/2000/svg"><text x="90" y="38" text-anchor="middle" font-family="Helvetica Neue,Arial,sans-serif" font-size="30" font-weight="200" letter-spacing="16" fill="currentColor">VOGU</text></svg>`
    },
    {
      id: "vogu-vintage", label: "VOGU كلاسيكي", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 210 100" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="194" height="84" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="14" y="14" width="182" height="72" rx="2" fill="none" stroke="currentColor" stroke-width="0.8"/><text x="105" y="48" text-anchor="middle" font-family="Georgia,serif" font-size="32" font-weight="700" letter-spacing="6" fill="currentColor">VOGU</text><text x="105" y="70" text-anchor="middle" font-family="Georgia,serif" font-size="9" letter-spacing="4" fill="currentColor">EST. 2026 — PREMIUM</text><circle cx="22" cy="22" r="3" fill="currentColor"/><circle cx="188" cy="22" r="3" fill="currentColor"/><circle cx="22" cy="78" r="3" fill="currentColor"/><circle cx="188" cy="78" r="3" fill="currentColor"/></svg>`
    },
    {
      id: "vogu-stamp", label: "VOGU ختم", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="70" r="62" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="5 3"/><text x="70" y="60" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="26" font-weight="900" letter-spacing="3" fill="currentColor">VOGU</text><text x="70" y="82" text-anchor="middle" font-family="Arial,sans-serif" font-size="7" letter-spacing="2" fill="currentColor">AUTHENTIC</text><line x1="22" y1="90" x2="118" y2="90" stroke="currentColor" stroke-width="1"/><text x="70" y="102" text-anchor="middle" font-family="Arial,sans-serif" font-size="6" letter-spacing="1.5" fill="currentColor">GUARANTEED QUALITY</text></svg>`
    },
    {
      id: "vogu-modern", label: "VOGU عصري", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 210 60" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="8" width="6" height="44" fill="currentColor"/><text x="18" y="42" font-family="Arial Black,sans-serif" font-size="36" font-weight="900" letter-spacing="5" fill="currentColor">VOGU</text><rect x="204" y="8" width="6" height="44" fill="currentColor"/></svg>`
    },
    {
      id: "vogu-circle-text", label: "VOGU دائري", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg"><circle cx="65" cy="65" r="55" fill="none" stroke="currentColor" stroke-width="2"/><path id="topA" d="M15 65A50 50 0 0 1 115 65" fill="none"/><path id="botA" d="M115 68A50 50 0 0 1 15 68" fill="none"/><text font-family="Arial Black,sans-serif" font-size="13" font-weight="900" letter-spacing="5" fill="currentColor"><textPath href="#topA" startOffset="50%" text-anchor="middle">VOGU</textPath></text><text font-family="Arial,sans-serif" font-size="8" letter-spacing="2.5" fill="currentColor"><textPath href="#botA" startOffset="50%" text-anchor="middle">ORIGINAL ★ CUSTOM</textPath></text><text x="65" y="70" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="currentColor">★</text></svg>`
    },
    {
      id: "vogu-box", label: "VOGU صندوق", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 190 70" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="180" height="60" rx="3" fill="currentColor"/><text x="95" y="44" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="900" letter-spacing="10" fill="white">VOGU</text></svg>`
    },
    {
      id: "vogu-line", label: "VOGU خطي", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 210 40" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="20" x2="55" y2="20" stroke="currentColor" stroke-width="1.5"/><text x="105" y="28" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="12" fill="currentColor">VOGU</text><line x1="155" y1="20" x2="210" y2="20" stroke="currentColor" stroke-width="1.5"/></svg>`
    },
    {
      id: "vogu-horizontal-badge", label: "VOGU شارة أفقية", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 200 70" xmlns="http://www.w3.org/2000/svg"><path d="M35 5L165 5C180 5 195 18 195 35C195 52 180 65 165 65L35 65C20 65 5 52 5 35C5 18 20 5 35 5Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M40 12L160 12C172 12 182 22 182 35C182 48 172 58 160 58L40 58C28 58 18 48 18 35C18 22 28 12 40 12Z" fill="none" stroke="currentColor" stroke-width="1"/><text x="100" y="42" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="22" font-weight="900" letter-spacing="6" fill="currentColor">VOGU</text></svg>`
    },
    {
      id: "vogu-serif", label: "VOGU سيريف", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg"><text x="100" y="46" text-anchor="middle" font-family="Georgia,Playfair Display,serif" font-size="42" font-weight="700" font-style="italic" letter-spacing="4" fill="currentColor">VOGU</text></svg>`
    },
    {
      id: "vogu-distressed", label: "VOGU ممزق", category: "شعارات VOGU",
      svg: `<svg viewBox="0 0 200 65" xmlns="http://www.w3.org/2000/svg"><text x="100" y="48" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="44" font-weight="900" letter-spacing="6" fill="currentColor">VOGU</text><rect x="28" y="15" width="8" height="3" fill="white" opacity="0.15" transform="rotate(-5 32 16)"/><rect x="72" y="38" width="12" height="2.5" fill="white" opacity="0.12" transform="rotate(3 78 39)"/><rect x="130" y="22" width="10" height="2" fill="white" opacity="0.1" transform="rotate(-2 135 23)"/><rect x="155" y="42" width="6" height="3" fill="white" opacity="0.12" transform="rotate(6 158 43)"/><rect x="45" y="42" width="5" height="2" fill="white" opacity="0.08" transform="rotate(-4 47 43)"/></svg>`
    },
  ],

  /* ══════════════════════════════════════════════════════════════
     بادجات وشارات — Badges & Seals
     ══════════════════════════════════════════════════════════════ */
  "بادجات وشارات": [
    {
      id: "badge-round-01", label: "بادج دائري 01", category: "بادجات وشارات",
      svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="55" fill="currentColor"/><circle cx="60" cy="60" r="48" fill="white" opacity="0.1"/><circle cx="60" cy="60" r="42" fill="none" stroke="white" stroke-width="1" opacity="0.2"/><text x="60" y="50" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="3" fill="white" opacity="0.7">CERTIFIED</text><text x="60" y="75" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="22" font-weight="900" fill="white" opacity="0.9">2026</text></svg>`
    },
    {
      id: "badge-shield-01", label: "درع بادج", category: "بادجات وشارات",
      svg: `<svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M50 5L90 20L90 52C90 78 72 98 50 108C28 98 10 78 10 52L10 20Z"/><path fill="white" opacity="0.08" d="M50 12L82 24L82 52C82 74 68 90 50 100C32 90 18 74 18 52L18 24Z"/><text x="50" y="55" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="white" opacity="0.8">VOGU</text><text x="50" y="75" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" letter-spacing="2" fill="white" opacity="0.5">APPROVED</text></svg>`
    },
    {
      id: "badge-ribbon-01", label: "شريط نجاح", category: "بادجات وشارات",
      svg: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M0 18L60 0L120 18L120 55L60 75L0 55Z"/><path fill="currentColor" opacity="0.85" d="M18 55L32 92L45 62"/><path fill="currentColor" opacity="0.85" d="M102 55L88 92L75 62"/><text x="60" y="44" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="16" font-weight="900" fill="white" opacity="0.9">WINNER</text></svg>`
    },
    {
      id: "badge-square-01", label: "بادج مربع", category: "بادجات وشارات",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="90" rx="6" fill="currentColor" transform="rotate(3 50 50)"/><rect x="12" y="12" width="76" height="76" rx="3" fill="none" stroke="white" stroke-width="1" opacity="0.2" transform="rotate(3 50 50)"/><text x="50" y="45" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="2" fill="white" opacity="0.6">OFFICIAL</text><text x="50" y="68" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="20" font-weight="900" fill="white" opacity="0.9">01</text></svg>`
    },
    {
      id: "badge-laurel-01", label: "إكليل بادج", category: "بادجات وشارات",
      svg: `<svg viewBox="0 0 130 95" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-width="2.5" d="M22 80C22 80 32 25 65 12C98 25 108 80 108 80"/><path fill="currentColor" opacity="0.5" d="M28 68C20 60 16 50 20 42C24 50 28 58 28 68Z"/><path fill="currentColor" opacity="0.5" d="M34 56C24 50 20 40 24 32C28 40 34 48 34 56Z"/><path fill="currentColor" opacity="0.5" d="M42 46C32 42 28 34 30 26C36 32 40 40 42 46Z"/><path fill="currentColor" opacity="0.5" d="M102 68C110 60 114 50 110 42C106 50 102 58 102 68Z"/><path fill="currentColor" opacity="0.5" d="M96 56C106 50 110 40 106 32C102 40 96 48 96 56Z"/><path fill="currentColor" opacity="0.5" d="M88 46C98 42 102 34 100 26C94 32 90 40 88 46Z"/><text x="65" y="58" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-weight="700" letter-spacing="2" fill="currentColor">CHAMPION</text></svg>`
    },
    {
      id: "badge-seal-01", label: "ختم رسمي", category: "بادجات وشارات",
      svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2"/><path id="sealTop" d="M18 60A42 42 0 0 1 102 60" fill="none"/><path id="sealBot" d="M102 64A42 42 0 0 1 18 64" fill="none"/><text font-family="Arial,sans-serif" font-size="9" font-weight="700" letter-spacing="3" fill="currentColor"><textPath href="#sealTop" startOffset="50%" text-anchor="middle">VOGU STUDIO</textPath></text><text font-family="Arial,sans-serif" font-size="7" letter-spacing="2" fill="currentColor"><textPath href="#sealBot" startOffset="50%" text-anchor="middle">★ QUALITY GUARANTEE ★</textPath></text><text x="60" y="66" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="16" font-weight="900" fill="currentColor">OK</text></svg>`
    },
    {
      id: "badge-name-tag", label: "بطاقة اسم", category: "بادجات وشارات",
      svg: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="65" rx="4" fill="currentColor" transform="rotate(-2 50 42)"/><rect x="18" y="18" width="64" height="50" rx="2" fill="white" opacity="0.1" transform="rotate(-2 50 42)"/><circle cx="50" cy="32" r="10" fill="white" opacity="0.12"/><line x1="25" y1="50" x2="75" y2="50" stroke="white" stroke-width="1" opacity="0.1"/><line x1="30" y1="56" x2="70" y2="56" stroke="white" stroke-width="1" opacity="0.08"/><path fill="currentColor" d="M35 75L42 105L50 82L58 105L65 75"/></svg>`
    },
    {
      id: "badge-diamond-01", label: "بادج ماسي", category: "بادجات وشارات",
      svg: `<svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg"><polygon points="55,5 100,35 55,105 10,35" fill="currentColor"/><polygon points="55,20 85,38 55,88 25,38" fill="white" opacity="0.08"/><line x1="10" y1="35" x2="100" y2="35" stroke="white" stroke-width="1.5" opacity="0.15"/><text x="55" y="60" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="14" font-weight="900" fill="white" opacity="0.8">VIP</text></svg>`
    },
  ],

  /* ══════════════════════════════════════════════════════════════
     ستريت وير — Streetwear
     ══════════════════════════════════════════════════════════════ */
  "ستريت وير": [
    {
      id: "sw-downtown", label: "DOWNTOWN", category: "ستريت وير",
      svg: `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><text x="100" y="38" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="32" font-weight="900" letter-spacing="6" fill="currentColor">DOWNTOWN</text></svg>`
    },
    {
      id: "sw-no-rules", label: "NO RULES", category: "ستريت وير",
      svg: `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><text x="100" y="38" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="34" font-weight="900" letter-spacing="4" fill="currentColor">NO RULES</text></svg>`
    },
    {
      id: "sw-night-shift", label: "NIGHT SHIFT", category: "ستريت وير",
      svg: `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><text x="100" y="38" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="30" font-weight="900" letter-spacing="5" fill="currentColor">NIGHT SHIFT</text></svg>`
    },
    {
      id: "sw-block-party", label: "BLOCK PARTY", category: "ستريت وير",
      svg: `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><text x="100" y="38" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="28" font-weight="900" letter-spacing="4" fill="currentColor">BLOCK PARTY</text></svg>`
    },
    {
      id: "sw-urban-code", label: "URBAN CODE", category: "ستريت وير",
      svg: `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><text x="100" y="38" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="32" font-weight="900" letter-spacing="5" fill="currentColor">URBAN CODE</text></svg>`
    },
    {
      id: "sw-raw-edge", label: "RAW EDGE", category: "ستريت وير",
      svg: `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><text x="100" y="38" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="34" font-weight="900" letter-spacing="6" fill="currentColor">RAW EDGE</text></svg>`
    },
    {
      id: "sw-low-key", label: "LOW KEY", category: "ستريت وير",
      svg: `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><text x="100" y="38" text-anchor="middle" font-family="Helvetica Neue,Arial,sans-serif" font-size="34" font-weight="300" letter-spacing="14" fill="currentColor">LOW KEY</text></svg>`
    },
    {
      id: "sw-local-only", label: "LOCAL ONLY", category: "ستريت وير",
      svg: `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><text x="100" y="38" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="30" font-weight="900" letter-spacing="5" fill="currentColor">LOCAL ONLY</text></svg>`
    },
    {
      id: "sw-off-duty", label: "OFF DUTY", category: "ستريت وير",
      svg: `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><text x="100" y="38" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="34" font-weight="900" letter-spacing="8" fill="currentColor">OFF DUTY</text></svg>`
    },
    {
      id: "sw-city-club", label: "CITY CLUB", category: "ستريت وير",
      svg: `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><text x="100" y="38" text-anchor="middle" font-family="Georgia,serif" font-size="32" font-weight="700" font-style="italic" letter-spacing="5" fill="currentColor">CITY CLUB</text></svg>`
    },
  ],

  /* ══════════════════════════════════════════════════════════════
     عسكرية — Military
     ══════════════════════════════════════════════════════════════ */
  "عسكرية": [
    {
      id: "mil-dog-tag", label: "داوغ تاج", category: "عسكرية",
      svg: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="50" height="80" rx="4" fill="currentColor"/><rect x="10" y="10" width="40" height="70" rx="2" fill="white" opacity="0.08"/><circle cx="30" cy="18" r="3" fill="white" opacity="0.2"/><line x1="15" y1="32" x2="45" y2="32" stroke="white" stroke-width="1.5" opacity="0.15"/><line x1="15" y1="42" x2="45" y2="42" stroke="white" stroke-width="1.5" opacity="0.12"/><line x1="15" y1="52" x2="45" y2="52" stroke="white" stroke-width="1.5" opacity="0.12"/><line x1="15" y1="62" x2="35" y2="62" stroke="white" stroke-width="1.5" opacity="0.1"/><circle cx="30" cy="92" r="6" fill="none" stroke="currentColor" stroke-width="3"/></svg>`
    },
    {
      id: "mil-star-chevron", label: "نجمة ورتبة", category: "عسكرية",
      svg: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><polygon points="50,8 58,30 82,30 62,44 70,66 50,52 30,66 38,44 18,30 42,30" fill="currentColor"/><path fill="currentColor" d="M25 72L40 72L40 78L55 78L55 72L75 72L75 78L75 80L25 80Z"/></svg>`
    },
    {
      id: "mil-crosshair", label: "متصويب", category: "عسكرية",
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="2" fill="currentColor"/><line x1="50" y1="2" x2="50" y2="20" stroke="currentColor" stroke-width="2.5"/><line x1="50" y1="80" x2="50" y2="98" stroke="currentColor" stroke-width="2.5"/><line x1="2" y1="50" x2="20" y2="50" stroke="currentColor" stroke-width="2.5"/><line x1="80" y1="50" x2="98" y2="50" stroke="currentColor" stroke-width="2"/></svg>`
    }, 
  ],
};

/* ─── فهرس سريع بالـ ID ─── */
export const STICKER_BY_ID: Record<string, StickerItem> = {};
for (const pack of Object.values(STICKER_PACKS)) {
  for (const s of pack) STICKER_BY_ID[s.id] = s;
}

/* ─── كل الفئات مرتبة ─── */
export const STICKER_CATEGORIES = Object.keys(STICKER_PACKS);