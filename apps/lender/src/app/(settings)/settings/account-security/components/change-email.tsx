"use client";

import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { useToast } from "@repo/ui/toast";
import {
  extractErrorMessage,
  readFieldErrors,
  readProblem,
  readProblemType,
  readRetryAfter,
} from "@/api/client";
import { emptyOtp } from "@/utils/otp";
import { useCooldown } from "../hooks/use-cooldown";
import {
  useConfirmEmailChange,
  useRequestEmailChange,
  useResendEmailChange,
  useResendStepUp,
  useStartStepUp,
  useVerifyStepUp,
} from "../hooks/use-email-change";
import { NewEmailModal } from "./new-email-modal";
import { VerifyEmailModal } from "./verify-email-modal";

/** Codes are limited to one a minute per address. */
const DEFAULT_RETRY_SECONDS = 60;

type Step =
  | { kind: "current"; challengeId?: string }
  | { kind: "new-email"; stepUpChallengeId: string }
  | {
      kind: "verify-new";
      stepUpChallengeId: string;
      email: string;
      challengeId: string;
    };

export function ChangeEmail({ email }: { email?: string }) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step | null>(null);
  const [digits, setDigits] = useState(emptyOtp);
  const [codeError, setCodeError] = useState<string>();
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const firstDigit = useRef<HTMLInputElement>(null);
  const sendCooldown = useCooldown();
  const verifyCooldown = useCooldown();

  const { mutate: startStepUp } = useStartStepUp();
  const { mutate: verifyStepUp, isPending: verifyingStepUp } =
    useVerifyStepUp();
  const { mutate: resendStepUp, isPending: resendingStepUp } =
    useResendStepUp();
  const { mutate: requestChange, isPending: requesting } =
    useRequestEmailChange();
  const { mutate: confirmChange, isPending: confirming } =
    useConfirmEmailChange();
  const { mutate: resendChange, isPending: resendingChange } =
    useResendEmailChange();

  function failed(error: unknown, fallback: string) {
    toast({ state: "error", message: extractErrorMessage(error, fallback) });
  }

  function rateLimited(error: unknown, cooldown: typeof sendCooldown) {
    if (readProblemType(error) !== "rate-limited") return false;
    cooldown.start(readRetryAfter(error) ?? DEFAULT_RETRY_SECONDS);
    return true;
  }

  function resetCode() {
    setDigits(emptyOtp());
    setCodeError(undefined);
    verifyCooldown.stop();
  }

  function close() {
    setStep(null);
    resetCode();
    sendCooldown.stop();
  }

  function beginStepUp() {
    resetCode();
    sendCooldown.stop();
    setStep({ kind: "current" });
    startStepUp(undefined, {
      onSuccess: ({ challengeId }) =>
        setStep((current) =>
          current?.kind === "current"
            ? { kind: "current", challengeId }
            : current,
        ),
      onError: (error) => {
        if (rateLimited(error, sendCooldown)) {
          setCodeError(
            extractErrorMessage(error, "Too many requests. Try again shortly."),
          );
          return;
        }
        failed(error, "We couldn't send a code to your email.");
        close();
      },
    });
  }

  function restart(error: unknown) {
    toast({
      state: "error",
      message:
        readProblem(error)?.detail ??
        "That code has expired. We've sent a new one to your current email.",
    });
    beginStepUp();
  }

  function codeFailed(error: unknown, fallback: string) {
    const type = readProblemType(error);
    if (type === "invalid-code" || type === "validation-failed") {
      setCodeError(extractErrorMessage(error, "That code didn't work"));
      return;
    }
    if (rateLimited(error, verifyCooldown)) {
      setCodeError(extractErrorMessage(error, "Too many attempts."));
      return;
    }
    if (type === "challenge-expired") {
      restart(error);
      return;
    }
    failed(error, fallback);
  }

  function resent() {
    toast({ message: "A new code is on its way" });
    setDigits(emptyOtp());
    setCodeError(undefined);
    firstDigit.current?.focus();
  }

  function resendFailed(error: unknown) {
    if (rateLimited(error, sendCooldown)) return;
    if (readProblemType(error) === "challenge-expired") {
      restart(error);
      return;
    }
    failed(error, "We couldn't send a new code.");
  }

  function enterNewEmail(stepUpChallengeId: string) {
    resetCode();
    sendCooldown.stop();
    setStep({ kind: "new-email", stepUpChallengeId });
  }

  return (
    <>
      <Button
        variant="tertiary"
        size="pill"
        disabled={!email}
        leadingIcon={<HugeiconsIcon icon={PencilEdit02Icon} />}
        onClick={() => {
          setNewEmail("");
          setEmailError(undefined);
          beginStepUp();
        }}
      >
        Change
      </Button>

      {step?.kind === "current" && email ? (
        <VerifyEmailModal
          key="current"
          email={email}
          address="current"
          value={digits}
          onChange={(value) => {
            setDigits(value);
            setCodeError(undefined);
          }}
          inputRef={firstDigit}
          error={codeError}
          ready={!!step.challengeId}
          verifying={verifyingStepUp}
          resending={resendingStepUp}
          verifyIn={verifyCooldown.seconds}
          resendIn={sendCooldown.seconds}
          onResend={() => {
            if (!step.challengeId) {
              beginStepUp();
              return;
            }
            resendStepUp(step.challengeId, {
              onSuccess: resent,
              onError: resendFailed,
            });
          }}
          onVerify={() => {
            const { challengeId } = step;
            if (!challengeId) return;
            verifyStepUp(
              { challengeId, code: digits.join("") },
              {
                onSuccess: () => enterNewEmail(challengeId),
                onError: (error) =>
                  codeFailed(error, "That code could not be verified."),
              },
            );
          }}
          onClose={close}
        />
      ) : null}

      {step?.kind === "new-email" ? (
        <NewEmailModal
          email={newEmail}
          onEmailChange={(value) => {
            setNewEmail(value);
            setEmailError(undefined);
            sendCooldown.stop();
          }}
          error={emailError}
          saving={requesting}
          retryIn={sendCooldown.seconds}
          onSave={(address) =>
            requestChange(
              { stepUpChallengeId: step.stepUpChallengeId, email: address },
              {
                onSuccess: ({ challengeId }) => {
                  resetCode();
                  sendCooldown.stop();
                  setStep((current) =>
                    current?.kind === "new-email"
                      ? {
                          kind: "verify-new",
                          stepUpChallengeId: current.stepUpChallengeId,
                          email: address,
                          challengeId,
                        }
                      : current,
                  );
                },
                onError: (error) => {
                  const fields = readFieldErrors(error);
                  const onEmail = fields?.find(({ path }) => path === "email");
                  if (onEmail) {
                    setEmailError(onEmail.detail);
                    return;
                  }
                  if (rateLimited(error, sendCooldown)) return;
                  if (readProblemType(error) === "challenge-expired") {
                    toast({
                      state: "error",
                      message:
                        "Please confirm it’s you again. We’ve sent a new code to your current email.",
                    });
                    beginStepUp();
                    return;
                  }
                  failed(error, "We couldn't send a code to that email.");
                },
              },
            )
          }
          onClose={close}
        />
      ) : null}

      {step?.kind === "verify-new" ? (
        <VerifyEmailModal
          key="new"
          email={step.email}
          address="new"
          value={digits}
          onChange={(value) => {
            setDigits(value);
            setCodeError(undefined);
          }}
          inputRef={firstDigit}
          error={codeError}
          ready
          verifying={confirming}
          resending={resendingChange}
          verifyIn={verifyCooldown.seconds}
          resendIn={sendCooldown.seconds}
          onResend={() =>
            resendChange(step.challengeId, {
              onSuccess: resent,
              onError: resendFailed,
            })
          }
          onVerify={() =>
            confirmChange(
              { challengeId: step.challengeId, code: digits.join("") },
              {
                onSuccess: () => {
                  toast({
                    state: "success",
                    message: "Your email was changed",
                  });
                  close();
                },
                onError: (error) => {
                  if (readProblemType(error) === "email-taken") {
                    setEmailError(
                      extractErrorMessage(
                        error,
                        "Another account already uses that email.",
                      ),
                    );
                    enterNewEmail(step.stepUpChallengeId);
                    return;
                  }
                  codeFailed(error, "That code could not be verified.");
                },
              },
            )
          }
          onClose={close}
        />
      ) : null}
    </>
  );
}
