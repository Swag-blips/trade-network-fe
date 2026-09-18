"use client";

import { useState } from "react";
import { Tabs } from "@repo/ui/tabs";
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
        <Tabs
          label="Customer sections"
          tabs={TABS}
          value={tab}
          onChange={setTab}
          className="w-full pt-xs"
        />
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
