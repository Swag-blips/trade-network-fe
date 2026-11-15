"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { MandateFields } from "@/components/mandate-fields";
import { useFieldErrors } from "@/hooks/use-field-errors";
import type { Mandate } from "@/types/mandate";
import {
  changedMandateFields,
  fromDraft,
  isCompleteMandate,
  isSameDraft,
  MANDATE_FIELDS,
  toDraft,
} from "@/utils/mandate-options";
import { useUpdateMandate } from "../hooks/use-update-mandate";
import { longDate } from "@/utils/date";
import { UpdateLimitBanner } from "./update-limit-banner";

export function MandateForm({ mandate }: { mandate: Mandate }) {
  const { mutate: updateMandate, isPending } = useUpdateMandate();
  const fieldErrors = useFieldErrors(MANDATE_FIELDS);
  const [draft, setDraft] = useState(() => toDraft(mandate));
  const [dismissed, setDismissed] = useState<"edited" | "locked" | null>(null);

  const { nextChangeAt } = mandate;
  const locked = nextChangeAt !== null;
  const dirty = !isSameDraft(draft, toDraft(mandate));
  const valid = isCompleteMandate(draft);

  return (
    <>
      {nextChangeAt !== null && dismissed !== "locked" ? (
        <UpdateLimitBanner
          title="Funding preference update limit reached"
          onDismiss={() => setDismissed("locked")}
        >
          You&rsquo;ve already updated your funding mandate within the last 30
          days. You can make changes again on {longDate(nextChangeAt)}.
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
          fieldErrors.reset();
          updateMandate(
            { ...mandate, ...fromDraft(draft) },
            { onError: fieldErrors.show },
          );
        }}
      >
        <MandateFields
          value={draft}
          disabled={locked}
          errors={fieldErrors.errors}
          onChange={(fields) => {
            setDraft({ ...draft, ...fields });
            changedMandateFields(fields).forEach(fieldErrors.clear);
          }}
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
