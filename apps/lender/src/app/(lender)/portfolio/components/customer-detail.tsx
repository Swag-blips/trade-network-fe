"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  MoneyReceive01Icon,
  Store02Icon,
  WarehouseIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { useToast } from "@repo/ui/toast";
import { DetailHeader } from "@repo/ui/detail-header";
import { InitialsAvatar } from "@repo/ui/avatars";
import { StatusChip } from "./status-chip";
import { CustomerTabs } from "./customer-tabs";
import {
  RecordRepaymentModal,
  type RepaymentDraft,
} from "./record-repayment-modal";
import type { Customer } from "../types/customer";

const TODAY = "Sept 09, 2026";

export function CustomerDetail({
  customer: initial,
  prevHref,
  nextHref,
}: {
  customer: Customer;
  prevHref?: string;
  nextHref?: string;
}) {
  const [customer, setCustomer] = useState(initial);
  const [repayingTradeId, setRepayingTradeId] = useState<string | null>(null);
  const { toast } = useToast();

  const settled = customer.status === "settled";

  function recordRepayment(draft: RepaymentDraft) {
    setRepayingTradeId(null);
    setCustomer((current) => {
      const trades = current.trades.map((trade) =>
        trade.id === draft.tradeId
          ? { ...trade, status: "repaid" as const, outstanding: "₦0" }
          : trade,
      );
      const open = trades.filter((trade) => trade.status !== "repaid");

      return {
        ...current,
        trades,
        status: open.length === 0 ? ("settled" as const) : current.status,
        outstanding: open.length === 0 ? "₦0" : current.outstanding,
        activeTrades: open.length,
        repayments: [
          {
            id: `rp-${current.repayments.length + 1}`,
            date: TODAY,
            tradeId: draft.tradeId,
            amount: `₦${draft.amount.trim().replace(/^₦/, "")}`,
            remainingBalance: open.length === 0 ? "₦0" : current.outstanding,
            evidence: draft.evidence,
          },
          ...current.repayments,
        ],
      };
    });
    toast({ message: "Repayment has been recorded" });
  }

  return (
    <>
      <DetailHeader
        backLabel="portfolio"
        itemLabel="customer"
        initials={customer.initials}
        name={customer.name}
        badge={<StatusChip status={customer.status} />}
        prevHref={prevHref}
        nextHref={nextHref}
      />

      <div className="min-h-px flex-1 overflow-y-auto pt-xs pb-lg">
        <div className="flex items-center px-lg">
          <div className="flex min-w-0 flex-1 items-center gap-md py-2.5">
            <InitialsAvatar initials={customer.initials} size={64} />
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
              <p className="font-sans text-[1.25rem]/[normal] font-medium text-black">
                {customer.name}
              </p>
              <span className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={
                    customer.kind === "Distributor"
                      ? Store02Icon
                      : WarehouseIcon
                  }
                  size={16}
                  className="text-grey-800"
                />
                <span className="text-body-sm/[normal] text-grey-800">
                  {customer.kind}
                </span>
              </span>
            </div>
            <div className="flex flex-none items-center gap-md">
              <Button
                variant="secondary"
                size="form"
                leadingIcon={<HugeiconsIcon icon={InformationCircleIcon} />}
              >
                About
              </Button>
              {settled ? null : (
                <Button
                  size="form"
                  leadingIcon={<HugeiconsIcon icon={MoneyReceive01Icon} />}
                  onClick={() => setRepayingTradeId("")}
                >
                  Record repayment
                </Button>
              )}
            </div>
          </div>
        </div>

        <CustomerTabs
          customer={customer}
          onRecordRepayment={setRepayingTradeId}
        />
      </div>

      {repayingTradeId !== null ? (
        <RecordRepaymentModal
          trades={customer.trades.filter((trade) => trade.status !== "repaid")}
          selectedTradeId={repayingTradeId || undefined}
          onClose={() => setRepayingTradeId(null)}
          onSubmit={recordRepayment}
        />
      ) : null}
    </>
  );
}
