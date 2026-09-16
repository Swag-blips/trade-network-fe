"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";
import { InitialsAvatar } from "@/components/avatars";

const NAV =
  "rounded-md! border border-grey-100 bg-white shadow-small-thick hover:bg-grey-50 disabled:opacity-50";

export function DetailHeader({
  initials,
  name,
  badge,
  prevHref,
  nextHref,
  backLabel,
  itemLabel,
}: {
  initials: string;
  name: string;
  badge?: ReactNode;
  prevHref?: string;
  nextHref?: string;
  /** Where "Back" goes, e.g. "offers". */
  backLabel: string;
  /** What prev/next step through, e.g. "offer". */
  itemLabel: string;
}) {
  const router = useRouter();

  return (
    <header className="flex h-15 flex-none items-center justify-center gap-2.5 overflow-hidden border-b border-grey-100 bg-white px-lg py-sm">
      <div className="flex min-w-0 flex-1 items-center gap-xs">
        <IconButton
          label={`Back to ${backLabel}`}
          size="xs"
          onClick={router.back}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} />
        </IconButton>
        <div className="flex min-w-0 items-center gap-sm">
          <InitialsAvatar initials={initials} size={32} />
          <h1 className="max-w-50 truncate font-sans text-body font-medium text-grey-900">
            {name}
          </h1>
        </div>
        {badge}
      </div>

      <div className="flex flex-none items-center gap-xs">
        <IconButton
          label={`Previous ${itemLabel}`}
          size="sm"
          className={NAV}
          disabled={!prevHref}
          onClick={() => router.push(prevHref!)}
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} />
        </IconButton>
        <IconButton
          label={`Next ${itemLabel}`}
          size="sm"
          className={NAV}
          disabled={!nextHref}
          onClick={() => router.push(nextHref!)}
        >
          <HugeiconsIcon icon={ArrowRight02Icon} />
        </IconButton>
      </div>
    </header>
  );
}
