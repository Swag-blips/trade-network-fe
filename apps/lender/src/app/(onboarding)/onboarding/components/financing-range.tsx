"use client";

import Image from "next/image";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { formatAmount, parseAmount } from "@/utils/mandate-options";

const CEILING = 1_000_000_000;
const STEP = 1_000_000;
const THUMB_PX = 20;

export const NAIRA = <span className="-mr-1.5">₦</span>;

const RANGE =
  "pointer-events-none absolute inset-0 m-0 h-5 w-full appearance-none bg-transparent outline-none " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 " +
  "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border " +
  "[&::-webkit-slider-thumb]:border-grey-200 [&::-webkit-slider-thumb]:shadow-small-thick " +
  "[&::-webkit-slider-thumb]:bg-[radial-gradient(circle,var(--color-evergreen-500)_4px,white_4.5px)] " +
  "focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 " +
  "focus-visible:[&::-webkit-slider-thumb]:outline-evergreen-600 " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 " +
  "[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border " +
  "[&::-moz-range-thumb]:border-grey-200 [&::-moz-range-thumb]:shadow-small-thick " +
  "[&::-moz-range-thumb]:bg-[radial-gradient(circle,var(--color-evergreen-500)_4px,white_4.5px)] " +
  "focus-visible:[&::-moz-range-thumb]:outline-2 focus-visible:[&::-moz-range-thumb]:outline-offset-2 " +
  "focus-visible:[&::-moz-range-thumb]:outline-evergreen-600";

/** Where a native range thumb's centre sits: it stops half a thumb from each end. */
const thumbCentre = (value: number) => {
  const ratio = Math.min(Math.max(value / CEILING, 0), 1);
  return `calc(${THUMB_PX / 2}px + (100% - ${THUMB_PX}px) * ${ratio})`;
};

export function FinancingRange({
  min,
  max,
  minError,
  maxError,
  onChange,
}: {
  min: number;
  max: number;
  minError?: string;
  maxError?: string;
  onChange: (range: { min: number; max: number }) => void;
}) {
  const setMin = (value: number) => onChange({ min: value, max });
  const setMax = (value: number) => onChange({ min, max: value });

  const fromInput = (value: string) => Math.min(parseAmount(value), CEILING);

  return (
    <section className="flex flex-col gap-lg rounded-lg border border-grey-100 bg-white px-lg py-md shadow-soft-section">
      <div className="flex flex-col gap-xs">
        <p className="font-sans text-body/[1.21] font-medium text-grey-900">
          What financing amount would you consider per transaction?
        </p>
        <p className="text-body-sm/[normal] text-grey-600">
          Set the minimum and maximum amount you&rsquo;re willing to finance for
          a single trade.
        </p>
      </div>

      <hr className="-mb-px border-grey-100" />

      <div className="flex items-center justify-between gap-md xl:gap-0">
        <Field
          label="Min"
          htmlFor="financing-min"
          variant="caption"
          className="flex-1"
          error={minError}
        >
          <Input
            id="financing-min"
            variant="strong"
            leading={NAIRA}
            inputMode="numeric"
            value={formatAmount(min)}
            onChange={(event) => setMin(fromInput(event.target.value))}
          />
        </Field>
        <Image
          src="/onboarding/range-arrows.svg"
          alt=""
          width={219}
          height={64}
          unoptimized
          className="hidden h-16 w-54.75 flex-none xl:block"
        />
        <Field
          label="Max"
          htmlFor="financing-max"
          variant="caption"
          className="flex-1"
          error={maxError}
        >
          <Input
            id="financing-max"
            variant="strong"
            leading={NAIRA}
            inputMode="numeric"
            value={formatAmount(max)}
            onChange={(event) => setMax(fromInput(event.target.value))}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-lg">
        <div className="relative h-5">
          <span className="absolute inset-x-0 top-2 h-1 rounded-full bg-grey-100" />
          <span
            className="absolute top-2 h-1 bg-evergreen-500"
            style={{
              left: thumbCentre(min),
              right: `calc(100% - ${thumbCentre(max)})`,
            }}
          />
          <input
            type="range"
            aria-label="Minimum financing amount"
            min={0}
            max={CEILING}
            step={STEP}
            value={min}
            onChange={(event) =>
              setMin(Math.min(Number(event.target.value), max))
            }
            // In the top half the max thumb has nowhere left to go, so an
            // overlap there must be grabbable by min or the pair sticks.
            className={`${RANGE} ${min > CEILING / 2 ? "z-10" : ""}`}
          />
          <input
            type="range"
            aria-label="Maximum financing amount"
            min={0}
            max={CEILING}
            step={STEP}
            value={max}
            onChange={(event) =>
              setMax(Math.max(Number(event.target.value), min))
            }
            className={RANGE}
          />
        </div>
        <div className="flex items-center justify-between text-body-sm/[normal] whitespace-nowrap text-grey-600">
          <span>₦0</span>
          <span>₦1B</span>
        </div>
      </div>
    </section>
  );
}
