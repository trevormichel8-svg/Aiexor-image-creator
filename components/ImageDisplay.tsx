"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

export interface ImageDisplayProps {
  image: string;
  provider: string;
  showProvider: boolean;
}

export function ImageDisplay({ image, provider, showProvider }: ImageDisplayProps) {
  const downloadImage = () => {
    const a = document.createElement("a");
    a.href = image;
    a.download = "aiexor-image.png";
    a.click();
  };

  const shareImage = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Aiexor Image", url: image });
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-[hsl(var(--glow))] shadow-[0_0_10px_hsl(var(--glow)/0.5)] bg-black">
      <img src={image} alt="Generated" className="w-full h-auto object-cover" />
      <div className="absolute bottom-2 left-2 flex gap-2">
        <Button
          size="icon"
          onClick={downloadImage}
          className="bg-black/70 text-white border border-[hsl(var(--glow))] rounded-full hover:shadow-[0_0_10px_hsl(var(--glow))]"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          onClick={shareImage}
          className="bg-black/70 text-white border border-[hsl(var(--glow))] rounded-full hover:shadow-[0_0_10px_hsl(var(--glow))]"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
      {showProvider && (
        <div className="absolute top-2 right-2 text-xs text-[hsl(var(--glow))] bg-black/70 px-2 py-1 rounded-md">
          {provider}
        </div>
      )}
    </div>
  );
}
