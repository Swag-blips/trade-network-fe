"use client";

import { useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { IconButton } from "@repo/ui/icon-button";
import { Input } from "@repo/ui/input";
import { FormDialog } from "@/components/form-dialog";
import { Notice } from "@/components/notice";
import { useFieldErrors } from "@/hooks/use-field-errors";
import { useRequestDocuments } from "../hooks/use-request-documents";
import { isFormError } from "../utils/negotiation";
import type { DocumentRequestResponse } from "../types/inbox";

const MAX_DOCUMENTS = 10;

type Row = { id: number; value: string };

function DocumentRow({
  index,
  row,
  error,
  onChange,
  onRemove,
}: {
  index: number;
  row: Row;
  error?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
}) {
  const id = useId();

  return (
    <div className="flex items-start gap-lg">
      <Field
        label={`Document ${index + 1}`}
        htmlFor={id}
        variant="auth"
        className="flex-1"
        error={error}
      >
        <Input
          id={id}
          variant="strong"
          value={row.value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="e.g. Signed purchase order"
          maxLength={200}
          autoFocus={index > 0}
        />
      </Field>
      <div className="w-5 flex-none pt-10">
        {onRemove ? (
          <IconButton
            label={`Remove document ${index + 1}`}
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

export function RequestInfoModal({
  opportunityId,
  onClose,
  onSent,
}: {
  opportunityId: string;
  onClose: () => void;
  onSent: (request: DocumentRequestResponse) => void;
}) {
  const { mutate: requestDocuments, isPending } = useRequestDocuments(
    opportunityId,
    onSent,
  );
  const [rows, setRows] = useState<Row[]>([{ id: 0, value: "" }]);
  const documents = rows.map((row) => row.value.trim()).filter(Boolean);
  const filled = rows.filter((row) => row.value.trim() !== "");
  const fieldErrors = useFieldErrors([
    ...filled.map((_, index) => `documents/${index}`),
    "documents",
  ]);

  // The API numbers the documents it was sent, which skips blank rows.
  function errorFor(row: Row) {
    const index = filled.indexOf(row);
    const own = index === -1 ? undefined : fieldErrors.errors[`documents/${index}`];
    return own ?? (row === rows[0] ? fieldErrors.errors.documents : undefined);
  }

  return (
    <FormDialog
      title="Request for info?"
      className="w-159.75"
      onClose={onClose}
      onSubmit={() => {
        if (documents.length === 0 || isPending) return;
        fieldErrors.reset();
        requestDocuments(documents, {
          onError: (error) => {
            fieldErrors.show(error);
            if (!isFormError(error)) onClose();
          },
        });
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
            disabled={documents.length === 0}
          >
            Send request
          </Button>
        </>
      }
    >
      <p className="text-body/[1.5] text-grey-600">
        Specify the documents you need from the enterprise to review this
        financing opportunity.
      </p>

      <div className="flex flex-col items-start gap-lg">
        <div className="flex flex-col gap-lg self-stretch">
          {rows.map((row, index) => (
            <DocumentRow
              key={row.id}
              index={index}
              row={row}
              error={errorFor(row)}
              onChange={(value) => {
                fieldErrors.reset();
                setRows((current) =>
                  current.map((item) =>
                    item.id === row.id ? { ...item, value } : item,
                  ),
                );
              }}
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
        </div>
        {rows.length < MAX_DOCUMENTS ? (
          <Button
            type="button"
            variant="tertiary"
            size="form"
            leadingIcon={<HugeiconsIcon icon={Add01Icon} />}
            onClick={() =>
              setRows((current) => [
                ...current,
                {
                  id: Math.max(...current.map((item) => item.id)) + 1,
                  value: "",
                },
              ])
            }
          >
            Add another document
          </Button>
        ) : null}
      </div>

      <Notice>
        Once sent, a negotiation will start with this enterprise. You&apos;ll be
        taken to your inbox to continue the conversation.
      </Notice>
    </FormDialog>
  );
}
