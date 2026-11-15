import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

// End stop is off-palette, verbatim from Figma.
export const FEATURED_FILL =
  "bg-linear-to-r from-evergreen-800 to-[#0d5551] text-grey-50";

export function StatCard({
  label,
  value,
  caption,
  icon,
  featured = false,
  valueClassName = "",
  className = "flex-1",
}: {
  label: string;
  value: ReactNode;
  caption?: string;
  icon: IconSvgElement;
  featured?: boolean;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start overflow-hidden rounded-lg border border-grey-100 p-md shadow-soft-section ${
        featured ? FEATURED_FILL : "bg-white"
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
          <span className="flex size-6 flex-none items-center justify-center rounded-full border border-grey-100 bg-white">
            <HugeiconsIcon icon={icon} size={16} className="text-grey-800" />
          </span>
        </div>
        <div className="flex w-full flex-col gap-1">
          <p
            className={`font-brand text-2xl/[1.3] font-normal tracking-[0.192px] ${
              valueClassName || (featured ? "" : "text-grey-900")
            }`}
          >
            {value}
          </p>
          {caption ? (
            <p
              className={`text-body-sm/[normal] ${featured ? "opacity-80" : "text-grey-600"}`}
            >
              {caption}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
