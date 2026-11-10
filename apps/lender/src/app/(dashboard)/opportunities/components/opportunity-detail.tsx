"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowLeftRightIcon,
  Calendar04Icon,
  CalendarClockIcon,
  Coins01Icon,
  File02Icon,
  InformationCircleIcon,
  ReceiptTextIcon,
  SentIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { Avatar } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { IconButton } from "@repo/ui/icon-button";
import { Tabs } from "@repo/ui/tabs";
import { readStatus } from "@/api/client";
import { usePermission } from "@/hooks/use-permission";
import { NotInterestedModal } from "./not-interested-modal";
import { OfferModal } from "./offer-modal";
import { RequestInfoModal } from "./request-info-modal";
import { useDismissOpportunity } from "../hooks/use-dismiss-opportunity";
import { useOpportunity } from "../hooks/use-opportunity";
import type { OfferTerms } from "../types/inbox";
import type { Opportunity, OpportunitySummary } from "../types/opportunity";
import { MATCH, fullNaira, shortDate } from "../utils/format";
import { forgetOpportunity } from "../utils/opportunity-cache";

const TABS = ["Overview", "Trade details"] as const;
type Tab = (typeof TABS)[number];

function Square({ name }: { name: string }) {
  return (
    <Avatar
      name={name}
      size={40}
      shape="square"
      className="border border-grey-200 bg-grey-50 text-grey-600"
    />
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: IconSvgElement;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-md rounded-lg border border-grey-100 bg-white p-sm">
      <div className="flex min-w-0 flex-1 flex-col gap-xs">
        <p className="text-body/[normal] text-grey-600">{label}</p>
        <p className="font-brand text-2xl/[normal] text-grey-900">{value}</p>
      </div>
      <span className="flex size-8 flex-none items-center justify-center rounded-xl border border-grey-100 text-grey-800">
        <HugeiconsIcon icon={icon} size={20} />
      </span>
    </div>
  );
}

function Notice({ icon, text }: { icon: IconSvgElement; text: string }) {
  return (
    <p className="flex items-center gap-xs rounded-lg border border-grey-200 bg-grey-50 p-md text-body/[normal] text-grey-600">
      <HugeiconsIcon icon={icon} size={20} className="flex-none" />
      {text}
    </p>
  );
}

function Party({ role, name }: { role: string; name: string }) {
  return (
    <div className="flex items-start gap-md">
      <Square name={name} />
      <div className="flex flex-col gap-1 whitespace-nowrap">
        <p className="text-body-sm/[normal] text-grey-600">{role}</p>
        <p className="text-body/[normal] font-medium text-grey-900">{name}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-xl text-body/[normal]">
      <dt className="w-41 flex-none text-grey-600">{label}</dt>
      <dd className="min-w-0 text-grey-900">{value}</dd>
    </div>
  );
}

function TradeDetails({ item }: { item: Opportunity }) {
  return (
    <section className="flex flex-col gap-md rounded-lg border border-grey-100 bg-white p-md">
      <h3 className="font-sans text-xl/[normal] font-medium text-grey-900">
        Trade details
      </h3>
      <hr className="border-grey-200" />

      <div className="flex items-center gap-xl">
        <Party
          role={item.kind === "Distributor" ? "Distributor" : "Seller"}
          name={item.name}
        />
        <HugeiconsIcon
          icon={ArrowLeftRightIcon}
          size={20}
          className="flex-none text-grey-800"
        />
        <Party role="Buyer" name={item.buyer} />
      </div>

      <dl className="flex flex-col gap-md">
        <Row label="Industry" value={item.industry} />
        <Row label="Financing purpose:" value={item.purpose} />
        <Row
          label="Trade credit terms:"
          value={`Pay in ${item.creditTermDays} days`}
        />
        {item.documents.length > 0 ? (
          <div className="flex flex-col gap-md">
            <dt className="text-body/[normal] text-grey-600">
              Trade evidence:
            </dt>
            <dd className="flex flex-wrap gap-md">
              {item.documents.map((document) => (
                <div
                  key={document.file}
                  className="flex w-63.5 items-center gap-md rounded-lg border border-grey-100 bg-white p-xs shadow-card"
                >
                  <HugeiconsIcon
                    icon={File02Icon}
                    className="flex-none text-grey-800"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="text-body/[normal] font-medium text-evergreen-600">
                      {document.label}
                    </p>
                    <p className="truncate text-body-sm/[normal] text-grey-600">
                      {document.file}
                    </p>
                  </div>
                </div>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

function BodyPlaceholder() {
  return (
    <div aria-hidden className="grid grid-cols-2 gap-md">
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          className="h-21.75 animate-pulse rounded-lg bg-grey-100"
        />
      ))}
    </div>
  );
}

export function OpportunityDetail({
  summary,
  onOffer,
  onRequestDocuments,
}: {
  summary: OpportunitySummary;
  onOffer: (opportunity: Opportunity, terms: OfferTerms) => void;
  onRequestDocuments: (opportunity: Opportunity, documents: string[]) => void;
}) {
  const queryClient = useQueryClient();
  const { data: item, isPending, error } = useOpportunity(summary.id);
  const canDismiss = usePermission("opportunities:dismiss");
  const { mutate: dismiss, isPending: dismissing } = useDismissOpportunity();
  const [tab, setTab] = useState<Tab>("Overview");
  const [offerOpen, setOfferOpen] = useState(false);
  const [dismissOpen, setDismissOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  const gone = readStatus(error) === 404;
  useEffect(() => {
    if (gone) forgetOpportunity(queryClient, summary.id);
  }, [gone, queryClient, summary.id]);

  const open = item?.status === "OPEN";

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-white shadow-small-thick">
      <header className="flex min-h-18 flex-none items-center justify-between gap-md border-b border-grey-100 px-lg py-md">
        <div className="flex min-w-0 items-center gap-md">
          <Square name={summary.name} />
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="truncate font-sans text-body/[normal] font-medium text-grey-900">
              {summary.name}
            </h2>
            <p className="text-body-sm/[normal] text-grey-600">
              <span className={`font-medium ${MATCH[summary.match].text}`}>
                {MATCH[summary.match].label}
              </span>
              {` · Expires ${shortDate(summary.expiresAt)}`}
            </p>
          </div>
        </div>

        {item && open ? (
          <div className="flex flex-none items-center gap-md">
            <Button
              size="auth"
              leadingIcon={<HugeiconsIcon icon={SentIcon} />}
              onClick={() => setOfferOpen(true)}
            >
              Make offer
            </Button>
            <Button
              variant="secondary"
              size="auth"
              onClick={() => setRequestOpen(true)}
            >
              Request for info
            </Button>
            {canDismiss ? (
              <IconButton
                label="Not interested"
                variant="tertiary"
                size="lg"
                onClick={() => setDismissOpen(true)}
              >
                <HugeiconsIcon
                  icon={UnavailableIcon}
                  className="text-red-error-500"
                />
              </IconButton>
            ) : null}
          </div>
        ) : null}
      </header>

      <Tabs
        label="Opportunity sections"
        tabs={TABS}
        value={tab}
        onChange={setTab}
        className="flex-none px-lg pt-1"
      />

      <div
        role="tabpanel"
        aria-label={tab}
        className="flex min-h-px flex-1 flex-col gap-xl overflow-y-auto p-lg"
      >
        {isPending || gone ? (
          <BodyPlaceholder />
        ) : !item ? (
          <Notice
            icon={Alert02Icon}
            text="We couldn't load this request. Please try again."
          />
        ) : (
          <>
            {open ? null : (
              <Notice
                icon={InformationCircleIcon}
                text="This request is no longer available."
              />
            )}
            {tab === "Overview" ? (
              <div className="grid grid-cols-2 gap-md">
                <Metric
                  label="Trade value (Invoice)"
                  value={fullNaira(item.tradeValue)}
                  icon={ReceiptTextIcon}
                />
                <Metric
                  label="Requested advance"
                  value={fullNaira(item.advance)}
                  icon={Coins01Icon}
                />
                <Metric
                  label="Repayment tenure"
                  value={`${item.tenorDays} days`}
                  icon={CalendarClockIcon}
                />
                <Metric
                  label="Needed before"
                  value={shortDate(item.expiresAt)}
                  icon={Calendar04Icon}
                />
              </div>
            ) : null}
            <TradeDetails item={item} />
          </>
        )}
      </div>

      {offerOpen && item ? (
        <OfferModal
          opportunity={item}
          onClose={() => setOfferOpen(false)}
          onSend={(terms) => {
            setOfferOpen(false);
            onOffer(item, terms);
          }}
        />
      ) : null}

      {requestOpen && item ? (
        <RequestInfoModal
          onClose={() => setRequestOpen(false)}
          onSend={(documents) => {
            setRequestOpen(false);
            onRequestDocuments(item, documents);
          }}
        />
      ) : null}

      {dismissOpen ? (
        <NotInterestedModal
          pending={dismissing}
          onClose={() => setDismissOpen(false)}
          onConfirm={() =>
            dismiss(summary.id, { onSettled: () => setDismissOpen(false) })
          }
        />
      ) : null}
    </div>
  );
}
