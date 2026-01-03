"use client";

// Pull in the canonical list of art styles from our library. Defining the
// available options in one place avoids divergence across components.
import artStyles from "@/lib/artStyles";

const ART_STYLES = artStyles;

interface ArtStyleSheetProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (style: string) => void;
}

export default function ArtStyleSheet({
  open,
  onClose,
  value,
  onChange,
}: ArtStyleSheetProps) {
  if (!open) return null;

  return (
    <div className="art-style-overlay">
      <div className="art-style-modal">
        {ART_STYLES.map((style) => (
          <button
            key={style}
            className={`art-style-option ${
              value === style ? "active" : ""
            }`}
            onClick={() => {
              onChange(style);
              onClose();
            }}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
}
