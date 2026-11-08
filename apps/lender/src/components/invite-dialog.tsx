"use client";

import { useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { IconButton } from "@repo/ui/icon-button";
import { Input } from "@repo/ui/input";
import { Select, type SelectOption } from "@repo/ui/select";
import { readProblemType } from "@/api/client";
import { FormDialog } from "@/components/form-dialog";
import { useFieldErrors } from "@/hooks/use-field-errors";
import { useInviteMembers } from "@/hooks/use-invite-members";
import { useMembers } from "@/hooks/use-members";
import { useRoles } from "@/hooks/use-roles";

const MAX_INVITES = 10;
const DEFAULT_ROLE = "Admin";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Row = { id: number; email: string; roleId: string; touched: boolean };

const newRow = (id: number): Row => ({
  id,
  email: "",
  roleId: "",
  touched: false,
});

function InviteRow({
  index,
  row,
  roleId,
  roles,
  emailError,
  roleError,
  onChange,
  onRemove,
}: {
  index: number;
  row: Row;
  roleId: string;
  roles: SelectOption[];
  emailError?: string;
  roleError?: string;
  onChange: (patch: Partial<Row>) => void;
  onRemove?: () => void;
}) {
  const emailId = useId();
  const roleFieldId = useId();

  return (
    <div className="flex items-start gap-lg self-stretch">
      <Field
        label="Email"
        htmlFor={emailId}
        variant="auth"
        className="min-w-0 flex-1"
        error={emailError}
      >
        <Input
          id={emailId}
          type="email"
          variant="auth"
          value={row.email}
          onChange={(event) => onChange({ email: event.target.value })}
          onBlur={() => onChange({ touched: true })}
          placeholder="name@company.com"
          autoComplete="off"
          autoFocus
        />
      </Field>
      <Field
        label="Role"
        htmlFor={roleFieldId}
        variant="auth"
        className="min-w-0 flex-1"
        error={roleError}
      >
        <Select
          id={roleFieldId}
          variant="strong"
          value={roleId}
          onValueChange={(value) => onChange({ roleId: value })}
          options={roles}
          placeholder="Choose a role"
          disabled={roles.length === 0}
        />
      </Field>
      <div className="w-5 flex-none pt-10">
        {onRemove ? (
          <IconButton
            label={`Remove invite ${index + 1}`}
            size="xs"
            onClick={onRemove}
          >
            <HugeiconsIcon icon={Delete02Icon} className="text-red-error-500" />
          </IconButton>
        ) : null}
      </div>
    </div>
  );
}

export function InviteDialog({ onClose }: { onClose: () => void }) {
  const { members } = useMembers();
  const { mutate: invite, isPending } = useInviteMembers(onClose);
  const { data: allRoles = [] } = useRoles();
  const [rows, setRows] = useState<Row[]>([newRow(0)]);
  const fieldErrors = useFieldErrors([
    ...rows.flatMap((_, index) => [
      `invitations/${index}/email`,
      `invitations/${index}/roleId`,
    ]),
    "invitations",
  ]);
  const { errors } = fieldErrors;

  const roles = allRoles
    .filter((role) => role.name !== "Owner")
    .map((role) => ({ value: role.id, label: role.name }));
  const fallbackRole =
    roles.find((role) => role.label === DEFAULT_ROLE)?.value ??
    roles[0]?.value ??
    "";
  const roleOf = (row: Row) => row.roleId || fallbackRole;

  const joined = new Set(
    members
      .filter((member) => !member.invitation)
      .map((member) => member.email.toLowerCase()),
  );
  const emails = rows.map((row) => row.email.trim().toLowerCase());

  function checkFor(row: Row, index: number) {
    const email = emails[index]!;
    if (!email) return undefined;
    if (joined.has(email)) return "This person is already on your team";
    if (emails.indexOf(email) !== index) return "This email is already listed";
    if (row.touched && !EMAIL.test(email)) return "Enter a valid email address";
    return undefined;
  }

  const ready =
    fallbackRole !== "" &&
    rows.every(
      (row, index) => EMAIL.test(emails[index]!) && !checkFor(row, index),
    );

  function update(id: number, patch: Partial<Row>) {
    const index = rows.findIndex((row) => row.id === id);
    if ("email" in patch) fieldErrors.clear(`invitations/${index}/email`);
    if ("roleId" in patch) fieldErrors.clear(`invitations/${index}/roleId`);
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  return (
    <FormDialog
      title="Invite team members"
      className="w-159.75"
      onClose={onClose}
      onSubmit={() => {
        if (!ready || isPending) return;
        fieldErrors.reset();
        invite(
          rows.map((row, index) => ({
            email: emails[index]!,
            roleId: roleOf(row),
          })),
          {
            onError: (error) => {
              fieldErrors.show(error);
              const type = readProblemType(error);
              if (type !== "validation-failed" && type !== "rate-limited") {
                onClose();
              }
            },
          },
        );
      }}
      footer={
        <>
          <Button
            type="button"
            variant="tertiary"
            size="compact"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="compact"
            loading={isPending}
            disabled={!ready}
          >
            Send invites
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-start gap-lg pt-xs">
        {rows.map((row, index) => (
          <InviteRow
            key={row.id}
            index={index}
            row={row}
            roleId={roleOf(row)}
            roles={roles}
            emailError={
              checkFor(row, index) ??
              errors[`invitations/${index}/email`] ??
              (index === 0 ? errors.invitations : undefined)
            }
            roleError={errors[`invitations/${index}/roleId`]}
            onChange={(patch) => update(row.id, patch)}
            onRemove={
              index === 0
                ? undefined
                : () => {
                    fieldErrors.reset();
                    setRows((current) =>
                      current.filter((item) => item.id !== row.id),
                    );
                  }
            }
          />
        ))}
        {rows.length < MAX_INVITES ? (
          <Button
            type="button"
            variant="tertiary"
            size="form"
            leadingIcon={<HugeiconsIcon icon={Add01Icon} />}
            onClick={() =>
              setRows((current) => [
                ...current,
                newRow(Math.max(...current.map((item) => item.id)) + 1),
              ])
            }
          >
            Add
          </Button>
        ) : null}
      </div>
    </FormDialog>
  );
}
