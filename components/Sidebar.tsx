"use client";

type HistoryItem = {
  id: string;
  prompt: string;
  image: string;
};

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
};

export default function Sidebar({
  open,
  onClose,
  history,
  onSelect,
  onClear,
}: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <header className="sidebar-header">
          <h2>History</h2>
          <button onClick={onClose}>✕</button>
        </header>

        <div className="sidebar-content">
          {history.length === 0 && (
            <p className="sidebar-empty">No images yet</p>
          )}

          {history.map((item) => (
            <button
              key={item.id}
              className="sidebar-item"
              onClick={() => onSelect(item)}
            >
              <img src={item.image} alt="" />
              <span>{item.prompt.slice(0, 40)}…</span>
            </button>
          ))}
        </div>

        <footer className="sidebar-footer">
          <button className="danger" onClick={onClear}>
            Clear History
          </button>
        </footer>
      </aside>
    </>
  );
}
