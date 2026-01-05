"use client"

import { useState } from "react"
import AuthButton from "@/components/AuthButton"
import BuyCreditsModal from "@/components/BuyCreditsModal"

export default function Page() {
  const [buyOpen, setBuyOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#0b1416] text-white relative">

      {/* 🔐 SIGN IN BUTTON (TOP RIGHT – ALWAYS VISIBLE) */}
      <div className="fixed top-4 right-4 z-50">
        <AuthButton />
      </div>

      {/* 💳 BUY CREDITS BUTTON (BOTTOM RIGHT) */}
      <button
        onClick={() => setBuyOpen(true)}
        className="fixed bottom-6 right-6 z-40
                   px-5 py-3 rounded-full
                   bg-teal-500 text-black font-semibold
                   shadow-[0_0_20px_rgba(45,212,191,0.6)]
                   hover:bg-teal-400 transition"
      >
        Buy Credits
      </button>

      {/* 🧾 BUY CREDITS MODAL */}
      <BuyCreditsModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
      />

      {/* 🖼️ PLACEHOLDER CANVAS */}
      <div className="flex items-center justify-center h-screen opacity-60">
        <h1 className="text-xl">Image Generator Canvas</h1>
      </div>
    </main>
  )
}
