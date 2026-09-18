import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Calendar04Icon,
  PieChart06Icon,
} from "@hugeicons/core-free-icons";

export interface CapitalDeployedCardProps {
  title: string;
  period: string;
  filterLabel: string;
}

export function CapitalDeployedCard({
  title,
  period,
  filterLabel,
}: CapitalDeployedCardProps) {
  return (
    <section className="flex flex-col gap-9.5 overflow-hidden rounded-lg border border-grey-200 bg-white px-5 py-md">
      <div className="flex w-full items-start gap-2.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="font-sans text-body font-medium text-grey-800">
            {title}
          </h3>
          <p className="text-caption text-grey-600">{period}</p>
        </div>
        <button
          type="button"
          className="flex flex-none items-center justify-center gap-xs overflow-hidden rounded-md border border-grey-200 bg-white px-xs py-1 shadow-small-thick"
        >
          <HugeiconsIcon
            icon={Calendar04Icon}
            size={16}
            className="text-grey-800"
          />
          <span className="text-body-sm font-medium whitespace-nowrap text-grey-800">
            {filterLabel}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            className="text-grey-800"
          />
        </button>
      </div>

      <div className="flex h-27 w-full items-center justify-center rounded-md">
        <div className="flex w-52.25 flex-col items-center gap-xs">
          <HugeiconsIcon
            icon={PieChart06Icon}
            size={32}
            className="text-grey-300"
          />
          <p className="text-center text-body-sm text-grey-500">
            No capital deployed yet
          </p>
        </div>
      </div>
    </section>
  );
}
