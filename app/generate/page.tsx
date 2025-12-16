
"use client";
import { useGenerate } from "@/components/generate/useGenerate";
import PromptInput from "@/components/generate/PromptInput";
import StyleChips from "@/components/generate/StyleChips";
import AdvancedOptions from "@/components/generate/AdvancedOptions";
import GenerateButton from "@/components/generate/GenerateButton";
import ImageResult from "@/components/generate/ImageResult";
import MyCreations from "@/components/gallery/MyCreations";
import ExploreGrid from "@/components/explore/ExploreGrid";

export default function GeneratePage() {
  const gen = useGenerate();
  return (
    <main className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <PromptInput {...gen} />
        <StyleChips {...gen} />
        <AdvancedOptions {...gen} />
        <GenerateButton {...gen} />
        <ImageResult {...gen} />
        <MyCreations {...gen} />
        <ExploreGrid {...gen} />
      </div>
    </main>
  );
}
