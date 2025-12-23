"use client";

type Props = {
  onGenerate: () => void;
  loading: boolean;
};

export default function GenerateButton({ onGenerate, loading }: Props) {
  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={loading}
      className="w-full bg-black text-white py-2 rounded"
    >
      {loading ? "Generating..." : "Generate"}
    </button>
  );
}
