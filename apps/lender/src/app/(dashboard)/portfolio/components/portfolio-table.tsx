"use client";

import { useState } from "react";
import { Avatar } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { DataTable } from "@repo/ui/data-table";
import { withKobo } from "@/utils/naira";
import { shortDate } from "@/utils/date";
import { EmptyState } from "./empty-state";
import { HealthChip } from "./health-chip";
import { ANY_STATUS, TablePanel } from "./table-panel";
import { useBorrowers } from "../hooks/use-borrowers";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { PORTFOLIO_HEALTH } from "../types/portfolio";

const STATUSES = Object.values(PORTFOLIO_HEALTH).map((health) => health.label);

export function PortfolioTable() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ANY_STATUS);
  const search = useDebouncedValue(query.trim());
  const {
    data,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useBorrowers(search);

  const borrowers = data?.pages.flatMap((page) => page.items) ?? [];
  const visible = borrowers.filter(
    (borrower) =>
      status === ANY_STATUS ||
      PORTFOLIO_HEALTH[borrower.health].label === status,
  );

  if (!search && !isPending && borrowers.length === 0) {
    return (
      <EmptyState
        title={
          isError
            ? "We couldn't load your portfolio"
            : "No trades have been funded"
        }
        bodyWidth="w-91.75"
        className="min-h-57.75 rounded-xl border border-grey-100 bg-white px-md shadow-small-thick"
      >
        {isError
          ? "Refresh the page to try again."
          : "View your financed businesses here to track facilities, repayments, and trade signals."}
      </EmptyState>
    );
  }

  return (
    <TablePanel
      query={query}
      onQueryChange={setQuery}
      placeholder="Search company"
      status={status}
      onStatusChange={setStatus}
      statuses={STATUSES}
      filterLabel="Filter by portfolio health"
    >
      <DataTable
        variant="cards"
        rows={visible}
        gap={32}
        rowKey={(borrower) => borrower.id}
        rowHref={(borrower) => `/portfolio/${borrower.id}`}
        empty={
          isPending ? "Loading companies…" : "No companies match these filters."
        }
        columns={[
          {
            header: `Company (${visible.length})`,
            cell: (borrower) => (
              <span className="flex min-w-0 items-center gap-md">
                <Avatar
                  name={borrower.name}
                  size={40}
                  shape="square"
                  className="border border-grey-200 bg-grey-50 text-grey-600"
                />
                <span className="truncate font-medium text-evergreen-600">
                  {borrower.name}
                </span>
              </span>
            ),
          },
          {
            header: "Active loans",
            width: 172,
            cell: (borrower) => borrower.activeFundings,
          },
          {
            header: "Next repayment",
            width: 172,
            cell: (borrower) => (
              <span className={borrower.overdue ? "text-red-error-500" : ""}>
                {borrower.nextRepaymentAt
                  ? shortDate(borrower.nextRepaymentAt)
                  : "—"}
              </span>
            ),
          },
          {
            header: "Outstanding amount (NGN)",
            width: 190,
            cell: (borrower) => (
              <span
                className={`font-medium ${borrower.overdue ? "text-red-error-500" : ""}`}
              >
                {withKobo(borrower.outstanding)}
              </span>
            ),
          },
          {
            header: "Portfolio health",
            width: 140,
            cell: (borrower) => <HealthChip level={borrower.health} />,
          },
        ]}
      />
      {hasNextPage ? (
        <div className="flex justify-center px-md pb-md">
          <Button
            variant="tertiary"
            size="form"
            loading={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            Load more
          </Button>
        </div>
      ) : null}
    </TablePanel>
  );
}
