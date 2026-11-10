"use client";

import { useState } from "react";
import { Badge } from "@repo/ui/badge";
import { Radio } from "@repo/ui/radio";

const MODES = [
  {
    id: "suggest",
    title: "Suggest actions only",
    recommended: true,
    description:
      "Tai suggests responses within your funding mandate, but you decide the action.",
  },
  {
    id: "negotiate",
    title: "Negotiate on my behalf",
    recommended: false,
    description:
      "Tai handles negotiations for you, while you make the final decisions on the offers.",
  },
];

export function AutoNegotiationSettings() {
  const [mode, setMode] = useState("suggest");

  return (
    <div className="flex flex-col gap-md">
      {MODES.map((option) => (
        <div key={option.id} className="flex gap-sm">
          <Radio
            name="auto-negotiation"
            checked={mode === option.id}
            onSelect={() => setMode(option.id)}
            label={option.title}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-xs">
              <p className="font-sans text-body-sm/[normal] text-grey-900">
                {option.title}
              </p>
              {option.recommended ? <Badge>Recommended</Badge> : null}
            </div>
            <p className="text-body-sm text-grey-600">
              {option.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
