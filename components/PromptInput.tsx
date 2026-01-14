"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PromptInputProps {
  _prompt?: string;
  onSubmit: (prompt: string) => void;
}

export function PromptInput({ _prompt, onSubmit }: PromptInputProps) {
  const [value, setValue] = React.useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      className="flex gap-2"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a prompt"
      />
      <Button type="submit">Generate</Button>
    </form>
  );
}
