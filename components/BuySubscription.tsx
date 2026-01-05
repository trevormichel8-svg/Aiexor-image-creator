"use client"

export default function BuySubscription() {
  async function startCheckout(plan: "pro" | "elite") {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan })
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Failed to start checkout")
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => startCheckout("pro")}
        className="w-full py-3 rounded bg-teal-500 text-black font-medium"
      >
        Pro — $29.99 / month (200 credits)
      </button>

      <button
        onClick={() => startCheckout("elite")}
        className="w-full py-3 rounded border border-teal-400 text-teal-400"
      >
        Elite — $49.99 / month (500 credits)
      </button>
    </div>
  )
}
