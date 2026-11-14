"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { useToast } from "@repo/ui/toast";
import {
  extractErrorMessage,
  readFieldErrors,
  readProblemType,
} from "@/api/client";
import {
  useConfirmEmailChange,
  useRequestEmailChange,
  useResendEmailChange,
} from "../hooks/use-email-change";
import { useStepUp } from "../hooks/use-step-up";
import { NewEmailModal } from "./new-email-modal";
import { VerifyEmailModal } from "./verify-email-modal";

type Step =
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
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();

  const stepUp = useStepUp({
    onBegin: () => setStep(null),
    onVerified: (stepUpChallengeId) => enterNewEmail(stepUpChallengeId),
  });

  const { mutate: requestChange, isPending: requesting } =
    useRequestEmailChange();
  const { mutate: confirmChange, isPending: confirming } =
    useConfirmEmailChange();
  const { mutate: resendChange, isPending: resendingChange } =
    useResendEmailChange();

  function close() {
    setStep(null);
    stepUp.close();
  }

  function enterNewEmail(stepUpChallengeId: string) {
    stepUp.close();
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
          stepUp.begin();
        }}
      >
        Change
      </Button>

      {stepUp.active && email ? (
        <VerifyEmailModal
          key="current"
          email={email}
          address="current"
          {...stepUp.modal}
          onClose={close}
        />
      ) : null}

      {step?.kind === "new-email" ? (
        <NewEmailModal
          email={newEmail}
          onEmailChange={(value) => {
            setNewEmail(value);
            setEmailError(undefined);
            stepUp.stopSendCooldown();
          }}
          error={emailError}
          saving={requesting}
          retryIn={stepUp.code.resendIn}
          onSave={(address) =>
            requestChange(
              { stepUpChallengeId: step.stepUpChallengeId, email: address },
              {
                onSuccess: ({ challengeId }) => {
                  stepUp.resetCode();
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
                  if (stepUp.sendLimited(error)) return;
                  if (readProblemType(error) === "challenge-expired") {
                    toast({
                      state: "error",
                      message:
                        "Please confirm it’s you again. We’ve sent a new code to your current email.",
                    });
                    stepUp.begin();
                    return;
                  }
                  toast({
                    state: "error",
                    message: extractErrorMessage(
                      error,
                      "We couldn't send a code to that email.",
                    ),
                  });
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
          {...stepUp.code}
          ready
          verifying={confirming}
          resending={resendingChange}
          onResend={() =>
            resendChange(step.challengeId, {
              onSuccess: stepUp.resent,
              onError: stepUp.resendFailed,
            })
          }
          onVerify={() =>
            confirmChange(
              {
                challengeId: step.challengeId,
                code: stepUp.code.value.join(""),
              },
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
                  stepUp.codeFailed(error, "That code could not be verified.");
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
