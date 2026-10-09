"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  SentIcon,
  SparklesIcon,
  SquareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";
import { TaiAgent } from "@repo/ui/tai-agent";
import { ChatAssetBlock } from "./chat-assets";
import type { AssistantMessage, ChatMessage } from "../../types/types";

/** What a thread needs from its conversation — `useChat` returns this shape. */
export interface ThreadChat {
  messages: ChatMessage[];
  status: "idle" | "thinking";
  statusLabel?: string;
  send: (text: string) => void;
}

/** `panel` is the floating Tai window (20px sides), `page` the inbox pane (24px). */
const GUTTER = { panel: "px-5", page: "px-lg" } as const;

const BUBBLE =
  "w-full rounded-lg border border-grey-100 bg-white px-sm py-xs text-body text-grey-800 shadow-small-thick";

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex w-full justify-end pl-10">
      <p className="rounded-lg bg-evergreen-500 px-sm py-xs text-body text-white">
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
    <div className="flex w-full flex-col gap-xs pr-10">
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

function Thinking({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-xs pr-10">
      <TaiAgent size="sm" />
      <span className="flex items-center gap-2.5 rounded-lg border border-grey-100 bg-white px-sm py-1 font-sans text-body-sm text-grey-500 shadow-small-thick">
        {label}
        <span aria-hidden className="flex gap-0.5">
          <i className="size-1 animate-dot-pulse rounded-full bg-grey-500" />
          <i className="size-1 animate-dot-pulse rounded-full bg-grey-500 [animation-delay:0.15s]" />
          <i className="size-1 animate-dot-pulse rounded-full bg-grey-500 [animation-delay:0.3s]" />
        </span>
      </span>
    </div>
  );
}

/**
 * The conversation body: message list, composer and notice. It knows nothing
 * about where it is shown — the floating panel and the inbox pane both wrap it.
 */
export function ChatThread({
  chat,
  gutter = "page",
  empty,
  placeholder = "Ask Tai",
  notice = "Tai may make mistakes at times, please verify important information.",
}: {
  chat: ThreadChat;
  gutter?: keyof typeof GUTTER;
  /** Shown instead of the message list before the first message. */
  empty?: ReactNode;
  placeholder?: string;
  /** Line under the composer; pass `null` to hide it. */
  notice?: string | null;
}) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const thinking = chat.status === "thinking";
  const side = GUTTER[gutter];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat.messages, chat.status]);

  function submit(text: string) {
    const value = text.trim();
    if (!value || thinking) return;
    setDraft("");
    chat.send(value);
  }

  return (
    <>
      <div ref={scrollRef} className="min-h-px flex-1 overflow-y-auto">
        {chat.messages.length === 0 && empty ? (
          empty
        ) : (
          <div
            className={`flex min-h-full flex-col justify-end gap-md py-lg ${side}`}
          >
            <div className="flex justify-center">
              <span className="rounded-xl border border-grey-100 bg-white px-xs py-0.5 font-sans text-body-sm text-grey-800 shadow-small-thick">
                Today
              </span>
            </div>
            {chat.messages.map((message) =>
              message.role === "user" ? (
                <UserBubble key={message.id} text={message.text} />
              ) : (
                <AssistantTurn
                  key={message.id}
                  message={message}
                  onSuggestion={submit}
                />
              ),
            )}
            {thinking ? (
              <Thinking label={chat.statusLabel ?? "Thinking..."} />
            ) : null}
          </div>
        )}
      </div>

      <div className={`flex flex-none flex-col gap-2.5 pt-xs pb-md ${side}`}>
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
            placeholder={placeholder}
            aria-label={placeholder}
            className="min-w-0 flex-1 bg-transparent font-sans text-body text-grey-900 outline-none placeholder:text-grey-500"
          />
          <button
            type="submit"
            aria-label={thinking ? "Stop" : "Send message"}
            className="flex-none text-grey-500 hover:text-evergreen-600"
          >
            <HugeiconsIcon icon={thinking ? SquareIcon : SentIcon} size={24} />
          </button>
        </form>
        {notice ? (
          <p className="px-5 text-center text-body-sm text-grey-500">
            {notice}
          </p>
        ) : null}
      </div>
    </>
  );
}

export const TAI_PROMPTS = [
  "What needs my attention today?",
  "Show me the best funding opportunities for me",
  "Which customers are showing signs of risk?",
];

/** Tai's empty state: the greeting and the starter prompts. */
export function TaiWelcome({
  name,
  prompts = TAI_PROMPTS,
  onPrompt,
}: {
  name: string;
  prompts?: string[];
  onPrompt: (prompt: string) => void;
}) {
  return (
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
            How can I help you {name}?
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 px-5 py-md">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPrompt(prompt)}
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
  );
}
