"use client";

import type { Ref } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  MailValidation02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { FieldError } from "@repo/ui/field";
import { IconButton } from "@repo/ui/icon-button";
import { OtpInput } from "@repo/ui/otp-input";
import { OTP_LENGTH } from "@/utils/otp";
import { AuthCard } from "./auth-card";

export function CodeStep({
  email,
  value,
  onChange,
  inputRef,
  error,
  busy,
  resending,
  onResend,
  onBack,
  onVerify,
}: {
  email: string;
  value: string[];
  onChange: (value: string[]) => void;
  inputRef?: Ref<HTMLInputElement>;
  error?: string;
  busy: boolean;
  resending: boolean;
  onResend: () => void;
  onBack: () => void;
  onVerify: () => void;
}) {
  const complete = value.join("").length === OTP_LENGTH;

  return (
    <AuthCard width="sm" className="items-start gap-lg">
      <HugeiconsIcon
        icon={MailValidation02Icon}
        size={32}
        className="text-grey-900"
      />

      <div className="flex w-full flex-col items-center gap-lg">
        <div className="flex w-full flex-col items-start gap-xs">
          <p className="w-full font-brand text-[24px] leading-normal font-medium text-grey-900">
            Verify your email
          </p>
          <p className="w-full text-body text-grey-600">
            We&rsquo;ve sent an email with a verification code to{" "}
            <span className="font-medium text-grey-800">{email}</span>
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-xl">
          <div className="flex w-full flex-col items-start gap-md">
            <div className="flex w-full flex-col gap-xs">
              <OtpInput ref={inputRef} value={value} onChange={onChange} />
              {error ? <FieldError>{error}</FieldError> : null}
            </div>
            <p className="flex items-center gap-xs text-body-sm text-grey-900">
              Didn&rsquo;t receive the code?{" "}
              <button
                type="button"
                disabled={resending}
                onClick={onResend}
                className="font-medium text-evergreen-600 disabled:text-evergreen-600/40"
              >
                Resend code
              </button>
            </p>
          </div>

          <div className="flex w-full items-center justify-between">
            <IconButton
              label="Back"
              variant="tertiary"
              size="lg"
              onClick={onBack}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} />
            </IconButton>
            <Button
              variant="primary"
              disabled={!complete || busy}
              onClick={onVerify}
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </AuthCard>
  );
}
