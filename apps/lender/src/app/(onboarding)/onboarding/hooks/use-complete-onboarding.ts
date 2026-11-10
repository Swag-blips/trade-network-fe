import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, readProblem } from "@/api/client";
import { clearOnboarding } from "@/lib/onboarding-storage";
import { useOnboarding } from "../../components/onboarding-provider";
import { onboardingService } from "../services";
import type { CompleteOnboardingDto } from "../types";
import { hasFirstStepError, toFieldErrors } from "../utils/field-errors";

const CHALLENGE_EXPIRED = "urn:trade-network:problem:challenge-expired";
const ONBOARDING_COMPLETED = "urn:trade-network:problem:onboarding-completed";
const VALIDATION_FAILED = "urn:trade-network:problem:validation-failed";

export function useCompleteOnboarding() {
  const router = useRouter();
  const { toast } = useToast();
  const { back, setErrors } = useOnboarding();

  return useMutation({
    mutationFn: (fields: CompleteOnboardingDto) =>
      onboardingService.complete(fields),
    onError: (error) => {
      const problem = readProblem(error);

      if (problem?.type === VALIDATION_FAILED) {
        const { fields, unplaced } = toFieldErrors(problem.errors);

        setErrors(fields);
        if (hasFirstStepError(fields)) back();
        if (Object.keys(fields).length > 0 && !unplaced) return;
      }

      toast({
        message: extractErrorMessage(
          error,
          "Could not finish setting up your account",
        ),
        state: "error",
      });

      // The form stays in session storage on an expired code, so logging back
      // in returns to it filled in, under the new challengeId.
      if (problem?.type === CHALLENGE_EXPIRED) router.push("/login");

      if (problem?.type === ONBOARDING_COMPLETED) {
        clearOnboarding();
        router.push("/login");
      }
    },
  });
}
