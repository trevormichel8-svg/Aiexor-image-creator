"use client"

import artStyles from "@/lib/artStyles"

interface SidebarProps {
  open: boolean
  onClose: () => void
  artStyle: string
  setArtStyle: (value: string) => void
  strength: number
  setStrength: (value: number) => void
}

export default function Sidebar({
  open,
  onClose,
  artStyle,
  setArtStyle,
  strength,
  setStrength,
}: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 transition ${
          open ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72
          bg-[#0b1416]
          border-r border-teal-500/30
          shadow-[0_0_40px_rgba(45,212,191,0.35)]
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4
            text-teal-400 text-xl
            rounded-full w-9 h-9
            flex items-center justify-center
            bg-black/40
            shadow-[0_0_12px_rgba(45,212,191,0.6)]
            hover:bg-black/70"
        >
          ×
        </button>

        <div className="p-5 space-y-6">
          <h2 className="text-lg font-semibold text-teal-400">
            Art Settings
          </h2>

          {/* Art Style Dropdown */}
          <div className="space-y-2">
            <label className="text-sm text-teal-300">
              Art Style
            </label>

            <select
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
              className="
                w-full
                rounded-full
                px-4 py-2
                bg-[#081214]
                border border-teal-500/40
                text-teal-200
                outline-none
                shadow-[0_0_12px_rgba(45,212,191,0.35)]
                focus:border-teal-400
              "
            >
              {artStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Strength Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-teal-300">
              <span>Strength</span>
              <span>{strength}</span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
              className="
                w-full
                accent-teal-400
                cursor-pointer
              "
            />
          </div>
        </div>
      </aside>
    </>
  )
}
