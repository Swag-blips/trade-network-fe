"use client";

import type { ReactNode } from "react";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";

const FLOOR = 5_000_000;
const CEILING = 1_000_000_000;
const STEP = 1_000_000;

const THUMB =
  "pointer-events-none absolute inset-0 w-full appearance-none bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-3 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-evergreen-600 " +
  "[&::-webkit-slider-thumb]:bg-white " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-3 " +
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 " +
  "[&::-moz-range-thumb]:border-evergreen-600 [&::-moz-range-thumb]:bg-white";

const format = (value: number) => value.toLocaleString("en-NG");
const parse = (value: string) => Number(value.replace(/[^0-9]/g, ""));

export function TicketRange({
  icon,
  min,
  max,
  onChange,
}: {
  icon: ReactNode;
  min: number;
  max: number;
  onChange: (range: { min: number; max: number }) => void;
}) {
  const setMin = (value: number) => onChange({ min: value, max });
  const setMax = (value: number) => onChange({ min, max: value });

  const percent = (value: number) =>
    ((value - FLOOR) / (CEILING - FLOOR)) * 100;

  return (
    <section className="flex flex-col gap-md rounded-lg border border-grey-200 p-md">
      <div className="flex flex-col gap-1">
        <p className="font-sans text-body-sm/[normal] font-medium text-grey-900">
          Preferred ticket range*
        </p>
        <p className="text-caption text-grey-600">
          Set the minimum you are willing to fund per opportunity.
        </p>
      </div>

      <div className="flex flex-col gap-xs">
        <div className="relative h-3">
          <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-evergreen-100" />
          <span
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-evergreen-600"
            style={{
              left: `${percent(min)}%`,
              right: `${100 - percent(max)}%`,
            }}
          />
          <input
            type="range"
            aria-label="Minimum ticket size"
            min={FLOOR}
            max={CEILING}
            step={STEP}
            value={min}
            onChange={(event) =>
              setMin(Math.min(Number(event.target.value), max))
            }
            className={THUMB}
          />
          <input
            type="range"
            aria-label="Maximum ticket size"
            min={FLOOR}
            max={CEILING}
            step={STEP}
            value={max}
            onChange={(event) =>
              setMax(Math.max(Number(event.target.value), min))
            }
            className={THUMB}
          />
        </div>
        <div className="flex justify-between text-caption text-grey-600">
          <span>₦5M</span>
          <span>₦1B</span>
        </div>
      </div>

      <div className="flex items-end gap-sm">
        <Field label="Min" htmlFor="ticket-min" className="flex-1">
          <Input
            id="ticket-min"
            leading="₦"
            value={format(min)}
            onChange={(event) => setMin(parse(event.target.value) || FLOOR)}
          />
        </Field>
        <span aria-hidden="true" className="pb-2.5">
          {icon}
        </span>
        <Field label="Max" htmlFor="ticket-max" className="flex-1">
          <Input
            id="ticket-max"
            leading="₦"
            value={format(max)}
            onChange={(event) => setMax(parse(event.target.value) || CEILING)}
          />
        </Field>
      </div>
    </section>
  );
}
