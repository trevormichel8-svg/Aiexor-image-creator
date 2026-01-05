"use client"

import { useState } from "react"

const PLANS = [
  {
    id: "pro",
    label: "Pro",
    price: "$29.99 / month",
    description: "200 credits / month",
  },
  {
    id: "elite",
    label: "Elite",
    price: "$49.99 / month",
    description: "500 credits / month",
  },
]

export default function BuySubscriptionModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [loading, setLoading] = useState<string | null>(null)

  if (!open) return null

  async function subscribe(plan: string) {
    setLoading(plan)

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }), // ✅ "pro" | "elite"
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("Checkout error:", data)
        alert("Failed to start checkout")
        setLoading(null)
      }
    } catch (err) {
      console.error(err)
      alert("Unexpected error")
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#0b1416] border border-teal-500/30 rounded-xl p-6 w-[90%] max-w-md shadow-[0_0_30px_rgba(45,212,191,0.35)]">
        <h2 className="text-xl font-semibold text-teal-400 mb-4">
          Choose a Plan
        </h2>

        <div className="space-y-3">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => subscribe(p.id)}
              disabled={loading === p.id}
              className="w-full px-4 py-4 rounded-lg
                         bg-teal-600/10 border border-teal-500/40
                         hover:bg-teal-500/20 transition
                         shadow-[0_0_12px_rgba(45,212,191,0.35)]
                         text-left text-teal-300"
            >
              <div className="flex justify-between">
                <span className="font-medium">{p.label}</span>
                <span>{loading === p.id ? "Redirecting…" : p.price}</span>
              </div>
              <div className="text-sm opacity-70">{p.description}</div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-teal-400 hover:text-teal-300"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
