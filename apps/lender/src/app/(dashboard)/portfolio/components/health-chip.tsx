import { PORTFOLIO_HEALTH, type HealthLevel } from "../types/customer";

export function HealthChip({ level }: { level: HealthLevel }) {
  const tone = PORTFOLIO_HEALTH[level];

  return (
    <span
      className={`inline-flex items-center gap-1 py-1 font-sans text-body-sm/[normal] font-medium ${tone.className}`}
    >
      <span className="flex size-4 items-center justify-center">
        <span className="size-1.5 rounded-full bg-current" />
      </span>
      {tone.label}
    </span>
  );
}
