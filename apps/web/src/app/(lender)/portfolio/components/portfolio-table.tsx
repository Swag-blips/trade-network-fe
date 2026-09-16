"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterMailCircleIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { Select } from "@repo/ui/select";
import { InitialsAvatar } from "@/components/avatars";
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

          <div className="flex flex-none items-center gap-md">
            <span className="flex items-center gap-xs">
              <HugeiconsIcon
                icon={FilterMailCircleIcon}
                size={20}
                className="text-grey-600"
              />
              <span className="text-body-sm/[normal] whitespace-nowrap text-grey-600">
                Filter by:
              </span>
            </span>
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
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-xs overflow-hidden bg-white">
        <div className="flex h-8.75 items-center px-lg">
          <div className="type-overline flex h-full min-w-0 flex-1 items-center gap-12 bg-grey-50 px-sm tracking-[0.24px] text-grey-500">
            <span className="min-w-0 flex-1">Customer</span>
            <span className="w-38 flex-none">Outstanding balance</span>
            <span className="w-35 flex-none">Repayment due</span>
            <span className="w-26.5 flex-none">Status</span>
            <span className="w-31 flex-none">Portfolio health</span>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="px-lg py-md text-body-sm text-grey-500">
            No customers match these filters.
          </p>
        ) : (
          <div className="flex flex-col gap-xs px-lg">
            {visible.map((customer) => (
              <Link
                key={customer.id}
                href={`/portfolio/${customer.id}`}
                className="relative flex items-center gap-12 rounded-md px-sm py-2.5 hover:bg-grey-50"
              >
                <span className="flex min-w-0 flex-1 items-center gap-xs">
                  {customer.unread ? (
                    <span
                      aria-label="Unread"
                      className="absolute top-px left-1.75 size-3 rounded-full bg-evergreen-900"
                    />
                  ) : null}
                  <InitialsAvatar initials={customer.initials} size={40} />
                  <span className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                    <span className="font-sans text-body-sm/[normal] font-medium text-eucalyptus-900">
                      {customer.name}
                    </span>
                    <span className="text-caption/[normal] text-grey-800">
                      {customer.kind}
                    </span>
                  </span>
                </span>
                <span className="w-38 flex-none text-body-sm/[normal] text-grey-800">
                  {customer.outstanding}
                </span>
                <span className="w-35 flex-none text-body-sm/[normal] text-grey-800">
                  {customer.repaymentDue}
                </span>
                <span className="flex w-26.5 flex-none items-center">
                  <StatusChip status={customer.status} />
                </span>
                <span className="flex w-31 flex-none items-center">
                  <HealthDots level={customer.health} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
