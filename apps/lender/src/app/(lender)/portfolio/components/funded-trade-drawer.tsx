"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  CheckmarkCircle02Icon,
  FileTextIcon,
  MoneyReceive01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { DetailRow } from "@repo/ui/detail-row";
import { Panel } from "@repo/ui/panel";
import { Sheet } from "@repo/ui/sheet";
import { Tabs } from "@repo/ui/tabs";
import { TaiAgent } from "@repo/ui/tai-agent";
import { TradeRoom } from "@/components/trade-room";
import { StatusChip } from "./status-chip";
import type { FundedTrade } from "../types/customer";

const TABS = ["Credit & exposure", "TradeRoom"] as const;

function TradeSummary({ summary }: { summary: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#92bbfd] bg-white px-sm py-2.5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center gap-sm"
      >
        <span className="flex min-w-0 flex-1 items-center gap-xs">
          <TaiAgent size="xs" />
          <span className="min-w-0 flex-1 text-left font-sans text-body font-medium text-grey-900">
            View trade summary
          </span>
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={20}
          className={`flex-none text-grey-900 transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="mt-md border-t border-grey-100 pt-md">
          <p className="text-body text-grey-800">{summary}</p>
        </div>
      ) : null}
    </div>
  );
}

export function FundedTradeDrawer({
  trade,
  onClose,
  onRecordRepayment,
}: {
  trade: FundedTrade;
  onClose: () => void;
  onRecordRepayment?: () => void;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Credit & exposure");

  return (
    <Sheet
      title={trade.id}
      onClose={onClose}
      icon={
        <span className="flex size-8 flex-none items-center justify-center rounded-full bg-evergreen-100">
          <HugeiconsIcon
            icon={FileTextIcon}
            size={20}
            className="text-evergreen-700"
          />
        </span>
      }
    >
      <div className="flex w-full flex-col px-md py-2.5">
        <div className="flex w-full flex-col justify-center gap-lg rounded-xl border border-evergreen-100 bg-evergreen-50 p-lg">
          <div className="flex w-full flex-col items-center justify-center gap-lg">
            <div className="flex w-full flex-col items-center justify-center gap-xs">
              <p className="w-full text-center text-body/[normal] text-grey-600">
                Outstanding balance
              </p>
              <div className="flex w-full flex-col items-center gap-xs text-center">
                <p className="w-full font-brand text-[2rem]/[1.3] font-medium tracking-[0.256px] text-grey-900">
                  {trade.outstanding}
                </p>
                <p className="w-full font-sans text-body-sm/[normal] font-medium text-orange-500">
                  Payment due on {trade.paymentDue}
                </p>
              </div>
            </div>
            <Button
              size="lg"
              leadingIcon={<HugeiconsIcon icon={MoneyReceive01Icon} />}
              onClick={onRecordRepayment}
            >
              Record repayment
            </Button>
          </div>
          <TradeSummary summary={trade.summary} />
        </div>
      </div>

      <div className="flex w-full flex-col pb-md">
        <div className="flex w-full flex-col items-center justify-center px-lg">
          <Tabs
            label="Funded trade sections"
            tabs={TABS}
            value={tab}
            onChange={setTab}
            className="w-full pt-xs"
          />
        </div>

        {tab === "Credit & exposure" ? (
          <div className="flex w-full flex-col gap-lg bg-white p-lg">
            <div className="flex w-full flex-col items-center justify-center gap-xs">
              <h3 className="w-full font-sans text-[1.25rem]/[normal] font-medium text-grey-900">
                Credit and exposure
              </h3>
              <p className="w-full text-body text-grey-800">
                View the current exposure, repayment position, and financing
                terms for this trade.
              </p>
            </div>

            <Panel title="Performance">
              <DetailRow label="Repayment status">
                <StatusChip status={trade.status} />
              </DetailRow>
              <DetailRow label="Maturity date">{trade.maturityDate}</DetailRow>
              <DetailRow label="Overdue exposure">
                {trade.overdueExposure}
              </DetailRow>
              <DetailRow label="Trade exceptions">
                {trade.tradeExceptions}
              </DetailRow>
            </Panel>

            <Panel title="Financing terms">
              <DetailRow label="Financing type">{trade.fundingType}</DetailRow>
              <DetailRow label="Amount funded">{trade.amountFunded}</DetailRow>
              <DetailRow label="Fee">{trade.fee}</DetailRow>
              <DetailRow label="Tenor">{trade.tenor}</DetailRow>
            </Panel>

            <Panel title="Trade integrity">
              <DetailRow label="Trade verification">
                <span className="flex flex-none items-center gap-1 text-body text-grey-800">
                  {trade.verified ? (
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={16}
                      className="text-green-500"
                    />
                  ) : null}
                  {trade.verified ? "Verified" : "Unverified"}
                </span>
              </DetailRow>
              <DetailRow label="Duplicate funding">
                {trade.duplicateFunding}
              </DetailRow>
            </Panel>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-lg bg-white px-lg pt-md pb-lg">
            <TradeRoom data={trade.tradeRoom} />
          </div>
        )}
      </div>
    </Sheet>
  );
}
