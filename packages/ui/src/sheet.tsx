"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { IconButton } from "./icon-button";

export function Sheet({
  title,
  icon,
  onClose,
  children,
}: {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="mt-0 mr-0 mb-0 ml-auto h-full max-h-full w-136 max-w-full overflow-y-auto bg-white p-0 backdrop:bg-grey-900/40"
    >
      <header className="flex w-full items-center gap-md border-b border-grey-100 px-lg py-md">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {icon}
          <h2 id={titleId} className="font-sans text-body/[normal] text-black">
            {title}
          </h2>
        </div>
        <IconButton label="Close" size="xs" onClick={onClose}>
          <HugeiconsIcon icon={Cancel01Icon} />
        </IconButton>
      </header>

      {children}
    </dialog>
  );
}
