"use client";

import { useEffect, useRef, type Ref } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailValidation02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { FieldError } from "@repo/ui/field";
import { OtpInput } from "@repo/ui/otp-input";
import { OTP_LENGTH } from "@/utils/otp";
import { formatWait } from "../utils/wait";

type Address = "current" | "new" | "account";

const INTRO: Record<Address, string> = {
  current:
    "Confirm that it’s you by entering the OTP that was sent to your old email: ",
  new: "Enter the OTP that was sent to your new email: ",
  account:
    "Confirm that it’s you by entering the OTP that was sent to your email: ",
};

export function VerifyEmailModal({
  email,
  address,
  value,
  onChange,
  inputRef,
  error,
  ready,
  verifying,
  resending,
  verifyIn,
  resendIn,
  onResend,
  onVerify,
  onClose,
}: {
  email: string;
  address: Address;
  value: string[];
  onChange: (value: string[]) => void;
  inputRef?: Ref<HTMLInputElement>;
  error?: string;
  /** False until the code has been sent and there is a challenge to answer. */
  ready: boolean;
  verifying: boolean;
  resending: boolean;
  verifyIn: number;
  resendIn: number;
  onResend: () => void;
  onVerify: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const complete = value.join("").length === OTP_LENGTH;

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="verify-email-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-110.75 max-w-[calc(100vw-2rem)] rounded-xl border border-grey-100 bg-white p-0 shadow-card backdrop:bg-grey-900/40"
    >
      <form
        className="flex flex-col items-start gap-lg p-lg"
        onSubmit={(event) => {
          event.preventDefault();
          if (ready && complete && !verifying && verifyIn === 0) onVerify();
        }}
      >
        <HugeiconsIcon
          icon={MailValidation02Icon}
          size={32}
          className="text-grey-900"
        />

        <div className="flex w-full flex-col gap-xs">
          <h2
            id="verify-email-title"
            className="font-brand text-2xl/[1.5] font-medium text-grey-900"
          >
            Verify your email
          </h2>
          <p className="text-body/[1.5] text-grey-600">
            {INTRO[address]}
            <span className="font-medium text-grey-800">{email}</span>
          </p>
        </div>

        <div className="flex w-full flex-col gap-xl">
          <div className="flex w-full flex-col gap-md">
            <div className="flex w-full flex-col gap-xs">
              <OtpInput ref={inputRef} value={value} onChange={onChange} />
              {error ? <FieldError>{error}</FieldError> : null}
            </div>
            <p className="flex items-center gap-xs text-body-sm text-grey-900">
              Didn&rsquo;t receive the code?
              <button
                type="button"
                disabled={resending || resendIn > 0}
                onClick={onResend}
                className="cursor-pointer font-medium text-evergreen-600 disabled:cursor-default disabled:text-evergreen-600/40"
              >
                {resendIn > 0
                  ? `Resend code in ${formatWait(resendIn)}`
                  : "Resend code"}
              </button>
            </p>
          </div>

          <div className="flex justify-end gap-md">
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
              className="w-24"
              loading={verifying}
              disabled={!ready || !complete || verifyIn > 0}
            >
              Verify
            </Button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
