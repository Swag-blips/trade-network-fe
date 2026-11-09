import type { ReactNode } from "react";

export type BadgeVariant = "label" | "pill";

const VARIANTS: Record<BadgeVariant, string> = {
  label: "rounded-sm px-1.5 py-0.5 tracking-[0.5px]",
  pill: "rounded-full px-xs py-1",
};

export function Badge({
  variant = "label",
  children,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center bg-grey-100 font-sans text-[0.625rem]/[normal] font-medium text-grey-600 uppercase ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
