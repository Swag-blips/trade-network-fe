"use client";

import { useState } from "react";
import { Avatar } from "@repo/ui/avatar";
import { DataTable } from "@repo/ui/data-table";
import { SearchInput } from "@repo/ui/search-input";
import { Select } from "@repo/ui/select";
import { HealthChip } from "./health-chip";
import { PORTFOLIO_HEALTH, type Customer } from "../types/customer";
import { parseAmount, withKobo } from "@/utils/naira";

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
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search company"
          className="w-91.75"
        />

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
                {withKobo(parseAmount(customer.outstanding))}
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
