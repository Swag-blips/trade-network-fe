"use client";

import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { CheckboxChip } from "@repo/ui/checkbox";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { useToast } from "@repo/ui/toast";
import { TicketRange } from "@/components/ticket-range";
import { clearOnboarding, readOnboarding } from "@/lib/onboarding-storage";
import { useOnboarding } from "../../components/onboarding-provider";
import { useCompleteOnboarding } from "../hooks/use-complete-onboarding";

const TENORS = ["30-90 days", "90-180 days", "180-365 days"];
const FUNDING_TYPES = [
  "Any",
  "Invoice financing",
  "Purchase order",
  "Working capital",
];
const SECTORS = [
  "Manufacturing",
  "Agriculture",
  "Healthcare",
  "Technology",
  "Finance",
  "Energy",
  "Retail",
];

export function FundingMandateStep() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, update } = useOnboarding();
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();
  const {
    capitalAllocation,
    tenor,
    fundingType,
    fundingMin,
    fundingMax,
    sectors,
  } = data;

  function toggleSector(sector: string, checked: boolean) {
    update({
      sectors: checked
        ? [...sectors, sector]
        : sectors.filter((item) => item !== sector),
    });
  }

  const canSubmit = capitalAllocation.trim() !== "" && sectors.length > 0;

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
    <>
      <div className="flex flex-col gap-xs">
        {/* 24px is off the type scale (h4 is 22px, h3 28px) — matches the comp verbatim. */}
        <h1 className="font-brand text-2xl/[1.24] font-medium text-grey-900">
          Set funding mandate
        </h1>
        <p className="text-body text-grey-800">
          Set the types of opportunities and financing terms that fit your
          strategy.
        </p>
      </div>

      <div className="flex w-full max-w-126.5 flex-col gap-lg">
        <Field
          label="Capital allocation"
          required
          htmlFor="allocation"
          className="w-77"
        >
          <Input
            id="allocation"
            leading="₦"
            value={capitalAllocation}
            onChange={(event) =>
              update({ capitalAllocation: event.target.value })
            }
          />
        </Field>

        <div className="flex flex-col gap-md sm:flex-row">
          <Field
            label="Preferred tenor"
            required
            htmlFor="tenor"
            className="flex-1"
          >
            <Select
              id="tenor"
              value={tenor}
              onValueChange={(value) => update({ tenor: value })}
              options={TENORS}
            />
          </Field>
          <Field
            label="Preferred funding types"
            required
            htmlFor="funding-type"
            className="flex-1"
          >
            <Select
              id="funding-type"
              value={fundingType}
              onValueChange={(value) => update({ fundingType: value })}
              options={FUNDING_TYPES}
            />
          </Field>
        </div>

        <TicketRange
          min={fundingMin}
          max={fundingMax}
          onChange={({ min, max }) =>
            update({ fundingMin: min, fundingMax: max })
          }
          icon={
            <HugeiconsIcon
              icon={ArrowDataTransferHorizontalIcon}
              size={20}
              className="text-grey-500"
            />
          }
        />

        <div className="flex flex-col gap-xs">
          <p className="font-sans text-body-sm/[normal] font-medium text-grey-900">
            Preferred sectors*
          </p>
          <div className="flex flex-wrap gap-xs">
            {SECTORS.map((sector) => (
              <CheckboxChip
                key={sector}
                label={sector}
                checked={sectors.includes(sector)}
                onCheckedChange={(checked) => toggleSector(sector, checked)}
              />
            ))}
          </div>
        </div>

        <div>
          <Button
            size="form"
            loading={isPending}
            disabled={!canSubmit}
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      </div>
    </>
  );
}
