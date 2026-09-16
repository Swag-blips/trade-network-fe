"use client";

import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { HistoryIcon, MenuCollapseIcon } from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";

export interface ChatConversation {
  id: string;
  title: string;
  updatedAt: string;
}

export function ChatHistory({
  conversations,
  activeId,
  onSelect,
  onClose,
}: {
  conversations: ChatConversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close chat history"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <aside
        ref={ref}
        tabIndex={-1}
        aria-label="Chat history"
        className="absolute inset-y-0 left-0 flex w-91.75 max-w-[85%] flex-col overflow-hidden bg-white outline-none"
      >
        <div className="flex flex-none items-center gap-2.5 border-b border-grey-100 px-5 py-md">
          <h2 className="min-w-0 flex-1 font-brand text-[1.5rem]/[1.3] font-medium text-grey-900">
            Chat history
          </h2>
          <IconButton label="Collapse chat history" size="xs" onClick={onClose}>
            <HugeiconsIcon icon={MenuCollapseIcon} />
          </IconButton>
        </div>

        <div className="min-h-px flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="mx-auto mt-xl flex w-61.75 flex-col items-center gap-md">
              <HugeiconsIcon
                icon={HistoryIcon}
                size={32}
                className="text-grey-500"
              />
              <div className="flex w-full flex-col gap-xs text-center">
                <p className="font-sans text-body font-medium text-grey-800">
                  Your chats will appear here
                </p>
                <p className="text-body-sm text-grey-500">
                  Your past conversation with Tai can be found here.
                </p>
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-xxs p-sm">
              {conversations.map((conversation) => {
                const active = conversation.id === activeId;
                return (
                  <li key={conversation.id}>
                    <button
                      type="button"
                      aria-current={active ? "true" : undefined}
                      onClick={() => onSelect(conversation.id)}
                      className={`flex w-full flex-col gap-0.5 rounded-md px-sm py-2.5 text-left transition-colors motion-reduce:transition-none ${
                        active
                          ? "bg-evergreen-100 text-evergreen-700"
                          : "text-grey-900 hover:bg-grey-100"
                      }`}
                    >
                      <span
                        className={`truncate font-sans text-body-sm/[normal] ${active ? "font-medium" : ""}`}
                      >
                        {conversation.title}
                      </span>
                      <span className="text-caption text-grey-500">
                        {conversation.updatedAt}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
