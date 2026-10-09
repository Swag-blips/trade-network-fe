"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { ConversationRow } from "./conversation-row";
import type { Conversation } from "../types/conversation";

export function ConversationList({
  assistant,
  conversations,
  selectedId,
  onSelect,
}: {
  assistant: Conversation;
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const matches = (c: Conversation) => c.name.toLowerCase().includes(term);
  const people = conversations.filter(matches);

  return (
    <aside className="flex h-full w-93.75 flex-none flex-col overflow-hidden border-r border-grey-100 bg-white">
      <div className="px-5 py-md">
        <label className="flex items-center gap-xs overflow-hidden rounded-md bg-grey-100 px-sm py-xs focus-within:outline-2 focus-within:outline-evergreen-600">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="flex-none text-grey-500"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chat"
            aria-label="Search chat"
            className="min-w-0 flex-1 bg-transparent font-sans text-body/[normal] font-medium text-grey-900 outline-none placeholder:text-grey-500"
          />
        </label>
      </div>

      <div className="flex min-h-px flex-1 flex-col gap-xs overflow-y-auto px-5">
        {matches(assistant) ? (
          <>
            <ConversationRow
              conversation={assistant}
              selected={selectedId === assistant.id}
              onSelect={() => onSelect(assistant.id)}
            />
            <hr className="border-grey-100" />
          </>
        ) : null}
        {people.map((conversation) => (
          <ConversationRow
            key={conversation.id}
            conversation={conversation}
            selected={selectedId === conversation.id}
            onSelect={() => onSelect(conversation.id)}
          />
        ))}
        {people.length === 0 && !matches(assistant) ? (
          <p className="px-xs py-md text-body-sm text-grey-500">
            No chats match “{query}”.
          </p>
        ) : null}
      </div>
    </aside>
  );
}
