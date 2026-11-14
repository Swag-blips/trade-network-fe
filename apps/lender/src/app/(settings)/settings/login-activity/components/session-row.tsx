"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerIcon,
  Logout01Icon,
  MoreHorizontalIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@repo/ui/badge";
import { IconButton } from "@repo/ui/icon-button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useRevokeSession } from "../hooks/use-revoke-session";
import type { LoginSession } from "../types/session";
import {
  describeDevice,
  endedLabel,
  sessionDay,
  sessionTime,
} from "../utils/session";

function SessionMenu({ onSignOut }: { onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <IconButton
        label="Session options"
        variant="tertiary"
        size="lg"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} />
      </IconButton>
      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-20 mt-xs flex w-56 flex-col overflow-hidden rounded-lg border border-grey-200 bg-white p-xs shadow-thick"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="flex w-full cursor-pointer items-center gap-xs rounded-md px-xs py-1 text-left text-body-sm/[1.5] font-medium text-red-error-500 hover:bg-grey-100"
          >
            <HugeiconsIcon icon={Logout01Icon} size={20} />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function SessionRow({ session }: { session: LoginSession }) {
  const device = describeDevice(session.userAgent);
  const [confirming, setConfirming] = useState(false);
  const { mutate: revoke, isPending } = useRevokeSession();

  const details = [
    `${sessionDay(session.createdAt)} • ${sessionTime(session.createdAt)}`,
    session.ipAddress ? `IP: ${session.ipAddress}` : null,
    session.active ? null : endedLabel(session.endedAt),
  ].filter(Boolean);

  return (
    <li className="flex items-center gap-lg bg-white p-md">
      <div
        className={`flex min-w-0 flex-1 items-center gap-md ${session.active ? "" : "opacity-60"}`}
      >
        <span className="flex size-10 flex-none items-center justify-center rounded-full border border-grey-200 bg-white text-grey-900">
          <HugeiconsIcon
            icon={device.kind === "mobile" ? SmartPhone01Icon : ComputerIcon}
            size={20}
          />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="flex items-center gap-xs text-body/[1.5] font-medium text-grey-900">
            {device.label}
            {session.current ? <Badge>This device</Badge> : null}
          </p>
          <p className="text-body-sm/[normal] text-grey-600">
            {details.join(" • ")}
          </p>
        </div>
      </div>

      {session.active ? (
        <SessionMenu onSignOut={() => setConfirming(true)} />
      ) : null}

      {confirming ? (
        <ConfirmDialog
          title={
            session.current
              ? "Sign out of this device?"
              : "Sign out this device?"
          }
          confirmLabel="Sign out"
          confirmVariant="destructive"
          loading={isPending}
          onConfirm={() =>
            revoke(session, { onSettled: () => setConfirming(false) })
          }
          onClose={() => setConfirming(false)}
        >
          {session.current
            ? "This is the browser you're using now, so you'll need to sign in again."
            : `${device.label} will be signed out and will need to sign in again to access your account.`}
        </ConfirmDialog>
      ) : null}
    </li>
  );
}
