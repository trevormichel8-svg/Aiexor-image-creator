"use client";

import * as React from "react";

export interface CarouselApi {
  selectedScrollSnap(): number;
  on(event: string, cb: () => void): void;
  off(event: string, cb: () => void): void;
}

export function Carousel({
  _api,
  children,
  setApi,
}: {
  _api?: CarouselApi;
  children: React.ReactNode;
  setApi?: (api: CarouselApi) => void;
}) {
  React.useEffect(() => {
    if (setApi) {
      setApi({
        selectedScrollSnap: () => 0,
        on: () => {},
        off: () => {},
      });
    }
  }, [setApi]);

  return <div>{children}</div>;
}

export function CarouselContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function CarouselItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function CarouselPrevious() {
  return <button>Prev</button>;
}

export function CarouselNext() {
  return <button>Next</button>;
}
