"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { ButtonLink } from "@repo/ui/button-link";
import { useMandate } from "@/hooks/use-mandate";
import { TextPlaceholder } from "@/components/text-placeholder";
import { compactNaira, fullNaira } from "../utils/format";

export function FinancingPreference() {
  const { data: mandate, isPending } = useMandate();

  const rows: { label: string; value?: string }[] = [
    {
      label: "Capital allocation",
      value: mandate && fullNaira(mandate.capitalAllocation),
    },
    {
      label: "Interest rate",
      value: mandate && `${mandate.interestRate}%`,
    },
    {
      label: "Ticket range",
      value:
        mandate &&
        `${compactNaira(mandate.fundingMin)} - ${compactNaira(mandate.fundingMax)}`,
    },
    { label: "Preferred tenure", value: mandate?.tenor },
    { label: "Industries", value: mandate?.businessSectors.join(", ") },
  ];

  return (
    <section className="relative w-126.5 overflow-hidden rounded-xl border border-grey-100 bg-white shadow-card">
      <div className="flex items-center gap-2.5 border-b border-grey-100 p-md">
        <h2 className="min-w-0 flex-1 font-sans text-xl/[normal] font-medium text-grey-900">
          Financing preference
        </h2>
        <ButtonLink
          href="/settings/funding-mandate"
          variant="tertiary"
          size="pill"
          leadingIcon={<HugeiconsIcon icon={PencilEdit02Icon} />}
        >
          Update
        </ButtonLink>
      </div>

      <dl className="flex flex-col gap-md p-md text-body/[normal]">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-xs">
            <dt className="text-grey-600">{label}</dt>
            <dd className="font-medium text-grey-900">
              {isPending ? (
                <TextPlaceholder className="w-40" />
              ) : (
                (value ?? "—")
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
