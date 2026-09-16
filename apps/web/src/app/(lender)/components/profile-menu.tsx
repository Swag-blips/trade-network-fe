"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Logout01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { UserAvatar } from "@/components/avatars";

export function ProfileMenu({ name, email }: { name: string; email: string }) {
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
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-xs rounded-full focus-visible:outline-2 focus-visible:outline-evergreen-600 focus-visible:outline-offset-2"
      >
        <UserAvatar name={name} size={24} />
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          className="text-grey-900"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-xs w-69.5 overflow-hidden rounded-md border border-grey-200 bg-white shadow-small-thick"
        >
          <div className="flex items-center gap-sm border-b border-grey-100 p-md">
            <UserAvatar name={name} size={32} />
            <div className="flex min-w-0 flex-col">
              <p className="truncate font-sans text-body-sm/[normal] font-medium text-grey-900">
                {name}
              </p>
              <p className="truncate text-caption text-grey-500">{email}</p>
            </div>
          </div>
          <div className="flex flex-col p-xs">
            <Link
              href="/settings/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-sm rounded-md px-sm py-2.5 text-body-sm/[normal] text-grey-900 hover:bg-grey-50"
            >
              <HugeiconsIcon icon={UserCircleIcon} size={20} />
              Account settings
            </Link>
            <button
              type="button"
              role="menuitem"
              className="flex items-center gap-sm rounded-md px-sm py-2.5 text-left text-body-sm/[normal] text-grey-500 hover:bg-grey-50"
            >
              <HugeiconsIcon icon={Logout01Icon} size={20} />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
