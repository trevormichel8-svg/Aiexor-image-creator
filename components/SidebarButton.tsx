"use client";

export default function SidebarButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "12px",
        left: "12px",
        zIndex: 2147483647, // MAX SAFE Z-INDEX
        pointerEvents: "auto",
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "12px",
          border: "none",
          background: "rgba(20,20,20,0.9)",
          color: "#fff",
          fontSize: "22px",
          boxShadow:
            "0 0 14px rgba(255,0,0,0.7), inset 0 0 6px rgba(255,255,255,0.1)",
        }}
        aria-label="Open sidebar"
      >
        ☰
      </button>
    </div>
  );
}
