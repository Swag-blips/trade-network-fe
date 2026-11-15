import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { PORTFOLIO_HEALTH, type HealthLevel } from "../types/portfolio";

export function HealthChip({ level }: { level: HealthLevel }) {
  const tone = PORTFOLIO_HEALTH[level];

  return (
    <span
      className={`inline-flex items-center gap-1 py-1 font-sans text-body-sm/[normal] font-medium ${tone.className}`}
    >
      {level === "at-risk" ? (
        <HugeiconsIcon icon={Alert02Icon} size={16} />
      ) : (
        <span className="flex size-4 items-center justify-center">
          <span className="size-1.5 rounded-full bg-current" />
        </span>
      )}
      {tone.label}
    </span>
  );
}
