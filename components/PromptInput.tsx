"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function PromptInput({
  onGenerate,
  onClear,
}: {
  onGenerate: (prompt: string) => void;
  onClear: () => void;
}) {
  const [prompt, setPrompt] = React.useState("");

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-3 bg-neutral-800/80 p-4 rounded-xl border border-[hsl(var(--border))] shadow-[0_0_12px_hsl(var(--glow)/0.4)]">
      {/* Input area */}
      <textarea
        placeholder="Describe your image prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="
          flex-1
          bg-neutral-700
          text-white
          placeholder:text-neutral-400
          p-3
          rounded-lg
          border border-[hsl(var(--border))]
          focus:outline-none
          focus:ring-2 focus:ring-[hsl(var(--glow))]
          resize-none
          min-h-[100px]
        "
      />

      {/* Button group */}
      <div className="flex sm:flex-col gap-2 justify-center">
        <Button
          onClick={() => onGenerate(prompt)}
          className="
            bg-black 
            text-white 
            border border-[hsl(var(--glow))] 
            hover:shadow-[0_0_15px_hsl(var(--glow))] 
            hover:border-[hsl(var(--glow))] 
            rounded-full 
            transition-all duration-300
            px-5 py-2
          "
        >
          Generate
        </Button>

        <Button
          onClick={() => {
            setPrompt("");
            onClear();
          }}
          className="
            bg-black 
            text-white 
            border border-[hsl(var(--glow))] 
            hover:shadow-[0_0_15px_hsl(var(--glow))] 
            hover:border-[hsl(var(--glow))] 
            rounded-full 
            transition-all duration-300
            px-5 py-2
          "
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
