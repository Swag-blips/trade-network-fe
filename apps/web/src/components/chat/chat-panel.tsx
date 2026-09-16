"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleArrowDown02Icon,
  Copy01Icon,
  MessageAdd01Icon,
  Menu01Icon,
  SentIcon,
  SparklesIcon,
  SquareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";
import { TaiAgent } from "@/components/tai-agent";
import { useChat } from "@/hooks/use-chat";
import { ChatAssetBlock } from "./chat-assets";
import { ChatHistory, type ChatConversation } from "./chat-history";
import type { AssistantMessage, ChatMessage } from "../../types/types";

const BUBBLE =
  "w-full rounded-lg border border-grey-100 bg-white px-sm py-xs text-body text-grey-800 shadow-small-thick";

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex w-full justify-end">
      <p className="max-w-[85%] rounded-lg bg-evergreen-600 px-md py-2.5 text-body text-white">
        {text}
      </p>
    </div>
  );
}

function FeedbackActions() {
  return (
    <div className="flex items-center gap-2.5 pl-10">
      {[
        { icon: ThumbsUpIcon, label: "Helpful" },
        { icon: ThumbsDownIcon, label: "Not helpful" },
        { icon: Copy01Icon, label: "Copy response" },
      ].map((action) => (
        <IconButton
          key={action.label}
          label={action.label}
          className="text-grey-500"
        >
          <HugeiconsIcon icon={action.icon} />
        </IconButton>
      ))}
    </div>
  );
}

function AssistantTurn({
  message,
  onSuggestion,
}: {
  message: AssistantMessage;
  onSuggestion: (text: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-xs pl-xs">
      <div className="flex w-full items-end gap-xs">
        <TaiAgent size="sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          {message.blocks.map((block, index) =>
            block.type === "text" ? (
              <p key={index} className={BUBBLE}>
                {block.text}
              </p>
            ) : (
              <ChatAssetBlock key={index} asset={block} />
            ),
          )}
          {message.suggestions?.length ? (
            <div className="flex flex-wrap items-start gap-xs py-xs">
              {message.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSuggestion(suggestion)}
                  className="rounded-full border border-evergreen-600 bg-white px-sm py-1.5 font-sans text-body-sm/[normal] font-medium text-evergreen-600 hover:bg-evergreen-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <FeedbackActions />
    </div>
  );
}

function Turn({
  message,
  onSuggestion,
}: {
  message: ChatMessage;
  onSuggestion: (text: string) => void;
}) {
  if (message.role === "user") return <UserBubble text={message.text} />;
  return <AssistantTurn message={message} onSuggestion={onSuggestion} />;
}

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const { messages, status, statusLabel, title, send, reset } = useChat();
  const [draft, setDraft] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const conversations: ChatConversation[] = [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const empty = messages.length === 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  function submit(text: string) {
    const value = text.trim();
    if (!value || status === "thinking") return;
    setDraft("");
    send(value);
  }

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
              {title}
            </h2>
          )}
        </div>
        {!empty ? (
          <IconButton label="New conversation" size="xs" onClick={reset}>
            <HugeiconsIcon icon={MessageAdd01Icon} />
          </IconButton>
        ) : null}
        <IconButton label="Collapse chat" size="xs" onClick={onClose}>
          <HugeiconsIcon icon={CircleArrowDown02Icon} />
        </IconButton>
      </header>

      <div ref={scrollRef} className="min-h-px flex-1 overflow-y-auto">
        {empty ? (
          <>
            <div className="relative flex h-101.5 flex-col items-center justify-center overflow-hidden">
              <div
                aria-hidden
                className="absolute top-35 left-16.75 size-39.5 rounded-full bg-azure-200 opacity-30 blur-[60px]"
              />
              <div
                aria-hidden
                className="absolute top-57.5 left-66.75 size-54.5 rounded-full bg-evergreen-200 opacity-30 blur-[60px]"
              />
              <div className="relative flex flex-col items-center gap-md">
                <TaiAgent />
                <p className="font-sans text-xl/normal font-medium text-grey-900">
                  How can I help you Shile?
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 px-5 py-md">
              {[
                "What needs my attention today?",
                "Show me the best funding opportunities for me",
                "Which customers are showing signs of risk?",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submit(prompt)}
                  className="flex items-center gap-sm rounded-lg px-xs py-1 text-left font-sans text-body text-grey-900 hover:bg-grey-100"
                >
                  <HugeiconsIcon
                    icon={SparklesIcon}
                    size={20}
                    className="flex-none text-tai"
                  />
                  {prompt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-sm px-5 pt-0 pb-md">
            <div className="flex justify-center py-xs">
              <span className="rounded-full bg-white px-2.5 py-0.5 font-sans text-body-sm text-grey-600 shadow-small-thick">
                Today
              </span>
            </div>
            {messages.map((message) => (
              <Turn key={message.id} message={message} onSuggestion={submit} />
            ))}
            {status === "thinking" ? (
              <div className="flex items-center gap-xs pl-xs">
                <TaiAgent size="sm" />
                <span className="flex items-center gap-xs rounded-full bg-white px-sm py-1.5 font-sans text-body-sm text-grey-600 shadow-small-thick">
                  {statusLabel}
                  <span aria-hidden className="flex gap-0.5">
                    <i className="size-1 animate-dot-pulse rounded-full bg-grey-500" />
                    <i className="size-1 animate-dot-pulse rounded-full bg-grey-500 [animation-delay:0.15s]" />
                  </span>
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {historyOpen ? (
        <ChatHistory
          conversations={conversations}
          onSelect={() => setHistoryOpen(false)}
          onClose={() => setHistoryOpen(false)}
        />
      ) : null}

      <div className="flex flex-none flex-col gap-2.5 px-5 pt-xs pb-md">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(draft);
          }}
          className="flex w-full items-center gap-2.5 rounded-full border border-evergreen-500 bg-white px-lg py-md shadow-[0_0_1px_4px_rgb(47_138_122/8%)]"
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask Tai"
            aria-label="Ask Tai"
            className="min-w-0 flex-1 bg-transparent font-sans text-body text-grey-900 outline-none placeholder:text-grey-500"
          />
          <button
            type="submit"
            aria-label={status === "thinking" ? "Stop" : "Send message"}
            className="flex-none text-grey-500 hover:text-evergreen-600"
          >
            <HugeiconsIcon
              icon={status === "thinking" ? SquareIcon : SentIcon}
              size={24}
            />
          </button>
        </form>
        <p className="px-5 text-center text-body-sm text-grey-500">
          Tai may make mistakes at times, please verify important information.
        </p>
      </div>
    </section>
  );
}
