"use client";

type Props = {
  onClick: () => void;
};

export default function SidebarButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Open sidebar"
      className="sidebar-button"
    >
      ☰
    </button>
  );
}
