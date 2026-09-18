"use client";

import { DetailRow } from "@repo/ui/detail-row";
import { Panel } from "@repo/ui/panel";
import { Sheet } from "@repo/ui/sheet";
import type { Repayment } from "../types/customer";

export function RepaymentDetailsDrawer({
  repayment,
  onClose,
}: {
  repayment: Repayment;
  onClose: () => void;
}) {
  return (
    <Sheet title="Details" onClose={onClose}>
      <div className="flex w-full flex-col gap-2.5 px-md py-2.5">
        <div className="flex w-full flex-col items-center justify-center gap-xs rounded-xl border border-evergreen-100 bg-evergreen-50 px-xl py-lg text-center">
          <p className="w-full text-body/[normal] text-grey-600">Amount paid</p>
          <p className="w-full font-brand text-[2rem]/[1.3] font-medium tracking-[0.256px] text-evergreen-500">
            {repayment.amount}
          </p>
        </div>

        <Panel title="Repayment details">
          <DetailRow label="Outstanding balance">
            {repayment.remainingBalance}
          </DetailRow>
          <DetailRow label="Date recorded">{repayment.date}</DetailRow>
          <DetailRow label="Trade ID">{repayment.tradeId}</DetailRow>
        </Panel>
      </div>
    </Sheet>
  );
}
