import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from "@repo/ui/button-classes";

export function ButtonLink({
  variant,
  size,
  leadingIcon,
  trailingIcon,
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}) {
  const classes = buttonClasses({ variant, size });

  return (
    <Link className={`${classes.root} ${className}`} {...props}>
      <span className={classes.content}>
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
    </Link>
  );
}
