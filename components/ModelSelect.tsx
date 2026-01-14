"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ModelSelectProps {
  _value?: string;
  _providerKey?: string;
  _enabled?: boolean;
}

export function ModelSelect({
  _value,
  _providerKey,
  _enabled,
}: ModelSelectProps) {
  return (
    <Card>
      <CardContent>Select a model</CardContent>
    </Card>
  );
}
