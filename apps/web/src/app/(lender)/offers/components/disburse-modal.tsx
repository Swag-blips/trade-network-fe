"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CloudUploadIcon } from "@hugeicons/core-free-icons";
import { ConfirmModal } from "@/components/confirm-modal";

export function DisburseModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [proof, setProof] = useState<string | null>(null);

  return (
    <ConfirmModal
      title="Confirm disbursement of funds"
      confirmLabel="Confirm"
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <p className="text-body text-grey-800">
        Upload a receipt or transfer confirmation showing that the agreed funds
        have been disbursed
      </p>
      <label className="flex h-[148px] w-full cursor-pointer flex-col items-center justify-center gap-md overflow-hidden rounded-lg border border-dashed border-green-200 bg-green-50 text-center hover:border-green-500">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="sr-only"
          onChange={(event) => setProof(event.target.files?.[0]?.name ?? null)}
        />
        <HugeiconsIcon
          icon={CloudUploadIcon}
          size={32}
          className="text-green-600"
        />
        <span className="flex w-[253px] flex-col gap-sm">
          <span className="font-sans text-body/[normal] font-medium text-grey-800">
            {proof ?? "Upload proof"}
          </span>
          <span className="text-body-sm text-grey-500">
            PDF, PNG or JPG - Max 10 MB
          </span>
        </span>
      </label>
    </ConfirmModal>
  );
}
