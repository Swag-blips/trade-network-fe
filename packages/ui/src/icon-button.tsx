"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

export type IconButtonSize = "2xs" | "xs" | "sm" | "md" | "lg";
export type IconButtonVariant = "ghost" | "tertiary";

/*
 * The visual box is the `size` prop, but the hit target is always at least
 * 32px via a centred pseudo-element — so a 20px glyph keeps its drawn size
 * without shipping a 20px tap target.
 */
const BASE =
  "relative inline-flex flex-none cursor-pointer items-center justify-center rounded-full " +
  "transition-colors focus-visible:outline-2 focus-visible:outline-evergreen-600 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed motion-reduce:transition-none";

const VARIANTS: Record<IconButtonVariant, string> = {
  ghost:
    "text-grey-900 " +
    "after:absolute after:top-1/2 after:left-1/2 after:size-8 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] " +
    "hover:bg-grey-100 disabled:text-grey-300 disabled:hover:bg-transparent",
  // The bordered white circle — e.g. the back control beside a form's submit
  // button. Same ring/fill as Button's tertiary variant, in icon-only form.
  tertiary:
    "inset-ring inset-ring-grey-200 bg-white text-grey-900 " +
    "hover:bg-grey-50 disabled:inset-ring-grey-200 disabled:bg-white disabled:text-grey-900/40",
};

const SIZES: Record<IconButtonSize, string> = {
  "2xs": "size-4 [&_svg]:size-4",
  xs: "size-5 [&_svg]:size-5",
  sm: "size-6 [&_svg]:size-4",
  md: "size-8 [&_svg]:size-5",
  lg: "size-10 [&_svg]:size-5",
};

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /** Required: icon-only buttons have no accessible name otherwise. */
  label: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  children: ReactNode;
}

export function IconButton({
  label,
  size = "md",
  variant = "ghost",
  className = "",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
