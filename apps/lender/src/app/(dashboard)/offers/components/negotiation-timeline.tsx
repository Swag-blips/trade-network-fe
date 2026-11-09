"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshCcwIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";
import { useToast } from "@repo/ui/toast";
import { ConfirmModal } from "@repo/ui/confirm-modal";
import { PartyCard } from "@/components/party-card";
import { OfferModal, type OfferDraft } from "@/components/offer-modal";
import { TimelineCard } from "./timeline-card";
import { TermsAgreedModal } from "./terms-agreed-modal";
import { DisburseModal } from "./disburse-modal";
import type { Offer, OfferTerms, TimelineEntry } from "../types/offer";

type Dialog = "accept" | "agreed" | "disburse" | "exit" | "withdraw";

const TODAY = "Today, Sept 8";
/** Hours the lender has to disburse once terms are agreed. */
const FUNDING_WINDOW_HOURS = 48;
const naira = (value: string) => Number(value.replace(/[^0-9.]/g, "")) || 0;

function Day({ label }: { label: string }) {
  const [lead, ...rest] = label.split(", ");
  return (
    <p className="w-full text-body/[normal] text-grey-900">
      {rest.length > 0 ? (
        <>
          {lead}, <span className="text-grey-500">{rest.join(", ")}</span>
        </>
      ) : (
        <span className="text-grey-500">{lead}</span>
      )}
    </p>
  );
}

function groupByDay(entries: TimelineEntry[]) {
  const groups: { day: string; items: TimelineEntry[] }[] = [];
  for (const entry of entries) {
    const last = groups.at(-1);
    if (last?.day === entry.day) last.items.push(entry);
    else groups.push({ day: entry.day, items: [entry] });
  }
  return groups;
}

export function NegotiationTimeline({ offer }: { offer: Offer }) {
  const { toast } = useToast();
  const [entries, setEntries] = useState(offer.timeline);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [counterFrom, setCounterFrom] = useState<OfferTerms | null>(null);
  const [dialog, setDialog] = useState<Dialog | null>(null);

  const party = {
    name: offer.applicant,
    kind: offer.kind,
    initials: offer.initials,
  };
  const agreed = entries.find((entry) => entry.kind === "counter-offer");

  const latest = entries[0];
  const groups = groupByDay(entries);

  function addSentOffer(terms: OfferTerms) {
    setEntries((current) => [
      {
        id: `sent-${current.length}`,
        kind: "offer-sent",
        title: "Offer sent",
        by: "By You",
        day: TODAY,
        terms,
      },
      ...current,
    ]);
  }

  function execute(entry: TimelineEntry) {
    if (!entry.recommendation) return;
    const { proposal } = entry.recommendation;
    setExecutingId(entry.id);
    setTimeout(() => {
      setExecutingId(null);
      addSentOffer(proposal);
      toast({ message: "Your offer has been sent!" });
    }, 1800);
  }

  function sendCounter(draft: OfferDraft) {
    setCounterFrom(null);
    addSentOffer({
      advance: draft.advance,
      fee: draft.fee,
      feeRate: draft.feeRate,
      tenor: draft.tenor,
      expires: offer.expires,
    });
    toast({ message: "Your offer has been countered" });
  }

  function acceptOffer() {
    setDialog("agreed");
    setEntries((current) => [
      {
        id: `agreed-${current.length}`,
        kind: "terms-agreed",
        title: "Terms agreed",
        by: "By You",
        day: TODAY,
        terms: current[0]!.terms,
      },
      ...current,
    ]);
  }

  function disburse() {
    setDialog(null);
    toast({
      message: `Funds have been successfully disbursed to ${offer.applicant}.`,
    });
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center gap-2.5 border-b border-grey-100 pb-md">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-xs">
          <h2 className="font-sans text-xl/normal font-medium text-grey-900">
            Negotiation timeline
          </h2>
          <p className="flex items-center gap-xs text-body-sm/[normal] text-grey-600">
            <span
              aria-hidden
              className="flex size-3 flex-none items-center justify-center"
            >
              <span className="size-2 rounded-full bg-green-500" />
            </span>
            Updated 2 mins ago
          </p>
        </div>
        <IconButton
          label="Refresh timeline"
          onClick={() => toast({ message: "Timeline is up to date" })}
        >
          <HugeiconsIcon icon={RefreshCcwIcon} />
        </IconButton>
      </div>

      <div className="flex flex-col pt-md">
        {groups.map((group, groupIndex) => (
          <div
            key={`${group.day}-${groupIndex}`}
            className="flex w-full items-start gap-lg"
          >
            <div className="flex w-4 flex-none flex-col items-center gap-1 self-stretch pt-1">
              <span
                aria-hidden
                className="size-3 flex-none rounded-full bg-grey-200"
              />
              <span
                aria-hidden
                className="min-h-px w-0.5 flex-1 rounded-lg bg-grey-200"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-md pb-xl">
              <Day label={group.day} />
              {group.items.map((entry) => (
                <TimelineCard
                  key={entry.id}
                  entry={entry}
                  offer={offer}
                  isLatest={entry.id === latest?.id}
                  executing={executingId === entry.id}
                  onExecute={() => execute(entry)}
                  onEditRecommendation={() =>
                    setCounterFrom(entry.recommendation?.proposal ?? null)
                  }
                  onCounter={() => setCounterFrom(entry.terms)}
                  fundingWindow={`${FUNDING_WINDOW_HOURS} hours`}
                  onAccept={() => setDialog("accept")}
                  onDisburse={() => setDialog("disburse")}
                  onExit={() => setDialog("exit")}
                  onWithdraw={() => setDialog("withdraw")}
                />
              ))}
            </div>
          </div>
        ))}

        <div aria-hidden className="flex h-4 w-full items-start">
          <div className="flex w-4 flex-none flex-col items-center pt-1">
            <span className="size-3 rounded-full bg-grey-200" />
          </div>
        </div>
      </div>

      {counterFrom ? (
        <OfferModal
          title="Send counter offer"
          party={{
            name: offer.applicant,
            kind: offer.kind,
            initials: offer.initials,
          }}
          requested={`${counterFrom.advance} requested · ${counterFrom.tenor} · ${counterFrom.feeRate} Fee`}
          invoiceValue={naira(offer.invoiceValue)}
          initialAmount={counterFrom.advance.replace("₦", "")}
          initialFee={counterFrom.feeRate.replace("%", "")}
          initialTenor={counterFrom.tenor}
          onClose={() => setCounterFrom(null)}
          onSubmit={sendCounter}
        />
      ) : null}

      {dialog === "accept" ? (
        <ConfirmModal
          title="Accept offer?"
          confirmLabel="Accept offer"
          confirmIcon={<HugeiconsIcon icon={Tick02Icon} />}
          onClose={() => setDialog(null)}
          onConfirm={acceptOffer}
        >
          <p className="text-body text-grey-800">
            Accepting this offer will confirm the agreed terms and end the
            negotiation. You&rsquo;ll then proceed to disbursement.
          </p>
          {agreed ? (
            <PartyCard
              party={party}
              terms={`${agreed.terms.advance} requested · ${agreed.terms.tenor} · ${agreed.terms.feeRate} Fee`}
            />
          ) : null}
        </ConfirmModal>
      ) : null}

      {dialog === "agreed" ? (
        <TermsAgreedModal
          initials={offer.initials}
          hours={FUNDING_WINDOW_HOURS}
          minutes={0}
          onDisburse={() => setDialog("disburse")}
          onClose={() => setDialog(null)}
        />
      ) : null}

      {dialog === "disburse" ? (
        <DisburseModal onClose={() => setDialog(null)} onConfirm={disburse} />
      ) : null}

      {dialog === "withdraw" ? (
        <ConfirmModal
          title="Withdraw offer?"
          confirmLabel="Withdraw offer"
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setDialog(null);
            toast({ message: "You have withdrawn your offer" });
          }}
        >
          <p className="text-body text-grey-800">
            This will remove your current offer from consideration. The other
            party will no longer be able to accept it.
          </p>
        </ConfirmModal>
      ) : null}

      {dialog === "exit" ? (
        <ConfirmModal
          title="Exit negotiation?"
          cancelLabel="Keep negotiating"
          confirmLabel="Continue"
          confirmVariant="destructive"
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setDialog(null);
            toast({
              message: "You have exited this negotiation",
              state: "error",
            });
          }}
        >
          <p className="text-body text-grey-800">
            This will end the current negotiation and close the offer. You
            won&rsquo;t be able to continue negotiating from this offer once you
            exit.
          </p>
        </ConfirmModal>
      ) : null}
    </div>
  );
}
