import { Avatar } from "@repo/ui/avatar";
import { SelectableRow } from "./selectable-row";
import type { OpportunitySummary } from "../types/opportunity";
import { MATCH, nairaSuffix, shortDate } from "../utils/format";

export function OpportunityCard({
  item,
  selected,
  onSelect,
}: {
  item: OpportunitySummary;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <SelectableRow
      selected={selected}
      onSelect={onSelect}
      className="items-start"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-sm">
        <span className="flex items-start gap-md">
          <Avatar
            name={item.name}
            size={40}
            shape="square"
            className="border border-grey-200 bg-grey-50 text-grey-600"
          />
          <span className="flex min-w-0 flex-1 flex-col gap-1 text-body/[normal]">
            <span className="truncate font-medium text-evergreen-600">
              {item.name}
            </span>
            <span className="text-body-sm/[normal] text-grey-800">
              {nairaSuffix(item.advance)}
            </span>
          </span>
        </span>

        <span className="flex items-center gap-xs text-caption/[normal] font-medium">
          <span
            className={`rounded-full px-xs py-1 text-white ${MATCH[item.match].chip}`}
          >
            {MATCH[item.match].label}
          </span>
          <span className="rounded-full border border-grey-200 bg-white px-xs py-1 text-grey-800">
            Expires: {shortDate(item.expiresAt)}
          </span>
        </span>
      </span>

      {item.unread ? (
        <span className="flex-none pt-xs">
          <span
            role="img"
            aria-label="Unread"
            className="block size-3 rounded-full border-2 border-white bg-red-error-500"
          />
        </span>
      ) : null}
    </SelectableRow>
  );
}
