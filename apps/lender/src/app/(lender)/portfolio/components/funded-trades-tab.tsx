"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Invoice01Icon } from "@hugeicons/core-free-icons";
import { Select } from "@repo/ui/select";
import { DataTable } from "@repo/ui/data-table";
import { FilterBar } from "@repo/ui/filter-bar";
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

export function FundedTradesTab({
  customer,
  onRecordRepayment,
}: {
  customer: Customer;
  onRecordRepayment?: (tradeId: string) => void;
}) {
  const [status, setStatus] = useState(STATUSES[0]!);
  const [open, setOpen] = useState<FundedTrade | null>(null);

  const visible = customer.trades.filter(
    (trade) =>
      status === "Any status" || CUSTOMER_STATUS[trade.status].label === status,
  );

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center gap-md">
        <h2 className="min-w-0 flex-1 font-sans text-xl/normal font-medium text-grey-900">
          Funded trades
        </h2>
        <FilterBar>
          <Select
            aria-label="Filter trades by status"
            variant="chip"
            value={status}
            onValueChange={setStatus}
            options={STATUSES}
          />
        </FilterBar>
      </div>

      <div className="mt-md w-full">
        <DataTable
          rows={visible}
          gap={52}
          rowKey={(trade) => trade.id}
          onRowClick={setOpen}
          empty="No trades match this filter."
          columns={[
            {
              header: "Trade ID",
              width: 108,
              cell: (trade) => (
                <>
                  <span className="flex size-8 flex-none items-center justify-center rounded-full bg-evergreen-100">
                    <HugeiconsIcon
                      icon={Invoice01Icon}
                      size={16}
                      className="text-evergreen-700"
                    />
                  </span>
                  <span className="ml-xs font-sans">{trade.id}</span>
                </>
              ),
            },
            { header: "Funding type", cell: (trade) => trade.fundingType },
            {
              header: "Outstanding balance",
              width: 160,
              cell: (trade) => trade.outstanding,
            },
            { header: "Due date", width: 160, cell: (trade) => trade.dueDate },
            {
              header: "Status",
              width: 124,
              cell: (trade) => <StatusChip status={trade.status} />,
            },
          ]}
        />
      </div>

      {open ? (
        <FundedTradeDrawer
          trade={open}
          onClose={() => setOpen(null)}
          onRecordRepayment={() => {
            setOpen(null);
            onRecordRepayment?.(open.id);
          }}
        />
      ) : null}
    </div>
  );
}
