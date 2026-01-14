"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles } from "lucide-react";

interface QualityModeToggleProps {
  _value?: boolean;
}

export function QualityModeToggle({ _value }: QualityModeToggleProps) {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <Button
      variant="outline"
      onClick={() => setEnabled((v) => !v)}
      className="flex gap-2"
    >
      {enabled ? <Sparkles /> : <Zap />}
      {enabled ? "High Quality" : "Fast"}
    </Button>
  );
}
