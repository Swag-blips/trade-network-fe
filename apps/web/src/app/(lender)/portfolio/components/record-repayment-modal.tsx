"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileTextIcon } from "@hugeicons/core-free-icons";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { ConfirmModal } from "@/components/confirm-modal";
import { UploadDropzone } from "@/components/upload-dropzone";
import type { FundedTrade } from "../types/customer";

export interface RepaymentDraft {
  tradeId: string;
  amount: string;
  evidence: string;
}

export function RecordRepaymentModal({
  trades,
  selectedTradeId,
  onClose,
  onSubmit,
}: {
  trades: FundedTrade[];
  selectedTradeId?: string;
  onClose: () => void;
  onSubmit: (draft: RepaymentDraft) => void;
}) {
  const [tradeId, setTradeId] = useState(selectedTradeId ?? "");
  const trade = trades.find((item) => item.id === tradeId);
  const [amount, setAmount] = useState(
    trade?.outstanding.replace("₦", "") ?? "",
  );
  const [evidence, setEvidence] = useState<string | null>(null);

  function selectTrade(next: string) {
    setTradeId(next);
    const picked = trades.find((item) => item.id === next);
    setAmount(picked ? picked.outstanding.replace("₦", "") : "");
  }

  return (
    <ConfirmModal
      title="Record repayment"
      width="lg"
      confirmLabel="Confirm repayment"
      confirmDisabled={!tradeId || !amount || !evidence}
      onClose={onClose}
      onConfirm={() => onSubmit({ tradeId, amount, evidence: evidence! })}
    >
      <p className="w-full text-body text-grey-800">
        Record a repayment of a funded trade.
      </p>

      <div className="flex w-full items-start gap-lg">
        <Field
          label="Select funded trade"
          required
          className="min-w-0 flex-1"
          hint={
            trade
              ? `${trade.outstanding} outstanding · ${trade.tradeRoom.buyer}`
              : undefined
          }
        >
          <Select
            aria-label="Select funded trade"
            value={tradeId}
            onValueChange={selectTrade}
            placeholder="Select---"
            options={trades.map((item) => ({
              value: item.id,
              label: `${item.id} — ${item.outstanding} · ${item.tradeRoom.buyer}`,
              display: item.id,
            }))}
            leading={
              tradeId ? (
                <span className="flex size-8 items-center justify-center rounded-full bg-evergreen-100">
                  <HugeiconsIcon
                    icon={FileTextIcon}
                    size={20}
                    className="text-evergreen-700"
                  />
                </span>
              ) : undefined
            }
          />
        </Field>

        <Field label="How much was paid?" required className="min-w-0 flex-1">
          <Input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            leading="₦"
            inputMode="decimal"
          />
        </Field>
      </div>

      <div className="flex w-full flex-col gap-md">
        <div className="flex w-full flex-col gap-1">
          <p className="font-sans text-body/[normal] font-medium text-grey-900">
            Upload evidence*
          </p>
          <p className="text-body-sm text-grey-800">
            Add an evidence of payment
          </p>
        </div>
        <UploadDropzone file={evidence} onFileChange={setEvidence} />
      </div>
    </ConfirmModal>
  );
}
