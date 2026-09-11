"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import type { OfferTerms } from "../types/offer";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-center justify-between text-body-sm/[normal]">
      <span className="text-grey-600">{label}</span>
      <span className="whitespace-nowrap text-grey-800">{value}</span>
    </div>
  );
}

export function OfferDetails({
  terms,
  open,
  onToggle,
}: {
  terms: OfferTerms;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-grey-100 bg-grey-50 px-sm py-2.5">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-center gap-2.5"
      >
        <span className="min-w-0 flex-1 text-left font-sans text-body-sm/[normal] font-medium tracking-[0.28px] text-grey-800">
          {open ? "Offer" : "View offer"}
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={20}
          className={`flex-none text-grey-800 transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="mt-sm flex flex-col gap-sm border-t border-grey-200 pt-sm">
          <Row label="Offered advance" value={terms.advance} />
          <Row label={`Fee(${terms.feeRate})`} value={terms.fee} />
          <Row label="Repayment tenor" value={terms.tenor} />
          <Row label="Expiry date" value={terms.expires} />
        </div>
      ) : null}
    </div>
  );
}
