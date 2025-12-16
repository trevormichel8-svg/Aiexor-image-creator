
export default function AdvancedOptions({ modelId, setModelId, provider, setProvider }: any) {
  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <select value={provider} onChange={e=>setProvider(e.target.value)} className="w-full bg-zinc-800 p-2 rounded">
        <option value="openai">OpenAI</option>
        <option value="replicate">Replicate</option>
      </select>
      <select value={modelId} onChange={e=>setModelId(e.target.value)} className="w-full bg-zinc-800 p-2 rounded">
        <option value="gpt-image-1">GPT Image</option>
        <option value="sdxl">SDXL</option>
      </select>
    </div>
  );
}
