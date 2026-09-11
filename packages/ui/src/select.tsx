"use client";

import type { SelectHTMLAttributes } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

/** `size` is a real <select> attribute (a number), so the prop is `variant`. */
export type SelectVariant = "field" | "chip";

const VARIANTS: Record<SelectVariant, { root: string; field: string }> = {
  field: {
    root: "h-10 w-full border-grey-300",
    field: "px-sm pr-9 text-body-sm/[normal] text-grey-900",
  },
  chip: {
    root: "h-[29px] border-grey-200 shadow-small-thick",
    field: "px-xs pr-7 text-body-sm font-medium text-grey-800",
  },
};

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant;
}

export function Select({
  variant = "field",
  className = "",
  children,
  ...props
}: SelectProps) {
  const styles = VARIANTS[variant];

  return (
    <div
      className={`relative flex items-center rounded-md border bg-white focus-within:border-evergreen-600 ${styles.root} ${className}`}
    >
      <select
        className={`h-full w-full cursor-pointer appearance-none bg-transparent font-sans outline-none ${styles.field}`}
        {...props}
      >
        {children}
      </select>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={16}
        className={`pointer-events-none absolute text-grey-900 ${variant === "chip" ? "right-xs" : "right-sm"}`}
      />
    </div>
  );
}
