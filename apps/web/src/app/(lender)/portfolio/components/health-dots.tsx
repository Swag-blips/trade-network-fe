import { HEALTH, type HealthLevel } from "../types/customer";

const DOTS = [0, 1, 2, 3];

export function HealthDots({ level }: { level: HealthLevel }) {
  const tone = HEALTH[level];
  return (
    <span className="flex items-center gap-xs">
      <span className="font-sans text-body-sm/[normal] font-medium text-grey-800">
        {tone.label}
      </span>
      <span aria-hidden className="flex items-center gap-1">
        {DOTS.map((index) => (
          <span
            key={index}
            className={`size-2 rounded-full ${index < tone.filled ? tone.className : "bg-grey-200"}`}
          />
        ))}
      </span>
    </span>
  );
}
