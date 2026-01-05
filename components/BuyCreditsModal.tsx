"use client"

import { useState } from "react"

const PLANS = [
  { credits: 20, label: "20 Credits", price: "$6.99" },
  { credits: 50, label: "50 Credits", price: "$13.99" },
  { credits: 100, label: "100 Credits", price: "$24.99" },
]

export default function BuyCreditsModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [loading, setLoading] = useState<number | null>(null)

  if (!open) return null

  async function checkout(credits: number) {
    setLoading(credits)

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credits }),
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert(data.error || "Checkout failed")
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#0b1416] border border-teal-500/30 rounded-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold text-teal-400 mb-4">
          Buy Credits
        </h2>

        <div className="space-y-3">
          {PLANS.map((p) => (
            <button
              key={p.credits}
              onClick={() => checkout(p.credits)}
              disabled={loading === p.credits}
              className="w-full flex justify-between items-center px-4 py-3 rounded-lg
                         bg-teal-600/10 border border-teal-500/40
                         hover:bg-teal-500/20 transition text-teal-300"
            >
              <span>{p.label}</span>
              <span>
                {loading === p.credits ? "Redirecting…" : p.price}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-teal-400"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
