"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Select } from "@repo/ui/select";
import { FilterBar } from "@repo/ui/filter-bar";
import { TextPlaceholder } from "../../components/text-placeholder";
import { OpportunityCard } from "./opportunity-card";
import { OpportunityDetailModal } from "./opportunity-detail";
import { detailFor } from "../data";
import { useOpportunities } from "../hooks/use-opportunities";
import { toOpportunity } from "../utils/to-opportunity";
import type { OpportunityFilter, OpportunityPage } from "../types/opportunity";

const TABS: {
  id: OpportunityFilter;
  label: string;
  count: keyof Pick<
    OpportunityPage,
    "allCount" | "supplierCount" | "distributorCount"
  >;
}[] = [
  { id: "all", label: "All", count: "allCount" },
  { id: "Supplier", label: "Suppliers", count: "supplierCount" },
  { id: "Distributor", label: "Distributors", count: "distributorCount" },
];

const ROLES = { Supplier: "SUPPLIER", Distributor: "DISTRIBUTOR" } as const;

const SORTS = ["All matches", "Strong matches", "Expiring soonest"];

function CardPlaceholder() {
  return (
    <div
      aria-hidden
      className="h-37 w-full max-w-166.5 animate-pulse rounded-xl bg-grey-100"
    />
  );
}

export function OpportunityList() {
  const [tab, setTab] = useState<OpportunityFilter>("all");
  const [sort, setSort] = useState(SORTS[0]!);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const {
    data,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useOpportunities({
    borrowerRole: tab === "all" ? undefined : ROLES[tab],
    matchLevel: sort === "Strong matches" ? "STRONG" : undefined,
  });

  const counts = data?.pages[0];
  const items = (data?.pages ?? []).flatMap((page) =>
    page.opportunities.payload.map(toOpportunity),
  );
  // The service has no sort parameter, so this orders only what has loaded.
  const visible =
    sort === "Expiring soonest"
      ? [...items].sort((a, b) => a.expiresAt.localeCompare(b.expiresAt))
      : items;

  return (
    <>
      <div
        role="tablist"
        aria-label="Opportunity type"
        className="flex w-fit overflow-hidden rounded-t-md border-x border-t border-grey-200"
      >
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={`relative flex h-20.75 w-45 flex-col items-start gap-1.5 px-md py-sm text-left not-last:border-r border-grey-200 ${
                active ? "bg-white" : "border-b bg-grey-50"
              }`}
            >
              {active ? (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1.25 rounded-b-sm bg-evergreen-500"
                />
              ) : null}
              <span className="text-body text-grey-800">{item.label}</span>
              <span className="font-sans text-xl/normal font-medium text-grey-900">
                {counts ? (
                  counts[item.count]
                ) : (
                  <TextPlaceholder className="w-6" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-md pt-lg">
        <h2 className="min-w-0 flex-1 font-sans text-xl/normal font-medium text-grey-900">
          {tab === "all" ? "All opportunities" : `${tab}s`}
        </h2>
        <FilterBar>
          <Select
            aria-label="Filter opportunities"
            value={sort}
            onValueChange={setSort}
            options={SORTS}
            className="w-29.75"
            variant="chip"
          />
        </FilterBar>
      </div>

      <div className="flex flex-col gap-md pt-md">
        {isPending ? (
          <>
            <CardPlaceholder />
            <CardPlaceholder />
          </>
        ) : isError ? (
          <p className="text-body-sm text-grey-500">
            We couldn&rsquo;t load your matched opportunities. Please refresh to
            try again.
          </p>
        ) : visible.length === 0 ? (
          <p className="text-body-sm text-grey-500">
            {tab === "all" && sort === SORTS[0]
              ? "No matched opportunities yet. We’ll list them here as soon as one fits your mandate."
              : "No opportunities match this filter."}
          </p>
        ) : (
          visible.map((item, index) => (
            <OpportunityCard
              key={item.id}
              item={item}
              onSelect={() => setOpenIndex(index)}
            />
          ))
        )}

        {hasNextPage ? (
          <div>
            <Button
              variant="outline"
              size="form"
              loading={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              Load more
            </Button>
          </div>
        ) : null}
      </div>

      {openIndex !== null && visible[openIndex] ? (
        <OpportunityDetailModal
          key={visible[openIndex].id}
          item={visible[openIndex]}
          detail={detailFor(visible[openIndex])}
          onClose={() => setOpenIndex(null)}
          // The list refetches without it, so there is nothing to step to.
          onDismissOpportunity={() => setOpenIndex(null)}
          onPrev={openIndex > 0 ? () => setOpenIndex(openIndex - 1) : undefined}
          onNext={
            openIndex < visible.length - 1
              ? () => setOpenIndex(openIndex + 1)
              : undefined
          }
        />
      ) : null}
    </>
  );
}
