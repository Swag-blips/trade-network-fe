"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

export interface CheckboxChipProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

export function CheckboxChip({
  checked,
  onCheckedChange,
  label,
}: CheckboxChipProps) {
  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-xs rounded-full border px-sm py-2 font-sans text-body-sm/[normal] transition-colors motion-reduce:transition-none ${
        checked
          ? "border-evergreen-600 bg-evergreen-50 text-grey-900"
          : "border-grey-300 bg-white text-grey-900"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        className={`flex size-4 flex-none items-center justify-center rounded-[4px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-evergreen-600 peer-focus-visible:outline-offset-2 motion-reduce:transition-none ${
          checked
            ? "border-evergreen-600 bg-evergreen-600 text-white"
            : "border-grey-300 bg-white text-transparent"
        }`}
      >
        <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={3} />
      </span>
      {label}
    </label>
  );
}
