"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "destructive";

export type ButtonSize = "sm" | "md";

/*
 * Interaction states are pseudo-class variants, not props: Figma models Hover
 * and Pressed as component variants because it has no interaction model. Only
 * `loading` and `disabled` are props, because only those are application state.
 */

/*
 * Every variant sets its own border-color, including the transparent ones.
 * Putting `border-transparent` in BASE would not work: both it and a variant's
 * border-color are the same kind of utility, so which one wins is decided by
 * Tailwind's generated stylesheet order, not by the order of the class strings.
 */
const BASE =
  "group relative inline-flex cursor-pointer items-center justify-center " +
  // text-body-sm/[normal]: the size token, but with Figma's line-height. As a
  // separate `leading-[normal]` it loses to the line-height baked into the
  // font-size utility, depending on Tailwind's output order.
  "rounded-full border font-sans text-body-sm/[normal] font-medium " +
  "whitespace-nowrap transition-colors duration-100 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-evergreen-600 " +
  "disabled:cursor-not-allowed motion-reduce:transition-none";

const VARIANTS: Record<ButtonVariant, string> = {
  // Figma specifies no background change on hover — only the label drops to 50%.
  primary:
    "border-transparent bg-evergreen-600 text-white " +
    "enabled:active:bg-evergreen-800 " +
    "enabled:hover:[&_[data-label]]:opacity-50 " +
    "enabled:active:[&_[data-label]]:opacity-100 " +
    "disabled:bg-evergreen-600/40",
  secondary:
    "border-grey-200 bg-grey-100 text-grey-900 " +
    "enabled:hover:bg-grey-200 enabled:active:bg-grey-300 " +
    "disabled:border-grey-200 disabled:bg-grey-100 disabled:text-grey-900/40",
  outline:
    "border-evergreen-600 bg-transparent text-evergreen-600 " +
    "enabled:hover:bg-grey-100 enabled:active:bg-grey-200 " +
    "disabled:border-evergreen-600/40 disabled:bg-white disabled:text-evergreen-600/40",
  // Figma specifies no hover or pressed change; only disabled differs.
  ghost:
    "border-transparent bg-transparent text-evergreen-600 " +
    "disabled:bg-white disabled:text-evergreen-600/40",
  // Figma specifies the same fill for default and pressed.
  destructive:
    "border-transparent bg-destructive text-white " +
    "enabled:hover:bg-destructive-hover enabled:active:bg-destructive " +
    "disabled:bg-destructive-hover/20",
};

const SIZES: Record<ButtonSize, { button: string; content: string }> = {
  md: { button: "p-xs", content: "gap-xs [&_svg]:size-5" },
  sm: { button: "px-1.5 py-1", content: "gap-xxs [&_svg]:size-4" },
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders the dot indicator and blocks interaction. */
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leadingIcon,
  trailingIcon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(BASE, VARIANTS[variant], SIZES[size].button, className)}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span
        className={cx(
          "inline-flex items-center",
          SIZES[size].content,
          loading && "invisible",
        )}
      >
        {leadingIcon ? (
          <span className="flex-none" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <span data-label>{children}</span>
        {trailingIcon ? (
          <span className="flex-none" aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}
      </span>
      {/* The label stays in the DOM (invisible) so the button keeps its natural
          width instead of jumping to the fixed 121px the Figma variant hardcodes. */}
      {loading ? (
        <span
          className="absolute inset-0 inline-flex items-center justify-center gap-[3px]"
          aria-hidden="true"
        >
          <i className="size-1 animate-dot-pulse rounded-full bg-current" />
          <i className="size-1 animate-dot-pulse rounded-full bg-current [animation-delay:0.15s]" />
          <i className="size-1 animate-dot-pulse rounded-full bg-current [animation-delay:0.3s]" />
        </span>
      ) : null}
    </button>
  );
}
