"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageCard from "./ImageCard";

type ImageRow = {
  id: string;
  image_url: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  quality: string;
};

export default function Gallery({
  onRemix,
}: {
  onRemix: (image: ImageRow) => void;
}) {
  const [images, setImages] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadImages() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("images")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setImages(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadImages();
  }, []);

  if (loading) {
    return <p className="text-center opacity-50">Loading gallery…</p>;
  }

  if (!images.length) {
    return (
      <p className="text-center opacity-50 mt-6">
        Your creations will appear here.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 mt-6">
      {images.map((img) => (
        <ImageCard
          key={img.id}
          image={img}
          onRefresh={loadImages}
          onRemix={onRemix}
        />
      ))}
    </div>
  );
}
