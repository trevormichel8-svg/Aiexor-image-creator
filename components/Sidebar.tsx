"use client";

import { Dispatch, SetStateAction } from "react"

interface SidebarProps {
  open: boolean
  onClose: () => void

  artStyle: string
  setArtStyle: Dispatch<SetStateAction<string>>

  strength: number
  setStrength: Dispatch<SetStateAction<number>>
}

export default function Sidebar({
  open,
  onClose,
  artStyle,
  setArtStyle,
  strength,
  setStrength,
}: SidebarProps) {
  const [showStyles, setShowStyles] = useState(false);

  if (!open) return null;

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />

      <aside className="sidebar open">
        <div className="sidebar-header">
          <span>Settings</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="sidebar-content">
          {/* Art Style Button */}
          <button
            className="art-style-pill"
            onClick={() => setShowStyles((v) => !v)}
          >
            Art Styles
          </button>

          {showStyles && (
            <div className="art-style-list">
              {/* styles rendered elsewhere */}
            </div>
          )}

          {/* Strength Slider */}
          <div className="slider-group">
            <input
              type="range"
              min={0}
              max={100}
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
            />
            <div className="slider-label">Style Strength</div>
          </div>
        </div>
      </aside>
    </>
  );
}
