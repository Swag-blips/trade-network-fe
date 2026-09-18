import { HugeiconsIcon } from "@hugeicons/react";
import { Store02Icon, WarehouseIcon } from "@hugeicons/core-free-icons";
import { InitialsAvatar } from "@repo/ui/avatars";

export interface Party {
  name: string;
  kind: "Supplier" | "Distributor";
  initials: string;
}

export function PartyCard({ party, terms }: { party: Party; terms: string }) {
  return (
    <div className="flex w-full items-start gap-sm overflow-hidden rounded-lg border border-grey-100 bg-grey-50 p-md">
      <div className="flex min-w-0 flex-1 flex-col gap-sm">
        <div className="flex flex-col gap-1">
          <p className="font-sans text-body/[normal] font-medium text-grey-900">
            {party.name}
          </p>
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={party.kind === "Distributor" ? Store02Icon : WarehouseIcon}
              size={12}
              className="text-grey-600"
            />
            <span className="text-caption/[normal] text-grey-600">
              {party.kind}
            </span>
          </span>
        </div>
        <p className="text-caption text-grey-600">{terms}</p>
      </div>
      <InitialsAvatar initials={party.initials} size={56} />
    </div>
  );
}
