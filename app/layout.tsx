import "./globals.css"
import type { Metadata } from "next"
import { CreditsProvider } from "@/context/CreditsContext"

export const metadata: Metadata = {
  title: "Aiexor Image Creator",
  description: "AI Image Generator",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <CreditsProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-14 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-4">
              <button className="mb-4 text-xl">☰</button>
              <button className="text-sm text-teal-400">Buy</button>
            </aside>

            {/* Main */}
            <div className="flex-1 relative">{children}</div>
          </div>
        </CreditsProvider>
      </body>
    </html>
  )
}
