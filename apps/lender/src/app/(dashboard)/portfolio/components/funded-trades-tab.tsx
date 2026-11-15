"use client";

import { useState } from "react";
import {
  Alert01Icon,
  AlertCircleIcon,
  Clock02Icon,
  SirenIcon,
} from "@hugeicons/core-free-icons";
import { DataTable } from "@repo/ui/data-table";
import { withKobo } from "@/utils/naira";
import { shortDate } from "@/utils/date";
import { StatCard } from "./stat-card";
import { StatusChip } from "./status-chip";
import { ANY_STATUS, TablePanel } from "./table-panel";
import { useFundings } from "../hooks/use-fundings";
import { TRADE_STATUS, type Borrower } from "../types/portfolio";

const STATUSES = Object.values(TRADE_STATUS).map((status) => status.label);

export function FundedTradesTab({ borrower }: { borrower: Borrower }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ANY_STATUS);
  const { data: fundings = [], isPending, isError } = useFundings(borrower.id);

  const search = query.trim().replace(/^#/, "").toLowerCase();
  const visible = fundings.filter(
    (funding) =>
      funding.reference.toLowerCase().includes(search) &&
      (status === ANY_STATUS || TRADE_STATUS[funding.status].label === status),
  );

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-stretch gap-2.5">
        <StatCard
          label="Credit exposure"
          value={`₦ ${withKobo(borrower.outstanding)}`}
          valueClassName="text-red-error-500"
          icon={SirenIcon}
        />
        <StatCard
          label="Outstanding"
          value={borrower.fundings.active}
          icon={AlertCircleIcon}
        />
        <StatCard
          label="Due soon"
          value={borrower.fundings.dueSoon}
          icon={Clock02Icon}
        />
        <StatCard
          label="Overdue"
          value={borrower.fundings.overdue}
          icon={Alert01Icon}
        />
      </div>

      <TablePanel
        query={query}
        onQueryChange={setQuery}
        placeholder="Search trade ID"
        status={status}
        onStatusChange={setStatus}
        statuses={STATUSES}
        filterLabel="Filter trades by status"
      >
        <DataTable
          variant="cards"
          rows={visible}
          gap={32}
          rowKey={(funding) => funding.id}
          rowHref={(funding) => `/portfolio/${borrower.id}/${funding.id}`}
          empty={
            isPending
              ? "Loading trades…"
              : isError
                ? "We couldn't load these trades."
                : fundings.length === 0
                  ? "No trades have been funded for this company."
                  : "No trades match these filters."
          }
          columns={[
            {
              header: "ID",
              cell: (funding) => (
                <span className="font-medium text-evergreen-600">
                  {funding.reference}
                </span>
              ),
            },
            {
              header: "Amount financed (NGN)",
              width: 190,
              cell: (funding) => (
                <span className="font-medium">{withKobo(funding.amount)}</span>
              ),
            },
            {
              header: "Next repayment",
              width: 172,
              cell: (funding) => (
                <span
                  className={
                    funding.status === "overdue" ? "text-red-error-500" : ""
                  }
                >
                  {funding.nextRepaymentAt
                    ? shortDate(funding.nextRepaymentAt)
                    : "—"}
                </span>
              ),
            },
            {
              header: "Outstanding amount (NGN)",
              width: 190,
              cell: (funding) => (
                <span
                  className={`font-medium ${funding.status === "overdue" ? "text-red-error-500" : ""}`}
                >
                  {withKobo(funding.outstanding)}
                </span>
              ),
            },
            {
              header: "Status",
              width: 172,
              cell: (funding) => <StatusChip status={funding.status} />,
            },
          ]}
        />
      </TablePanel>
    </div>
  );
}
