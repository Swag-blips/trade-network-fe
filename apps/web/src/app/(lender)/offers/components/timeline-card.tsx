"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  Cancel01Icon,
  Exchange01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { InitialsAvatar, OrgAvatar } from "@/components/avatars";
import { OfferDetails } from "./offer-details";
import { AiSuggestion } from "./ai-suggestion";
import type { Offer, TimelineEntry } from "../types/offer";

type Shown = "details" | "recommendation" | "none";

export function TimelineCard({
  entry,
  offer,
  isLatest,
  executing = false,
  fundingWindow,
  onAccept,
  onCounter,
  onExit,
  onWithdraw,
  onExecute,
  onEditRecommendation,
  onDisburse,
}: {
  entry: TimelineEntry;
  offer: Offer;
  isLatest: boolean;
  executing?: boolean;
  /** Time left to disburse, e.g. "48 hours". Terms-agreed cards only. */
  fundingWindow?: string;
  onAccept?: () => void;
  onCounter?: () => void;
  onExit?: () => void;
  onWithdraw?: () => void;
  onExecute?: () => void;
  onEditRecommendation?: () => void;
  onDisburse?: () => void;
}) {
  const isCounter = entry.kind === "counter-offer";
  const isAgreed = entry.kind === "terms-agreed";
  const [shown, setShown] = useState<Shown>(isCounter ? "details" : "none");

  const open = executing ? "recommendation" : shown;
  const canWithdraw =
    !isCounter && !isAgreed && (isLatest || open === "details");
  const toggle = (next: Exclude<Shown, "none">) =>
    setShown(open === next ? "none" : next);

  return (
    <article className="w-116.5 max-w-full overflow-hidden rounded-lg border border-grey-100 bg-white shadow-small-thick">
      <div className="flex w-full items-center gap-3.75 px-md py-2.5">
        {isCounter ? (
          <InitialsAvatar initials={offer.initials} size={56} />
        ) : (
          <OrgAvatar name="Trade Network" size={56} />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-0.75">
          <p className="font-sans text-body/[normal] font-medium text-black">
            {entry.title}
          </p>
          <p className="text-caption/[normal] text-grey-500">{entry.by}</p>
        </div>
        {isLatest && !isAgreed ? (
          <span className="flex flex-none items-center justify-center rounded-md border border-grey-100 bg-white px-xs py-1 font-sans text-caption/[normal] font-medium text-grey-800">
            NEW
          </span>
        ) : null}
      </div>

      {isAgreed ? (
        <div className="flex flex-col px-md pt-xs pb-md">
          <div className="flex w-full flex-col gap-sm overflow-hidden rounded-lg bg-orange-50 px-sm py-2.5">
            <div className="flex w-full items-center justify-center gap-xs">
              <HugeiconsIcon
                icon={Alert02Icon}
                size={20}
                className="flex-none text-orange-500"
              />
              <p className="min-w-0 flex-1 font-sans text-body-sm font-medium text-grey-900">
                {fundingWindow} left to disburse the funds
              </p>
            </div>
            <p className="text-body-sm text-grey-800">
              If you don&rsquo;t confirm disbursement within 48 hours, the
              funding window will expire and the opportunity will be closed.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col gap-md px-md pt-xs ${isCounter ? "pb-xs" : "pb-md"}`}
        >
          <OfferDetails
            terms={entry.terms}
            open={open === "details"}
            onToggle={() => toggle("details")}
          />
          {entry.recommendation ? (
            <AiSuggestion
              recommendation={entry.recommendation}
              open={open === "recommendation"}
              onToggle={() => toggle("recommendation")}
              executing={executing}
              onExecute={onExecute}
              onEdit={onEditRecommendation}
            />
          ) : null}
        </div>
      )}

      {isAgreed ? (
        <div className="flex w-full items-start border-t border-grey-100 bg-white p-md">
          <Button
            size="form"
            className="flex-1"
            leadingIcon={<HugeiconsIcon icon={Tick02Icon} />}
            onClick={onDisburse}
          >
            Confirm disbursement of funds
          </Button>
        </div>
      ) : isCounter ? (
        !isLatest || executing ? null : (
          <div className="flex w-full items-start gap-2.5 border-t border-grey-100 bg-white p-md">
            <Button
              size="form"
              className="flex-1"
              leadingIcon={<HugeiconsIcon icon={Tick02Icon} />}
              onClick={onAccept}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="form"
              className="flex-1"
              leadingIcon={<HugeiconsIcon icon={Exchange01Icon} />}
              onClick={onCounter}
            >
              Counter
            </Button>
            <Button
              variant="outline"
              size="form"
              className="flex-1 inset-ring-red-error-500! text-red-error-500!"
              leadingIcon={<HugeiconsIcon icon={Cancel01Icon} />}
              onClick={onExit}
            >
              Exit
            </Button>
          </div>
        )
      ) : canWithdraw ? (
        <div className="flex w-full items-start border-t border-grey-100 bg-white p-md">
          <Button
            variant="outline"
            size="form"
            className="flex-1"
            onClick={onWithdraw}
          >
            Withdraw offer
          </Button>
        </div>
      ) : null}
    </article>
  );
}
