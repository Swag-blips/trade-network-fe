"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDataTransferHorizontalIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { CheckboxChip } from "@repo/ui/checkbox";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { SettingsPage, SectionHeading } from "../../components/settings-page";
import { TicketRange } from "@/components/ticket-range";

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

export default function FundingMandatePage() {
  const [allocation, setAllocation] = useState("700,000,000");
  const [tenor, setTenor] = useState(TENORS[0]!);
  const [fundingType, setFundingType] = useState(FUNDING_TYPES[0]!);
  const [ticketMin, setTicketMin] = useState(8_000_000);
  const [ticketMax, setTicketMax] = useState(50_000_000);
  const [sectors, setSectors] = useState<string[]>([
    "Manufacturing",
    "Agriculture",
    "Healthcare",
    "Technology",
  ]);
  const dirty = false;

  function toggleSector(sector: string, checked: boolean) {
    setSectors(
      checked
        ? [...sectors, sector]
        : sectors.filter((item) => item !== sector),
    );
  }

  return (
    <SettingsPage title="Funding mandate">
      <div className="flex max-w-126.5 flex-col gap-lg">
        <div className="flex items-center gap-xs rounded-md bg-azure-50 px-md py-sm">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            size={20}
            className="flex-none text-azure-600"
          />
          <p className="text-body-sm text-azure-700">
            You can update your funding mandate once every 30 days. (1 left)
          </p>
        </div>

        <SectionHeading
          title="Funding mandate"
          description="Set your funding preferences and limits."
        />

        <Field
          label="Capital allocation"
          required
          htmlFor="allocation"
          className="w-tour-card"
        >
          <Input
            id="allocation"
            leading="₦"
            value={allocation}
            onChange={(event) => setAllocation(event.target.value)}
          />
        </Field>

        <div className="flex gap-md">
          <Field
            label="Preferred tenor"
            required
            htmlFor="tenor"
            className="flex-1"
          >
            <Select
              id="tenor"
              value={tenor}
              onValueChange={setTenor}
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
              onValueChange={setFundingType}
              options={FUNDING_TYPES}
            />
          </Field>
        </div>

        <TicketRange
          min={ticketMin}
          max={ticketMax}
          onChange={({ min, max }) => {
            setTicketMin(min);
            setTicketMax(max);
          }}
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
          <Button size="form" disabled={!dirty}>
            Save
          </Button>
        </div>
      </div>
    </SettingsPage>
  );
}
