"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Chat01Icon,
  CheckmarkBadge02Icon,
} from "@hugeicons/core-free-icons";
import { useChat } from "@/hooks/use-chat";
import {
  ChatThread,
  TaiWelcome,
  type ThreadChat,
} from "@/components/chat/chat-thread";
import type { ChatMessage } from "@/types/types";
import { ConversationList } from "./conversation-list";
import { ConversationAvatar } from "./conversation-row";
import type { Conversation } from "../types/conversation";

function StartConversation() {
  return (
    <div className="flex w-85 flex-col items-center gap-lg px-5.5 py-6.75 text-center">
      <HugeiconsIcon icon={Chat01Icon} size={40} className="text-grey-600" />
      <div className="flex w-full flex-col items-center gap-xs">
        <h2 className="font-sans text-xl/normal font-medium text-grey-900">
          Start a conversation
        </h2>
        <p className="w-63.75 text-body text-grey-600">
          Select a message to start a conversation
        </p>
      </div>
    </div>
  );
}

function PaneHeader({ conversation }: { conversation: Conversation }) {
  return (
    <header className="flex flex-none items-center gap-sm border-b border-grey-100 px-lg py-sm">
      <ConversationAvatar conversation={conversation} />
      <h2 className="flex items-center gap-1 font-sans text-body-sm/[normal] font-medium text-grey-900">
        {conversation.name}
        {conversation.verified ? (
          <HugeiconsIcon
            icon={CheckmarkBadge02Icon}
            size={16}
            className="text-green-500"
          />
        ) : null}
      </h2>
    </header>
  );
}

function toMessages(id: string, sent: string[] = []): ChatMessage[] {
  return sent.map((text, index) => ({
    id: `${id}-${index}`,
    role: "user",
    text,
  }));
}

export function InboxView({
  assistant,
  conversations,
}: {
  assistant: Conversation;
  conversations: Conversation[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const tai = useChat();
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(
      conversations.map((c) => [c.id, toMessages(c.id, c.sent)]),
    ),
  );

  const people = conversations.map((c) => {
    const last = threads[c.id]?.at(-1);
    return last?.role === "user" ? { ...c, preview: `You: ${last.text}` } : c;
  });
  const selected =
    selectedId === assistant.id
      ? assistant
      : people.find((c) => c.id === selectedId);

  function personChat(id: string): ThreadChat {
    return {
      messages: threads[id] ?? [],
      status: "idle",
      send: (text) =>
        setThreads((current) => ({
          ...current,
          [id]: [
            ...(current[id] ?? []),
            { id: `${id}-${Date.now()}`, role: "user", text },
          ],
        })),
    };
  }

  return (
    <div className="flex min-h-px flex-1">
      <ConversationList
        assistant={assistant}
        conversations={people}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {selected ? (
        <section className="flex min-w-0 flex-1 flex-col bg-white">
          <PaneHeader conversation={selected} />
          {selected.isAssistant ? (
            <ChatThread
              chat={tai}
              empty={<TaiWelcome name="Shile" onPrompt={tai.send} />}
            />
          ) : (
            <ChatThread
              key={selected.id}
              chat={personChat(selected.id)}
              placeholder={`Message ${selected.name.split(" ")[0]}`}
              notice={null}
            />
          )}
        </section>
      ) : (
        <section className="flex min-w-0 flex-1 items-center justify-center bg-white">
          <StartConversation />
        </section>
      )}
    </div>
  );
}
