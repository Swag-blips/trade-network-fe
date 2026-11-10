import { InboxIcon } from "@hugeicons/core-free-icons";
import { Avatar } from "@repo/ui/avatar";
import { EmptyState, PillGroup } from "./requests-pane";
import { SelectableRow } from "./selectable-row";
import type { Conversation, InboxShow } from "../types/inbox";

const SHOW: readonly InboxShow[] = ["Active", "Funded"];

function preview({ messages }: Conversation) {
  const last = messages.at(-1);
  return last?.kind === "offer"
    ? "received your offer"
    : "received your document request";
}

export function InboxList({
  conversations,
  selectedId,
  onSelect,
  show,
  onShowChange,
}: {
  conversations: Conversation[];
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
      {conversations.length === 0 ? (
        <EmptyState
          icon={InboxIcon}
          text={show === "Funded" ? "No funded deals yet." : "No messages yet."}
        />
      ) : (
        <div className="flex min-h-px flex-1 flex-col gap-1 overflow-y-auto">
          {conversations.map((conversation) => {
            const { id, name } = conversation.opportunity;
            return (
              <SelectableRow
                key={id}
                selected={id === selectedId}
                onSelect={() => onSelect(id)}
                className="items-center"
              >
                <Avatar
                  name={name}
                  size={40}
                  shape="square"
                  className="border border-grey-200 bg-grey-50 text-grey-600"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-body/[normal] font-medium text-evergreen-600">
                    {name}
                  </span>
                  <span className="truncate text-body-sm/[1.4] text-grey-500">
                    {preview(conversation)}
                  </span>
                </span>
              </SelectableRow>
            );
          })}
        </div>
      )}
    </>
  );
}
