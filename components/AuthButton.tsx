"use client"

import { supabase } from "@/lib/supabase"

export default function AuthButton() {
  async function signIn() {
    const email = prompt("Enter your email")
    if (!email) return

    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })

    alert("Check your email for the login link.")
  }

  async function signOut() {
    await supabase.auth.signOut()
    location.reload()
  }

  return (
    <button
      onClick={signIn}
      style={{
        background: "var(--accent)",
        borderRadius: 999,
        padding: "8px 14px",
        boxShadow: "0 0 12px rgba(20,184,166,.8)",
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Sign In
    </button>
  )
}
