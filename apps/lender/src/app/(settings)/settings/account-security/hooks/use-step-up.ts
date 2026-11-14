import { useRef, useState } from "react";
import { useToast } from "@repo/ui/toast";
import {
  extractErrorMessage,
  readProblem,
  readProblemType,
  readRetryAfter,
} from "@/api/client";
import { emptyOtp } from "@/utils/otp";
import { useCooldown } from "./use-cooldown";
import {
  useResendStepUp,
  useStartStepUp,
  useVerifyStepUp,
} from "./use-email-change";

/** Codes are limited to one a minute per address. */
const DEFAULT_RETRY_SECONDS = 60;

/**
 * The code sent to the current email, and the code entry its modal shares with
 * any later code step. `onVerified` gets the accepted step-up's `challengeId`;
 * the modal stays open until the caller closes it.
 */
export function useStepUp({
  onVerified,
  onBegin,
  busy = false,
}: {
  onVerified: (challengeId: string) => void;
  /** Runs whenever a fresh step-up starts, including a restart after expiry. */
  onBegin?: () => void;
  /** Keeps Verify loading while the caller acts on the accepted code. */
  busy?: boolean;
}) {
  const { toast } = useToast();
  const [active, setActive] = useState(false);
  const [challengeId, setChallengeId] = useState<string>();
  const [digits, setDigits] = useState(emptyOtp);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const sendCooldown = useCooldown();
  const verifyCooldown = useCooldown();

  const { mutate: start } = useStartStepUp();
  const { mutate: verify, isPending: verifying } = useVerifyStepUp();
  const { mutate: resend, isPending: resending } = useResendStepUp();

  function failed(err: unknown, fallback: string) {
    toast({ state: "error", message: extractErrorMessage(err, fallback) });
  }

  function rateLimited(err: unknown, cooldown: typeof sendCooldown) {
    if (readProblemType(err) !== "rate-limited") return false;
    cooldown.start(readRetryAfter(err) ?? DEFAULT_RETRY_SECONDS);
    return true;
  }

  function resetCode() {
    setDigits(emptyOtp());
    setError(undefined);
    verifyCooldown.stop();
    sendCooldown.stop();
  }

  function close() {
    setActive(false);
    setChallengeId(undefined);
    resetCode();
  }

  function begin() {
    onBegin?.();
    resetCode();
    setChallengeId(undefined);
    setActive(true);
    start(undefined, {
      onSuccess: (result) => setChallengeId(result.challengeId),
      onError: (err) => {
        if (rateLimited(err, sendCooldown)) {
          setError(
            extractErrorMessage(err, "Too many requests. Try again shortly."),
          );
          return;
        }
        failed(err, "We couldn't send a code to your email.");
        close();
      },
    });
  }

  function restart(err?: unknown) {
    toast({
      state: "error",
      message:
        readProblem(err)?.detail ??
        "That code has expired. We've sent a new one to your current email.",
    });
    begin();
  }

  function codeFailed(err: unknown, fallback: string) {
    const type = readProblemType(err);
    if (type === "invalid-code" || type === "validation-failed") {
      setError(extractErrorMessage(err, "That code didn't work"));
      return;
    }
    if (rateLimited(err, verifyCooldown)) {
      setError(extractErrorMessage(err, "Too many attempts."));
      return;
    }
    if (type === "challenge-expired") {
      restart(err);
      return;
    }
    failed(err, fallback);
  }

  function resent() {
    toast({ message: "A new code is on its way" });
    setDigits(emptyOtp());
    setError(undefined);
    inputRef.current?.focus();
  }

  function resendFailed(err: unknown) {
    if (rateLimited(err, sendCooldown)) return;
    if (readProblemType(err) === "challenge-expired") {
      restart(err);
      return;
    }
    failed(err, "We couldn't send a new code.");
  }

  /** Props every code modal shares, whichever address it was sent to. */
  const code = {
    value: digits,
    onChange: (value: string[]) => {
      setDigits(value);
      setError(undefined);
    },
    inputRef,
    error,
    verifyIn: verifyCooldown.seconds,
    resendIn: sendCooldown.seconds,
  };

  return {
    active,
    begin,
    close,
    restart,
    resetCode,
    code,
    codeFailed,
    resent,
    resendFailed,
    /** For a step that sends a code to a new address. */
    sendLimited: (err: unknown) => rateLimited(err, sendCooldown),
    stopSendCooldown: sendCooldown.stop,
    modal: {
      ...code,
      ready: !!challengeId,
      verifying: verifying || busy,
      resending,
      onResend: () => {
        if (!challengeId) {
          begin();
          return;
        }
        resend(challengeId, { onSuccess: resent, onError: resendFailed });
      },
      onVerify: () => {
        if (!challengeId) return;
        verify(
          { challengeId, code: digits.join("") },
          {
            onSuccess: () => onVerified(challengeId),
            onError: (err) =>
              codeFailed(err, "That code could not be verified."),
          },
        );
      },
    },
  };
}
