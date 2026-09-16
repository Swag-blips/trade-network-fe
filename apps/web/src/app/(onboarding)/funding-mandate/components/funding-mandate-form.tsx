"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { CheckboxChip } from "@repo/ui/checkbox";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { TicketRange } from "@/components/ticket-range";
import { OnboardingShell } from "../../components/onboarding-shell";
import { roleLabel } from "../../components/roles";

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

export function FundingMandateForm({
  role,
  orgName,
}: {
  role: string;
  orgName: string;
}) {
  const router = useRouter();

  const [allocation, setAllocation] = useState("700,000,000");
  const [tenor, setTenor] = useState(TENORS[0]);
  const [fundingType, setFundingType] = useState(FUNDING_TYPES[0]);
  const [sectors, setSectors] = useState<string[]>([
    "Manufacturing",
    "Agriculture",
    "Healthcare",
    "Technology",
  ]);

  function toggleSector(sector: string, checked: boolean) {
    setSectors(
      checked
        ? [...sectors, sector]
        : sectors.filter((item) => item !== sector),
    );
  }

  const canSubmit = allocation.trim() !== "" && sectors.length > 0;

  return (
    <OnboardingShell step={2} orgName={orgName} orgRole={roleLabel(role)}>
      <div className="flex w-full max-w-126.5 flex-col gap-lg">
        <div className="flex flex-col gap-xs">
          <h1 className="font-sans text-h4 font-medium text-grey-900">
            Set funding mandate
          </h1>
          <p className="text-body-sm text-grey-600">
            Set the types of opportunities and financing terms that fit your
            strategy.
          </p>
        </div>

        <Field
          label="Capital allocation"
          required
          htmlFor="allocation"
          className="w-77"
        >
          <Input
            id="allocation"
            leading="₦"
            value={allocation}
            onChange={(event) => setAllocation(event.target.value)}
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
              onChange={(event) => setTenor(event.target.value)}
            >
              {TENORS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </Select>
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
              onChange={(event) => setFundingType(event.target.value)}
            >
              {FUNDING_TYPES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </Select>
          </Field>
        </div>

        <TicketRange
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
            disabled={!canSubmit}
            onClick={() => router.push("/home")}
          >
            Done
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
