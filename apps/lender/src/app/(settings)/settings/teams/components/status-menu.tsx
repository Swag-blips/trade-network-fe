"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Clock01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import type { MemberStatus as Status } from "@/types/team";

const DOT: Partial<Record<Status, string>> = {
  Active: "bg-green-500",
  Deactivated: "bg-grey-400",
};

const CLOCK: Partial<Record<Status, string>> = {
  Pending: "text-grey-600",
  Expired: "text-red-error-400",
};

const ITEM =
  "flex w-full cursor-pointer items-center gap-xs rounded-md px-xs py-1 text-left text-body-sm/[1.5] font-medium hover:bg-grey-100";

export interface StatusAction {
  label: string;
  danger?: boolean;
  onSelect: () => void;
}

export function StatusLabel({ status }: { status: Status }) {
  const clock = CLOCK[status];
  return clock ? (
    <span className="flex items-center gap-1">
      <HugeiconsIcon
        icon={Clock01Icon}
        size={16}
        className={`flex-none ${clock}`}
      />
      {status}
    </span>
  ) : (
    <span className="flex items-center gap-xs">
      <span className={`size-2 flex-none rounded-full ${DOT[status]}`} />
      {status}
    </span>
  );
}

export function StatusMenu({
  status,
  actions,
  divided = false,
}: {
  status: Status;
  actions: StatusAction[];
  divided?: boolean;
}) {
  const [at, setAt] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const open = at !== null;

  useEffect(() => {
    if (!open) return;

    function close() {
      setAt(null);
    }
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) close();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <div ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Status: ${status}`}
        onClick={(event) => {
          if (open) return setAt(null);
          const rect = event.currentTarget.getBoundingClientRect();
          setAt({ top: rect.bottom + 4, left: rect.left });
        }}
        className="flex cursor-pointer items-center gap-xs rounded-md text-grey-800"
      >
        <StatusLabel status={status} />
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
      </button>
      {at ? (
        // Fixed, so the outlined table's overflow-hidden can't clip it.
        <div
          role="menu"
          style={at}
          className="fixed z-20 flex w-34.5 flex-col gap-xs rounded-lg border border-grey-200 bg-white p-xs shadow-thick"
        >
          <button
            type="button"
            role="menuitemradio"
            aria-checked
            onClick={() => setAt(null)}
            className={`${ITEM} text-grey-800`}
          >
            <span className="flex-1">{status}</span>
            <HugeiconsIcon icon={Tick01Icon} size={16} />
          </button>
          {divided ? <hr aria-hidden className="border-grey-200" /> : null}
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setAt(null);
                action.onSelect();
              }}
              className={`${ITEM} ${action.danger ? "text-red-error-400" : "text-grey-800"}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
