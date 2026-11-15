"use client";

import { useState } from "react";
import { Tabs } from "@repo/ui/tabs";
import { AboutTab } from "./about-tab";
import { FundedTradesTab } from "./funded-trades-tab";
import { SignalsTab } from "./signals-tab";
import type { Borrower } from "../types/portfolio";

const TABS = ["Funded trades", "About", "Signals"] as const;

export function CustomerTabs({ borrower }: { borrower: Borrower }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Funded trades");

  return (
    <div className="flex flex-col gap-lg">
      <Tabs
        label="Customer sections"
        tabs={TABS}
        value={tab}
        onChange={setTab}
        className="w-full pt-1"
      />

      {tab === "Funded trades" ? <FundedTradesTab borrower={borrower} /> : null}
      {tab === "About" ? <AboutTab borrower={borrower} /> : null}
      {tab === "Signals" ? <SignalsTab /> : null}
    </div>
  );
}
