"use client"

import { useCredits } from "@/context/CreditsContext"

export default function Header() {
  const { credits } = useCredits()

  return (
    <div className="fixed top-0 right-0 p-4 text-sm text-teal-300">
      {credits === null ? "—" : `Credits: ${credits}`}
    </div>
  )
}
