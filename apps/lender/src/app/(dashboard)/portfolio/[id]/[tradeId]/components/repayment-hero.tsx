import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar04Icon } from "@hugeicons/core-free-icons";
import { withKobo } from "@/utils/naira";
import { shortDate } from "@/utils/date";
import { FEATURED_FILL } from "../../../components/stat-card";
import type { Funding } from "../../../types/portfolio";

export function RepaymentHero({ funding }: { funding: Funding }) {
  const overdue = funding.installments.find(
    (installment) => installment.status === "overdue",
  )?.dueAt;
  const caption = overdue
    ? `Oldest overdue: ${shortDate(overdue)}`
    : funding.nextRepaymentAt
      ? `Next repayment: ${shortDate(funding.nextRepaymentAt)}`
      : null;

  return (
    <div
      className={`flex flex-col items-start gap-xs overflow-hidden rounded-lg px-lg py-md ${FEATURED_FILL}`}
    >
      <p className="text-body/[1.5] opacity-80">Remaining total repayment</p>
      {/* 32px sits between the h3 and h2 steps, verbatim from Figma. */}
      <p
        className={`font-brand text-[2rem]/[1.3] tracking-[0.256px] ${funding.overdue ? "text-red-error-300" : ""}`}
      >
        ₦ {withKobo(funding.outstanding)}
      </p>
      {caption ? (
        <span className="flex items-center gap-1 rounded-full bg-white/8 px-sm py-1 text-body-sm/[1.5] font-medium">
          <HugeiconsIcon icon={Calendar04Icon} size={16} />
          <span className="opacity-80">{caption}</span>
        </span>
      ) : null}
    </div>
  );
}
