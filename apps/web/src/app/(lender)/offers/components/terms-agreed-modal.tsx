"use client";

import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { HandshakeIcon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { InitialsAvatar, OrgAvatar } from "@/components/avatars";

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex flex-col items-center justify-center gap-xs whitespace-nowrap">
      <span className="text-center font-mono text-[2rem]/[normal] tabular-nums text-red-error-500">
        {value}
      </span>
      <span className="text-body text-grey-800">{label}</span>
    </span>
  );
}

export function TermsAgreedModal({
  initials,
  hours,
  minutes,
  onDisburse,
  onClose,
}: {
  initials: string;
  hours: number;
  minutes: number;
  onDisburse: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="terms-agreed-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-113.25 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-white p-0 backdrop:bg-grey-900/40"
    >
      <div className="relative h-33.5 w-full overflow-hidden">
        <span
          aria-hidden
          className="absolute -top-6.75 left-1/2 h-[252.257px] w-81.75 -translate-x-1/2 bg-[url(/confetti.svg)] bg-center bg-no-repeat"
        />
        <div className="absolute top-1/2 left-1/2 h-20 w-[136.25px] -translate-x-1/2 -translate-y-1/2">
          <span className="absolute top-0 -left-2.5 shadow-xs">
            <OrgAvatar name="Trade Network" size={80} />
          </span>
          <span className="absolute top-0 left-[66.25px] shadow-xs">
            <InitialsAvatar initials={initials} size={80} />
          </span>
          <span className="absolute top-6.25 left-13.5 flex size-[33.333px] items-center justify-center rounded-full bg-green-600 text-white ring-[3px] ring-white">
            <HugeiconsIcon icon={HandshakeIcon} size={20} />
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-lg px-5 pt-1 pb-md text-center">
        <h2
          id="terms-agreed-title"
          className="w-full font-sans text-[1.25rem]/[normal] font-medium text-grey-900"
        >
          Terms have been agreed
        </h2>
        <p className="w-full text-body text-grey-800">
          The final terms are confirmed. Complete the disbursement within the
          required funding window.
        </p>
        <div className="flex w-47.5 flex-col gap-md overflow-hidden rounded-lg border border-grey-100 bg-grey-50 px-md py-2.5">
          <p className="w-full text-center font-sans text-caption/[normal] font-medium text-grey-500 uppercase">
            Funding window
          </p>
          <div className="flex w-full items-center justify-center gap-2.5">
            <Unit value={String(hours).padStart(2, "0")} label="Hours" />
            <span className="w-8 text-center font-mono text-[2rem]/[normal] text-red-error-500">
              :
            </span>
            <Unit value={String(minutes).padStart(2, "0")} label="Mins" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 px-5 py-md">
        <Button size="form" className="flex-1" onClick={onDisburse}>
          Disburse funds
        </Button>
        <Button
          variant="outline"
          size="form"
          className="flex-1"
          onClick={onClose}
        >
          Dismiss
        </Button>
      </div>
    </dialog>
  );
}
