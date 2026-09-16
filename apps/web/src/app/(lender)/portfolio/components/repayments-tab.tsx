"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ReceiptIcon } from "@hugeicons/core-free-icons";
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
        <div className="flex w-full flex-col gap-xs">
          <div className="type-overline flex h-8.75 items-center gap-13 bg-grey-50 px-sm tracking-[0.24px] text-grey-500">
            <span className="w-27 flex-none">Date</span>
            <span className="w-27 flex-none">Trade ID</span>
            <span className="min-w-0 flex-1">Repayment amount</span>
            <span className="w-40 flex-none">Remaining balance</span>
            <span className="w-40 flex-none">Action</span>
          </div>
          {customer.repayments.map((repayment) => (
            <div
              key={repayment.id}
              className="flex items-center gap-13 rounded-md px-sm py-2.5 text-body-sm/[normal] text-grey-800"
            >
              <span className="w-27 flex-none">{repayment.date}</span>
              <span className="w-27 flex-none">{repayment.tradeId}</span>
              <span className="min-w-0 flex-1">{repayment.amount}</span>
              <span className="w-40 flex-none">
                {repayment.remainingBalance}
              </span>
              <span className="w-40 flex-none">
                <button
                  type="button"
                  onClick={() => setOpen(repayment)}
                  className="cursor-pointer font-sans font-medium text-evergreen-600 hover:underline"
                >
                  View receipt
                </button>
              </span>
            </div>
          ))}
        </div>
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
