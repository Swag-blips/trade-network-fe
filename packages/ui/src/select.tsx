"use client";

import type { SelectHTMLAttributes } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <div
      className={`relative flex h-10 w-full items-center rounded-md border border-grey-300 bg-white focus-within:border-evergreen-600 ${className}`}
    >
      <select
        className="h-full w-full appearance-none bg-transparent px-sm pr-9 font-sans text-body-sm/[normal] text-grey-900 outline-none"
        {...props}
      >
        {children}
      </select>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={16}
        className="pointer-events-none absolute right-sm text-grey-900"
      />
    </div>
  );
}
