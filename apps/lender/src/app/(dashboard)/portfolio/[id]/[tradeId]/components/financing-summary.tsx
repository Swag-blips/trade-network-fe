import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { DetailRow } from "@repo/ui/detail-row";
import { formatAmount, withKobo } from "@/utils/naira";
import { longDate } from "@/utils/date";
import { StatusChip } from "../../../components/status-chip";
import type { Funding } from "../../../types/portfolio";

export function FinancingSummary({ funding }: { funding: Funding }) {
  return (
    <section className="flex w-142.75 flex-none flex-col gap-md rounded-lg border border-grey-100 bg-white px-lg pt-md pb-lg shadow-small-thick">
      <h2 className="border-b border-grey-100 pb-md font-sans text-xl/[1.3] font-medium tracking-[0.16px] text-grey-900">
        Financing summary
      </h2>
      <div className="flex flex-col gap-md">
        <DetailRow label="Status">
          <StatusChip status={funding.status} />
        </DetailRow>
        <DetailRow label="Reference invoice">
          {funding.invoiceNumber ?? "—"}
          {funding.invoiceNumber ? (
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
          ) : null}
        </DetailRow>
        <DetailRow label="Disbursement date">
          {funding.confirmedAt ? longDate(funding.confirmedAt) : "—"}
        </DetailRow>
        <DetailRow label="Repayment tenure">{funding.tenorDays} days</DetailRow>
        <DetailRow label="Financing purpose">{funding.purpose}</DetailRow>
      </div>
      <hr className="border-grey-100" />
      <div className="flex flex-col gap-md">
        <DetailRow label="Amount financed">
          ₦ {formatAmount(funding.amount)}
        </DetailRow>
        <DetailRow label={`Interest (${funding.interestRate}% flat)`}>
          (+₦{formatAmount(funding.interest)})
        </DetailRow>
      </div>
      <hr className="border-dashed border-grey-200" />
      <DetailRow label="Total amount due">
        <span className="font-medium">₦ {withKobo(funding.repayment)}</span>
      </DetailRow>
    </section>
  );
}
