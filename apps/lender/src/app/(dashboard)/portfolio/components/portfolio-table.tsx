"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Avatar } from "@repo/ui/avatar";
import { DataTable } from "@repo/ui/data-table";
import { Select } from "@repo/ui/select";
import { HealthChip } from "./health-chip";
import { PORTFOLIO_HEALTH, type Customer } from "../types/customer";
import { toAmount, withKobo } from "../utils/amount";

const ANY = "Any Status";
const STATUSES = [
  ANY,
  ...new Set(Object.values(PORTFOLIO_HEALTH).map((health) => health.label)),
];

export function PortfolioTable({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ANY);

  const visible = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (status === ANY || PORTFOLIO_HEALTH[customer.health].label === status),
  );

  return (
    <div className="flex flex-col rounded-xl border border-grey-100 bg-white shadow-small-thick">
      <div className="flex items-center justify-between gap-md px-md py-2.5">
        <label className="flex w-91.75 max-w-full items-center gap-xs overflow-hidden rounded-full border border-grey-200 bg-grey-50 px-sm py-xs focus-within:outline-2 focus-within:outline-evergreen-600">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="flex-none text-grey-900"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search company"
            aria-label="Search company"
            className="min-w-0 flex-1 bg-transparent font-sans text-body/[normal] font-medium text-grey-900 outline-none placeholder:text-grey-400"
          />
        </label>

        <Select
          aria-label="Filter by portfolio health"
          variant="filter"
          value={status}
          onValueChange={setStatus}
          options={STATUSES}
        />
      </div>

      <DataTable
        variant="cards"
        rows={visible}
        gap={32}
        rowKey={(customer) => customer.id}
        rowHref={(customer) => `/portfolio/${customer.id}`}
        empty="No companies match these filters."
        columns={[
          {
            header: `Company (${visible.length})`,
            cell: (customer) => (
              <span className="flex min-w-0 items-center gap-md">
                <Avatar
                  name={customer.name}
                  size={40}
                  shape="square"
                  className="border border-grey-200 bg-grey-50 text-grey-600"
                />
                <span className="truncate font-medium text-evergreen-600">
                  {customer.name}
                </span>
              </span>
            ),
          },
          {
            header: "Active loans",
            width: 172,
            cell: (customer) => customer.activeTrades,
          },
          {
            header: "Next repayment",
            width: 172,
            cell: (customer) => customer.repaymentDue,
          },
          {
            header: "Outstanding amount (NGN)",
            width: 190,
            cell: (customer) => (
              <span className="font-medium">
                {withKobo(toAmount(customer.outstanding))}
              </span>
            ),
          },
          {
            header: "Portfolio health",
            width: 140,
            cell: (customer) => <HealthChip level={customer.health} />,
          },
        ]}
      />
    </div>
  );
}
