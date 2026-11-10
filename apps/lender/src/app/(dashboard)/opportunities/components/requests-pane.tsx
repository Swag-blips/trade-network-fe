"use client";

import type { ReactNode } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Alert02Icon,
  Clock02Icon,
  SearchList01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { Tabs } from "@repo/ui/tabs";
import { OpportunityCard } from "./opportunity-card";
import type { OpportunitySummary } from "../types/opportunity";

const TABS = ["Requests", "Inbox"] as const;
export type Pane = (typeof TABS)[number];
const SHOW = ["All", "New"] as const;
export type Show = (typeof SHOW)[number];

export type ListState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "searching" }
  | {
      kind: "ready";
      items: OpportunitySummary[];
      hasMore: boolean;
      loadingMore: boolean;
      onLoadMore: () => void;
    };

export function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-none gap-xs border-b border-grey-100 px-md py-2.5"
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`h-6.75 cursor-pointer rounded-full border px-sm font-sans text-body-sm/[normal] font-medium transition-colors motion-reduce:transition-none ${
              active
                ? "border-evergreen-500 bg-evergreen-500 text-white"
                : "border-grey-200 bg-white text-grey-600 hover:bg-grey-50"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function EmptyState({ icon, text }: { icon: IconSvgElement; text: string }) {
  return (
    <div className="flex justify-center px-md pt-3xl">
      <div className="flex w-62.5 flex-col items-center gap-md text-center">
        <HugeiconsIcon icon={icon} size={32} className="text-grey-900" />
        <p className="text-body/6 font-medium text-grey-600">{text}</p>
      </div>
    </div>
  );
}

function CardPlaceholder() {
  return (
    <div aria-hidden className="flex gap-md p-md">
      <span className="size-10 flex-none animate-pulse rounded-md bg-grey-100" />
      <span className="flex flex-1 flex-col gap-xs">
        <span className="h-4 w-40 animate-pulse rounded-sm bg-grey-100" />
        <span className="h-3.5 w-24 animate-pulse rounded-sm bg-grey-100" />
        <span className="mt-1 h-6 w-52 animate-pulse rounded-full bg-grey-100" />
      </span>
    </div>
  );
}

export function RequestsPane({
  list,
  selectedId,
  onSelect,
  show,
  onShowChange,
  tab,
  onTabChange,
  inbox,
}: {
  list: ListState;
  selectedId?: string;
  onSelect: (id: string) => void;
  show: Show;
  onShowChange: (show: Show) => void;
  tab: Pane;
  onTabChange: (tab: Pane) => void;
  /** Omitted while there is nothing to show in it. */
  inbox?: ReactNode;
}) {
  const searching = list.kind === "searching";

  return (
    <div className="flex w-94.5 flex-none flex-col border-r border-grey-100 bg-white shadow-small-thick">
      <Tabs
        label="Opportunities"
        tabs={inbox ? TABS : TABS.slice(0, 1)}
        value={inbox ? tab : "Requests"}
        onChange={onTabChange}
        className="flex-none px-md pt-2.5"
      />

      {tab === "Inbox" && inbox ? (
        <div
          role="tabpanel"
          aria-label="Inbox"
          className="flex min-h-px flex-1 flex-col"
        >
          {inbox}
        </div>
      ) : (
        <div
          role="tabpanel"
          aria-label="Requests"
          className="flex min-h-px flex-1 flex-col"
        >
          {searching ? (
            <EmptyState
              icon={Clock02Icon}
              text="Finding matching opportunities..."
            />
          ) : (
            <>
              <PillGroup
                label="Show"
                options={SHOW}
                value={show}
                onChange={onShowChange}
              />

              {list.kind === "loading" ? (
                <div className="flex flex-col gap-1">
                  <CardPlaceholder />
                  <CardPlaceholder />
                </div>
              ) : list.kind === "error" ? (
                <EmptyState
                  icon={Alert02Icon}
                  text="We couldn't load your opportunities. Please refresh to try again."
                />
              ) : list.items.length === 0 ? (
                <EmptyState
                  icon={SearchList01Icon}
                  text="No opportunities match this filter."
                />
              ) : (
                <div className="flex min-h-px flex-1 flex-col gap-1 overflow-y-auto">
                  {list.items.map((item) => (
                    <OpportunityCard
                      key={item.id}
                      item={item}
                      selected={item.id === selectedId}
                      onSelect={() => onSelect(item.id)}
                    />
                  ))}
                  {list.hasMore ? (
                    <div className="flex justify-center p-md">
                      <Button
                        variant="tertiary"
                        size="form"
                        loading={list.loadingMore}
                        onClick={list.onLoadMore}
                      >
                        Load more
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
