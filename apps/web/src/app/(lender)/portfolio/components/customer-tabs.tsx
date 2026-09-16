"use client";

import { useState } from "react";
import { OverviewTab } from "./overview-tab";
import { FundedTradesTab } from "./funded-trades-tab";
import { RepaymentsTab } from "./repayments-tab";
import type { Customer } from "../types/customer";

const TABS = ["Overview", "Funded trades", "Repayments"] as const;

export function CustomerTabs({
  customer,
  onRecordRepayment,
}: {
  customer: Customer;
  onRecordRepayment?: (tradeId: string) => void;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  return (
    <>
      <div className="flex flex-col items-start px-lg">
        <div
          role="tablist"
          aria-label="Customer sections"
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

      <div className="flex flex-col items-start px-lg pt-lg">
        {tab === "Overview" ? <OverviewTab customer={customer} /> : null}
        {tab === "Funded trades" ? (
          <FundedTradesTab
            customer={customer}
            onRecordRepayment={onRecordRepayment}
          />
        ) : null}
        {tab === "Repayments" ? <RepaymentsTab customer={customer} /> : null}
      </div>
    </>
  );
}
