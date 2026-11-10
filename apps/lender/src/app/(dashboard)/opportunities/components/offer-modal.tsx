"use client";

import { useEffect, useId, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiMagicIcon, SentIcon } from "@hugeicons/core-free-icons";
import { Avatar } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Select } from "@repo/ui/select";
import { RANGE_THUMB } from "@/components/financing-range";
import { useMandate } from "@/hooks/use-mandate";
import { naira } from "@/utils/naira";
import { useDashboardOverview } from "../../hooks/use-dashboard-overview";
import type { OfferTerms } from "../types/inbox";
import type { Opportunity } from "../types/opportunity";
import { interestOf, shortDate } from "../utils/format";

const TENORS = [30, 45, 60, 90];
const tenorLabel = (days: number) => `${days} days`;

function toAmountText(raw: string) {
  const [whole = "", ...rest] = raw.replace(/[^\d.]/g, "").split(".");
  const grouped = whole
    .replace(/^0+(?=\d)/, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rest.length > 0 ? `${grouped}.${rest.join("").slice(0, 2)}` : grouped;
}

const parseAmount = (text: string) => Number(text.replace(/,/g, "")) || 0;

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-md">
      <dt className="text-body/[normal] text-grey-600">{label}</dt>
      <dd
        className={`whitespace-nowrap text-grey-800 ${strong ? "text-xl/[normal] font-medium" : "text-body/[normal]"}`}
      >
        {value}
      </dd>
    </div>
  );
}

export function OfferModal({
  opportunity,
  onClose,
  onSend,
}: {
  opportunity: Opportunity;
  onClose: () => void;
  onSend: (terms: OfferTerms) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const amountId = useId();
  const tenorId = useId();
  const { data: mandate } = useMandate();
  const { data: overview } = useDashboardOverview();
  const [amountText, setAmountText] = useState("");
  const [tenorDays, setTenorDays] = useState(TENORS[0]!);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const available = overview?.availableCapital;
  const ceiling = available ?? opportunity.advance;
  const amount = parseAmount(amountText);
  const terms: OfferTerms = {
    amount,
    tenorDays,
    ratePercent: mandate?.interestRate ?? 0,
  };
  const total = amount + interestOf(terms);
  const overCapital = available !== undefined && amount > available;
  const fill = ceiling > 0 ? Math.min(amount / ceiling, 1) * 100 : 0;

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto max-h-[min(41.9375rem,calc(100dvh-2rem))] w-127 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl bg-white p-0 backdrop:bg-grey-900/40 open:flex"
    >
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          if (amount > 0 && !overCapital) onSend(terms);
        }}
      >
        <header className="flex flex-none flex-col items-center gap-1 px-5 py-md">
          <h2
            id={titleId}
            className="font-sans text-body/[normal] font-medium text-grey-900"
          >
            Send an offer to
          </h2>
          <p className="flex items-center gap-2.5 text-body-sm/[normal] text-grey-600">
            <Avatar
              name={opportunity.name}
              size={24}
              shape="square"
              className="border border-grey-200 bg-grey-50 text-grey-600"
            />
            {opportunity.name}
          </p>
        </header>

        <div className="flex min-h-0 flex-col gap-lg overflow-y-auto px-5 pt-xs pb-md">
          <section className="flex flex-col gap-sm rounded-xl border border-grey-100 bg-grey-50 p-md">
            <h3 className="font-sans text-body/[1.5] font-medium text-grey-900">
              Financing request
            </h3>
            <dl className="flex flex-col gap-sm">
              <Row
                label="Requested advance"
                value={naira(opportunity.advance)}
              />
              <Row
                label="Repayment tenure"
                value={tenorLabel(opportunity.tenorDays)}
              />
              <Row
                label="Needed before"
                value={shortDate(opportunity.expiresAt)}
              />
            </dl>
          </section>

          <section className="flex flex-col gap-md">
            <div className="flex items-center gap-xs">
              <h3 className="min-w-0 flex-1 font-sans text-body/[1.5] font-medium text-grey-900">
                Your offer
              </h3>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                leadingIcon={<HugeiconsIcon icon={AiMagicIcon} />}
                onClick={() => {
                  setAmountText(
                    toAmountText(
                      String(Math.round(Math.min(opportunity.advance, ceiling))),
                    ),
                  );
                  if (TENORS.includes(opportunity.tenorDays))
                    setTenorDays(opportunity.tenorDays);
                }}
              >
                Auto suggest
              </Button>
            </div>

            <div className="flex flex-col items-center gap-md rounded-2xl border border-grey-100 bg-white px-lg py-md">
              <div className="flex flex-col items-center gap-xs">
                <label
                  htmlFor={amountId}
                  className="text-body/[normal] text-grey-600"
                >
                  Enter amount
                </label>
                {/* 32px is off the type scale (28 → 36); kept from the comp. */}
                <div className="flex w-71.25 items-center justify-center gap-2.5 border-b border-grey-200 pb-1 font-brand text-[2rem]/[normal]">
                  <span aria-hidden className="font-medium text-grey-600">
                    ₦
                  </span>
                  <input
                    id={amountId}
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0.00"
                    value={amountText}
                    onChange={(event) =>
                      setAmountText(toAmountText(event.target.value))
                    }
                    className="field-sizing-content min-w-16 max-w-56 bg-transparent text-grey-900 caret-grey-900 outline-none placeholder:text-grey-300"
                  />
                </div>
                <p className="text-body-sm/[normal] text-grey-600">
                  Total repayment ≃{" "}
                  <span className="text-evergreen-600">{naira(total)}</span>
                </p>
              </div>

              <div className="flex w-full flex-col gap-xs">
                <div className="relative h-5">
                  <div className="absolute inset-x-0 top-2 h-1 overflow-hidden rounded-3xl bg-grey-100">
                    <div
                      className="h-full bg-evergreen-500"
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    aria-label="Offer amount"
                    min={0}
                    max={Math.max(Math.round(ceiling), 1)}
                    step={Math.max(Math.round(ceiling / 200), 1)}
                    value={Math.min(amount, ceiling)}
                    onChange={(event) =>
                      setAmountText(toAmountText(event.target.value))
                    }
                    className={`absolute inset-0 m-0 h-5 w-full cursor-pointer appearance-none bg-transparent outline-none ${RANGE_THUMB}`}
                  />
                </div>
                <p
                  className={`text-center text-body-sm/[normal] ${overCapital ? "text-red-error-500" : "text-grey-600"}`}
                >
                  Available capital:{" "}
                  <span className={overCapital ? "" : "text-grey-800"}>
                    {available === undefined ? "—" : naira(available)}
                  </span>
                </p>
              </div>
            </div>

            <Field label="Repayment tenure" htmlFor={tenorId} variant="auth">
              <Select
                id={tenorId}
                variant="strong"
                value={tenorLabel(tenorDays)}
                onValueChange={(value) => setTenorDays(parseInt(value, 10))}
                options={TENORS.map(tenorLabel)}
              />
            </Field>
          </section>

          <section className="flex flex-col gap-sm rounded-xl border border-evergreen-100 bg-evergreen-50 p-md">
            <h3 className="font-sans text-body/[1.5] font-medium text-grey-900">
              Offer preview
            </h3>
            <dl className="flex flex-col gap-sm">
              <Row label="Tenure" value={tenorLabel(tenorDays)} />
              <Row label="Offered amount" value={naira(amount)} />
              <hr className="border-grey-200" />
              <Row label="Total repayment" value={naira(total)} strong />
            </dl>
          </section>
        </div>

        <footer className="flex flex-none items-center justify-end gap-2.5 border-t border-grey-200 px-5 py-md">
          <Button
            type="button"
            variant="tertiary"
            size="compact"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="auth"
            disabled={amount <= 0 || overCapital}
            trailingIcon={<HugeiconsIcon icon={SentIcon} />}
          >
            Send offer
          </Button>
        </footer>
      </form>
    </dialog>
  );
}
