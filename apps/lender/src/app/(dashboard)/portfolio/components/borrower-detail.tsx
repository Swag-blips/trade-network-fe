"use client";

import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Building05Icon } from "@hugeicons/core-free-icons";
import { Avatar } from "@repo/ui/avatar";
import { readStatus } from "@/api/client";
import { Breadcrumb } from "./breadcrumb";
import { CustomerTabs } from "./customer-tabs";
import { HealthChip } from "./health-chip";
import { useBorrower } from "../hooks/use-borrower";

export function BorrowerDetail({ id }: { id: string }) {
  const { data: borrower, error, isPending } = useBorrower(id);

  if (readStatus(error) === 404) {
    notFound();
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Portfolio management", href: "/portfolio" },
          { label: borrower?.name ?? "…" },
        ]}
      />

      {borrower ? (
        <div className="flex flex-col gap-lg">
          <div className="flex items-center gap-lg">
            <Avatar
              name={borrower.name}
              size={64}
              shape="square"
              className="border border-grey-200 bg-grey-50 text-grey-600"
            />
            <div className="flex min-w-0 flex-col gap-xs">
              <h1 className="truncate font-brand text-2xl/[1.24] font-medium text-grey-900">
                {borrower.name}
              </h1>
              <div className="flex items-center gap-xs text-body/[normal] text-grey-600">
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Building05Icon} size={20} />
                  {borrower.industry}
                </span>
                <span aria-hidden>·</span>
                <HealthChip level={borrower.health} />
              </div>
            </div>
          </div>

          <CustomerTabs borrower={borrower} />
        </div>
      ) : (
        <p className="text-body/[normal] text-grey-600">
          {isPending ? "Loading…" : "We couldn't load this company."}
        </p>
      )}
    </>
  );
}
