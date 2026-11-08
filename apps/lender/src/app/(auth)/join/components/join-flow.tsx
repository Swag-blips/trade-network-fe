"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@repo/ui/toast";
import {
  extractErrorMessage,
  readProblem,
  readProblemType,
} from "@/api/client";
import { emptyOtp } from "@/utils/otp";
import { CodeStep } from "../../components/code-step";
import { VerifyingOverlay } from "../../components/verifying-overlay";
import {
  useInvitationPreview,
  useResendInvitationCode,
  useStartInvitation,
  useVerifyInvitation,
} from "../hooks/use-join";
import { DeadLink } from "./dead-link";
import { InvitationCard } from "./invitation-card";
import { NameStep } from "./name-step";

const DEAD_LINK =
  "This invitation link is no longer valid. Ask your team for a new one.";

type Step =
  | { kind: "preview" }
  | { kind: "code"; challengeId: string }
  | { kind: "name"; challengeId: string };

export function JoinFlow() {
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState<Step>({ kind: "preview" });
  const [deadLink, setDeadLink] = useState<string | null>(null);
  const [digits, setDigits] = useState(emptyOtp);
  const [codeError, setCodeError] = useState<string>();
  const [leaving, setLeaving] = useState(false);
  const firstDigit = useRef<HTMLInputElement>(null);

  const preview = useInvitationPreview(token);
  const { mutate: start, isPending: starting } = useStartInvitation();
  const { mutate: resend, isPending: resending } = useResendInvitationCode();
  const { mutate: verify, isPending: verifying } = useVerifyInvitation();

  // The token rides in the fragment so no server ever logs it; drop it from the
  // address bar and history as soon as it's read.
  useEffect(() => {
    const found = new URLSearchParams(window.location.hash.slice(1)).get(
      "token",
    );
    if (found) {
      setToken(found);
      window.history.replaceState(null, "", "/join");
    }
    setChecked(true);
  }, []);

  function handle(error: unknown, fallback: string) {
    const type = readProblemType(error);
    if (type === "invitation-invalid") {
      setDeadLink(readProblem(error)?.detail ?? DEAD_LINK);
      return;
    }
    if (type === "challenge-expired") setStep({ kind: "preview" });
    toast({ state: "error", message: extractErrorMessage(error, fallback) });
  }

  function enterApp() {
    setLeaving(true);
    // A full load, so nothing cached from whoever was signed in before survives.
    window.location.assign("/home");
  }

  if (deadLink) return <DeadLink message={deadLink} />;
  if (checked && !token) return <DeadLink message={DEAD_LINK} />;

  if (preview.isError) {
    const type = readProblemType(preview.error);
    return type === "invitation-invalid" || type === "validation-failed" ? (
      <DeadLink message={readProblem(preview.error)?.detail ?? DEAD_LINK} />
    ) : (
      <DeadLink
        message={extractErrorMessage(
          preview.error,
          "We couldn't load this invitation. Please try again.",
        )}
        onRetry={() => void preview.refetch()}
      />
    );
  }

  if (!preview.data) return <InvitationCard />;

  const invitation = preview.data;
  const busy = verifying || leaving;

  return (
    <>
      {busy ? <VerifyingOverlay /> : null}

      <div inert={busy} className="contents">
        {step.kind === "preview" ? (
          <InvitationCard
            preview={invitation}
            sending={starting}
            onJoin={() =>
              start(token!, {
                onSuccess: ({ challengeId }) => {
                  setDigits(emptyOtp());
                  setCodeError(undefined);
                  setStep({ kind: "code", challengeId });
                },
                onError: (error) =>
                  handle(
                    error,
                    "We couldn't send your code. Please try again.",
                  ),
              })
            }
          />
        ) : step.kind === "code" ? (
          <CodeStep
            email={invitation.email}
            value={digits}
            onChange={(value) => {
              setDigits(value);
              setCodeError(undefined);
            }}
            inputRef={firstDigit}
            error={codeError}
            busy={busy}
            resending={resending}
            onBack={() => setStep({ kind: "preview" })}
            onResend={() =>
              resend(step.challengeId, {
                onSuccess: () => {
                  toast({ message: "A new code is on its way" });
                  setDigits(emptyOtp());
                  setCodeError(undefined);
                  firstDigit.current?.focus();
                },
                onError: (error) =>
                  handle(error, "We couldn't send a new code."),
              })
            }
            onVerify={() =>
              verify(
                {
                  token: token!,
                  challengeId: step.challengeId,
                  code: digits.join(""),
                },
                {
                  onSuccess: (result) => {
                    if (result.onboardingRequired) {
                      setStep({ kind: "name", challengeId: step.challengeId });
                    } else {
                      enterApp();
                    }
                  },
                  onError: (error) => {
                    const type = readProblemType(error);
                    if (
                      type === "invalid-code" ||
                      type === "validation-failed"
                    ) {
                      setCodeError(
                        extractErrorMessage(error, "That code didn't work"),
                      );
                      return;
                    }
                    handle(error, "That code could not be verified");
                  },
                },
              )
            }
          />
        ) : (
          <NameStep
            preview={invitation}
            challenge={{ token: token!, challengeId: step.challengeId }}
            onJoined={enterApp}
            onError={(error) => {
              if (readProblemType(error) === "validation-failed") return;
              handle(error, "We couldn't finish joining. Please try again.");
            }}
          />
        )}
      </div>
    </>
  );
}
