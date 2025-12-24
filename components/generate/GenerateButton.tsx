interface Props {
  loading: boolean;
  onGenerate: () => void;
}

export default function GenerateButton({ loading, onGenerate }: Props) {
  return (
    <button
      onClick={onGenerate}
      disabled={loading}
      className="w-full rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
    >
      {loading ? "Generating…" : "Generate Image"}
    </button>
  );
}
📱 Mobile-first
