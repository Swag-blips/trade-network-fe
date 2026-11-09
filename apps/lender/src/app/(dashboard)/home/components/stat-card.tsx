import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

export interface StatCardProps {
  label: string;
  /** A node so a loading placeholder can stand in for the figure. */
  value: ReactNode;
  caption: string;
  icon: IconSvgElement;

  muted?: boolean;
}

export function StatCard({
  label,
  value,
  caption,
  icon,
  muted = false,
}: StatCardProps) {
  return (
    <div className="flex flex-1 items-start overflow-hidden rounded-lg border border-grey-200 bg-white px-md py-2.5">
      <div className="flex min-w-0 flex-1 flex-col gap-xs">
        <div className="flex w-full items-center gap-xs">
          <p className="min-w-0 flex-1 text-body-sm font-medium text-grey-800">
            {label}
          </p>
          <span className="flex size-6 flex-none items-center justify-center rounded-full bg-grey-100">
            <HugeiconsIcon icon={icon} size={16} className="text-grey-800" />
          </span>
        </div>
        <div className="flex w-full flex-col gap-1">
          <p
            className={`font-brand text-[1.25rem]/[1.3] font-medium tracking-[0.16px] ${
              muted ? "text-grey-600" : "text-grey-900"
            }`}
          >
            {value}
          </p>
          <p className="text-caption text-grey-600">{caption}</p>
        </div>
      </div>
    </div>
  );
}
