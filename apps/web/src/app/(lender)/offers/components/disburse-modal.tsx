"use client";

import { useState } from "react";
import { ConfirmModal } from "@/components/confirm-modal";
import { UploadDropzone } from "@/components/upload-dropzone";

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
      <UploadDropzone file={proof} onFileChange={setProof} />
    </ConfirmModal>
  );
}
