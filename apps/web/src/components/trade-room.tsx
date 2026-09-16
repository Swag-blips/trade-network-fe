"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDataTransferHorizontalIcon,
  CheckmarkCircle02Icon,
  Clock03Icon,
  DeliveryTruck01Icon,
  Invoice01Icon,
  Package01Icon,
  Progress04Icon,
  RefreshIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { IconButton } from "@repo/ui/icon-button";
import { InitialsAvatar } from "@/components/avatars";

export type EvidenceStatus = "requested" | "pending" | "verified";
export type ActivityKind = "invoice" | "delivery" | "shipment" | "checkpoint";

export interface EvidenceStep {
  id: string;
  label: string;
  status: EvidenceStatus;
}

export interface TradeActivity {
  id: string;
  title: string;
  at: string;
  description: string;
  kind?: ActivityKind;
}

export interface TradeRoomData {
  seller: string;
  sellerInitials: string;
  buyer: string;
  buyerInitials: string;
  rows: { label: string; value: string; verified?: boolean }[];
  evidence: EvidenceStep[];
  activity: TradeActivity[];
}

const SUB_TABS = ["Trade details", "Evidence", "Activity"] as const;
type SubTab = (typeof SUB_TABS)[number];

const EVIDENCE_TONE: Record<
  EvidenceStatus,
  { icon: IconSvgElement; className: string; label: string }
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

const ACTIVITY_ICON: Record<ActivityKind, IconSvgElement> = {
  invoice: Invoice01Icon,
  delivery: Package01Icon,
  shipment: DeliveryTruck01Icon,
  checkpoint: CheckmarkCircle02Icon,
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="w-full font-sans text-xl/normal font-medium text-grey-900">
      {children}
    </h3>
  );
}

function Party({
  name,
  role,
  initials,
  owned = false,
}: {
  name: string;
  role: string;
  initials: string;
  owned?: boolean;
}) {
  return (
    <span className="flex flex-none items-center gap-sm">
      <InitialsAvatar
        initials={initials}
        size={56}
        className={owned ? "" : "border-grey-200 bg-grey-100 text-grey-600"}
      />
      <span className="flex flex-col justify-center gap-0.5">
        <span className="flex items-center gap-sm font-sans text-body-sm font-medium text-grey-800">
          {name}
          {owned ? (
            <HugeiconsIcon
              icon={UserIcon}
              size={16}
              className="text-grey-800"
            />
          ) : null}
        </span>
        <span className="text-body-sm/[normal] text-grey-600">{role}</span>
      </span>
    </span>
  );
}

function TradeDetails({ data }: { data: TradeRoomData }) {
  return (
    <div className="flex flex-col gap-lg">
      <SectionTitle>Trade details</SectionTitle>

      <div className="flex w-fit max-w-full flex-wrap items-center gap-xl overflow-hidden rounded-lg border border-grey-100 bg-white p-md">
        <Party
          name={data.seller}
          role="Seller"
          initials={data.sellerInitials}
          owned
        />
        <span className="flex size-8 flex-none items-center justify-center rounded-xl bg-white">
          <HugeiconsIcon
            icon={ArrowDataTransferHorizontalIcon}
            size={20}
            className="text-grey-500"
          />
        </span>
        <Party name={data.buyer} role="Buyer" initials={data.buyerInitials} />
      </div>

      <dl className="flex flex-col gap-md">
        {data.rows.map((row) => (
          <div key={row.label} className="flex items-center gap-xl">
            <dt className="w-42.25 flex-none text-body-sm text-grey-600">
              {row.label}
            </dt>
            <dd className="flex items-center gap-1 text-body-sm text-grey-800">
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

function TradeEvidence({ steps }: { steps: EvidenceStep[] }) {
  return (
    <div className="flex flex-col gap-lg">
      <SectionTitle>Trade evidence</SectionTitle>
      <ol className="flex w-86.5 max-w-full flex-col">
        {steps.map((step, index) => {
          const tone = EVIDENCE_TONE[step.status];
          return (
            <li key={step.id}>
              {index > 0 ? (
                <span
                  aria-hidden
                  className="ml-43.25 block h-5 w-px bg-grey-200"
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

function TradeActivityList({ activity }: { activity: TradeActivity[] }) {
  return (
    <section className="w-full overflow-hidden rounded-lg border border-grey-100 bg-white">
      <div className="flex items-center gap-sm px-5 py-md">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="font-sans text-xl/normal font-medium text-grey-900">
            Trade Activities
          </h3>
          <span className="flex items-center gap-xs text-body-sm/[normal] text-grey-600">
            <span
              aria-hidden
              className="flex size-3 items-center justify-center"
            >
              <span className="size-2 rounded-full bg-green-500" />
            </span>
            Updated 2 mins ago
          </span>
        </div>
        <IconButton label="Refresh activity" className="text-grey-500">
          <HugeiconsIcon icon={RefreshIcon} />
        </IconButton>
      </div>
      <ul className="flex max-h-107 flex-col overflow-y-auto">
        {activity.map((event) => (
          <li key={event.id} className="flex gap-sm px-5 py-sm">
            <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-evergreen-100">
              <HugeiconsIcon
                icon={ACTIVITY_ICON[event.kind ?? "checkpoint"]}
                size={18}
                className="text-evergreen-700"
              />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-start gap-sm">
                <span className="min-w-0 flex-1 font-sans text-body font-medium text-grey-900">
                  {event.title}
                </span>
                <span className="flex-none text-caption/[normal] text-grey-500">
                  {event.at}
                </span>
              </span>
              <span className="text-body-sm text-grey-600">
                {event.description}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TradeRoom({ data }: { data: TradeRoomData }) {
  const [tab, setTab] = useState<SubTab>("Trade details");

  return (
    <div className="flex w-full flex-col gap-lg">
      <div
        role="tablist"
        aria-label="Trade room sections"
        className="flex w-fit gap-0.5 rounded-md border border-grey-100 bg-grey-50"
      >
        {SUB_TABS.map((name) => {
          const active = tab === name;
          return (
            <button
              key={name}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(name)}
              className={`rounded-md px-sm py-xs font-sans text-body/[normal] font-medium transition-colors motion-reduce:transition-none ${
                active
                  ? "bg-white text-grey-900 shadow-small-thick"
                  : "text-grey-500 hover:text-grey-900"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {tab === "Trade details" ? <TradeDetails data={data} /> : null}
      {tab === "Evidence" ? <TradeEvidence steps={data.evidence} /> : null}
      {tab === "Activity" ? (
        <TradeActivityList activity={data.activity} />
      ) : null}
    </div>
  );
}
