import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building05Icon,
  CheckmarkBadge02Icon,
} from "@hugeicons/core-free-icons";
import { UserAvatar } from "@repo/ui/avatars";
import { TaiAgent } from "@repo/ui/tai-agent";
import type { Conversation } from "../types/conversation";

export function ConversationAvatar({ conversation }: { conversation: Conversation }) {
  return (
    <span className="relative size-10 flex-none">
      {conversation.isAssistant ? (
        <span className="flex size-10 items-center justify-center rounded-full border border-grey-100">
          <TaiAgent size="avatar" />
        </span>
      ) : (
        <span className="block size-10 overflow-hidden rounded-full border border-grey-100">
          <UserAvatar
            src={conversation.photo}
            name={conversation.name}
            size={40}
          />
        </span>
      )}
      {conversation.fromCompany ? (
        <span className="absolute top-7 left-5.25 flex size-5 items-center justify-center rounded-full border-2 border-white bg-linen-100 text-linen-600">
          <HugeiconsIcon icon={Building05Icon} size={12} />
        </span>
      ) : null}
    </span>
  );
}

export function ConversationRow({
  conversation,
  selected = false,
  onSelect,
}: {
  conversation: Conversation;
  selected?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      className={`flex w-full cursor-pointer items-center gap-xs rounded-md p-xs text-left ${
        selected ? "bg-grey-100" : "hover:bg-grey-50"
      }`}
    >
      <ConversationAvatar conversation={conversation} />

      <span className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <span className="flex items-center gap-2.5">
          <span className="flex min-w-0 flex-1 items-center gap-1">
            <span className="truncate font-sans text-body-sm/[normal] font-medium text-grey-900">
              {conversation.name}
            </span>
            {conversation.verified ? (
              <HugeiconsIcon
                icon={CheckmarkBadge02Icon}
                size={16}
                className="flex-none text-green-500"
              />
            ) : null}
          </span>
          {conversation.time ? (
            <span className="flex-none text-caption/[normal] text-grey-500">
              {conversation.time}
            </span>
          ) : null}
        </span>

        {conversation.preview ? (
          <span className="flex items-center gap-2.5">
            <span className="min-w-0 flex-1 truncate text-caption/[normal] text-grey-500">
              {conversation.preview}
            </span>
            {conversation.unread ? (
              <span className="flex w-4 flex-none items-center justify-center rounded-full bg-evergreen-900 px-1 py-0.5 text-[10px]/[normal] text-white">
                {conversation.unread}
              </span>
            ) : null}
          </span>
        ) : null}
      </span>
    </button>
  );
}
