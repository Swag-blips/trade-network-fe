"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowRight01Icon,
  BanIcon,
  BanknoteIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Coins01Icon,
  DateTimeIcon,
  Door01Icon,
  File02Icon,
  FileAddIcon,
  HourglassIcon,
  InformationCircleIcon,
  LockIcon,
  SentIcon,
  UnavailableIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { Avatar } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { IconButton } from "@repo/ui/icon-button";
import { extractErrorMessage } from "@/api/client";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { usePermission } from "@/hooks/use-permission";
import { naira } from "@/utils/naira";
import { OfferModal } from "./offer-modal";
import { PaymentModal } from "./payment-modal";
import { RequestInfoModal } from "./request-info-modal";
import { useAcceptOffer } from "../hooks/use-accept-offer";
import { useConversation } from "../hooks/use-conversation";
import { useExitConversation } from "../hooks/use-exit-conversation";
import { usePayFunding } from "../hooks/use-pay-funding";
import { useTimeLeft } from "../hooks/use-time-left";
import { useWithdrawOffer } from "../hooks/use-withdraw-offer";
import type {
  Conversation,
  ConversationSummary,
  Funding,
  Message,
  Offer,
  OfferStatus,
} from "../types/inbox";
import { conversationKey } from "../utils/negotiation";
import { clockTime, shortDate, timeLeft } from "../utils/format";

function describeStatus(
  conversation?: Conversation,
  summary?: ConversationSummary,
): { icon: IconSvgElement; label: string } {
  const status = conversation?.status ?? summary?.status ?? "ACTIVE";
  if (status === "FUNDED")
    return { icon: CheckmarkCircle02Icon, label: "Funded" };
  if (status === "CLOSED") {
    const left = conversation
      ? conversation.messages.at(-1)?.kind === "exit"
      : summary?.lastMessage === "exit";
    return left
      ? { icon: Door01Icon, label: "You left this negotiation" }
      : { icon: LockIcon, label: "This request has closed" };
  }
  switch (conversation?.funding?.status) {
    case "AWAITING_PAYMENT":
      return { icon: Clock01Icon, label: "Awaiting payment" };
    case "AWAITING_CONFIRMATION":
      return { icon: HourglassIcon, label: "Awaiting confirmation" };
    default:
      return { icon: Clock01Icon, label: "Awaiting response" };
  }
}

const OFFER_LABEL: Record<OfferStatus, string> = {
  PENDING: "Offer sent",
  WITHDRAWN: "Offer withdrawn",
  ACCEPTED: "Offer accepted",
  REJECTED: "Offer declined",
  LAPSED: "Offer lapsed",
  COUNTERED: "Offer countered",
};

const COUNTER_LABEL: Record<OfferStatus, string> = {
  PENDING: "Counter offer",
  WITHDRAWN: "Counter offer withdrawn",
  ACCEPTED: "Counter offer accepted",
  REJECTED: "Counter offer declined",
  LAPSED: "Counter offer lapsed",
  COUNTERED: "Counter offer countered",
};

const SETTLED: OfferStatus[] = ["REJECTED", "LAPSED", "COUNTERED"];

/** Funding states that hold the deal for this lender: no exit, no new terms. */
const RESERVED: Funding["status"][] = [
  "AWAITING_PAYMENT",
  "AWAITING_CONFIRMATION",
];

const BUBBLE = {
  card: {
    in: "w-94.25 flex-col gap-md p-sm shadow-small-thick rounded-bl-none border border-grey-100 bg-white",
    out: "w-94.25 flex-col gap-md p-sm shadow-small-thick rounded-br-none bg-evergreen-100",
  },
  note: {
    in: "items-start gap-1 px-sm py-xs rounded-bl-none border border-grey-100 bg-white",
    out: "items-start gap-1 px-sm py-xs rounded-br-none border border-evergreen-200 bg-evergreen-100",
  },
};

function Bubble({
  side,
  time,
  variant = "card",
  children,
}: {
  side: "in" | "out";
  time: string;
  variant?: keyof typeof BUBBLE;
  children: ReactNode;
}) {
  const incoming = side === "in";
  return (
    <div
      className={`flex flex-col gap-xs ${incoming ? "items-start" : "items-end"}`}
    >
      <div className={`flex max-w-full rounded-2xl ${BUBBLE[variant][side]}`}>
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
  struck = false,
  children,
}: {
  label: string;
  value?: string;
  muted?: boolean;
  struck?: boolean;
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
        <p
          className={`text-xl/[normal] font-medium ${struck ? "text-grey-500 line-through" : "text-grey-800"}`}
        >
          {value}
        </p>
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

function OfferFacts({ offer }: { offer: Offer }) {
  return (
    <dl className="flex flex-col gap-xs">
      <Fact
        icon={BanknoteIcon}
        label={`Interest (${offer.ratePercent}% flat)`}
        value={naira(offer.interest)}
      />
      <Fact
        icon={Coins01Icon}
        label="Total repayment amount"
        value={naira(offer.repayment)}
      />
      <Fact
        icon={DateTimeIcon}
        label="Repayment tenure"
        value={`${offer.tenorDays} days`}
      />
    </dl>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const side = message.outgoing ? "out" : "in";

  if (message.kind === "documents") {
    return (
      <Bubble side={side} time={message.sentAt}>
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
    );
  }

  if (message.kind === "exit") {
    return (
      <Bubble side="out" time={message.sentAt} variant="note">
        <HugeiconsIcon
          icon={Door01Icon}
          size={20}
          className="flex-none text-grey-800"
        />
        <p className="text-body-sm/[1.4] text-grey-800 italic opacity-80">
          You left this negotiation
        </p>
      </Bubble>
    );
  }

  const { offer } = message;
  if (offer.status === "WITHDRAWN") {
    return (
      <Bubble side={side} time={message.sentAt} variant="note">
        <HugeiconsIcon
          icon={BanIcon}
          size={20}
          className="flex-none text-grey-800"
        />
        <p className="text-body-sm/[1.4] text-grey-800 italic opacity-80">
          This offer was withdrawn
        </p>
      </Bubble>
    );
  }

  return (
    <Bubble side={side} time={message.sentAt}>
      <Lead
        label={
          (offer.madeBy === "BORROWER" ? COUNTER_LABEL : OFFER_LABEL)[
            offer.status
          ]
        }
        value={naira(offer.amount)}
        struck={SETTLED.includes(offer.status)}
      />
      <OfferFacts offer={offer} />
    </Bubble>
  );
}

function NoticeFooter({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <footer className="relative flex flex-none items-center gap-md border-t border-orange-100 bg-orange-50 px-lg py-md">
      <span
        aria-hidden
        className="absolute -top-px bottom-0 left-0 w-1 bg-orange-500"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.25">
        <p className="text-body/[normal] font-medium text-grey-900">{title}</p>
        <p className="text-body-sm/[1.4] text-grey-800 opacity-80">
          {children}
        </p>
      </div>
      {action}
    </footer>
  );
}

function PaymentFooter({
  conversationId,
  funding,
  onPay,
}: {
  conversationId: string;
  funding: Funding;
  onPay?: () => void;
}) {
  const queryClient = useQueryClient();
  const left = useTimeLeft(funding.payBy);

  useEffect(() => {
    if (left === 0) {
      void queryClient.invalidateQueries({
        queryKey: conversationKey(conversationId),
      });
    }
  }, [left, conversationId, queryClient]);

  return (
    <NoticeFooter
      title={
        left > 0
          ? `Awaiting payment of funds (${timeLeft(left)})`
          : "Awaiting payment of funds"
      }
      action={
        onPay ? (
          <Button size="auth" className="flex-none" onClick={onPay}>
            Make payment
          </Button>
        ) : null
      }
    >
      Your offer is accepted and exclusive for 24 hours. If funds aren&rsquo;t
      disbursed within this time, acceptance expires and the enterprise may
      accept other offers.
    </NoticeFooter>
  );
}

export function ConversationView({
  id,
  summary,
  onViewDetails,
}: {
  id: string;
  summary?: ConversationSummary;
  onViewDetails: (opportunityId: string) => void;
}) {
  const { data: conversation, error } = useConversation(id);
  const canNegotiate = usePermission("offers:negotiate");
  const canAccept = usePermission("offers:accept");
  const canDisburse = usePermission("funding:disburse");
  const { mutate: withdraw, isPending: withdrawing } = useWithdrawOffer();
  const { mutate: accept, isPending: accepting } = useAcceptOffer();
  const { mutate: pay, isPending: paying } = usePayFunding();
  const { mutate: exit, isPending: exiting } = useExitConversation();
  const [dialog, setDialog] = useState<
    "offer" | "documents" | "withdraw" | "accept" | "payment" | "exit"
  >();
  const close = () => setDialog(undefined);
  const threadRef = useRef<HTMLDivElement>(null);

  const name = conversation?.opportunity.name ?? summary?.name ?? "";
  const status = describeStatus(conversation, summary);
  const funding = conversation?.funding ?? null;
  const pendingOffer = conversation?.pendingOffer ?? null;
  const reserved = funding !== null && RESERVED.includes(funding.status);
  const active = conversation?.status === "ACTIVE";
  const opportunityId = conversation?.opportunity.id ?? summary?.opportunityId;
  const messageCount = conversation?.messages.length ?? 0;

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messageCount]);

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-white shadow-small-thick">
      <header className="flex flex-none items-center gap-md border-b border-grey-100 px-md py-2.5">
        <Avatar
          name={name}
          size={40}
          shape="square"
          className="border border-grey-200 bg-grey-50 text-grey-600"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="truncate font-sans text-body/[normal] font-medium text-grey-900">
            {name}
          </h2>
          <p className="flex items-center gap-1 text-body-sm/[1.4] text-grey-500">
            <HugeiconsIcon icon={status.icon} size={16} />
            {status.label}
          </p>
        </div>
        <div className="flex flex-none items-center gap-md">
          {active && canNegotiate && !reserved ? (
            <Button
              variant="tertiary"
              size="pill"
              leadingIcon={
                <HugeiconsIcon
                  icon={Door01Icon}
                  className="text-red-error-500"
                />
              }
              onClick={() => setDialog("exit")}
            >
              Exit
            </Button>
          ) : null}
          {opportunityId ? (
            <IconButton
              label="Opportunity details"
              variant="tertiary"
              size="lg"
              onClick={() => onViewDetails(opportunityId)}
            >
              <HugeiconsIcon icon={InformationCircleIcon} />
            </IconButton>
          ) : null}
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
          {conversation ? (
            <>
              <Bubble side="in" time={conversation.startedAt}>
                <Lead
                  muted
                  label="Requested advance"
                  value={naira(conversation.opportunity.advance)}
                />
                <dl className="flex flex-col gap-2.5">
                  <Fact
                    icon={Wallet01Icon}
                    label="Financing purpose"
                    value={conversation.opportunity.purpose}
                  />
                  <Fact
                    icon={DateTimeIcon}
                    label="Repayment tenure"
                    value={`${conversation.opportunity.tenorDays} days`}
                  />
                  <Fact
                    icon={HourglassIcon}
                    label="Needed before"
                    value={shortDate(conversation.opportunity.expiresAt)}
                  />
                </dl>
                <Button
                  variant="tertiary"
                  size="compact"
                  className="w-full"
                  trailingIcon={<HugeiconsIcon icon={ArrowRight01Icon} />}
                  onClick={() => onViewDetails(conversation.opportunity.id)}
                >
                  View more details
                </Button>
              </Bubble>

              {conversation.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </>
          ) : error ? (
            <p className="mx-auto mb-auto flex items-center gap-xs rounded-lg border border-grey-200 bg-white p-md text-body/[normal] text-grey-600">
              <HugeiconsIcon
                icon={Alert02Icon}
                size={20}
                className="flex-none"
              />
              {extractErrorMessage(
                error,
                "We couldn't load this conversation. Please try again.",
              )}
            </p>
          ) : null}
        </div>
      </div>

      {conversation && active ? (
        funding?.status === "AWAITING_PAYMENT" ? (
          <PaymentFooter
            conversationId={conversation.id}
            funding={funding}
            onPay={canDisburse ? () => setDialog("payment") : undefined}
          />
        ) : funding?.status === "AWAITING_CONFIRMATION" ? (
          <NoticeFooter title="Awaiting confirmation">
            You&rsquo;ve marked the funds as sent. We&rsquo;re waiting for the
            enterprise to confirm receipt. The financing facility will become
            active once confirmation is received.
          </NoticeFooter>
        ) : (
          <>
            {funding?.status === "EXPIRED" ? (
              <p className="flex flex-none items-center gap-xs border-t border-grey-100 bg-grey-50 px-lg py-xs text-body-sm/[1.4] text-grey-600">
                <HugeiconsIcon
                  icon={Alert02Icon}
                  size={16}
                  className="flex-none"
                />
                The payment window passed, so your accepted offer lapsed.
              </p>
            ) : null}
            {canNegotiate || canAccept ? (
              <footer className="flex flex-none gap-2.5 border-t border-grey-100 bg-white p-md shadow-container-modal">
                {pendingOffer?.madeBy === "BORROWER" ? (
                  <>
                    {canAccept ? (
                      <Button
                        size="auth"
                        className="flex-1"
                        leadingIcon={
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} />
                        }
                        onClick={() => setDialog("accept")}
                      >
                        Accept offer
                      </Button>
                    ) : null}
                    {canNegotiate ? (
                      <Button
                        variant="outline"
                        size="auth"
                        className="flex-1"
                        leadingIcon={<HugeiconsIcon icon={SentIcon} />}
                        onClick={() => setDialog("offer")}
                      >
                        Make offer
                      </Button>
                    ) : null}
                  </>
                ) : canNegotiate ? (
                  <>
                    {pendingOffer ? (
                      <Button
                        variant="tertiary"
                        size="auth"
                        className="flex-1"
                        leadingIcon={<HugeiconsIcon icon={UnavailableIcon} />}
                        onClick={() => setDialog("withdraw")}
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
                  </>
                ) : null}
              </footer>
            ) : null}
          </>
        )
      ) : null}

      {conversation && dialog === "offer" ? (
        <OfferModal
          opportunity={conversation.opportunity}
          onClose={close}
          onSent={close}
        />
      ) : null}
      {pendingOffer && dialog === "withdraw" ? (
        <ConfirmDialog
          title="Withdraw offer?"
          confirmLabel="Withdraw offer"
          loading={withdrawing}
          onConfirm={() => withdraw(pendingOffer.id, { onSettled: close })}
          onClose={close}
        >
          Are you sure you want to withdraw this financing offer? The other
          party will be notified, and the offer will no longer be available for
          acceptance.
        </ConfirmDialog>
      ) : null}
      {pendingOffer && dialog === "accept" ? (
        <ConfirmDialog
          title="Accept counter offer?"
          confirmLabel="Accept offer"
          loading={accepting}
          onConfirm={() => accept(pendingOffer.id, { onSettled: close })}
          onClose={close}
        >
          The deal will be reserved for you, and you&rsquo;ll have 24 hours to
          send {name} {naira(pendingOffer.amount)}.
        </ConfirmDialog>
      ) : null}
      {conversation && funding && dialog === "payment" ? (
        <PaymentModal
          beneficiary={conversation.opportunity.name}
          amount={funding.amount}
          loading={paying}
          onClose={close}
          onConfirm={() => pay(funding.id, { onSettled: close })}
        />
      ) : null}
      {conversation && dialog === "exit" ? (
        <ConfirmDialog
          title="Leave this negotiation?"
          confirmLabel="Exit"
          confirmVariant="destructive"
          loading={exiting}
          onConfirm={() => exit(conversation.id, { onSettled: close })}
          onClose={close}
        >
          {pendingOffer?.madeBy === "LENDER"
            ? "Your pending offer will be withdrawn and you won’t be able to make another on this request."
            : "You won’t be able to make an offer or request documents on this request again."}
        </ConfirmDialog>
      ) : null}
      {conversation && dialog === "documents" ? (
        <RequestInfoModal
          opportunityId={conversation.opportunity.id}
          onClose={close}
          onSent={close}
        />
      ) : null}
    </div>
  );
}
