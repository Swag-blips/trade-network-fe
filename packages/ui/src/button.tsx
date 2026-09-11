"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "destructive";

export type ButtonSize = "sm" | "md" | "lg" | "form" | "flush";

const BASE =
  "group relative inline-flex cursor-pointer items-center justify-center " +
  "rounded-full font-sans font-medium " +
  "whitespace-nowrap transition-colors duration-100 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-evergreen-600 " +
  "disabled:cursor-not-allowed motion-reduce:transition-none";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-evergreen-600 text-white " +
    "enabled:active:bg-evergreen-800 " +
    "enabled:hover:[&_[data-label]]:opacity-50 " +
    "enabled:active:[&_[data-label]]:opacity-100 " +
    "disabled:bg-evergreen-600/40",
  secondary:
    "inset-ring inset-ring-grey-200 bg-grey-100 text-grey-900 " +
    "enabled:hover:bg-grey-200 enabled:active:bg-grey-300 " +
    "disabled:inset-ring-grey-200 disabled:bg-grey-100 disabled:text-grey-900/40",
  outline:
    "inset-ring inset-ring-evergreen-600 bg-transparent text-evergreen-600 " +
    "enabled:hover:bg-grey-100 enabled:active:bg-grey-200 " +
    "disabled:inset-ring-evergreen-600/40 disabled:bg-white disabled:text-evergreen-600/40",
  ghost:
    "bg-transparent text-evergreen-600 " +
    "disabled:bg-white disabled:text-evergreen-600/40",
  destructive:
    "bg-destructive text-white " +
    "enabled:hover:bg-destructive-hover enabled:active:bg-destructive " +
    "disabled:bg-destructive-hover/20",
};

const SIZES: Record<ButtonSize, { button: string; content: string }> = {
  sm: {
    button: "px-1.5 py-1 text-body-sm/[normal]",
    content: "gap-xxs [&_svg]:size-4",
  },
  md: {
    button: "p-xs text-body-sm/[normal]",
    content: "gap-xs [&_svg]:size-5",
  },
  lg: {
    button: "px-lg py-md text-body/[normal]",
    content: "gap-xs [&_svg]:size-5",
  },
  form: {
    button: "px-md py-xs text-body-sm/[normal]",
    content: "gap-xs [&_svg]:size-5",
  },
  flush: {
    button: "py-xs text-body-sm/[normal]",
    content: "gap-xs [&_svg]:size-5",
  },
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
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
