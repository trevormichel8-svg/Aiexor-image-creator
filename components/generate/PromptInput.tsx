
export default function PromptInput({ prompt, setPrompt }: any) {
  return (
    <div className="glass rounded-2xl p-5">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image…"
        rows={4}
        className="w-full bg-transparent text-lg outline-none resize-none"
      />
    </div>
  );
}
