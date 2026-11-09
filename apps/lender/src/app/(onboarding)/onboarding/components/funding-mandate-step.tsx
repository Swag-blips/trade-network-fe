"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Radio } from "@repo/ui/radio";
import { useToast } from "@repo/ui/toast";
import { clearOnboarding, readOnboarding } from "@/lib/onboarding-storage";
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

export function FundingMandateStep() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, update, back } = useOnboarding();
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();
  const { capitalAllocation, tenor, fundingMin, fundingMax, sectors } = data;
  const industriesInput = useRef<HTMLInputElement>(null);

  const canSubmit =
    Number(capitalAllocation.replace(/,/g, "")) > 0 &&
    tenor !== "" &&
    fundingMax > 0 &&
    fundingMin <= fundingMax &&
    sectors.length > 0;

  function handleDone() {
    const session = readOnboarding();

    if (!session) {
      toast({
        message: "We've lost track of that sign-up. Please start again.",
        state: "error",
      });
      return;
    }

    completeOnboarding(
      { session, data },
      {
        onSuccess: () => {
          clearOnboarding();
          router.push("/home");
        },
      },
    );
  }

  return (
    <StepFrame
      title="Set your financing preference"
      submitLabel="Done"
      canSubmit={canSubmit}
      loading={isPending}
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
        </div>

        <FinancingRange
          min={fundingMin}
          max={fundingMax}
          onChange={({ min, max }) =>
            update({ fundingMin: min, fundingMax: max })
          }
        />

        <div className="flex flex-col gap-lg">
          <Field
            label="Which industries would you prefer to finance?"
            htmlFor="industries"
            variant="question"
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
