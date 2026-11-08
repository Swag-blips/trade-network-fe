"use client";

import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { FormDialog } from "@/components/form-dialog";
import { formatWait } from "../utils/wait";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewEmailModal({
  email,
  onEmailChange,
  error,
  saving,
  retryIn,
  onSave,
  onClose,
}: {
  email: string;
  onEmailChange: (email: string) => void;
  error?: string;
  saving: boolean;
  retryIn: number;
  onSave: (email: string) => void;
  onClose: () => void;
}) {
  const valid = EMAIL.test(email.trim());

  return (
    <FormDialog
      title="Enter new email"
      className="w-110.5"
      onClose={onClose}
      onSubmit={() => {
        if (valid && !saving && retryIn === 0) onSave(email.trim());
      }}
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
          <Button
            type="submit"
            size="form"
            className="w-27.5"
            loading={saving}
            disabled={!valid || retryIn > 0}
          >
            Save
          </Button>
        </>
      }
    >
      <p className="text-body/[1.5] text-grey-600">
        Enter the new email you want to change your old email.
      </p>
      <Field
        label="New email"
        htmlFor="new-email"
        variant="auth"
        error={
          error ??
          (retryIn > 0
            ? `Too many requests. Try again in ${formatWait(retryIn)}.`
            : undefined)
        }
      >
        <Input
          id="new-email"
          type="email"
          variant="auth"
          autoComplete="email"
          placeholder="Enter new email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
        />
      </Field>
    </FormDialog>
  );
}
