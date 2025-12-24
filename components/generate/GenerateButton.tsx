type Props = {
  loading: boolean;
  onGenerate?: () => void;
};

export default function GenerateButton({ loading, onGenerate }: Props) {
  return (
    <button
      type="button"
      disabled={loading || !onGenerate}
      onClick={onGenerate}
      className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 py-3 font-semibold text-black shadow-lg transition hover:opacity-90 disabled:opacity-50"
    >
      {loading ? "Generating..." : "Generate Image"}
    </button>
  );
}
