"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterMailCircleIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { Select } from "@repo/ui/select";
import { DataTable } from "@repo/ui/data-table";
import { FilterBar } from "@repo/ui/filter-bar";
import { InitialsAvatar } from "@repo/ui/avatars";
import { StatusChip } from "./status-chip";
import { HealthDots } from "./health-dots";
import { CUSTOMER_STATUS, HEALTH, type Customer } from "../types/customer";

const KINDS = ["All customers", "Suppliers", "Distributors"];
const STATUSES = [
  "Any status",
  ...Object.values(CUSTOMER_STATUS).map((status) => status.label),
];
const HEALTHS = [
  "Portfolio health",
  ...Object.values(HEALTH).map((health) => health.label),
];

export function PortfolioTable({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState(KINDS[0]!);
  const [status, setStatus] = useState(STATUSES[0]!);
  const [health, setHealth] = useState(HEALTHS[0]!);

  const visible = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (kind === "All customers" || kind.startsWith(customer.kind)) &&
      (status === "Any status" ||
        CUSTOMER_STATUS[customer.status].label === status) &&
      (health === "Portfolio health" ||
        HEALTH[customer.health].label === health),
  );

  return (
    <>
      <div className="flex items-center px-lg">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-md border-b border-grey-100 pb-md">
          <label className="flex h-8.25 w-81.75 max-w-full items-center gap-xs overflow-hidden rounded-md bg-grey-100 px-sm py-xs focus-within:outline-2 focus-within:outline-evergreen-600">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="flex-none text-grey-500"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search customer"
              aria-label="Search customer"
              className="min-w-0 flex-1 bg-transparent font-sans text-body/[normal] font-medium text-grey-900 outline-none placeholder:text-grey-500"
            />
          </label>

          <FilterBar>
            <Select
              aria-label="Filter by customer type"
              variant="chip"
              value={kind}
              onValueChange={setKind}
              options={KINDS}
            />
            <Select
              aria-label="Filter by status"
              variant="chip"
              value={status}
              onValueChange={setStatus}
              options={STATUSES}
            />
            <Select
              aria-label="Filter by portfolio health"
              variant="chip"
              value={health}
              onValueChange={setHealth}
              options={HEALTHS}
            />
          </FilterBar>
        </div>
      </div>

      <div className="bg-white px-lg">
        <DataTable
          rows={visible}
          gap={48}
          rowKey={(customer) => customer.id}
          rowHref={(customer) => `/portfolio/${customer.id}`}
          unread={(customer) => Boolean(customer.unread)}
          empty="No customers match these filters."
          columns={[
            {
              header: "Customer",
              cell: (customer) => (
                <>
                  <InitialsAvatar initials={customer.initials} size={40} />
                  <span className="ml-xs flex min-w-0 flex-1 flex-col justify-center gap-1">
                    <span className="font-sans text-body-sm/[normal] font-medium text-eucalyptus-900">
                      {customer.name}
                    </span>
                    <span className="text-caption/[normal] text-grey-800">
                      {customer.kind}
                    </span>
                  </span>
                </>
              ),
            },
            {
              header: "Outstanding balance",
              width: 152,
              cell: (customer) => customer.outstanding,
            },
            {
              header: "Repayment due",
              width: 140,
              cell: (customer) => customer.repaymentDue,
            },
            {
              header: "Status",
              width: 106,
              cell: (customer) => <StatusChip status={customer.status} />,
            },
            {
              header: "Portfolio health",
              width: 124,
              cell: (customer) => <HealthDots level={customer.health} />,
            },
          ]}
        />
      </div>
    </>
  );
}
