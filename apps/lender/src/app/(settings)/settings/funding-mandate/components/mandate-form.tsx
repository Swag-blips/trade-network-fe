"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { CheckboxChip } from "@repo/ui/checkbox";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { TicketRange } from "@/components/ticket-range";
import { naira } from "@/utils/naira";
import {
  FUNDING_TYPES,
  SECTORS,
  TENORS,
  withSaved,
} from "@/utils/mandate-options";
import { useUpdateMandate } from "../hooks/use-update-mandate";
import type { Mandate } from "@/types/mandate";

// The service stores and returns decimals (e.g. 2000000.00), but `parse` only
// keeps digits — so a rendered "." would be read as another digit and multiply
// the amount. Round at display, as `naira` does, to keep the field whole-naira.
const format = (value: number) =>
  value ? Math.round(value).toLocaleString("en-NG") : "";
const parse = (value: string) => Number(value.replace(/[^0-9]/g, ""));

function sameSectors(a: string[], b: string[]) {
  return a.length === b.length && a.every((sector) => b.includes(sector));
}

function isSame(a: Mandate, b: Mandate) {
  return (
    a.capitalAllocation === b.capitalAllocation &&
    a.tenor === b.tenor &&
    a.fundingType === b.fundingType &&
    a.fundingMin === b.fundingMin &&
    a.fundingMax === b.fundingMax &&
    sameSectors(a.businessSectors, b.businessSectors)
  );
}

/** `mandate` is the saved copy: the form starts from it and is dirty against it. */
export function MandateForm({ mandate }: { mandate: Mandate }) {
  const { mutate: updateMandate, isPending } = useUpdateMandate();
  const [draft, setDraft] = useState(mandate);
  const update = (fields: Partial<Mandate>) =>
    setDraft({ ...draft, ...fields });

  // Sectors saved before the list was fixed stay visible, so unticking one is
  // still possible.
  const sectorOptions = [
    ...SECTORS,
    ...mandate.businessSectors.filter((sector) => !SECTORS.includes(sector)),
  ];

  function toggleSector(sector: string, checked: boolean) {
    update({
      businessSectors: checked
        ? [...draft.businessSectors, sector]
        : draft.businessSectors.filter((item) => item !== sector),
    });
  }

  // The service enforces this too; catching it here keeps Save honest.
  const overAllocated = draft.fundingMax > draft.capitalAllocation;
  const valid =
    draft.capitalAllocation > 0 &&
    !overAllocated &&
    draft.businessSectors.length > 0;
  const dirty = !isSame(draft, mandate);

  return (
    <>
      <Field
        label="Capital allocation"
        required
        htmlFor="allocation"
        hint={
          overAllocated && draft.capitalAllocation > 0
            ? `Must cover your maximum ticket of ${naira(draft.fundingMax)}.`
            : undefined
        }
        className="w-tour-card"
      >
        <Input
          id="allocation"
          leading="₦"
          inputMode="numeric"
          value={format(draft.capitalAllocation)}
          onChange={(event) =>
            update({ capitalAllocation: parse(event.target.value) })
          }
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
            value={draft.tenor}
            onValueChange={(tenor) => update({ tenor })}
            options={withSaved(TENORS, mandate.tenor)}
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
            value={draft.fundingType}
            onValueChange={(fundingType) => update({ fundingType })}
            options={withSaved(FUNDING_TYPES, mandate.fundingType)}
          />
        </Field>
      </div>

      <TicketRange
        min={draft.fundingMin}
        max={draft.fundingMax}
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
          {sectorOptions.map((sector) => (
            <CheckboxChip
              key={sector}
              label={sector}
              checked={draft.businessSectors.includes(sector)}
              onCheckedChange={(checked) => toggleSector(sector, checked)}
            />
          ))}
        </div>
      </div>

      <div>
        <Button
          size="form"
          loading={isPending}
          disabled={!dirty || !valid}
          onClick={() => updateMandate(draft)}
        >
          Save
        </Button>
      </div>
    </>
  );
}
