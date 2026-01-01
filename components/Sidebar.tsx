"use client";

import ArtStyleSheet from "./ArtStyleSheet";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  artStyle: string;
  setArtStyle: (v: string) => void;
  strength: number;
  setStrength: (v: number) => void;
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
    <aside className="sidebar">
      <button className="sidebar-close" onClick={onClose}>
        ✕
      </button>

      <h2 className="sidebar-title">Settings</h2>

      {/* ART STYLE BUTTON */}
      <button
        className="art-style-pill"
        onClick={() => setShowStyles(true)}
      >
        Art Styles
      </button>

      {/* SLIDER */}
      <div className="slider-group">
        <div className="slider-label">
          Style Strength: {strength}%
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={strength}
          onChange={(e) => setStrength(Number(e.target.value))}
          className="red-slider"
        />
      </div>

      <ArtStyleSheet
        open={showStyles}
        onClose={() => setShowStyles(false)}
        value={artStyle}
        onChange={setArtStyle}
      />
    </aside>
  );
}
