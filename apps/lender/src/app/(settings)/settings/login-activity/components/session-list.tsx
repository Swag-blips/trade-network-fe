"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TextPlaceholder } from "@/components/text-placeholder";
import { useRevokeOtherSessions } from "../hooks/use-revoke-other-sessions";
import { useSessions } from "../hooks/use-sessions";
import { SessionRow } from "./session-row";

const LIST =
  "flex flex-col divide-y divide-grey-100 overflow-hidden rounded-2xl border border-grey-100 shadow-card";

export function SessionList() {
  const { data, isPending, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSessions();
  const [confirming, setConfirming] = useState(false);
  const { mutate: revokeOthers, isPending: revoking } = useRevokeOtherSessions();

  if (isPending) {
    return (
      <div className="flex flex-col gap-md">
        <TextPlaceholder className="w-24" />
        <ul className={LIST}>
          {[0, 1, 2].map((key) => (
            <li key={key} className="flex items-center gap-md bg-white p-md">
              <span className="size-10 flex-none rounded-full bg-grey-100" />
              <span className="flex flex-1 flex-col gap-xs">
                <TextPlaceholder className="w-32" />
                <TextPlaceholder className="w-56" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-body/[normal] text-grey-600">
        We couldn&rsquo;t load your login activity. Refresh the page to try
        again.
      </p>
    );
  }

  const sessions = data.pages.flatMap((page) => page.items);
  const active = sessions.filter((session) => session.active).length;
  const othersActive = sessions.some(
    (session) => session.active && !session.current,
  );

  return (
    <div className="flex flex-col gap-md">
      <div className="flex min-h-8 items-center justify-between gap-md">
        <p className="text-body-sm/[normal] text-grey-600">
          {active} active {active === 1 ? "session" : "sessions"}
        </p>
        {othersActive ? (
          <Button
            variant="destructive-outline"
            size="sm"
            leadingIcon={<HugeiconsIcon icon={Logout01Icon} />}
            onClick={() => setConfirming(true)}
          >
            Sign out of all other devices
          </Button>
        ) : null}
      </div>

      <ul className={LIST}>
        {sessions.map((session) => (
          <SessionRow key={session.id} session={session} />
        ))}
      </ul>

      {hasNextPage ? (
        <div className="flex justify-center">
          <Button
            variant="tertiary"
            size="form"
            loading={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            Load more
          </Button>
        </div>
      ) : null}

      {confirming ? (
        <ConfirmDialog
          title="Sign out of all other devices?"
          confirmLabel="Sign out"
          confirmVariant="destructive"
          loading={revoking}
          onConfirm={() =>
            revokeOthers(undefined, { onSettled: () => setConfirming(false) })
          }
          onClose={() => setConfirming(false)}
        >
          Every device except this one will be signed out and will need to sign
          in again.
        </ConfirmDialog>
      ) : null}
    </div>
  );
}
