"use client";

import { useRef } from "react";
import { Field, FieldError } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Radio } from "@repo/ui/radio";
import type { MandateDraft } from "@/types/mandate";
import {
  SECTORS,
  TENORS,
  exceedsAllocation,
  formatAllocation,
  formatRate,
  parseAllocation,
  withSaved,
} from "@/utils/mandate-options";
import { FinancingRange, NAIRA } from "./financing-range";
import { IndustryPicker } from "./industry-picker";
import { SelectedIndustries } from "./selected-industries";

export function MandateFields({
  value,
  onChange,
  errors = {},
  disabled = false,
}: {
  value: MandateDraft;
  onChange: (fields: Partial<MandateDraft>) => void;
  errors?: Partial<Record<keyof MandateDraft, string>>;
  disabled?: boolean;
}) {
  const industriesInput = useRef<HTMLInputElement>(null);
  const {
    capitalAllocation,
    interestRate,
    tenor,
    fundingMin,
    fundingMax,
    sectors,
  } = value;

  return (
    <div className="flex flex-col gap-10">
      <Field
        label="How much capital would you like to allocate to trade financing?"
        htmlFor="allocation"
        variant="question"
        className="-mb-1"
        error={errors.capitalAllocation}
      >
        <Input
          id="allocation"
          variant="auth"
          leading={NAIRA}
          inputMode="decimal"
          placeholder="0.00"
          disabled={disabled}
          value={capitalAllocation}
          onChange={(event) =>
            onChange({
              capitalAllocation: formatAllocation(event.target.value),
            })
          }
        />
      </Field>

      <Field
        label="What is your preferred interest rate?"
        htmlFor="interest-rate"
        variant="question"
        className="-mb-1"
        error={errors.interestRate}
      >
        <Input
          id="interest-rate"
          variant="auth"
          leading="%"
          inputMode="decimal"
          placeholder="0.00"
          disabled={disabled}
          value={interestRate}
          onChange={(event) =>
            onChange({ interestRate: formatRate(event.target.value) })
          }
        />
      </Field>

      <div className="flex flex-col gap-md">
        <p
          id="tenure-label"
          className="font-sans text-body/[1.21] font-medium text-grey-900"
        >
          What is your preferred funding tenure?
        </p>
        <div
          role="radiogroup"
          aria-labelledby="tenure-label"
          className="flex flex-col items-start gap-lg"
        >
          {withSaved(TENORS, tenor).map((option) => (
            <label
              key={option}
              className={`flex items-center gap-md text-body/[normal] text-grey-900 ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <Radio
                name="tenure"
                size="lg"
                label={option}
                disabled={disabled}
                checked={tenor === option}
                onSelect={() => onChange({ tenor: option })}
              />
              {option}
            </label>
          ))}
        </div>
        {errors.tenor ? <FieldError>{errors.tenor}</FieldError> : null}
      </div>

      <FinancingRange
        min={fundingMin}
        max={fundingMax}
        minError={errors.fundingMin}
        maxError={
          errors.fundingMax ??
          (exceedsAllocation(value)
            ? "Max ticket can't be more than your capital allocation."
            : undefined)
        }
        ceiling={parseAllocation(capitalAllocation)}
        disabled={disabled}
        onChange={({ min, max }) =>
          onChange({ fundingMin: min, fundingMax: max })
        }
      />

      <div className="flex flex-col gap-lg">
        <Field
          label="Which industries would you prefer to finance?"
          htmlFor="industries"
          variant="question"
          error={errors.sectors}
        >
          <IndustryPicker
            id="industries"
            inputRef={industriesInput}
            options={SECTORS}
            selected={sectors}
            disabled={disabled}
            onChange={(next) => onChange({ sectors: next })}
          />
        </Field>
        <SelectedIndustries
          selected={sectors}
          onRemove={
            disabled
              ? undefined
              : (industry, viaKeyboard) => {
                  onChange({
                    sectors: sectors.filter((item) => item !== industry),
                  });
                  // The chip's button is about to unmount and would drop focus to <body>.
                  if (viaKeyboard) industriesInput.current?.focus();
                }
          }
        />
      </div>
    </div>
  );
}
