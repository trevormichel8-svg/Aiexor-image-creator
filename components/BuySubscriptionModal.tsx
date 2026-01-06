"use client"

import { useState } from "react"

type Plan = "pro" | "elite"

interface Props {
  open: boolean
  onClose: () => void
}

export default function BuySubscriptionModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState<Plan | null>(null)

  if (!open) return null

  async function startCheckout(plan: Plan) {
    try {
      setLoading(plan)

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to start checkout")
        setLoading(null)
        return
      }

      if (!data.url) {
        alert("Stripe did not return a checkout URL")
        setLoading(null)
        return
      }

      // 🔁 Redirect to Stripe
      window.location.href = data.url
    } catch (err) {
      console.error("Checkout error:", err)
      alert("Checkout failed")
      setLoading(null)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#111",
          padding: 20,
          borderRadius: 8,
          width: "90%",
          maxWidth: 400,
          color: "#fff",
        }}
      >
        <h2>Choose a subscription</h2>

        <button
          onClick={() => startCheckout("pro")}
          disabled={loading !== null}
          style={{ width: "100%", marginBottom: 12 }}
        >
          {loading === "pro"
            ? "Redirecting…"
            : "Pro — $29.99 / month (200 credits)"}
        </button>

        <button
          onClick={() => startCheckout("elite")}
          disabled={loading !== null}
          style={{ width: "100%", marginBottom: 12 }}
        >
          {loading === "elite"
            ? "Redirecting…"
            : "Elite — $49.99 / month (500 credits)"}
        </button>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            background: "transparent",
            color: "#aaa",
            marginTop: 8,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
