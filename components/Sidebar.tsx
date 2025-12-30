"use client";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="sidebar-overlay" onClick={onClose} />

      {/* Sidebar */}
      <aside className="sidebar open">
        <div className="sidebar-header">
          <h2>Settings</h2>
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sidebar-content">
          {/* Art style + slider live here (Step 2 & 3) */}
        </div>
      </aside>
    </>
  );
}
