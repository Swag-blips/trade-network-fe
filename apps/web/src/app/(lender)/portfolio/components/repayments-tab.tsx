import { HugeiconsIcon } from "@hugeicons/react";
import { ReceiptIcon } from "@hugeicons/core-free-icons";
import type { Customer } from "../types/customer";

export function RepaymentsTab({ customer }: { customer: Customer }) {
  return (
    <div className="flex w-full flex-col gap-lg">
      <h2 className="w-full font-sans text-[1.25rem]/[1.5] font-medium text-grey-900">
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
          <div className="type-overline flex h-[35px] items-center gap-[52px] bg-grey-50 px-sm tracking-[0.24px] text-grey-500">
            <span className="w-[160px] flex-none">Date</span>
            <span className="min-w-[176px] flex-1">Method</span>
            <span className="w-[160px] flex-none">Amount</span>
          </div>
          {customer.repayments.map((repayment) => (
            <div
              key={repayment.id}
              className="flex items-center gap-[52px] rounded-md px-sm py-2.5"
            >
              <span className="w-[160px] flex-none text-body-sm/[normal] text-grey-800">
                {repayment.date}
              </span>
              <span className="min-w-[176px] flex-1 text-body-sm/[normal] text-grey-800">
                {repayment.method}
              </span>
              <span className="w-[160px] flex-none text-body-sm/[normal] text-grey-800">
                {repayment.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
