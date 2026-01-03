import { cookies } from "next/headers"

const CREDITS_KEY = "aiexor_credits"

function getStore() {
  return cookies()
}

export function getCredits(): number {
  const store = getStore()
  const raw = store.get(CREDITS_KEY)?.value
  const credits = raw ? parseInt(raw, 10) : 0
  return Number.isNaN(credits) ? 0 : credits
}

export function addCredits(amount: number) {
  if (amount <= 0) return

  const store = getStore()
  const current = getCredits()

  store.set(CREDITS_KEY, String(current + amount), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  })
}

export function consumeCredit(): boolean {
  const store = getStore()
  const current = getCredits()

  if (current < 1) return false

  store.set(CREDITS_KEY, String(current - 1), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  })

  return true
}
