"use client";

import { Button } from "@repo/ui/button";
import { FormDialog } from "@/components/form-dialog";

const DELETED = [
  "Your account and company profile",
  "Your funding and investment preferences",
  "Your saved opportunities and negotiation history",
  "Your account settings and preferences",
];

export function DeleteAccountModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <FormDialog
      title="Delete your account"
      className="w-145.5"
      onClose={onClose}
      onSubmit={onConfirm}
      footer={
        <>
          <Button
            type="button"
            variant="tertiary"
            size="form"
            className="w-22"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" variant="destructive" size="auth">
            Delete account
          </Button>
        </>
      }
    >
      <p className="text-body/[1.5] text-grey-600">
        Deleting your account will permanently remove your access to
        TradeNetwork and associated business data.
      </p>

      <div className="flex flex-col gap-xs">
        <p className="text-body/[1.5] font-medium text-grey-800">
          What will be deleted:
        </p>
        <ul className="flex flex-col gap-xs">
          {DELETED.map((item) => (
            <li
              key={item}
              className="flex items-center gap-md text-body/[1.5] text-grey-600"
            >
              <span
                aria-hidden
                className="size-2 flex-none rounded-full bg-grey-900"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="rounded-md border border-grey-200 bg-grey-50 px-md py-2.5 text-body/[1.5] text-grey-600">
        You have <strong className="font-medium text-grey-800">7 days</strong>{" "}
        to cancel your account deletion request. After this period, your account
        will be permanently deleted, and this action cannot be undone.
      </p>
    </FormDialog>
  );
}
