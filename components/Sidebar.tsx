"use client";

import { ReactNode } from "react";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Sidebar({ open, onClose, children }: SidebarProps) {
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
          {children}
        </div>
      </aside>
    </>
  );
}
