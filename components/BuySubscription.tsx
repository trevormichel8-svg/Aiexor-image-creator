"use client"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function BuySubscription() {
  const startCheckout = async (plan: "pro" | "elite") => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("Please sign in first")
        return
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          userId: user.id,
          email: user.email,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        console.error("Checkout error:", data)
        alert("Failed to start checkout")
        return
      }

      window.location.href = data.url
    } catch (err) {
      console.error(err)
      alert("Failed to start checkout")
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Choose a Plan</h3>

      <button
        style={{ display: "block", marginBottom: 8 }}
        onClick={() => startCheckout("pro")}
      >
        Pro — $29.99 / month (200 credits)
      </button>

      <button onClick={() => startCheckout("elite")}>
        Elite — $49.99 / month (500 credits)
      </button>
    </div>
  )
}
