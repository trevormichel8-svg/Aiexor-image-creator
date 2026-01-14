"use client";

import * as React from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface ModelCardCarouselProps {
  _value?: string;
  _providerKey?: string;
  _enabled?: boolean;
}

export function ModelCardCarousel({
  _value,
  _providerKey,
  _enabled,
}: ModelCardCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        <CarouselItem>Model 1</CarouselItem>
        <CarouselItem>Model 2</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
