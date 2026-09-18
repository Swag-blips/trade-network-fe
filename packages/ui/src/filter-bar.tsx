import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterMailCircleIcon } from "@hugeicons/core-free-icons";

/** "Filter by:" and its chips. Pass one or more `<Select variant="chip">`. */
export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <span className="flex flex-none items-center gap-md">
      <span className="flex items-center gap-xs">
        <HugeiconsIcon
          icon={FilterMailCircleIcon}
          size={20}
          className="text-grey-600"
        />
        <span className="text-body-sm/[normal] whitespace-nowrap text-grey-600">
          Filter by:
        </span>
      </span>
      {children}
    </span>
  );
}
