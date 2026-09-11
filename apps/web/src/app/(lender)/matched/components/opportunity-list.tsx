"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterMailCircleIcon } from "@hugeicons/core-free-icons";
import { Select } from "@repo/ui/select";
import { OpportunityCard } from "./opportunity-card";
import { OpportunityDetailModal } from "./opportunity-detail";
import type {
  Opportunity,
  OpportunityDetail,
  OpportunityFilter,
} from "../types/opportunity";

const TABS: { id: OpportunityFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Supplier", label: "Suppliers" },
  { id: "Distributor", label: "Distributors" },
];

const SORTS = ["All matches", "Strong matches", "Expiring soonest"];

export function OpportunityList({
  items,
  details,
}: {
  items: Opportunity[];
  details: Record<string, OpportunityDetail>;
}) {
  const [tab, setTab] = useState<OpportunityFilter>("all");
  const [sort, setSort] = useState(SORTS[0]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const remaining = items.filter((item) => !dismissed.includes(item.id));
  const countFor = (id: OpportunityFilter) =>
    id === "all"
      ? remaining.length
      : remaining.filter((i) => i.kind === id).length;

  const visible = items
    .filter((item) => !dismissed.includes(item.id))
    .filter((item) => tab === "all" || item.kind === tab)
    .filter((item) => sort !== "Strong matches" || item.match >= 80);

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
              className={`relative flex h-[83px] w-[180px] flex-col items-start gap-1.5 px-md py-sm text-left not-last:border-r border-grey-200 ${
                active ? "bg-white" : "border-b bg-grey-50"
              }`}
            >
              {active ? (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[5px] rounded-b-[4px] bg-evergreen-500"
                />
              ) : null}
              <span className="text-body text-grey-800">{item.label}</span>
              <span className="font-sans text-[1.25rem]/[1.5] font-medium text-grey-900">
                {countFor(item.id)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-md pt-lg">
        <h2 className="min-w-0 flex-1 font-sans text-[1.25rem]/[1.5] font-medium text-grey-900">
          {tab === "all" ? "All opportunities" : `${tab}s`}
        </h2>
        <span className="flex flex-none items-center gap-sm">
          <HugeiconsIcon
            icon={FilterMailCircleIcon}
            size={20}
            className="text-grey-800"
          />
          <span className="text-body-sm/[normal] text-grey-800">
            Filter by:
          </span>
          <Select
            aria-label="Filter opportunities"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-[29px] w-[119px]"
          >
            {SORTS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </Select>
        </span>
      </div>

      <div className="flex flex-col gap-md pt-md">
        {visible.length === 0 ? (
          <p className="text-body-sm text-grey-500">
            No opportunities match this filter.
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
      </div>

      {openIndex !== null && visible[openIndex] ? (
        <OpportunityDetailModal
          key={visible[openIndex].id}
          item={visible[openIndex]}
          detail={details[visible[openIndex].id]!}
          onClose={() => setOpenIndex(null)}
          onDismissOpportunity={() => {
            setDismissed([...dismissed, visible[openIndex]!.id]);
            setOpenIndex(null);
          }}
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
