"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ReceiptIcon } from "@hugeicons/core-free-icons";
import { DataTable } from "@repo/ui/data-table";
import { RepaymentDetailsDrawer } from "./repayment-details-drawer";
import type { Customer, Repayment } from "../types/customer";

export function RepaymentsTab({ customer }: { customer: Customer }) {
  const [open, setOpen] = useState<Repayment | null>(null);

  return (
    <div className="flex w-full flex-col gap-lg">
      <h2 className="w-full font-sans text-xl/normal font-medium text-grey-900">
        Repayment history
      </h2>

      {customer.repayments.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-xs py-2xl">
          <HugeiconsIcon
            icon={ReceiptIcon}
            size={32}
            className="text-grey-400"
          />
          <p className="text-body-sm text-grey-500">No repayments recorded</p>
        </div>
      ) : (
        <DataTable
          rows={customer.repayments}
          gap={52}
          rowKey={(repayment) => repayment.id}
          empty="No repayments recorded"
          columns={[
            { header: "Date", width: 108, cell: (r) => r.date },
            { header: "Trade ID", width: 108, cell: (r) => r.tradeId },
            { header: "Repayment amount", cell: (r) => r.amount },
            {
              header: "Remaining balance",
              width: 160,
              cell: (r) => r.remainingBalance,
            },
            {
              header: "Action",
              width: 160,
              cell: (r) => (
                <button
                  type="button"
                  onClick={() => setOpen(r)}
                  className="cursor-pointer font-sans font-medium text-evergreen-600 hover:underline"
                >
                  View receipt
                </button>
              ),
            },
          ]}
        />
      )}

      {open ? (
        <RepaymentDetailsDrawer
          repayment={open}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}
