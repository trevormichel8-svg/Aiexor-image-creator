"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

type CreditsContextType = {
  credits: number | null
  refreshCredits: () => Promise<void>
  setCredits: (n: number) => void
}

const CreditsContext = createContext<CreditsContextType | null>(null)

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function refreshCredits() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) {
      setCredits(null)
      return
    }

    const { data } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userData.user.id)
      .single()

    setCredits(data?.credits ?? 0)
  }

  useEffect(() => {
    refreshCredits()
  }, [])

  return (
    <CreditsContext.Provider
      value={{ credits, refreshCredits, setCredits }}
    >
      {children}
    </CreditsContext.Provider>
  )
}

export function useCredits() {
  const ctx = useContext(CreditsContext)
  if (!ctx) throw new Error("useCredits must be used inside CreditsProvider")
  return ctx
}
