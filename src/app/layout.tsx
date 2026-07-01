import type { Metadata } from "next";
import { Cormorant_Garamond, Tajawal } from "next/font/google";
import "./globals.css";
import SupportWidget from "@/components/SupportWidget";
import { Providers } from "./providers";

// ─── Fonts ────────────────────────────────────────────────────
const cormorant = Cormorant_Garamond({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700"],
  style:    ["normal", "italic"],
  variable: "--font-cormorant",
  display:  "swap",
});

const tajawal = Tajawal({
  subsets:  ["arabic", "latin"],
  weight:   ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
  display:  "swap",
});

// ─── Metadata ─────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "VŌGU — أزياء فاخرة",
    template: "%s | VŌGU",
  },
  description: "تجربة تسوق فاخرة تجمع الأناقة والجودة الاستثنائية في كل قطعة",
  keywords:    ["أزياء", "ملابس فاخرة", "موضة", "VOGU"],
  authors:     [{ name: "VŌGU" }],
  openGraph: {
    title:       "VŌGU — أزياء فاخرة",
    description: "تجربة تسوق فاخرة",
    locale:      "ar_EG",
    type:        "website",
  },
};

// ─── Root Layout ──────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cormorant.variable} ${tajawal.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#070707] text-[#EDE8DF] antialiased font-tajawal">
        <Providers>{children}</Providers>
        <SupportWidget />
      </body>

    </html>
  );
}
