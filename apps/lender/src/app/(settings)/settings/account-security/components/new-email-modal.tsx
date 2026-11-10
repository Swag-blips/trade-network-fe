"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { FormDialog } from "@/components/form-dialog";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** No email-change endpoint yet, so Save only closes the dialog. */
export function NewEmailModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const valid = EMAIL.test(email.trim());

  return (
    <FormDialog
      title="Enter new email"
      className="w-110.5"
      onClose={onClose}
      onSubmit={() => {
        if (valid) onSave(email.trim());
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
            disabled={!valid}
          >
            Save
          </Button>
        </>
      }
    >
      <p className="text-body/[1.5] text-grey-600">
        Enter the new email you want to change your old email.
      </p>
      <Field label="New email" htmlFor="new-email" variant="auth">
        <Input
          id="new-email"
          type="email"
          variant="auth"
          autoComplete="email"
          placeholder="Enter new email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Field>
    </FormDialog>
  );
}
