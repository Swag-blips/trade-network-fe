"use client";

import { useState } from "react";
import { Select } from "@repo/ui/select";

// Placeholder options: the comp only shows "Flexible" and the API has no field yet.
const OPTIONS = ["Flexible", "Strict"];

export function MatchingPreference() {
  const [value, setValue] = useState(OPTIONS[0]!);

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-body/[normal] text-grey-600">
        Matching preference:
      </span>
      <div className="w-53.75">
        <Select
          aria-label="Matching preference"
          value={value}
          onValueChange={setValue}
          options={OPTIONS}
        />
      </div>
    </div>
  );
}
