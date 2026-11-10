"use client";

import { Button } from "@repo/ui/button";
import { FormDialog } from "@/components/form-dialog";

export function NotInterestedModal({
  pending = false,
  onClose,
  onConfirm,
}: {
  pending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <FormDialog
      title="Not interested in this opportunity?"
      className="w-137.75"
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
            variant="destructive"
            size="auth"
            loading={pending}
          >
            Not interested
          </Button>
        </>
      }
    >
      <p className="text-body/[1.5] text-grey-600">
        This opportunity will be removed from your recommendations. You
        won&apos;t receive further updates about it.
      </p>
    </FormDialog>
  );
}
