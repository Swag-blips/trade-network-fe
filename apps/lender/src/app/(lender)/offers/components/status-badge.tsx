import { HugeiconsIcon } from "@hugeicons/react";
import { Progress04Icon } from "@hugeicons/core-free-icons";
import { OFFER_STATUS, type OfferStatus } from "../types/offer";

export function StatusBadge({ status }: { status: OfferStatus }) {
  const tone = OFFER_STATUS[status];
  return (
    <span
      className={`inline-flex flex-none items-center gap-1 rounded-lg p-1 font-sans text-body-sm/[normal] font-medium ${tone.className}`}
    >
      <HugeiconsIcon icon={tone.icon ?? Progress04Icon} size={16} />
      {tone.label}
    </span>
  );
}
