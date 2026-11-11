"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Coins01Icon } from "@hugeicons/core-free-icons";
import { useMandate } from "@/hooks/use-mandate";
import { TextPlaceholder } from "@/components/text-placeholder";
import { withKobo } from "@/utils/naira";

/** A zero greys out everything after the symbol. */
function Amount({ value }: { value: number }) {
  return (
    <>
      ₦{" "}
      <span className={value === 0 ? "text-grey-600" : undefined}>
        {withKobo(value)}
      </span>
    </>
  );
}

function Metric({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-sm overflow-hidden rounded-md border border-grey-200 bg-white p-md">
      <div className="flex items-center">
        <p className="min-w-0 flex-1 text-body/[1.5] text-grey-900">{label}</p>
        <span className="flex size-6 flex-none items-center justify-center rounded-full border border-grey-100 bg-white text-grey-800">
          {icon}
        </span>
      </div>
      <p className="font-brand text-2xl/[normal] text-grey-900">{children}</p>
    </div>
  );
}

export function HomeMetrics() {
  const { data: mandate, isPending, isError } = useMandate();

  return (
    <div className="flex items-stretch gap-sm">
      {/* No API reports available capital; the allocation over-reads it while an offer is pending. */}
      <Metric
        label="Available to deploy"
        icon={<HugeiconsIcon icon={Coins01Icon} size={16} />}
      >
        {isPending ? (
          <TextPlaceholder className="w-40" />
        ) : isError ? (
          "—"
        ) : (
          <Amount value={mandate.capitalAllocation} />
        )}
      </Metric>
      {/* No endpoint for these two yet. */}
      <Metric
        label="Capital deployed"
        icon={
          // Not in the free Hugeicons set.
          <Image src="/home/money-bag-time.svg" alt="" width={16} height={16} />
        }
      >
        <Amount value={0} />
      </Metric>
      <Metric
        label="Outstanding balance"
        icon={<HugeiconsIcon icon={AlertCircleIcon} size={16} />}
      >
        <Amount value={0} />
      </Metric>
    </div>
  );
}
