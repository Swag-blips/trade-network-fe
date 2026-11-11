import { HEALTH, type HealthLevel } from "../types/customer";
import { round } from "../utils/geometry";

const CX = 101;
const CY = 105;
const R = 76;
const START = 150;
const SWEEP = 240;
const TICKS = 9;

const VALUE: Record<HealthLevel, number> = {
  healthy: 0.78,
  watch: 0.55,
  "at-risk": 0.35,
  critical: 0.15,
};

const point = (angle: number, radius: number) => {
  const radians = (angle * Math.PI) / 180;
  return [
    round(CX + radius * Math.cos(radians)),
    round(CY + radius * Math.sin(radians)),
  ] as const;
};

function arc(from: number, to: number, radius: number) {
  const [x1, y1] = point(from, radius);
  const [x2, y2] = point(to, radius);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
}

export function HealthGauge({ level }: { level: HealthLevel }) {
  const tone = HEALTH[level];
  const value = VALUE[level];
  const angle = START + SWEEP * value;
  const [nx, ny] = point(angle, R - 16);

  return (
    <div className="relative h-40.75 w-full">
      <svg
        viewBox="0 0 202 163"
        role="img"
        aria-label={`Portfolio health: ${tone.label}`}
        className="absolute top-1/2 left-1/2 h-40.75 w-50.5 -translate-x-1/2 -translate-y-1/2"
      >
        <defs>
          <linearGradient id="gauge-track" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#e0503f" />
            <stop offset="35%" stopColor="#e9a23b" />
            <stop offset="70%" stopColor="#5fb8a8" />
            <stop offset="100%" stopColor="#3fae7a" />
          </linearGradient>
        </defs>

        <path
          d={arc(START, START + SWEEP, R)}
          fill="none"
          stroke="#e2e5e4"
          strokeWidth={18}
          strokeLinecap="round"
        />
        <path
          d={arc(START, angle, R)}
          fill="none"
          stroke="url(#gauge-track)"
          strokeWidth={18}
          strokeLinecap="round"
        />

        {Array.from({ length: TICKS }, (_, index) => {
          const tick = START + (SWEEP / (TICKS - 1)) * index;
          const [x1, y1] = point(tick, R - 14);
          const [x2, y2] = point(tick, R - 19);
          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#afb4b2"
              strokeWidth={1}
              strokeLinecap="round"
            />
          );
        })}

        <line
          x1={CX}
          y1={CY}
          x2={nx}
          y2={ny}
          stroke="#0f3d3a"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r={10} fill="#e2e5e4" />
      </svg>

      <span className="absolute top-35 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-evergreen-100 px-xs py-0.5 font-sans text-body-sm font-medium text-evergreen-600">
        {tone.label}
      </span>
    </div>
  );
}
