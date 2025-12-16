
import Watermark from "@/components/watermark/Watermark";
import { useCredits } from "@/components/credits/useCredits";
export default function ImageResult({ image, loading, error }: any) {
  const { credits } = useCredits();
  const isFree = credits !== null && credits < 2;
  if(loading) return <div className="glass p-6">Generating…</div>;
  if(error) return <div className="glass p-6 text-red-400">{error}</div>;
  if(!image) return <div className="glass p-6 text-zinc-500">No image yet</div>;
  return (
    <div className="glass p-4 relative">
      <img src={image} className="rounded-lg"/>
      {isFree && <Watermark/>}
    </div>
  );
}
