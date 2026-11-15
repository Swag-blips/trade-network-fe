"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScheduleTable } from "@/components/schedule-table";
import { usePermission } from "@/hooks/use-permission";
import { naira } from "@/utils/naira";
import { shortDate } from "@/utils/date";
import { useRecordRepayment } from "../../../hooks/use-record-repayment";
import {
  INSTALLMENT_STATUS,
  type Funding,
  type Installment,
} from "../../../types/portfolio";

export function RepaymentSchedule({ funding }: { funding: Funding }) {
  const canRecord = usePermission("repayments:record");
  const [confirming, setConfirming] = useState<Installment | null>(null);
  const { mutate: record, isPending: recording } = useRecordRepayment();

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-grey-100 bg-white shadow-small-thick">
      <h2 className="border-b border-grey-100 p-md font-sans text-xl/[1.3] font-medium tracking-[0.16px] text-grey-900">
        Repayment
      </h2>
      <div className="flex flex-col gap-md px-lg py-md">
        <p className="text-body/[normal] text-grey-600">
          {funding.installments.length > 0
            ? "View upcoming and scheduled repayments."
            : `The schedule starts once ${funding.borrower.name} confirms the funds have arrived.`}
        </p>
        {funding.installments.length > 0 ? (
          <ScheduleTable
            rows={funding.installments.map((installment) => ({
              label: `Installment ${installment.sequence}`,
              dueDate: installment.dueAt,
              amount: installment.amount,
              status: INSTALLMENT_STATUS[installment.status],
              overdue: installment.status === "overdue",
              action:
                canRecord && installment.status !== "paid" ? (
                  <Button
                    variant="outline"
                    size="pill"
                    onClick={() => setConfirming(installment)}
                  >
                    Mark as paid
                  </Button>
                ) : undefined,
            }))}
          />
        ) : null}
      </div>

      {confirming ? (
        <ConfirmDialog
          title="Record repayment?"
          confirmLabel="Mark as paid"
          loading={recording}
          onConfirm={() =>
            record(confirming.id, { onSettled: () => setConfirming(null) })
          }
          onClose={() => setConfirming(null)}
        >
          Confirm that {funding.borrower.name} has paid Installment{" "}
          {confirming.sequence} of {naira(confirming.amount)}, due{" "}
          {shortDate(confirming.dueAt)}. You can&apos;t undo this here.
        </ConfirmDialog>
      ) : null}
    </section>
  );
}
