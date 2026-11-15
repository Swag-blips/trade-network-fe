"use client";

import { notFound } from "next/navigation";
import { readStatus } from "@/api/client";
import { Notice } from "@/components/notice";
import { Breadcrumb } from "../../../components/breadcrumb";
import { useFunding } from "../../../hooks/use-funding";
import { FinancingSummary } from "./financing-summary";
import { RepaymentHero } from "./repayment-hero";
import { RepaymentSchedule } from "./repayment-schedule";

export function TradeDetail({ id }: { id: string }) {
  const { data: funding, error, isPending } = useFunding(id);

  if (readStatus(error) === 404) {
    notFound();
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Portfolio management", href: "/portfolio" },
          funding
            ? {
                label: funding.borrower.name,
                href: `/portfolio/${funding.borrower.id}`,
              }
            : { label: "…" },
          { label: funding?.reference ?? "…" },
        ]}
      />

      {funding ? (
        <>
          {funding.overdue ? (
            <Notice>
              A scheduled repayment is overdue. Review the repayment schedule
              and follow up with the enterprise.
            </Notice>
          ) : null}

          <div className="flex flex-col gap-lg">
            <h1 className="font-brand text-2xl/[1.24] font-medium text-grey-900">
              {funding.reference}
            </h1>
            <RepaymentHero funding={funding} />
            <div className="flex items-stretch gap-2.5">
              <RepaymentSchedule funding={funding} />
              <FinancingSummary funding={funding} />
            </div>
          </div>
        </>
      ) : (
        <p className="text-body/[normal] text-grey-600">
          {isPending ? "Loading…" : "We couldn't load this trade."}
        </p>
      )}
    </>
  );
}
