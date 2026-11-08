"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Mail02Icon } from "@hugeicons/core-free-icons";
import { TextPlaceholder } from "@/components/text-placeholder";
import { useMe } from "@/hooks/use-me";
import { ChangeEmail } from "./change-email";

export function EmailSection() {
  const { data: me, isPending } = useMe();

  return (
    <div className="flex h-21.75 items-center gap-md p-md">
      <div className="flex min-w-0 flex-1 items-center gap-md">
        <span className="flex size-10 flex-none items-center justify-center rounded-full border border-grey-200 bg-white text-grey-900">
          <HugeiconsIcon icon={Mail02Icon} size={20} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body/[1.5] font-medium text-grey-900">
            Email address
          </p>
          <p className="truncate text-body-sm/[normal] text-grey-600">
            {isPending ? <TextPlaceholder className="w-48" /> : me?.email}
          </p>
        </div>
      </div>

      <ChangeEmail email={me?.email} />
    </div>
  );
}
