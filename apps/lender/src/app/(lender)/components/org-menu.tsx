"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UnfoldMoreIcon,
  Logout01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { OrgAvatar } from "@repo/ui/avatars";
import { useDashboardProfile } from "../hooks/use-dashboard-profile";
import { TextPlaceholder } from "./text-placeholder";

const ROLE = "Capital provider";

function OrgIdentity({ name, pending }: { name: string; pending: boolean }) {
  return (
    <>
      <OrgAvatar name={name} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <p className="truncate text-body-sm/[normal] text-grey-900">
          {pending ? <TextPlaceholder className="w-32" /> : name}
        </p>
        <p className="truncate text-caption text-grey-500">{ROLE}</p>
      </div>
    </>
  );
}

/** The sidebar's org card; opens the Settings / Sign out menu above it. */
export function OrgMenu() {
  const { data: profile, isPending } = useDashboardProfile();
  const name = profile?.profileName ?? "";

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
      {open ? (
        <div
          role="menu"
          className="absolute inset-x-0 bottom-full mb-2.5 overflow-hidden rounded-lg border border-grey-200 bg-white shadow-thick"
        >
          <div className="flex items-center gap-xs border-b border-grey-100 px-md py-2.5">
            <OrgIdentity name={name} pending={isPending} />
          </div>
          <div className="flex flex-col gap-xs p-xs">
            <Link
              href="/settings/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-xs rounded-md px-xs py-1 text-body-sm font-medium text-grey-800 hover:bg-grey-100"
            >
              <HugeiconsIcon icon={Settings01Icon} size={20} />
              Settings
            </Link>
            {/* Not wired: logout can't be called from the browser yet. */}
            <button
              type="button"
              role="menuitem"
              className="flex items-center gap-xs rounded-md px-xs py-1 text-left text-body-sm font-medium text-red-error-500 hover:bg-grey-100"
            >
              <HugeiconsIcon icon={Logout01Icon} size={20} />
              Sign out
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Organisation menu"
        onClick={() => setOpen(!open)}

        className="flex w-full items-center gap-xs rounded-lg p-xs transition-colors hover:bg-grey-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-evergreen-600 aria-expanded:bg-grey-200"
      >
        <OrgIdentity name={name} pending={isPending} />
        <HugeiconsIcon
          icon={UnfoldMoreIcon}
          size={20}
          className="flex-none text-grey-900"
        />
      </button>
    </div>
  );
}
