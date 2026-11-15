"use client";

import { Button } from "@repo/ui/button";
import { FormDialog } from "@/components/form-dialog";
import { ScheduleTable } from "@/components/schedule-table";
import type { Offer } from "../types/inbox";
import { repaymentSchedule } from "../utils/schedule";

export function RepaymentScheduleModal({
  offer,
  disbursedAt,
  onClose,
}: {
  offer: Offer;
  disbursedAt?: string | null;
  onClose: () => void;
}) {
  const rows = repaymentSchedule(
    offer.repayment,
    offer.tenorDays,
    disbursedAt ? new Date(disbursedAt) : new Date(),
  );

  return (
    <FormDialog
      title="Repayment schedule"
      className="w-164.25"
      dismissible={false}
      onClose={onClose}
      footer={
        <Button type="button" variant="tertiary" size="auth" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-md">
        <p className="text-body/[normal] text-grey-600">
          Due dates depend on the loan disbursement date.
        </p>
        <ScheduleTable rows={rows} total={offer.repayment} />
      </div>
    </FormDialog>
  );
}
