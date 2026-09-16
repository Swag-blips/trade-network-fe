"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  FileTextIcon,
  MoneyReceive01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { IconButton } from "@repo/ui/icon-button";
import { TaiAgent } from "@/components/tai-agent";
import { TradeRoom } from "@/components/trade-room";
import { StatusChip } from "./status-chip";
import type { FundedTrade } from "../types/customer";

const TABS = ["Credit & exposure", "TradeRoom"] as const;

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center gap-1">
      <p className="min-w-0 flex-1 text-body text-grey-600">{label}</p>
      {children}
    </div>
  );
}

function Value({ children }: { children: string }) {
  return (
    <p className="flex-none whitespace-nowrap text-body text-grey-900">
      {children}
    </p>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-md rounded-xl border border-grey-100 bg-white px-5 py-2.5">
      <h3 className="w-full font-sans text-body font-medium text-grey-900">
        {title}
      </h3>
      {children}
    </section>
  );
}

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
  const ref = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Credit & exposure");

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="funded-trade-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="mt-0 mr-0 mb-0 ml-auto h-full max-h-full w-136 max-w-full overflow-y-auto bg-white p-0 backdrop:bg-grey-900/40"
    >
      <header className="flex w-full items-center gap-md border-b border-grey-100 px-lg py-md">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="flex size-8 flex-none items-center justify-center rounded-full bg-evergreen-100">
            <HugeiconsIcon
              icon={FileTextIcon}
              size={20}
              className="text-evergreen-700"
            />
          </span>
          <h2
            id="funded-trade-title"
            className="font-sans text-body/[normal] text-black"
          >
            {trade.id}
          </h2>
        </div>
        <IconButton label="Close" size="xs" onClick={onClose}>
          <HugeiconsIcon icon={Cancel01Icon} />
        </IconButton>
      </header>

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
          <div
            role="tablist"
            aria-label="Funded trade sections"
            className="flex w-full items-center gap-md border-b border-grey-100 pt-xs"
          >
            {TABS.map((name) => {
              const active = tab === name;
              return (
                <button
                  key={name}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(name)}
                  className={`-mb-px border-b-2 px-2.5 py-xs font-sans text-body/[normal] font-medium whitespace-nowrap transition-colors motion-reduce:transition-none ${
                    active
                      ? "border-evergreen-600 text-grey-900"
                      : "border-transparent text-grey-500 hover:text-grey-900"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
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
              <Row label="Repayment status">
                <StatusChip status={trade.status} />
              </Row>
              <Row label="Maturity date">
                <Value>{trade.maturityDate}</Value>
              </Row>
              <Row label="Overdue exposure">
                <Value>{trade.overdueExposure}</Value>
              </Row>
              <Row label="Trade exceptions">
                <Value>{trade.tradeExceptions}</Value>
              </Row>
            </Panel>

            <Panel title="Financing terms">
              <Row label="Financing type">
                <Value>{trade.fundingType}</Value>
              </Row>
              <Row label="Amount funded">
                <Value>{trade.amountFunded}</Value>
              </Row>
              <Row label="Fee">
                <Value>{trade.fee}</Value>
              </Row>
              <Row label="Tenor">
                <Value>{trade.tenor}</Value>
              </Row>
            </Panel>

            <Panel title="Trade integrity">
              <Row label="Trade verification">
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
              </Row>
              <Row label="Duplicate funding">
                <Value>{trade.duplicateFunding}</Value>
              </Row>
            </Panel>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-lg bg-white px-lg pt-md pb-lg">
            <TradeRoom data={trade.tradeRoom} />
          </div>
        )}
      </div>
    </dialog>
  );
}
