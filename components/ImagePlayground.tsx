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
    const prompt = newPrompt.trim();
    if (!prompt) return;
    setIsLoading(true);
    try {
      // For this playground we generate a single image using OpenAI's DALL·E 2 model.
      const requestBody = {
        prompt,
        provider: "openai", // default provider
        modelId: "dall-e-2", // default model; change as desired
      };
      const res = await fetch("/api/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      if (res.ok && data.image) {
        // Prepend the data URI scheme to the returned base64 string
        const imageUrl = `data:image/png;base64,${data.image}`;
        setImages([{ url: imageUrl, provider: data.provider }]);
      } else {
        console.error("Error generating image", data.error);
        setImages([]);
      }
    } catch (err) {
      console.error(err);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Header />
      <main className="flex flex-col flex-1 items-center px-4 py-8 gap-6">
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
      </main>
    </div>
  );
}
