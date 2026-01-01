"use client";

import { useState } from "react"; // ✅ REQUIRED FIX

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  style: string;
  setStyle: (s: string) => void;
  strength: number;
  setStrength: (n: number) => void;
};

export default function Sidebar({
  open,
  onClose,
  style,
  setStyle,
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
