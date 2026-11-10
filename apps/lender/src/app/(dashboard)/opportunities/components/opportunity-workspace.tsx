"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@repo/ui/toast";
import { ConversationView } from "./conversation-view";
import { FinancingPreference } from "./financing-preference";
import { InboxList } from "./inbox-list";
import { MatchingPreference } from "./matching-preference";
import { OpportunityBanner } from "./opportunity-banner";
import { OpportunityDetail } from "./opportunity-detail";
import {
  RequestsPane,
  type ListState,
  type Pane,
  type Show,
} from "./requests-pane";
import { useOpportunities } from "../hooks/use-opportunities";
import { useViewOpportunity } from "../hooks/use-view-opportunity";
import type {
  Conversation,
  InboxShow,
  Message,
  OfferTerms,
} from "../types/inbox";
import type { MatchLevel, Opportunity } from "../types/opportunity";

function EmptyPreview() {
  return (
    <div className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-white shadow-small-thick">
      <Image
        src="/opportunities/preview-glow.svg"
        alt=""
        width={2358}
        height={2358}
        unoptimized
        className="pointer-events-none absolute top-[calc(50%-9.5px)] left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
      />
      <FinancingPreference />
    </div>
  );
}

export function OpportunityWorkspace({ title }: { title: React.ReactNode }) {
  const [match, setMatch] = useState<MatchLevel>();
  const [show, setShow] = useState<Show>("All");
  const [selectedId, setSelectedId] = useState<string>();
  const [pane, setPane] = useState<Pane>("Requests");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  const [inboxShow, setInboxShow] = useState<InboxShow>("Active");
  const { mutate: markViewed } = useViewOpportunity();
  const { toast } = useToast();

  function post(opportunity: Opportunity, message: Message) {
    setConversations((current) => {
      const existing = current.find(
        (conversation) => conversation.opportunity.id === opportunity.id,
      );
      const next: Conversation = existing
        ? { ...existing, opportunity, messages: [...existing.messages, message] }
        : {
            opportunity,
            startedAt: message.sentAt,
            funded: false,
            messages: [message],
          };
      return [
        next,
        ...current.filter(
          (conversation) => conversation.opportunity.id !== opportunity.id,
        ),
      ];
    });
    setConversationId(opportunity.id);
    setInboxShow("Active");
    setPane("Inbox");
  }

  function sendOffer(opportunity: Opportunity, terms: OfferTerms) {
    post(opportunity, {
      id: crypto.randomUUID(),
      kind: "offer",
      sentAt: new Date().toISOString(),
      terms,
    });
    toast({ state: "success", message: `Offer sent to ${opportunity.name}` });
  }

  function requestDocuments(opportunity: Opportunity, documents: string[]) {
    post(opportunity, {
      id: crypto.randomUUID(),
      kind: "documents",
      sentAt: new Date().toISOString(),
      documents,
    });
    toast({ state: "success", message: "Request for info sent" });
  }

  function withdrawOffer(id: string) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.opportunity.id === id
          ? {
              ...conversation,
              messages: conversation.messages.filter(
                (message) => message.kind !== "offer",
              ),
            }
          : conversation,
      ),
    );
    toast({ state: "success", message: "Offer withdrawn" });
  }

  const {
    data,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useOpportunities({
    matchLevel: match,
    unread: show === "New" ? true : undefined,
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const filtered = match !== undefined || show !== "All";
  const searching = !isPending && !isError && items.length === 0 && !filtered;
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const inbox = conversations.filter(
    (conversation) => conversation.funded === (inboxShow === "Funded"),
  );
  const conversation =
    inbox.find((item) => item.opportunity.id === conversationId) ?? inbox[0];
  const showInbox = !searching || conversations.length > 0;
  const inInbox = pane === "Inbox" && showInbox;

  const list: ListState = isPending
    ? { kind: "loading" }
    : isError
      ? { kind: "error" }
      : searching
        ? { kind: "searching" }
        : {
            kind: "ready",
            items,
            hasMore: hasNextPage,
            loadingMore: isFetchingNextPage,
            onLoadMore: () => void fetchNextPage(),
          };

  return (
    <>
      {searching ? <OpportunityBanner /> : null}

      <section className="flex flex-col gap-lg">
        <div className="flex items-center gap-2.5">
          {title}
          {searching ? null : (
            <MatchingPreference value={match} onChange={setMatch} />
          )}
        </div>

        <div className="flex h-149.75 overflow-hidden rounded-lg border border-grey-100 shadow-card">
          <RequestsPane
            list={list}
            selectedId={selected?.id}
            onSelect={(id) => {
              setSelectedId(id);
              if (items.find((item) => item.id === id)?.unread) markViewed(id);
            }}
            show={show}
            onShowChange={setShow}
            tab={pane}
            onTabChange={setPane}
            inbox={
              showInbox ? (
                <InboxList
                  conversations={inbox}
                  selectedId={conversation?.opportunity.id}
                  onSelect={setConversationId}
                  show={inboxShow}
                  onShowChange={setInboxShow}
                />
              ) : undefined
            }
          />
          {inInbox ? (
            conversation ? (
              <ConversationView
                key={conversation.opportunity.id}
                conversation={conversation}
                onOffer={(terms) => sendOffer(conversation.opportunity, terms)}
                onRequestDocuments={(documents) =>
                  requestDocuments(conversation.opportunity, documents)
                }
                onWithdrawOffer={() =>
                  withdrawOffer(conversation.opportunity.id)
                }
                onViewDetails={() => {
                  setSelectedId(conversation.opportunity.id);
                  setPane("Requests");
                }}
              />
            ) : (
              <div className="min-w-0 flex-1 bg-white shadow-small-thick" />
            )
          ) : selected ? (
            <OpportunityDetail
              key={selected.id}
              summary={selected}
              onOffer={sendOffer}
              onRequestDocuments={requestDocuments}
            />
          ) : isPending ? (
            <div className="min-w-0 flex-1 bg-white shadow-small-thick" />
          ) : (
            <EmptyPreview />
          )}
        </div>
      </section>
    </>
  );
}
