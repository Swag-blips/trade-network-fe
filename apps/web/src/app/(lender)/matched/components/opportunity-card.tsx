import { HugeiconsIcon } from "@hugeicons/react";
import { Store02Icon, WarehouseIcon } from "@hugeicons/core-free-icons";
import { InitialsAvatar } from "@/components/avatars";
import { MatchBadge } from "@/components/match-badge";
import type { Opportunity } from "../types/opportunity";

function Detail({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-xs ${className}`}>
      <p className="text-caption/[normal] text-grey-600">{label}</p>
      <div className="text-body-sm/[normal] text-grey-800">{children}</div>
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="w-px self-stretch bg-grey-100" />;
}

export function OpportunityCard({
  item,
  onSelect,
}: {
  item: Opportunity;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative flex w-full max-w-[666px] cursor-pointer flex-col gap-md overflow-hidden rounded-xl border border-grey-100 bg-white p-md text-left shadow-small-thick transition-colors hover:border-grey-200 motion-reduce:transition-none"
    >
      {item.unread ? (
        <span
          aria-label="New opportunity"
          className="absolute top-[21px] left-[15px] size-3 rounded-full bg-grey-900"
        />
      ) : null}

      <div className="flex w-full items-start gap-lg">
        <div className="flex min-w-0 flex-1 items-center gap-sm">
          <InitialsAvatar initials={item.initials} size={56} />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="font-sans text-body font-medium text-evergreen-600">
              {item.name}
            </p>
            <span className="flex items-center gap-1">
              <HugeiconsIcon
                icon={item.kind === "Distributor" ? Store02Icon : WarehouseIcon}
                size={12}
                className="flex-none text-grey-800"
              />
              <span className="text-caption/[normal] text-grey-800">
                {item.kind}
              </span>
            </span>
          </div>
        </div>
        <MatchBadge match={item.match} />
      </div>

      <div className="flex w-full items-center gap-lg">
        <Detail label="Requested advance" className="w-[116px] flex-none">
          {item.advance}
        </Detail>
        <Divider />
        <Detail label="Counterparty" className="w-[140px] flex-none">
          <span className="flex items-center gap-xs">
            <InitialsAvatar
              initials={item.counterpartyInitials}
              size={20}
              className="border-grey-200 bg-grey-100 text-grey-600"
            />
            <span className="min-w-0 flex-1 truncate">{item.counterparty}</span>
          </span>
        </Detail>
        <Divider />
        <Detail label="Tenor" className="w-[86px] flex-none">
          {item.tenor}
        </Detail>
        <Divider />
        <Detail label="Expiry date" className="min-w-0 flex-1">
          {item.expires}
        </Detail>
      </div>
    </button>
  );
}
