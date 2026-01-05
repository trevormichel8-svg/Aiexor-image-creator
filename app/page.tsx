"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Get logged-in user ID (mobile-safe)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) {
        setUserId(data.user.id)
      }
    })
  }, [])

  async function subscribe(plan: "pro" | "elite") {
    if (!userId) {
      alert("You must be signed in first")
      return
    }

    setLoading(true)

    const res = await fetch("/api/stripe/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        userId,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Failed to start checkout")
    }
  }

  return (
    <main style={{ padding: 20, color: "#e5e7eb" }}>
      <h1>Create your first image</h1>

      <h2>Choose a subscription</h2>

      <button onClick={() => subscribe("pro")} disabled={loading}>
        Pro — $29.99 / month (200 credits)
      </button>

      <br /><br />

      <button onClick={() => subscribe("elite")} disabled={loading}>
        Elite — $49.99 / month (500 credits)
      </button>
    </main>
  )
}
