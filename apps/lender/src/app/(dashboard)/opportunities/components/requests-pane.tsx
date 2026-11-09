"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Clock02Icon } from "@hugeicons/core-free-icons";
import { Tabs } from "@repo/ui/tabs";

const TABS = ["Requests"] as const;

export function RequestsPane() {
  return (
    <div className="flex w-94.5 flex-none flex-col border-r border-grey-100 bg-white shadow-small-thick">
      <Tabs
        label="Opportunities"
        tabs={TABS}
        value="Requests"
        onChange={() => {}}
        className="px-md pt-2.5"
      />
      <div role="tabpanel" aria-label="Requests" className="flex justify-center pt-3xl">
        <div className="flex w-62.5 flex-col items-center gap-md text-center">
          <HugeiconsIcon icon={Clock02Icon} size={32} className="text-grey-900" />
          <p className="text-body/6 font-medium text-grey-600">
            Finding matching opportunities...
          </p>
        </div>
      </div>
    </div>
  );
}
