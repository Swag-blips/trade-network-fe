import type { ReactNode } from "react";

export interface DonutSegment {
  value: number;
  /** A `stroke-*` utility. */
  strokeClass: string;
}

const SIZE = 220;
const STROKE = 11;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// Each round cap overhangs its dash by half the stroke, so neighbours need a
// full stroke between them before the air the comp leaves shows at all.
const GAP = STROKE + 6;

/** Server and client disagree on float tails; see the HealthGauge gotcha. */
const round = (n: number) => Math.round(n * 1000) / 1000;

export function DonutChart({
  segments,
  children,
}: {
  segments: DonutSegment[];
  children?: ReactNode;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const shown = segments.filter((s) => s.value > 0);
  const gap = shown.length > 1 ? GAP : 0;

  let offset = 0;
  const arcs = shown.map((segment) => {
    const length = (segment.value / total) * CIRCUMFERENCE;
    const arc = {
      ...segment,
      dash: round(Math.max(length - gap, 0.001)),
      start: round(offset + gap / 2),
    };
    offset += length;
    return arc;
  });

  return (
    <div className="relative size-55 flex-none">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="size-full -rotate-90"
        aria-hidden="true"
      >
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap={gap ? "round" : "butt"}
            strokeDasharray={`${arc.dash} ${round(CIRCUMFERENCE)}`}
            strokeDashoffset={-arc.start}
            className={arc.strokeClass}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.75 text-center">
        {children}
      </div>
    </div>
  );
}
