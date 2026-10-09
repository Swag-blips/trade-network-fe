import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon } from "@hugeicons/core-free-icons";

export function AnnouncementBanner() {
  return (
    <div className="flex h-10.75 flex-none items-center justify-center gap-xs border border-evergreen-100 bg-evergreen-50 px-4">
      <span className="flex size-6 flex-none items-center justify-center rounded-full bg-evergreen-100">
        <HugeiconsIcon
          icon={Megaphone01Icon}
          size={18}
          className="text-evergreen-900"
        />
      </span>
      <p className="truncate text-body text-evergreen-900">
        <span className="font-medium">Product update:</span> InvoiceMe is now
        part of TradeNetwork
      </p>
    </div>
  );
}
