"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  MailValidation02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { IconButton } from "@repo/ui/icon-button";
import { OtpInput } from "@repo/ui/otp-input";
import { useToast } from "@repo/ui/toast";
import { readChallengeId, saveChallengeId } from "@/lib/onboarding-storage";
import { clearLoginChallenge, readLoginChallenge } from "@/lib/login-storage";
import { useVerifyEmail } from "../hooks/use-verify-email";
import { useVerifyLogin } from "../hooks/use-verify-login";
import { useResendOtp } from "../hooks/use-resend-otp";
import { VerifyingOverlay } from "./verifying-overlay";
import { AuthCard } from "../../components/auth-card";

const CODE_LENGTH = 6;

export function VerifyEmailForm({
  email,
  redirectTo,
  flow = "signup",
}: {
  email: string;
  redirectTo?: string;
  /** Signing up verifies an onboarding record; logging in verifies a session. */
  flow?: "signup" | "login";
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: verifyEmail, isPending: verifying } = useVerifyEmail();
  const { mutate: verifyLogin, isPending: signingIn } = useVerifyLogin();
  const { mutate: resendOtp, isPending: resending } = useResendOtp();

  const [navigating, startNavigation] = useTransition();
  const isPending = verifying || signingIn || navigating;
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const firstDigit = useRef<HTMLInputElement>(null);

  const code = digits.join("");
  const canSubmit = code.length === CODE_LENGTH;

  function handleVerify() {
    if (flow === "login") {
      const challengeId = readLoginChallenge();

      if (!challengeId) {
        toast({
          message: "That sign-in has expired. Please start again.",
          state: "error",
        });
        return;
      }

      verifyLogin(
        { challengeId, code },
        {
          onSuccess: (result) => {
            clearLoginChallenge();

            if (result.onboardingRequired) {
              saveChallengeId(result.challengeId);
              startNavigation(() => router.push("/onboarding"));
              return;
            }

            startNavigation(() => router.push(redirectTo ?? "/home"));
          },
        },
      );
      return;
    }

    const challengeId = readChallengeId();

    if (!challengeId) {
      toast({
        message: "We've lost track of that sign-up. Please start again.",
        state: "error",
      });
      return;
    }

    verifyEmail(
      { challengeId, code },
      {
        onSuccess: () =>
          startNavigation(() => router.push(redirectTo ?? "/onboarding")),
      },
    );
  }

  function handleResend() {
    const challengeId =
      flow === "login" ? readLoginChallenge() : readChallengeId();

    if (!challengeId) {
      toast({
        message: "That session has expired. Please start again.",
        state: "error",
      });
      return;
    }

    resendOtp(
      { flow, challengeId },
      {
        onSuccess: () => {
          setDigits(Array(CODE_LENGTH).fill(""));
          firstDigit.current?.focus();
        },
      },
    );
  }

  return (
    <>
      {isPending ? <VerifyingOverlay /> : null}

      <div inert={isPending} className="contents">
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
                <OtpInput ref={firstDigit} value={digits} onChange={setDigits} />
                <p className="flex items-center gap-xs text-body-sm text-grey-900">
                  Didn&rsquo;t receive the code?{" "}
                  <button
                    type="button"
                    disabled={resending}
                    onClick={handleResend}
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
                  onClick={() => router.back()}
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} />
                </IconButton>
                <Button
                  variant="primary"
                  disabled={!canSubmit || isPending}
                  onClick={handleVerify}
                >
                  Verify
                </Button>
              </div>
            </div>
          </div>
        </AuthCard>
      </div>
    </>
  );
}
