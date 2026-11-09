"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";

export function SelectedIndustries({
  selected,
  onRemove,
}: {
  selected: string[];
  onRemove: (industry: string, viaKeyboard: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-md">
      <p className="text-body-sm/[normal] text-grey-600" aria-live="polite">
        {selected.length} selected
      </p>
      {selected.length > 0 ? (
        <ul className="flex flex-wrap gap-xs">
          {selected.map((industry) => (
            <li
              key={industry}
              className="flex items-center gap-1 rounded-full border border-evergreen-200 bg-evergreen-50 px-sm py-1.5 text-body-sm/[normal] font-medium whitespace-nowrap text-grey-900"
            >
              {industry}
              <IconButton
                label={`Remove ${industry}`}
                size="2xs"
                onClick={(event) => onRemove(industry, event.detail === 0)}
              >
                <HugeiconsIcon icon={Cancel01Icon} className="text-grey-800" />
              </IconButton>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
