'use client'

import { useState } from 'react'
import Navbar     from '@/components/Navbar'
import Footer     from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AIStylist  from '@/components/AIStylist'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [cartOpen, setCartOpen] = useState(false)
  const [aiOpen,   setAiOpen]   = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-vogu-bg">

      <Navbar
        onCartOpen={() => setCartOpen(true)}
        onAIOpen={() => setAiOpen(true)}
      />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      {/* ── الدرج الجانبي للسلة ── */}
      <CartDrawer
open={cartOpen}        onClose={() => setCartOpen(false)}
      />

      {/* ── مستشار الأزياء AI ── */}
      <AIStylist
        open={aiOpen}
        onClose={() => setAiOpen(false)}
      />

    </div>
  )
}
