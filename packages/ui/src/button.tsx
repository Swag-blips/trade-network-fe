"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from "./button-classes";

export type { ButtonSize, ButtonVariant };

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
  const classes = buttonClasses({ variant, size });

  return (
    <button
      className={`${classes.root} ${className ?? ""}`}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span className={`${classes.content}${loading ? " invisible" : ""}`}>
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
