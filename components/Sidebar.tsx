"use client";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Sidebar({ open, onClose, children }: SidebarProps) {
  if (!open) return null;

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />

      <aside className="sidebar open">
        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close settings"
        >
          ✕
        </button>

        <div className="sidebar-content">
          {children}
        </div>
      </aside>
    </>
  );
}
