"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

export type IconButtonSize = "xs" | "sm" | "md";

/*
 * The visual box is the `size` prop, but the hit target is always at least
 * 32px via a centred pseudo-element — so a 20px glyph keeps its drawn size
 * without shipping a 20px tap target.
 */
const BASE =
  "relative inline-flex flex-none cursor-pointer items-center justify-center rounded-full " +
  "text-grey-900 transition-colors " +
  "after:absolute after:top-1/2 after:left-1/2 after:size-8 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] " +
  "hover:bg-grey-100 focus-visible:outline-2 focus-visible:outline-evergreen-600 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed disabled:text-grey-300 disabled:hover:bg-transparent " +
  "motion-reduce:transition-none";

const SIZES: Record<IconButtonSize, string> = {
  xs: "size-5 [&_svg]:size-5",
  sm: "size-6 [&_svg]:size-4",
  md: "size-8 [&_svg]:size-5",
};

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /** Required: icon-only buttons have no accessible name otherwise. */
  label: string;
  size?: IconButtonSize;
  children: ReactNode;
}

export function IconButton({
  label,
  size = "md",
  className = "",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`${BASE} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
