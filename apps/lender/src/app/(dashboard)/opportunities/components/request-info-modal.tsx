"use client";

import { useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { IconButton } from "@repo/ui/icon-button";
import { Input } from "@repo/ui/input";
import { FormDialog } from "@/components/form-dialog";

type Row = { id: number; value: string };

function DocumentRow({
  index,
  row,
  onChange,
  onRemove,
}: {
  index: number;
  row: Row;
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
      >
        <Input
          id={id}
          variant="strong"
          value={row.value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="e.g. Signed purchase order"
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
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: (documents: string[]) => void;
}) {
  const [rows, setRows] = useState<Row[]>([{ id: 0, value: "" }]);
  const documents = rows.map((row) => row.value.trim()).filter(Boolean);

  return (
    <FormDialog
      title="Request for info?"
      className="w-159.75"
      onClose={onClose}
      onSubmit={() => {
        if (documents.length > 0) onSend(documents);
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
              onChange={(value) =>
                setRows((current) =>
                  current.map((item) =>
                    item.id === row.id ? { ...item, value } : item,
                  ),
                )
              }
              onRemove={
                index === 0
                  ? undefined
                  : () =>
                      setRows((current) =>
                        current.filter((item) => item.id !== row.id),
                      )
              }
            />
          ))}
        </div>
        <Button
          type="button"
          variant="tertiary"
          size="form"
          leadingIcon={<HugeiconsIcon icon={Add01Icon} />}
          onClick={() =>
            setRows((current) => [
              ...current,
              { id: Math.max(...current.map((item) => item.id)) + 1, value: "" },
            ])
          }
        >
          Add another document
        </Button>
      </div>

      <p className="border-l-4 border-orange-500 bg-orange-50 px-lg py-2.5 text-body/[1.5] text-grey-900">
        Once sent, a negotiation will start with this enterprise. You&apos;ll be
        taken to your inbox to continue the conversation.
      </p>
    </FormDialog>
  );
}
