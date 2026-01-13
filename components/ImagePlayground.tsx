"use client";

import * as React from "react";
import { PromptInput } from "@/components/PromptInput";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Header } from "@/components/Header";
import { Loader2 } from "lucide-react";

interface ImageData {
  url: string;
  provider: string;
}

export default function ImagePlayground() {
  const [images, setImages] = React.useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showProviders, setShowProviders] = React.useState(false);

  const toggleView = () => setShowProviders((p) => !p);

  const handlePromptSubmit = async (newPrompt: string) => {
    if (!newPrompt.trim()) return;
    try {
      setIsLoading(true);
      setImages([]);

      const response = await fetch("/api/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newPrompt }),
      });

      if (!response.ok) throw new Error("Failed to generate images");
      const data = await response.json();
      setImages(data.images || []);
    } catch (err) {
      console.error("Error generating images:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Header />
      <main className="flex flex-col flex-1 items-center justify-start px-4 py-8 gap-6">
        <PromptInput
          onSubmit={handlePromptSubmit}
          isLoading={isLoading}
          showProviders={showProviders}
          onToggleProviders={toggleView}
        />

        {isLoading && (
          <div className="flex items-center justify-center mt-8">
            <Loader2 className="animate-spin text-[hsl(var(--glow))]" size={48} />
          </div>
        )}

        {!isLoading && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {images.map((img, i) => (
              <ImageDisplay
                key={i}
                image={img.url}
                provider={img.provider}
                showProvider={showProviders}
              />
            ))}
          </div>
        )}

        {!isLoading && images.length === 0 && (
          <p className="text-neutral-400 mt-8">
            Enter a prompt above to generate your first image.
          </p>
        )}
      </main>
    </div>
  );
}
