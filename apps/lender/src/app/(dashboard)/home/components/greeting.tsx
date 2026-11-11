"use client";

import { useMe } from "@/hooks/use-me";
import { TextPlaceholder } from "@/components/text-placeholder";
import { partOfDay } from "../utils/greeting";

export function Greeting() {
  const { data: me, isPending } = useMe();

  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-brand text-2xl/[1.24] font-medium text-grey-900">
        {/* The hour is read only after `me` loads, in the browser, so it can't mismatch the server's. */}
        {isPending ? (
          <TextPlaceholder className="w-56" />
        ) : (
          <>
            Good {partOfDay(new Date().getHours())}
            {me?.firstName ? (
              <>
                , <span className="text-evergreen-600">{me.firstName}</span>
              </>
            ) : null}
          </>
        )}
      </h1>
      <p className="text-body/[1.5] text-grey-600">
        Here&rsquo;s an overview of your financing activity.
      </p>
    </div>
  );
}
