
import { useCredits } from "@/components/credits/useCredits";
export default function GenerateButton({ prompt, styles, provider, modelId, setImage, setLoading, setError }: any) {
  const { refresh } = useCredits();
  async function run() {
    setLoading(true); setError(null);
    const fullPrompt = styles.length ? prompt + ", " + styles.join(", ") : prompt;
    const r = await fetch("/api/generate-images",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:fullPrompt,provider,modelId})});
    const d = await r.json();
    if(!r.ok){setError(d.error); setLoading(false); return;}
    setImage(d.image); refresh(); setLoading(false);
  }
  return <button onClick={run} className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 text-black">Generate (-2 credits)</button>;
}
