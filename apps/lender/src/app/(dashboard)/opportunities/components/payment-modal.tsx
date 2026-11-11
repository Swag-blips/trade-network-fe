"use client";

import { useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BankIcon, Copy01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { IconButton } from "@repo/ui/icon-button";
import { useToast } from "@repo/ui/toast";
import { UploadDropzone } from "@repo/ui/upload-dropzone";
import { FormDialog } from "@/components/form-dialog";
import { withKobo } from "@/utils/naira";

function Step({
  title,
  description,
  divided = false,
  children,
}: {
  title: string;
  description: string;
  divided?: boolean;
  children: ReactNode;
}) {
  return (
    <li
      className={`flex flex-col gap-md ${divided ? "border-t border-grey-100 pt-lg" : ""}`}
    >
      <div className="flex flex-col gap-xs">
        <h3 className="font-sans text-body/[normal] font-medium text-grey-900">
          {title}
        </h3>
        <p className="text-body/[1.5] text-grey-600">{description}</p>
      </div>
      {children}
    </li>
  );
}

function AccountRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value?: string;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-center gap-10.5 py-xs text-body/[1.4]">
      <dt className="w-41 flex-none text-grey-600">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2.5 text-grey-900">
        {value ?? "—"}
        {value && onCopy ? (
          <IconButton
            label={`Copy ${label.toLowerCase()}`}
            size="2xs"
            className="text-evergreen-600"
            onClick={onCopy}
          >
            <HugeiconsIcon icon={Copy01Icon} />
          </IconButton>
        ) : null}
      </dd>
    </div>
  );
}

export function PaymentModal({
  beneficiary,
  amount,
  loading = false,
  onClose,
  onConfirm,
}: {
  beneficiary: string;
  amount: number;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { toast } = useToast();
  const [receipt, setReceipt] = useState<File | null>(null);

  function copy(value: string, what: string) {
    void navigator.clipboard.writeText(value);
    toast({ message: `${what} copied` });
  }

  return (
    <FormDialog
      title="Make payment"
      className="max-h-167 w-136.25"
      onClose={onClose}
      onSubmit={() => {
        if (receipt) onConfirm();
      }}
      footer={
        <>
          <Button
            type="button"
            variant="tertiary"
            size="auth"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="submit"
            size="auth"
            disabled={!receipt}
            loading={loading}
          >
            Confirm payment
          </Button>
        </>
      }
    >
      <ol className="flex flex-col gap-lg">
        <Step
          title="1. Make payment"
          description="Send the funds to the bank account below."
        >
          <div className="flex flex-col gap-md rounded-lg border border-grey-100 bg-grey-50 p-md">
            <p className="flex items-center gap-sm text-body/[normal] text-grey-900">
              <HugeiconsIcon icon={BankIcon} size={20} className="flex-none" />
              Bank account details
            </p>
            <dl className="flex flex-col gap-xs">
              <AccountRow label="Beneficiary name" value={beneficiary} />
              <AccountRow label="Bank name" />
              <AccountRow label="Account number" />
              <AccountRow
                label="Amount"
                value={`₦${withKobo(amount)}`}
                onCopy={() => copy(withKobo(amount), "Amount")}
              />
            </dl>
          </div>
        </Step>

        <Step
          divided
          title="2. Attach your receipt"
          description="Once the funds have been transferred, upload a screenshot or image of your proof of transfer"
        >
          <UploadDropzone
            variant="browse"
            file={receipt}
            onFileChange={setReceipt}
          />
        </Step>
      </ol>
    </FormDialog>
  );
}
