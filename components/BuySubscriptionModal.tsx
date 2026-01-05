"use client"

import { useState } from "react"

export default function BuySubscriptionModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [loading, setLoading] = useState<string | null>(null)

  if (!open) return null

  async function checkout(plan: "pro" | "elite") {
    setLoading(plan)

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })

      const text = await res.text()

      alert(`Stripe response:\n\n${text}`)

      let data: any = {}
      try {
        data = JSON.parse(text)
      } catch {}

      if (data?.url) {
        window.location.href = data.url
        return
      }

      setLoading(null)
    } catch (err: any) {
      alert(`Network error:\n${err?.message || err}`)
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#0b1416] border border-teal-500/30 rounded-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl text-teal-400 mb-4">
          Choose a subscription
        </h2>

        <button
          onClick={() => checkout("pro")}
          disabled={loading === "pro"}
          className="w-full mb-3 px-4 py-3 rounded-lg
                     bg-teal-500/20 border border-teal-500
                     text-teal-300 shadow"
        >
          {loading === "pro" ? "Redirecting…" : "Pro — $29.99 / month"}
        </button>

        <button
          onClick={() => checkout("elite")}
          disabled={loading === "elite"}
          className="w-full px-4 py-3 rounded-lg
                     bg-teal-500/20 border border-teal-500
                     text-teal-300 shadow"
        >
          {loading === "elite" ? "Redirecting…" : "Elite — $49.99 / month"}
        </button>

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
