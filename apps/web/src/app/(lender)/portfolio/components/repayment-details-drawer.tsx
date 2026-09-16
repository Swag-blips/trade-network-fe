"use client";

import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";
import type { Repayment } from "../types/customer";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-center gap-1 text-body">
      <p className="min-w-0 flex-1 text-grey-600">{label}</p>
      <p className="flex-none whitespace-nowrap text-grey-900">{value}</p>
    </div>
  );
}

export function RepaymentDetailsDrawer({
  repayment,
  onClose,
}: {
  repayment: Repayment;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="repayment-details-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="mt-0 mr-0 mb-0 ml-auto h-full max-h-full w-136 max-w-full overflow-y-auto bg-white p-0 backdrop:bg-grey-900/40"
    >
      <header className="flex w-full items-center gap-md border-b border-grey-100 px-lg py-md">
        <h2
          id="repayment-details-title"
          className="min-w-0 flex-1 font-sans text-body/[normal] text-black"
        >
          Details
        </h2>
        <IconButton label="Close" size="xs" onClick={onClose}>
          <HugeiconsIcon icon={Cancel01Icon} />
        </IconButton>
      </header>

      <div className="flex w-full flex-col gap-2.5 px-md py-2.5">
        <div className="flex w-full flex-col items-center justify-center gap-xs rounded-xl border border-evergreen-100 bg-evergreen-50 px-xl py-lg text-center">
          <p className="w-full text-body/[normal] text-grey-600">Amount paid</p>
          <p className="w-full font-brand text-[2rem]/[1.3] font-medium tracking-[0.256px] text-evergreen-500">
            {repayment.amount}
          </p>
        </div>

        <section className="flex w-full flex-col items-center justify-center gap-md rounded-xl border border-grey-100 bg-white px-5 py-2.5">
          <h3 className="w-full font-sans text-body font-medium text-grey-900">
            Repayment details
          </h3>
          <Row label="Outstanding balance" value={repayment.remainingBalance} />
          <Row label="Date recorded" value={repayment.date} />
          <Row label="Trade ID" value={repayment.tradeId} />
        </section>
      </div>
    </dialog>
  );
}
