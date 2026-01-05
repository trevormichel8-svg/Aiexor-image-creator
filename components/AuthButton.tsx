"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthButton() {
  const supabase = createClientComponentClient()

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/`,
      },
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    location.reload()
  }

  return (
    <button
      onClick={signIn}
      className="px-4 py-2 rounded-full
                 bg-teal-500 text-black
                 shadow-[0_0_12px_rgba(45,212,191,0.6)]
                 hover:bg-teal-400 transition"
    >
      Sign In
    </button>
  )
}
