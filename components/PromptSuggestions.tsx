"use client";

import * as React from "react";
import { suggestions } from "@/lib/suggestions";
import { Button } from "@/components/ui/button";

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
}

export function PromptSuggestions({
  onSelect,
}: PromptSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
