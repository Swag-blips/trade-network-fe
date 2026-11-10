import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

const SIZES = {
  md: {
    card: "border-grey-200 px-md py-2.5",
    value: "text-[1.25rem]/[1.3] font-medium tracking-[0.16px]",
    caption: "text-caption",
  },
  lg: {
    card: "border-grey-100 p-md shadow-soft-section",
    value: "text-2xl/[1.3] font-normal tracking-[0.192px]",
    caption: "text-body-sm/[normal]",
  },
};

export interface StatCardProps {
  label: string;
  value: ReactNode;
  caption: string;
  icon: IconSvgElement;
  size?: keyof typeof SIZES;
  featured?: boolean;
  muted?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  caption,
  icon,
  size = "md",
  featured = false,
  muted = false,
  className = "flex-1",
}: StatCardProps) {
  const styles = SIZES[size];

  return (
    <div
      className={`flex items-start overflow-hidden rounded-lg border ${styles.card} ${
        featured
          ? // End stop is off-palette, verbatim from Figma.
            "bg-linear-to-r from-evergreen-800 to-[#0d5551] text-grey-50"
          : "bg-white"
      } ${className}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-xs">
        <div className="flex w-full items-center gap-xs">
          <p
            className={`min-w-0 flex-1 text-body-sm/[1.5] font-medium ${
              featured ? "opacity-80" : "text-grey-800"
            }`}
          >
            {label}
          </p>
          <span
            className={`flex size-6 flex-none items-center justify-center rounded-full ${
              size === "lg"
                ? "border border-grey-100 bg-white"
                : "bg-grey-100"
            }`}
          >
            <HugeiconsIcon icon={icon} size={16} className="text-grey-800" />
          </span>
        </div>
        <div className="flex w-full flex-col gap-1">
          <p
            className={`font-brand ${styles.value} ${
              featured ? "" : muted ? "text-grey-600" : "text-grey-900"
            }`}
          >
            {value}
          </p>
          <p
            className={`${styles.caption} ${featured ? "opacity-80" : "text-grey-600"}`}
          >
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}
