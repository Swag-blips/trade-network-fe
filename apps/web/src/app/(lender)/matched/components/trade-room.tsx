"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDataTransferHorizontalIcon,
  CheckmarkCircle02Icon,
  Clock03Icon,
  Progress04Icon,
  RefreshIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";
import { InitialsAvatar } from "@/components/avatars";
import type {
  EvidenceStatus,
  OpportunityDetail,
  Opportunity,
} from "../types/opportunity";

const SUB_TABS = ["Trade details", "Evidence", "Activity"] as const;
type SubTab = (typeof SUB_TABS)[number];

const EVIDENCE_TONE: Record<
  EvidenceStatus,
  { icon: typeof Progress04Icon; className: string; label: string }
> = {
  requested: {
    icon: Progress04Icon,
    className: "text-ochre-700",
    label: "Requested",
  },
  pending: { icon: Clock03Icon, className: "text-grey-500", label: "Pending" },
  verified: {
    icon: CheckmarkCircle02Icon,
    className: "text-green-500",
    label: "Verified",
  },
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="font-brand text-[1.5rem]/[1.5] font-medium text-grey-900">
      {children}
    </h3>
  );
}

function TradeDetails({
  item,
  detail,
}: {
  item: Opportunity;
  detail: OpportunityDetail;
}) {
  return (
    <div className="flex flex-col gap-lg">
      <SectionTitle>Trade details</SectionTitle>

      <div className="flex w-fit items-center gap-lg rounded-lg border border-grey-100 bg-white p-md">
        <span className="flex items-center gap-sm">
          <InitialsAvatar initials={item.initials} size={40} />
          <span className="flex flex-col">
            <span className="flex items-center gap-xs font-sans text-body-sm/[normal] font-medium text-grey-900">
              {detail.trade.seller}
              <HugeiconsIcon
                icon={UserIcon}
                size={16}
                className="text-grey-800"
              />
            </span>
            <span className="text-caption/[normal] text-grey-600">Seller</span>
          </span>
        </span>
        <HugeiconsIcon
          icon={ArrowDataTransferHorizontalIcon}
          size={20}
          className="flex-none text-grey-500"
        />
        <span className="flex items-center gap-sm">
          <InitialsAvatar
            initials={detail.trade.buyerInitials}
            size={40}
            className="border-grey-200 bg-grey-100 text-grey-600"
          />
          <span className="flex flex-col">
            <span className="font-sans text-body-sm/[normal] font-medium text-grey-900">
              {detail.trade.buyer}
            </span>
            <span className="text-caption/[normal] text-grey-600">Buyer</span>
          </span>
        </span>
      </div>

      <dl className="flex flex-col gap-sm">
        {detail.trade.rows.map((row) => (
          <div key={row.label} className="flex items-center">
            <dt className="w-[160px] flex-none text-body-sm/[normal] text-grey-700">
              {row.label}
            </dt>
            <dd className="flex items-center gap-1 text-body-sm/[normal] text-grey-900">
              {row.verified ? (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={16}
                  className="text-green-500"
                />
              ) : null}
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function TradeEvidence({ steps }: { steps: OpportunityDetail["evidence"] }) {
  return (
    <div className="flex flex-col gap-lg">
      <SectionTitle>Trade evidence</SectionTitle>
      <ol className="flex w-[346px] max-w-full flex-col">
        {steps.map((step, index) => {
          const tone = EVIDENCE_TONE[step.status];
          return (
            <li key={step.id}>
              {index > 0 ? (
                <span
                  aria-hidden
                  className="ml-[173px] block h-5 w-px bg-grey-200"
                />
              ) : null}
              <div className="flex flex-col gap-0.5 rounded-lg border border-grey-100 bg-white px-md py-2.5">
                <p className="font-sans text-body font-medium text-grey-900">
                  {step.label}
                </p>
                <span
                  className={`flex items-center gap-1 text-body-sm/[normal] ${tone.className}`}
                >
                  <HugeiconsIcon icon={tone.icon} size={16} />
                  {tone.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function TradeActivityList({
  activity,
}: {
  activity: OpportunityDetail["activity"];
}) {
  return (
    <section className="w-[426px] max-w-full overflow-hidden rounded-lg border border-grey-100 bg-white">
      <div className="flex items-start gap-sm border-b border-grey-100 px-md py-sm">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="font-sans text-body font-medium text-grey-900">
            Trade Activities
          </h3>
          <span className="flex items-center gap-xs text-body-sm/[normal] text-grey-600">
            <span aria-hidden className="size-1.5 rounded-full bg-green-500" />
            Updated 2 mins ago
          </span>
        </div>
        <IconButton
          label="Refresh activity"
          size="xs"
          className="text-grey-500"
        >
          <HugeiconsIcon icon={RefreshIcon} />
        </IconButton>
      </div>
      <ul className="flex max-h-[300px] flex-col overflow-y-auto">
        {activity.map((event) => (
          <li key={event.id} className="flex gap-sm px-md py-sm">
            <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-evergreen-100">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={18}
                className="text-evergreen-700"
              />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-start gap-sm">
                <span className="min-w-0 flex-1 font-sans text-body-sm/[normal] font-medium text-grey-900">
                  {event.title}
                </span>
                <span className="flex-none text-caption/[normal] text-grey-500">
                  {event.at}
                </span>
              </span>
              <span className="text-caption/[normal] text-grey-600">
                {event.description}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TradeRoom({
  item,
  detail,
}: {
  item: Opportunity;
  detail: OpportunityDetail;
}) {
  const [tab, setTab] = useState<SubTab>("Trade details");

  return (
    <div className="flex flex-col gap-lg">
      <div
        role="tablist"
        aria-label="Trade room sections"
        className="flex w-fit gap-1 rounded-lg bg-grey-100 p-1"
      >
        {SUB_TABS.map((name) => {
          const active = tab === name;
          return (
            <button
              key={name}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(name)}
              className={`rounded-md px-sm py-1.5 font-sans text-body-sm/[normal] transition-colors motion-reduce:transition-none ${
                active
                  ? "bg-white font-medium text-grey-900 shadow-small-thick"
                  : "text-grey-500 hover:text-grey-900"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {tab === "Trade details" ? (
        <TradeDetails item={item} detail={detail} />
      ) : null}
      {tab === "Evidence" ? <TradeEvidence steps={detail.evidence} /> : null}
      {tab === "Activity" ? (
        <TradeActivityList activity={detail.activity} />
      ) : null}
    </div>
  );
}
