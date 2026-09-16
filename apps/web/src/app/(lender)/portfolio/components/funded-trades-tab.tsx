"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterMailCircleIcon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import { Select } from "@repo/ui/select";
import { useToast } from "@repo/ui/toast";
import { StatusChip } from "./status-chip";
import { FundedTradeDrawer } from "./funded-trade-drawer";
import {
  CUSTOMER_STATUS,
  type Customer,
  type FundedTrade,
} from "../types/customer";

const STATUSES = [
  "Any status",
  ...Object.values(CUSTOMER_STATUS).map((status) => status.label),
];

export function FundedTradesTab({ customer }: { customer: Customer }) {
  const [status, setStatus] = useState(STATUSES[0]!);
  const [open, setOpen] = useState<FundedTrade | null>(null);
  const { toast } = useToast();

  const visible = customer.trades.filter(
    (trade) =>
      status === "Any status" || CUSTOMER_STATUS[trade.status].label === status,
  );

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center gap-md">
        <h2 className="min-w-0 flex-1 font-sans text-[1.25rem]/[1.5] font-medium text-grey-900">
          Funded trades
        </h2>
        <span className="flex flex-none items-center gap-md">
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
            aria-label="Filter trades by status"
            variant="chip"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {STATUSES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </Select>
        </span>
      </div>

      <div className="mt-md flex w-full flex-col gap-xs">
        <div className="type-overline flex h-[35px] items-center gap-[52px] bg-grey-50 px-sm tracking-[0.24px] text-grey-500">
          <span className="w-[108px] flex-none">Trade ID</span>
          <span className="min-w-[176px] flex-1">Funding type</span>
          <span className="w-[160px] flex-none">Outstanding balance</span>
          <span className="w-[160px] flex-none">Due date</span>
          <span className="w-[124px] flex-none">Status</span>
        </div>

        {visible.length === 0 ? (
          <p className="px-sm py-md text-body-sm text-grey-500">
            No trades match this filter.
          </p>
        ) : (
          visible.map((trade) => (
            <button
              key={trade.id}
              type="button"
              onClick={() => setOpen(trade)}
              className="flex cursor-pointer items-center gap-[52px] rounded-md px-sm py-2.5 text-left hover:bg-grey-50"
            >
              <span className="flex w-[108px] flex-none items-center gap-xs">
                <span className="flex size-8 flex-none items-center justify-center rounded-full bg-evergreen-100">
                  <HugeiconsIcon
                    icon={Invoice01Icon}
                    size={16}
                    className="text-evergreen-700"
                  />
                </span>
                <span className="font-sans text-body-sm/[normal] text-grey-800">
                  {trade.id}
                </span>
              </span>
              <span className="min-w-[176px] flex-1 text-body-sm/[normal] text-grey-800">
                {trade.fundingType}
              </span>
              <span className="w-[160px] flex-none text-body-sm/[normal] text-grey-800">
                {trade.outstanding}
              </span>
              <span className="w-[160px] flex-none text-body-sm/[normal] text-grey-800">
                {trade.dueDate}
              </span>
              <span className="flex w-[124px] flex-none items-center">
                <StatusChip status={trade.status} />
              </span>
            </button>
          ))
        )}
      </div>

      {open ? (
        <FundedTradeDrawer
          trade={open}
          onClose={() => setOpen(null)}
          onRecordRepayment={() => {
            setOpen(null);
            toast({ message: "Repayment recorded" });
          }}
        />
      ) : null}
    </div>
  );
}
