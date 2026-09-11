import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Coins01Icon,
  Store02Icon,
  WarehouseIcon,
} from "@hugeicons/core-free-icons";
import { InitialsAvatar } from "@/components/avatars";
import { MatchBadge } from "@/components/match-badge";
import type {
  ChatAsset,
  OpportunityItem,
  PriorityItem,
} from "../../types/types";

const CARD =
  "w-full overflow-hidden rounded-lg border border-grey-100 bg-white shadow-small-thick";

function CardTitle({ children }: { children: string }) {
  return (
    <div className="w-full border-b border-grey-100 px-md py-2.5">
      <p className="font-sans text-body font-medium text-grey-900">
        {children}
      </p>
    </div>
  );
}

function PriorityRow({ item }: { item: PriorityItem }) {
  return (
    <Link
      href={item.href}
      className="flex w-full items-center gap-2.5 px-md py-sm hover:bg-grey-50"
    >
      <span className="relative flex size-10 flex-none items-center justify-center rounded-[20px] bg-[#e0f2fe]">
        <HugeiconsIcon
          icon={Coins01Icon}
          size={20}
          className="text-ocean-700"
        />
        {item.count ? (
          <span className="absolute -top-0.5 left-[27px] flex min-w-4 items-center justify-center rounded-full bg-evergreen-900 px-1 py-0.5 text-[10px]/none text-white">
            {item.count}
          </span>
        ) : null}
      </span>
      <span className="min-w-0 flex-1 font-sans text-body font-medium text-grey-800">
        {item.label}
      </span>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={24}
        className="flex-none text-grey-900"
      />
    </Link>
  );
}

function OpportunityRow({ item }: { item: OpportunityItem }) {
  return (
    <Link href={item.href} className="flex rounded-lg p-xs hover:bg-grey-50">
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-sm">
        <div className="flex w-full items-start gap-xs">
          <InitialsAvatar initials={item.initials} size={40} />
          <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
            <span className="font-sans text-body-sm font-medium text-evergreen-600">
              {item.name}
            </span>
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
          </span>
          <MatchBadge match={item.match} size="sm" />
        </div>
        <div className="flex items-center gap-2.5 text-caption/[normal]">
          <span className="flex items-center gap-1">
            <span className="text-grey-800">{item.amount}</span>
            <span className="text-grey-600">requested</span>
          </span>
          <span aria-hidden className="size-1 rounded-full bg-grey-300" />
          <span className="flex items-center gap-1">
            <span className="text-grey-600">Expires</span>
            <span className="text-grey-800">{item.expires}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ChatAssetBlock({ asset }: { asset: ChatAsset }) {
  if (asset.type === "priority-list") {
    return (
      <div className={CARD}>
        <CardTitle>{asset.title}</CardTitle>
        {asset.items.map((item) => (
          <PriorityRow key={item.id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className={CARD}>
      <CardTitle>{asset.title}</CardTitle>
      <div className="flex flex-col px-sm py-xs">
        {asset.items.map((item, index) => (
          <div key={item.id}>
            {index > 0 ? <hr className="border-grey-100" /> : null}
            <OpportunityRow item={item} />
          </div>
        ))}
        {asset.action ? (
          <div className="py-xs">
            <Link
              href={asset.action.href}
              className="flex w-full items-center justify-center gap-xs rounded-full bg-grey-50 px-md py-2.5 font-sans text-body-sm font-medium text-grey-900 hover:bg-grey-100"
            >
              {asset.action.label}
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
