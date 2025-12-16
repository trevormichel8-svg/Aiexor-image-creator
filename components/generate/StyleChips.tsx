
const STYLES = ["Cyberpunk","Anime","Photorealistic","Oil Painting","Dark Fantasy","Neon Noir","Watercolor","Concept Art","Pixel Art","Logo Design"];
export default function StyleChips({ styles, setStyles }: any) {
  const toggle = (s: string) =>
    setStyles((p: string[]) => p.includes(s) ? p.filter(x => x!==s) : [...p, s]);
  return (
    <div className="flex gap-2 overflow-x-auto">
      {STYLES.map(s => (
        <button key={s} onClick={() => toggle(s)}
          className={styles.includes(s) ? "gold-gradient px-4 py-2 rounded-full" : "px-4 py-2 rounded-full border border-zinc-700"}>
          {s}
        </button>
      ))}
    </div>
  );
}
