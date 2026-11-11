"use client";

import { useState } from "react";

const FILTERS = ["All", "Opportunity", "Portfolio"] as const;

/** No updates endpoint yet, so every filter shows the empty state. */
export function RecentUpdates() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  return (
    <section className="flex flex-col">
      <div className="flex flex-col gap-md border-b border-grey-100 pb-md">
        <h2 className="font-sans text-[1.25rem]/[1.5] font-medium text-grey-800">
          Recent updates
        </h2>
        <div className="flex items-start gap-xs">
          {FILTERS.map((label) => {
            const active = label === filter;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(label)}
                className={`cursor-pointer px-sm py-xs text-body-sm/[normal] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-evergreen-600 ${
                  active
                    ? "rounded-md bg-grey-100 text-grey-800"
                    : "rounded-full bg-white text-grey-600 hover:text-grey-900"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex h-65.5 flex-col items-center gap-xs pt-3xl text-center">
        <p className="text-body/[1.5] font-medium text-grey-600">
          No recent updates
        </p>
        <p className="w-91.75 max-w-full text-body-sm/[1.5] text-grey-500">
          New financing opportunities and portfolio signals will appear here.
        </p>
      </div>
    </section>
  );
}
