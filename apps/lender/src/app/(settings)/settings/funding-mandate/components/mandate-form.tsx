"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { MandateFields } from "@/components/mandate-fields";
import type { Mandate, MandateDraft } from "@/types/mandate";
import {
  formatAllocation,
  isCompleteMandate,
  parseAllocation,
} from "@/utils/mandate-options";
import { useUpdateMandate } from "../hooks/use-update-mandate";
import { UpdateLimitBanner } from "./update-limit-banner";

const toDraft = (mandate: Mandate): MandateDraft => ({
  capitalAllocation: formatAllocation(String(mandate.capitalAllocation)),
  interestRate: String(mandate.interestRate),
  tenor: mandate.tenor,
  fundingMin: mandate.fundingMin,
  fundingMax: mandate.fundingMax,
  sectors: mandate.businessSectors,
});

function isSame(a: MandateDraft, b: MandateDraft) {
  return (
    parseAllocation(a.capitalAllocation) ===
      parseAllocation(b.capitalAllocation) &&
    Number(a.interestRate) === Number(b.interestRate) &&
    a.tenor === b.tenor &&
    a.fundingMin === b.fundingMin &&
    a.fundingMax === b.fundingMax &&
    a.sectors.length === b.sectors.length &&
    a.sectors.every((sector) => b.sectors.includes(sector))
  );
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

export function MandateForm({ mandate }: { mandate: Mandate }) {
  const { mutate: updateMandate, isPending } = useUpdateMandate();
  const [draft, setDraft] = useState(() => toDraft(mandate));
  const [dismissed, setDismissed] = useState<"edited" | "locked" | null>(null);

  const { nextChangeAt } = mandate;
  const locked = nextChangeAt !== null;
  const dirty = !isSame(draft, toDraft(mandate));
  const valid = isCompleteMandate(draft);

  return (
    <>
      {nextChangeAt !== null && dismissed !== "locked" ? (
        <UpdateLimitBanner
          title="Funding preference update limit reached"
          onDismiss={() => setDismissed("locked")}
        >
          You&rsquo;ve already updated your funding mandate within the last 30
          days. You can make changes again on {formatDate(nextChangeAt)}.
        </UpdateLimitBanner>
      ) : null}
      {!locked && dirty && dismissed !== "edited" ? (
        <UpdateLimitBanner
          title="Funding preference update limit"
          onDismiss={() => setDismissed("edited")}
        >
          You can update your funding mandate once every 30 days. Review your
          preferences carefully before saving, as you won&rsquo;t be able to
          make further changes during this period.
        </UpdateLimitBanner>
      ) : null}

      <form
        className="flex w-157.5 max-w-full flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          if (!dirty || !valid || locked) return;
          updateMandate({
            ...mandate,
            capitalAllocation: parseAllocation(draft.capitalAllocation),
            interestRate: Number(draft.interestRate),
            tenor: draft.tenor,
            fundingMin: draft.fundingMin,
            fundingMax: draft.fundingMax,
            businessSectors: draft.sectors,
          });
        }}
      >
        <MandateFields
          value={draft}
          disabled={locked}
          onChange={(fields) => setDraft({ ...draft, ...fields })}
        />

        <div className="flex justify-end py-lg">
          <Button
            type="submit"
            size="form"
            loading={isPending}
            disabled={locked || !dirty || !valid}
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
