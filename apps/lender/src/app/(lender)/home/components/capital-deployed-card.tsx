"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Calendar04Icon,
  PieChart06Icon,
} from "@hugeicons/core-free-icons";
import { naira } from "@/utils/naira";
import { TextPlaceholder } from "../../components/text-placeholder";
import { useCapitalDeployed } from "../hooks/use-capital-deployed";
import type { BorrowerCategory, CapitalDeployed } from "../types";
import { DonutChart } from "./donut-chart";

// Off-palette, kept verbatim from Figma (node 2883-3937): the nearest ramp
// stops (ocean-300, azure-700) read visibly different on the ring.
const CATEGORIES: Record<
  BorrowerCategory,
  { label: string; stroke: string; dot: string }
> = {
  DISTRIBUTOR: {
    label: "Distributors",
    stroke: "stroke-[#7be7fc]",
    dot: "bg-[#7be7fc]",
  },
  SUPPLIER: {
    label: "Suppliers",
    stroke: "stroke-[#005894]",
    dot: "bg-[#005894]",
  },
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-08-01" → "Aug 01, 2026". Read as UTC so no timezone shifts the day. */
const formatDate = (date: string) =>
  dateFormat.format(new Date(`${date.slice(0, 10)}T00:00:00Z`));

function Period({ data }: { data: CapitalDeployed | undefined }) {
  if (!data?.startDate || !data.endDate) return null;
  return (
    <p className="text-caption text-grey-600">
      {formatDate(data.startDate)} - {formatDate(data.endDate)}
    </p>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-27 w-full items-center justify-center rounded-md">
      <div className="flex w-52.25 flex-col items-center gap-xs">
        <HugeiconsIcon
          icon={PieChart06Icon}
          size={32}
          className="text-grey-300"
        />
        <p className="text-center text-body-sm text-grey-500">{message}</p>
      </div>
    </div>
  );
}

function Breakdown({ data }: { data: CapitalDeployed }) {
  const slices = data.categories.map((slice) => ({
    ...slice,
    ...CATEGORIES[slice.category],
    percent: Math.round((slice.amount / data.totalAmount) * 100),
  }));

  return (
    <div className="flex w-full items-start gap-2xl">
      <DonutChart
        segments={slices.map((s) => ({
          value: s.amount,
          strokeClass: s.stroke,
        }))}
      >
        <p className="text-body-sm font-medium text-grey-800">Total amount</p>
        {/* 20px figure: off the type scale, matched to StatCard. */}
        <p className="font-brand text-[1.25rem]/[1.3] font-medium tracking-[0.16px] text-grey-900">
          {naira(data.totalAmount)}
        </p>
      </DonutChart>

      <div className="flex min-w-px flex-1 flex-col gap-sm">
        <h4 className="font-sans text-body-sm font-medium text-grey-800">
          Categories
        </h4>
        <ul className="flex flex-wrap items-start gap-lg">
          {slices.map((slice) => (
            <li key={slice.category} className="flex items-start gap-xs">
              <span
                aria-hidden="true"
                className={`mt-1 size-3 flex-none rounded-full ${slice.dot}`}
              />
              <div className="flex flex-col text-body-sm">
                <span className="text-grey-700">
                  {slice.label} ({slice.percent}%)
                </span>
                <span className="font-medium text-grey-900">
                  {naira(slice.amount)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CapitalDeployedCard() {
  const { data, isPending, isError } = useCapitalDeployed();

  return (
    <section className="flex flex-col gap-9.5 overflow-hidden rounded-lg border border-grey-200 bg-white px-5 py-md">
      <div className="flex w-full items-start gap-2.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="font-sans text-body font-medium text-grey-800">
            Total capital deployed
          </h3>
          {isPending ? (
            <p className="text-caption">
              <TextPlaceholder className="w-36" />
            </p>
          ) : (
            <Period data={data} />
          )}
        </div>
        {/* Not wired yet: the comp doesn't show this filter's options. */}
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
            All time
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            className="text-grey-800"
          />
        </button>
      </div>

      {isPending ? (
        <div className="h-27 w-full animate-pulse rounded-md bg-grey-50" />
      ) : isError ? (
        <EmptyState message="Couldn’t load capital deployed" />
      ) : data.totalAmount > 0 && data.categories.length > 0 ? (
        <Breakdown data={data} />
      ) : (
        <EmptyState message="No capital deployed yet" />
      )}
    </section>
  );
}
