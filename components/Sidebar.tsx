"use client";

import { ART_STYLES } from "./ArtStyleSheet";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  if (!open) return null;

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />

      <aside className="sidebar open">
        <div className="sidebar-header">
          <h2>Settings</h2>
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sidebar-content">
          <label className="sidebar-label">Art Style</label>

          {/* LOCKED PILL */}
          <div className="art-style-pill">
            Art Styles
          </div>

          <div className="slider-block">
            <div className="slider-label">Style Strength: 70%</div>
            <input type="range" min="0" max="100" defaultValue={70} />
          </div>
        </div>
      </aside>
    </>
  );
}
