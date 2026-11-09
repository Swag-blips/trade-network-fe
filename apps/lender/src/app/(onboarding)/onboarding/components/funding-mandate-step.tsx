"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldError } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Radio } from "@repo/ui/radio";
import { useToast } from "@repo/ui/toast";
import { clearOnboarding, readChallengeId } from "@/lib/onboarding-storage";
import { ONBOARDING_TENORS, SECTORS } from "@/utils/mandate-options";
import { useOnboarding } from "../../components/onboarding-provider";
import { useCompleteOnboarding } from "../hooks/use-complete-onboarding";
import { FinancingRange, NAIRA } from "./financing-range";
import { IndustryPicker } from "./industry-picker";
import { SelectedIndustries } from "./selected-industries";
import { StepFrame } from "./step-frame";

function formatAllocation(value: string) {
  const [whole = "", ...fraction] = value.replace(/[^0-9.]/g, "").split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fraction.length > 0
    ? `${grouped}.${fraction.join("").slice(0, 2)}`
    : grouped;
}

function formatRate(value: string) {
  const [whole = "", ...fraction] = value.replace(/[^0-9.]/g, "").split(".");
  const rate =
    fraction.length > 0
      ? `${whole.slice(0, 3)}.${fraction.join("").slice(0, 2)}`
      : whole.slice(0, 3);

  return Number(rate) > 100 ? "100" : rate;
}

export function FundingMandateStep() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, update, back, errors } = useOnboarding();
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();
  // Stays loading until /home has loaded: a second submit would get a 409.
  const [navigating, startNavigation] = useTransition();
  const {
    capitalAllocation,
    interestRate,
    tenor,
    fundingMin,
    fundingMax,
    sectors,
  } = data;
  const industriesInput = useRef<HTMLInputElement>(null);

  const canSubmit =
    Number(capitalAllocation.replace(/,/g, "")) > 0 &&
    Number(interestRate) > 0 &&
    tenor !== "" &&
    fundingMax > 0 &&
    fundingMin <= fundingMax &&
    sectors.length > 0;

  function handleDone() {
    const challengeId = readChallengeId();

    if (!challengeId) {
      toast({
        message: "We've lost track of that sign-up. Please log in again.",
        state: "error",
      });
      router.push("/login");
      return;
    }

    completeOnboarding(
      { challengeId, data },
      {
        onSuccess: () => {
          clearOnboarding();
          startNavigation(() => router.push("/home"));
        },
      },
    );
  }

  return (
    <StepFrame
      title="Set your financing preference"
      submitLabel="Done"
      canSubmit={canSubmit}
      loading={isPending || navigating}
      onBack={back}
      onSubmit={handleDone}
      raisedFooter
    >
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
            value={capitalAllocation}
            onChange={(event) =>
              update({
                capitalAllocation: formatAllocation(event.target.value),
              })
            }
          />
        </Field>

        <Field
          label="What is your preferred interest rate?"
          htmlFor="interest-rate"
          variant="question"
          error={errors.interestRate}
          className="-mb-1"
        >
          <Input
            id="interest-rate"
            variant="auth"
            leading="%"
            inputMode="decimal"
            placeholder="0.00"
            value={interestRate}
            onChange={(event) =>
              update({ interestRate: formatRate(event.target.value) })
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
            {ONBOARDING_TENORS.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-md text-body/[normal] text-grey-900"
              >
                <Radio
                  name="tenure"
                  size="lg"
                  label={option}
                  checked={tenor === option}
                  onSelect={() => update({ tenor: option })}
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
          maxError={errors.fundingMax}
          onChange={({ min, max }) =>
            update({ fundingMin: min, fundingMax: max })
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
              onChange={(next) => update({ sectors: next })}
            />
          </Field>
          <SelectedIndustries
            selected={sectors}
            onRemove={(industry, viaKeyboard) => {
              update({ sectors: sectors.filter((item) => item !== industry) });
              // The chip's button is about to unmount and would drop focus to <body>.
              if (viaKeyboard) industriesInput.current?.focus();
            }}
          />
        </div>
      </div>
    </StepFrame>
  );
}
