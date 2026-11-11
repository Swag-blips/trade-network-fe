"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailValidation02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { OtpInput } from "@repo/ui/otp-input";
import { emptyOtp } from "@/utils/otp";

/** No email-change endpoint yet, so any six digits pass. */
export function VerifyEmailModal({
  email,
  onClose,
  onVerified,
}: {
  email: string;
  onClose: () => void;
  onVerified: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const firstDigit = useRef<HTMLInputElement>(null);
  const [digits, setDigits] = useState(emptyOtp);
  const complete = digits.every(Boolean);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function resend() {
    setDigits(emptyOtp());
    firstDigit.current?.focus();
  }

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
      <div className="flex flex-col items-start gap-lg p-lg">
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
            Confirm that it&rsquo;s you by entering the OTP that was sent to
            your old email:{" "}
            <span className="font-medium text-grey-800">{email}</span>
          </p>
        </div>

        <div className="flex w-full flex-col gap-xl">
          <div className="flex w-full flex-col gap-md">
            <OtpInput ref={firstDigit} value={digits} onChange={setDigits} />
            <p className="flex items-center gap-xs text-body-sm text-grey-900">
              Didn&rsquo;t receive the code?
              <button
                type="button"
                onClick={resend}
                className="cursor-pointer font-medium text-evergreen-600"
              >
                Resend code
              </button>
            </p>
          </div>

          <div className="flex justify-end gap-md">
            <Button
              variant="tertiary"
              size="form"
              className="w-22"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="form"
              className="w-24"
              disabled={!complete}
              onClick={onVerified}
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
