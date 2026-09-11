"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button, type ButtonVariant } from "@repo/ui/button";
import { IconButton } from "@repo/ui/icon-button";

export function ConfirmModal({
  title,
  confirmLabel,
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  confirmIcon,
  confirmDisabled = false,
  onClose,
  onConfirm,
  children,
}: {
  title: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  confirmIcon?: ReactNode;
  confirmDisabled?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-[453px] max-w-[calc(100vw-2rem)] overflow-visible rounded-xl bg-white p-0 backdrop:bg-grey-900/40"
    >
      <header className="flex items-center gap-xs px-5 py-md">
        <h2
          id="confirm-title"
          className="min-w-0 flex-1 font-sans text-[1.25rem]/[normal] font-medium text-grey-900"
        >
          {title}
        </h2>
        <IconButton label="Close" size="xs" onClick={onClose}>
          <HugeiconsIcon icon={Cancel01Icon} />
        </IconButton>
      </header>

      <div className="flex flex-col gap-lg px-5 pt-1 pb-md">{children}</div>

      <footer className="flex items-center justify-end gap-2.5 border-t border-grey-100 px-5 py-md">
        <Button variant="ghost" size="form" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          variant={confirmVariant}
          size="form"
          disabled={confirmDisabled}
          onClick={onConfirm}
          trailingIcon={confirmIcon}
        >
          {confirmLabel}
        </Button>
      </footer>
    </dialog>
  );
}
