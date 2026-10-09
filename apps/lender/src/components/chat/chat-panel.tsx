"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleArrowDown02Icon,
  MessageAdd01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";
import { useChat } from "@/hooks/use-chat";
import { ChatHistory, type ChatConversation } from "./chat-history";
import { ChatThread, TaiWelcome } from "./chat-thread";

/** The floating Tai window. The conversation itself is `ChatThread`. */
export function ChatPanel({ onClose }: { onClose: () => void }) {
  const chat = useChat();
  const [historyOpen, setHistoryOpen] = useState(false);
  const conversations: ChatConversation[] = [];
  const empty = chat.messages.length === 0;

  return (
    <section
      aria-label="Tai assistant"
      className="fixed right-xl bottom-xl z-20 flex h-185.75 max-h-[calc(100vh-4rem)] w-129.25 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-azure-200 bg-grey-50 shadow-small-thick"
    >
      <header className="flex flex-none items-center gap-lg px-5 py-md">
        <div className="flex min-w-0 flex-1 items-center gap-md">
          <button
            type="button"
            aria-label="Chat history"
            aria-expanded={historyOpen}
            onClick={() => setHistoryOpen(!historyOpen)}
            className={`flex-none rounded-md p-0.5 transition-colors motion-reduce:transition-none ${
              historyOpen
                ? "bg-grey-100 text-evergreen-600"
                : "text-grey-900 hover:bg-grey-100"
            }`}
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </button>
          {empty ? (
            <span className="rounded-full bg-grey-100 px-xs py-1 font-sans text-caption/[normal] font-semibold tracking-[0.24px] text-grey-600">
              TAI
            </span>
          ) : (
            <h2 className="truncate font-sans text-body font-medium text-grey-900">
              {chat.title}
            </h2>
          )}
        </div>
        {!empty ? (
          <IconButton label="New conversation" size="xs" onClick={chat.reset}>
            <HugeiconsIcon icon={MessageAdd01Icon} />
          </IconButton>
        ) : null}
        <IconButton label="Collapse chat" size="xs" onClick={onClose}>
          <HugeiconsIcon icon={CircleArrowDown02Icon} />
        </IconButton>
      </header>

      <ChatThread
        chat={chat}
        gutter="panel"
        empty={<TaiWelcome name="Shile" onPrompt={chat.send} />}
      />

      {historyOpen ? (
        <ChatHistory
          conversations={conversations}
          onSelect={() => setHistoryOpen(false)}
          onClose={() => setHistoryOpen(false)}
        />
      ) : null}
    </section>
  );
}
