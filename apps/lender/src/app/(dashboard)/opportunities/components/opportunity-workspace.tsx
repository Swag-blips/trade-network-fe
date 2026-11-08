"use client";

import { useState } from "react";
import Image from "next/image";
import { ConversationView } from "./conversation-view";
import { FinancingPreference } from "./financing-preference";
import { InboxList } from "./inbox-list";
import { MatchingPreference } from "./matching-preference";
import { OpportunityBanner } from "./opportunity-banner";
import { OpportunityDetail } from "./opportunity-detail";
import { OpportunityDetailsModal } from "./opportunity-details-modal";
import {
  RequestsPane,
  type ListState,
  type Pane,
  type Show,
} from "./requests-pane";
import { useConversations } from "../hooks/use-conversations";
import { useOpportunities } from "../hooks/use-opportunities";
import { useViewOpportunity } from "../hooks/use-view-opportunity";
import type { ConversationSummary, InboxShow } from "../types/inbox";
import type { MatchLevel } from "../types/opportunity";

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
  const [conversationId, setConversationId] = useState<string>();
  const [inboxShow, setInboxShow] = useState<InboxShow>("All");
  const [detailOf, setDetailOf] = useState<string>();
  const { mutate: markViewed } = useViewOpportunity();
  const conversations = useConversations(inboxShow);

  function openConversation(id: string) {
    setConversationId(id);
    setInboxShow("All");
    setPane("Negotiations");
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
  const inbox = conversations.data?.pages.flatMap((page) => page.items) ?? [];
  const activeId = conversationId ?? inbox[0]?.id;
  const showInbox = !searching || inbox.length > 0 || inboxShow !== "All";
  const inInbox = pane === "Negotiations" && showInbox;

  const inboxList: ListState<ConversationSummary> = conversations.isPending
    ? { kind: "loading" }
    : conversations.isError
      ? { kind: "error" }
      : {
          kind: "ready",
          items: inbox,
          hasMore: conversations.hasNextPage,
          loadingMore: conversations.isFetchingNextPage,
          onLoadMore: () => void conversations.fetchNextPage(),
        };

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
      <OpportunityBanner />

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
                  list={inboxList}
                  selectedId={activeId}
                  onSelect={setConversationId}
                  show={inboxShow}
                  onShowChange={(next) => {
                    setInboxShow(next);
                    setConversationId(undefined);
                  }}
                />
              ) : undefined
            }
          />
          {inInbox ? (
            activeId ? (
              <ConversationView
                key={activeId}
                id={activeId}
                summary={inbox.find((item) => item.id === activeId)}
                onViewDetails={setDetailOf}
              />
            ) : (
              <div className="min-w-0 flex-1 bg-white shadow-small-thick" />
            )
          ) : selected ? (
            <OpportunityDetail
              key={selected.id}
              id={selected.id}
              summary={selected}
              onEngaged={openConversation}
            />
          ) : isPending ? (
            <div className="min-w-0 flex-1 bg-white shadow-small-thick" />
          ) : (
            <EmptyPreview />
          )}
        </div>
      </section>

      {detailOf ? (
        <OpportunityDetailsModal
          id={detailOf}
          onClose={() => setDetailOf(undefined)}
        />
      ) : null}
    </>
  );
}
