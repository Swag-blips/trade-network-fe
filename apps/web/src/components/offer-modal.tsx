"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Edit02Icon, SentIcon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { IconButton } from "@repo/ui/icon-button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { PartyCard, type Party } from "@/components/party-card";
import { TaiAgent } from "@/components/tai-agent";

type Step = "form" | "review" | "sent";

export interface OfferDraft {
  advance: string;
  fee: string;
  feeRate: string;
  tenor: string;
}

const TENORS = ["30 days", "45 days", "60 days", "90 days"];
const naira = (value: number) =>
  `₦${Math.round(value).toLocaleString("en-NG")}`;
const parse = (value: string) => Number(value.replace(/[^0-9.]/g, "")) || 0;

export function OfferModal({
  party,
  requested,
  invoiceValue,
  title = "Make an offer",
  submitLabel = "Send offer",
  initialAmount = "",
  initialFee = "",
  initialTenor = TENORS[0]!,
  onClose,
  onSubmit,
  onSent,
}: {
  party: Party;
  /** The borrower's ask, rendered under their name. */
  requested: string;
  invoiceValue: number;
  title?: string;
  submitLabel?: string;
  initialAmount?: string;
  initialFee?: string;
  initialTenor?: string;
  onClose: () => void;
  /** Given: the modal hands the draft back and closes, with no success step. */
  onSubmit?: (draft: OfferDraft) => void;
  /** Given: the success step renders, and this is its primary action. */
  onSent?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<Step>("form");
  const [mode, setMode] = useState<"amount" | "percent">("amount");
  const [amount, setAmount] = useState(initialAmount);
  const [fee, setFee] = useState(initialFee);
  const [tenor, setTenor] = useState(initialTenor);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const advance = parse(amount);
  const feePercent = parse(fee);
  const feeAmount = (advance * feePercent) / 100;
  const coverage = invoiceValue ? (advance / invoiceValue) * 100 : 0;
  const canReview = advance > 0;

  function send() {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      if (onSubmit) {
        onSubmit({
          advance: naira(advance),
          fee: naira(feeAmount),
          feeRate: `${feePercent.toFixed(1)}%`,
          tenor,
        });
      } else {
        setStep("sent");
      }
    }, 1600);
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="offer-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-[414px] max-w-[calc(100vw-2rem)] overflow-visible rounded-xl bg-white p-0 backdrop:bg-grey-900/40"
    >
      {step === "sent" ? (
        <div className="flex flex-col items-center gap-lg px-lg py-xl text-center">
          <HugeiconsIcon
            icon={SentIcon}
            size={40}
            className="text-evergreen-600"
          />
          <div className="flex flex-col gap-xs">
            <h2
              id="offer-title"
              className="font-sans text-[1.25rem]/[1.5] font-medium text-grey-900"
            >
              Your offer has been sent!
            </h2>
            <p className="text-body-sm text-grey-600">
              We&rsquo;ve sent your offer to {party.name}. We&rsquo;ll notify
              you once they respond.
            </p>
          </div>
          <div className="flex w-full flex-col gap-sm">
            <Button size="form" className="w-full" onClick={onSent}>
              View my offer
            </Button>
            <Button
              variant="outline"
              size="form"
              className="w-full"
              onClick={onClose}
            >
              Dismiss
            </Button>
          </div>
        </div>
      ) : (
        <>
          <header className="relative flex flex-none flex-col items-center gap-1 px-lg py-md">
            <h2
              id="offer-title"
              className="font-sans text-body font-medium text-grey-900"
            >
              {title}
            </h2>
            <p className="text-body-sm/[normal] text-grey-600">
              To {party.name}
            </p>
            <IconButton
              label="Close"
              size="xs"
              onClick={onClose}
              className="absolute top-5.5 right-5"
            >
              <HugeiconsIcon icon={Cancel01Icon} />
            </IconButton>
          </header>

          {step === "form" ? (
            <div className="flex max-h-[70vh] flex-col gap-lg overflow-y-auto px-5 pb-md">
              <PartyCard party={party} terms={requested} />

              <div className="flex flex-col gap-md">
                <div className="flex items-center gap-sm">
                  <h3 className="min-w-0 flex-1 font-sans text-body font-medium text-grey-900">
                    Offer details
                  </h3>
                  <TaiAgent size="xs" />
                </div>

                <div className="flex flex-col gap-sm rounded-md border border-grey-100 px-md py-2.5">
                  <div className="flex w-full gap-0.5 rounded-md border border-grey-100 bg-grey-50 p-0.5">
                    {(["amount", "percent"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={mode === option}
                        onClick={() => setMode(option)}
                        className={`flex-1 rounded-md px-sm py-xs font-sans text-body-sm/[normal] font-medium transition-colors motion-reduce:transition-none ${
                          mode === option
                            ? "bg-white text-grey-900 shadow-small-thick"
                            : "text-grey-500 hover:text-grey-900"
                        }`}
                      >
                        {option === "amount" ? "₦" : "%"}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-xs py-xs">
                    <Field label="Offered amount" htmlFor="offer-amount">
                      <Input
                        id="offer-amount"
                        leading={mode === "amount" ? "₦" : "%"}
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                      />
                    </Field>
                    <p className="text-caption/[normal] text-grey-600">
                      ≃{" "}
                      <span className="text-evergreen-600">
                        {coverage.toFixed(1)}%
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <Field label="Fee" htmlFor="offer-fee">
                    <Input
                      id="offer-fee"
                      placeholder="0.00"
                      value={fee}
                      onChange={(event) => setFee(event.target.value)}
                    />
                  </Field>
                  <p className="text-caption/[normal] text-grey-600">
                    ≃{" "}
                    <span className="text-evergreen-600">
                      {naira(feeAmount)}
                    </span>
                  </p>
                </div>

                <Field label="Repayment tenor" htmlFor="offer-tenor">
                  <Select
                    id="offer-tenor"
                    value={tenor}
                    onChange={(event) => setTenor(event.target.value)}
                  >
                    {TENORS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            </div>
          ) : (
            <div className="flex flex-col px-5 pb-md">
              <div className="flex flex-col gap-md rounded-md border border-grey-100 px-md py-2.5">
                <h3 className="font-sans text-body font-medium text-grey-900">
                  Offer summary
                </h3>
                <dl className="flex flex-col">
                  <hr className="border-grey-100" />
                  {[
                    { label: "Repayment tenor", value: tenor },
                    { label: "Advance offered", value: naira(advance) },
                    {
                      label: `Fee (${feePercent.toFixed(1)}%)`,
                      value: naira(feeAmount),
                    },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center pt-md">
                      <dt className="min-w-0 flex-1 text-body-sm/[normal] text-grey-600">
                        {row.label}
                      </dt>
                      <dd className="text-body-sm/[normal] text-grey-900">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                  <hr className="mt-md border-grey-100" />
                  <div className="flex items-center pt-md">
                    <dt className="min-w-0 flex-1 text-body-sm/[normal] text-grey-600">
                      Total repayment due
                    </dt>
                    <dd className="font-sans text-body-sm/[normal] font-medium text-grey-900">
                      {naira(advance + feeAmount)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          <footer className="flex flex-none items-center gap-sm border-t border-grey-100 px-5 py-md">
            {step === "form" ? (
              <Button
                size="form"
                className="ml-auto"
                disabled={!canReview}
                onClick={() => setStep("review")}
              >
                Review offer
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="form"
                  className="flex-1"
                  onClick={() => setStep("form")}
                  leadingIcon={<HugeiconsIcon icon={Edit02Icon} />}
                >
                  Edit offer
                </Button>
                <Button
                  size="form"
                  className="flex-1"
                  loading={sending}
                  onClick={send}
                  trailingIcon={<HugeiconsIcon icon={SentIcon} />}
                >
                  {submitLabel}
                </Button>
              </>
            )}
          </footer>
        </>
      )}
    </dialog>
  );
}
