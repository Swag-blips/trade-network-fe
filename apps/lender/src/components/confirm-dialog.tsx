"use client";

import type { ReactNode } from "react";
import { Button, type ButtonVariant } from "@repo/ui/button";
import { FormDialog } from "./form-dialog";

export function ConfirmDialog({
  title,
  confirmLabel,
  confirmVariant = "primary",
  loading = false,
  onConfirm,
  onClose,
  children,
}: {
  title: string;
  confirmLabel: string;
  confirmVariant?: ButtonVariant;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <FormDialog
      title={title}
      className="w-113.25"
      onClose={onClose}
      onSubmit={onConfirm}
      footer={
        <>
          <Button
            type="button"
            variant="tertiary"
            size="auth"
            onClick={onClose}
          >
            Cancel
          </Button>
          <span aria-hidden className="h-6.5 w-px bg-grey-200" />
          <Button
            type="submit"
            variant={confirmVariant}
            size="auth"
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-body/[1.5] text-grey-600">{children}</p>
    </FormDialog>
  );
}
