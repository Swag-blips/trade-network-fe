"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/toast";
import { readChallengeId, saveChallengeId } from "@/lib/onboarding-storage";
import { clearLoginChallenge, readLoginChallenge } from "@/lib/login-storage";
import { useVerifyEmail } from "../hooks/use-verify-email";
import { useVerifyLogin } from "../hooks/use-verify-login";
import { useResendOtp } from "../hooks/use-resend-otp";
import { VerifyingOverlay } from "../../components/verifying-overlay";
import { CodeStep } from "../../components/code-step";
import { emptyOtp } from "@/utils/otp";

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
  const [digits, setDigits] = useState(emptyOtp);
  const firstDigit = useRef<HTMLInputElement>(null);

  const code = digits.join("");

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
          setDigits(emptyOtp());
          firstDigit.current?.focus();
        },
      },
    );
  }

  return (
    <>
      {isPending ? <VerifyingOverlay /> : null}

      <div inert={isPending} className="contents">
        <CodeStep
          email={email}
          value={digits}
          onChange={setDigits}
          inputRef={firstDigit}
          busy={isPending}
          resending={resending}
          onResend={handleResend}
          onBack={() => router.back()}
          onVerify={handleVerify}
        />
      </div>
    </>
  );
}
