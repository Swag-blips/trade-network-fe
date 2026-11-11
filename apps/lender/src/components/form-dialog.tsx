"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { IconButton } from "@repo/ui/icon-button";

export function FormDialog({
  title,
  className,
  onClose,
  onSubmit,
  footer,
  children,
}: {
  title: string;
  className: string;
  onClose: () => void;
  onSubmit?: () => void;
  footer?: ReactNode;
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
      className={`m-auto max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-grey-100 bg-white p-0 backdrop:bg-grey-900/40 open:flex ${className}`}
    >
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.();
        }}
      >
        <header className="flex items-center gap-sm border-b border-grey-200 bg-grey-50 px-lg py-md">
          <h2
            id={titleId}
            className="min-w-0 flex-1 font-sans text-[1.25rem]/[normal] font-medium text-grey-900"
          >
            {title}
          </h2>
          <IconButton label="Close" size="xs" onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} />
          </IconButton>
        </header>

        <div className="flex min-h-0 flex-col gap-lg overflow-y-auto px-lg py-md">
          {children}
        </div>

        {footer ? (
          <footer className="flex items-center justify-end gap-md border-t border-grey-100 px-lg py-md">
            {footer}
          </footer>
        ) : null}
      </form>
    </dialog>
  );
}
