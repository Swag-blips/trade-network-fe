import { Alert02Icon, ClockFadingIcon } from "@hugeicons/core-free-icons";
import { Avatar } from "@repo/ui/avatar";
import {
  CardPlaceholder,
  EmptyState,
  LoadMore,
  PillGroup,
  type ListState,
} from "./requests-pane";
import { SelectableRow } from "./selectable-row";
import type { ConversationSummary, InboxShow } from "../types/inbox";

const SHOW: readonly InboxShow[] = ["All", "On-going", "Funded"];

const EMPTY: Record<InboxShow, string> = {
  All: "You’ve not entered into any negotiations yet",
  "On-going": "You have no on-going negotiations",
  Funded: "None of your negotiations have been funded yet",
};

const PREVIEW = {
  offer: "received your offer",
  documents: "received your document request",
  exit: "You left the negotiation",
} as const;

export function InboxList({
  list,
  selectedId,
  onSelect,
  show,
  onShowChange,
}: {
  list: ListState<ConversationSummary>;
  selectedId?: string;
  onSelect: (id: string) => void;
  show: InboxShow;
  onShowChange: (show: InboxShow) => void;
}) {
  return (
    <>
      <PillGroup
        label="Show"
        options={SHOW}
        value={show}
        onChange={onShowChange}
      />
      {list.kind === "loading" || list.kind === "searching" ? (
        <div className="flex flex-col gap-1">
          <CardPlaceholder />
          <CardPlaceholder />
        </div>
      ) : list.kind === "error" ? (
        <EmptyState
          icon={Alert02Icon}
          text="We couldn't load your negotiations. Please refresh to try again."
        />
      ) : list.items.length === 0 ? (
        <EmptyState icon={ClockFadingIcon} text={EMPTY[show]} />
      ) : (
        <div className="flex min-h-px flex-1 flex-col gap-1 overflow-y-auto">
          {list.items.map((conversation) => (
            <SelectableRow
              key={conversation.id}
              selected={conversation.id === selectedId}
              onSelect={() => onSelect(conversation.id)}
              className="items-center"
            >
              <Avatar
                name={conversation.name}
                size={40}
                shape="square"
                className="border border-grey-200 bg-grey-50 text-grey-600"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-xs">
                  <span className="truncate text-body/[normal] font-medium text-evergreen-600">
                    {conversation.name}
                  </span>
                  {conversation.status === "CLOSED" ? (
                    <span className="flex-none rounded-full border border-grey-200 bg-white px-xs py-0.5 text-caption/[normal] font-medium text-grey-600">
                      Closed
                    </span>
                  ) : null}
                </span>
                {conversation.lastMessage ? (
                  <span className="truncate text-body-sm/[1.4] text-grey-500">
                    {PREVIEW[conversation.lastMessage]}
                  </span>
                ) : null}
              </span>
            </SelectableRow>
          ))}
          <LoadMore list={list} />
        </div>
      )}
    </>
  );
}
