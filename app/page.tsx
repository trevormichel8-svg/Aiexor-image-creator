"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import PromptBar from "@/components/PromptBar"
import ImageCanvas from "@/components/ImageCanvas"

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <main className="canvas">
      <button
        className="sidebar-button"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <ImageCanvas src="" />

      <PromptBar onGenerate={() => {}} />
    </main>
  )
}
