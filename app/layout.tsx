import "./globals.css"
import type { Metadata } from "next"
import { CreditsProvider } from "@/context/CreditsContext"

export const metadata: Metadata = {
  title: "Aiexor",
  description: "AI Image Generator",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CreditsProvider>
          {children}
        </CreditsProvider>
      </body>
    </html>
  )
}
