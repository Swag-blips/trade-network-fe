"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BanknoteIcon,
  Clock01Icon,
  Coins01Icon,
  DateTimeIcon,
  Door01Icon,
  File02Icon,
  FileAddIcon,
  HourglassIcon,
  InformationCircleIcon,
  SentIcon,
  UnavailableIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { Avatar } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { IconButton } from "@repo/ui/icon-button";
import { naira } from "@/utils/naira";
import { OfferModal } from "./offer-modal";
import { RequestInfoModal } from "./request-info-modal";
import type { Conversation, OfferTerms } from "../types/inbox";
import { clockTime, interestOf, shortDate } from "../utils/format";

function Bubble({
  side,
  time,
  children,
}: {
  side: "in" | "out";
  time: string;
  children: ReactNode;
}) {
  const incoming = side === "in";
  return (
    <div
      className={`flex flex-col gap-xs ${incoming ? "items-start" : "items-end"}`}
    >
      <div
        className={`flex w-94.25 max-w-full flex-col gap-md rounded-2xl p-sm shadow-small-thick ${
          incoming
            ? "rounded-bl-none border border-grey-100 bg-white"
            : "rounded-br-none bg-evergreen-100"
        }`}
      >
        {children}
      </div>
      <p className="text-caption/[1.4] text-grey-600">{clockTime(time)}</p>
    </div>
  );
}

function Lead({
  label,
  value,
  muted = false,
  children,
}: {
  label: string;
  value?: string;
  muted?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col rounded-lg p-xs ${children ? "gap-md" : "gap-xs"} ${
        muted ? "border border-grey-100 bg-grey-50" : "bg-white shadow-card"
      }`}
    >
      <p className="text-body/[1.4] text-grey-800 opacity-80">{label}</p>
      {value ? (
        <p className="text-xl/[normal] font-medium text-grey-800">{value}</p>
      ) : null}
      {children}
    </div>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: IconSvgElement;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-xs text-body-sm/[normal] text-grey-800">
      <dt className="flex min-w-0 flex-1 items-center gap-xs">
        <HugeiconsIcon icon={icon} size={16} className="flex-none" />
        <span className="leading-[1.4] opacity-80">{label}</span>
      </dt>
      <dd className="text-right whitespace-nowrap">{value}</dd>
    </div>
  );
}

function OfferFacts({ terms }: { terms: OfferTerms }) {
  const interest = interestOf(terms);
  return (
    <dl className="flex flex-col gap-xs">
      <Fact
        icon={BanknoteIcon}
        label={`Interest (${terms.ratePercent}% flat)`}
        value={naira(interest)}
      />
      <Fact
        icon={Coins01Icon}
        label="Total repayment amount"
        value={naira(terms.amount + interest)}
      />
      <Fact
        icon={DateTimeIcon}
        label="Repayment tenure"
        value={`${terms.tenorDays} days`}
      />
    </dl>
  );
}

export function ConversationView({
  conversation,
  onOffer,
  onRequestDocuments,
  onWithdrawOffer,
  onViewDetails,
}: {
  conversation: Conversation;
  onOffer: (terms: OfferTerms) => void;
  onRequestDocuments: (documents: string[]) => void;
  onWithdrawOffer: () => void;
  onViewDetails: () => void;
}) {
  const { opportunity, messages } = conversation;
  const [dialog, setDialog] = useState<"offer" | "documents">();
  const threadRef = useRef<HTMLDivElement>(null);
  const hasOffer = messages.some((message) => message.kind === "offer");

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages.length]);

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-white shadow-small-thick">
      <header className="flex flex-none items-center gap-md border-b border-grey-100 px-md py-2.5">
        <Avatar
          name={opportunity.name}
          size={40}
          shape="square"
          className="border border-grey-200 bg-grey-50 text-grey-600"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="truncate font-sans text-body/[normal] font-medium text-grey-900">
            {opportunity.name}
          </h2>
          <p className="flex items-center gap-1 text-body-sm/[1.4] text-grey-500">
            <HugeiconsIcon icon={Clock01Icon} size={16} />
            Awaiting response
          </p>
        </div>
        <div className="flex flex-none items-center gap-md">
          <Button
            variant="tertiary"
            size="pill"
            leadingIcon={
              <HugeiconsIcon icon={Door01Icon} className="text-red-error-500" />
            }
          >
            Exit
          </Button>
          <IconButton
            label="Opportunity details"
            variant="tertiary"
            size="lg"
            onClick={onViewDetails}
          >
            <HugeiconsIcon icon={InformationCircleIcon} />
          </IconButton>
        </div>
      </header>

      <div className="relative min-h-px flex-1">
        <Image
          src="/chat/base.png"
          alt=""
          fill
          sizes="836px"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[url(/chat/pattern.png)] bg-size-[36.6px_36.6px]"
        />
        <div
          ref={threadRef}
          className="absolute inset-0 flex flex-col gap-md overflow-y-auto px-md py-lg"
        >
          <div className="mt-auto" />
          <Bubble side="in" time={conversation.startedAt}>
            <Lead
              muted
              label="Requested advance"
              value={naira(opportunity.advance)}
            />
            <dl className="flex flex-col gap-2.5">
              <Fact
                icon={Wallet01Icon}
                label="Financing purpose"
                value={opportunity.purpose}
              />
              <Fact
                icon={DateTimeIcon}
                label="Repayment tenure"
                value={`${opportunity.tenorDays} days`}
              />
              <Fact
                icon={HourglassIcon}
                label="Needed before"
                value={shortDate(opportunity.expiresAt)}
              />
            </dl>
            <Button
              variant="tertiary"
              size="compact"
              className="w-full"
              trailingIcon={<HugeiconsIcon icon={ArrowRight01Icon} />}
              onClick={onViewDetails}
            >
              View more details
            </Button>
          </Bubble>

          {messages.map((message) =>
            message.kind === "documents" ? (
              <Bubble key={message.id} side="out" time={message.sentAt}>
                <Lead label="Document requested">
                  <ul className="flex flex-col gap-md">
                    {message.documents.map((document, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2.5 text-body/[normal] font-medium text-grey-900"
                      >
                        <HugeiconsIcon icon={File02Icon} className="flex-none" />
                        {document}
                      </li>
                    ))}
                  </ul>
                </Lead>
              </Bubble>
            ) : (
              <Bubble key={message.id} side="out" time={message.sentAt}>
                <Lead label="Offer sent" value={naira(message.terms.amount)} />
                <OfferFacts terms={message.terms} />
              </Bubble>
            ),
          )}
        </div>
      </div>

      <footer className="flex flex-none gap-2.5 border-t border-grey-100 bg-white p-md shadow-container-modal">
        {hasOffer ? (
          <Button
            variant="tertiary"
            size="auth"
            className="flex-1"
            leadingIcon={<HugeiconsIcon icon={UnavailableIcon} />}
            onClick={onWithdrawOffer}
          >
            Withdraw offer
          </Button>
        ) : (
          <Button
            size="auth"
            className="flex-1"
            leadingIcon={<HugeiconsIcon icon={SentIcon} />}
            onClick={() => setDialog("offer")}
          >
            Make offer
          </Button>
        )}
        <Button
          variant="outline"
          size="auth"
          className="flex-1"
          leadingIcon={<HugeiconsIcon icon={FileAddIcon} />}
          onClick={() => setDialog("documents")}
        >
          Request document
        </Button>
      </footer>

      {dialog === "offer" ? (
        <OfferModal
          opportunity={opportunity}
          onClose={() => setDialog(undefined)}
          onSend={(terms) => {
            setDialog(undefined);
            onOffer(terms);
          }}
        />
      ) : null}
      {dialog === "documents" ? (
        <RequestInfoModal
          onClose={() => setDialog(undefined)}
          onSend={(documents) => {
            setDialog(undefined);
            onRequestDocuments(documents);
          }}
        />
      ) : null}
    </div>
  );
}
