"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  HelpCircleIcon,
  LinkSquare02Icon,
  Logout01Icon,
  OfficeIcon,
  Settings01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { UserAvatar } from "@repo/ui/avatars";
import { useMe } from "@/hooks/use-me";
import { useLogout } from "@/hooks/use-logout";
import { useOrganization } from "@/hooks/use-organization";
import { usePermission } from "@/hooks/use-permission";
import { InviteDialog } from "@/components/invite-dialog";
import { TextPlaceholder } from "@/components/text-placeholder";
import { DEFAULT_PHOTO } from "@/utils/avatar";

const MENU_ITEM =
  "flex w-full cursor-pointer items-center gap-xs rounded-md px-xs py-1 text-left text-body-sm/[1.5] font-medium hover:bg-grey-100 [&>svg]:flex-none";

export function OrgMenu() {
  const { data: profile, isPending } = useMe();
  const { data: organization, isPending: orgPending } = useOrganization();
  const { mutate: logout, isPending: signingOut } = useLogout();
  const firstName = profile?.firstName ?? "";
  const orgName = organization?.name ?? "";

  const canInvite = usePermission("team:manage");

  const [open, setOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
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
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-sm rounded-md bg-white px-xs py-1 transition-colors hover:bg-grey-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-evergreen-600 aria-expanded:bg-grey-100"
      >
        <span className="flex items-center gap-xs">
          <UserAvatar src={DEFAULT_PHOTO} name={firstName} size={32} />
          <span className="flex max-w-40 flex-col items-start">
            <span className="text-body-sm/[1.5] font-medium whitespace-nowrap text-grey-800">
              {isPending ? (
                <TextPlaceholder className="w-24" />
              ) : (
                `Welcome, ${firstName}`
              )}
            </span>
            <span className="flex w-full items-center gap-1 text-grey-500">
              <HugeiconsIcon
                icon={OfficeIcon}
                size={12}
                className="flex-none"
              />
              <span className="min-w-0 truncate text-caption/[normal]">
                {orgPending ? <TextPlaceholder className="w-16" /> : orgName}
              </span>
            </span>
          </span>
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={20}
          className="flex-none text-grey-600"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-20 mt-xs flex w-74 flex-col gap-xs overflow-hidden rounded-lg border border-grey-200 bg-white p-xs shadow-thick"
        >
          {canInvite ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                setInviting(true);
              }}
              className={`${MENU_ITEM} text-grey-800`}
            >
              <HugeiconsIcon icon={UserAdd01Icon} size={20} />
              Invite team members
            </button>
          ) : null}
          <Link
            href="/settings/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`${MENU_ITEM} text-grey-800`}
          >
            <HugeiconsIcon icon={Settings01Icon} size={20} />
            Settings
          </Link>
          {/* Help has no destination yet. */}
          <button
            type="button"
            role="menuitem"
            className={`${MENU_ITEM} text-grey-800`}
          >
            <HugeiconsIcon icon={HelpCircleIcon} size={20} />
            <span className="min-w-0 flex-1">Get help and support</span>
            <HugeiconsIcon
              icon={LinkSquare02Icon}
              size={16}
              className="text-grey-500"
            />
          </button>
          <hr className="border-grey-100" />
          <button
            type="button"
            role="menuitem"
            disabled={signingOut}
            onClick={() => logout()}
            className={`${MENU_ITEM} text-red-error-500 disabled:cursor-wait disabled:opacity-60`}
          >
            <HugeiconsIcon icon={Logout01Icon} size={20} />
            Sign out
          </button>
        </div>
      ) : null}

      {inviting ? <InviteDialog onClose={() => setInviting(false)} /> : null}
    </div>
  );
}
