"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}

      {/* Toast notifications */}
      <Toaster
        position="bottom-left"
        richColors
        toastOptions={{
          style: {
            background:  "#0D0D0D",
            border:      "1px solid #1A1A1A",
            color:       "#EDE8DF",
            fontFamily:  "var(--font-tajawal)",
            fontSize:    "13px",
            direction:   "rtl",
          },
        }}
      />
    </SessionProvider>
  );
}
