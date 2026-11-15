import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/toast";
import {
  extractErrorMessage,
  readFieldErrors,
  readProblemType,
} from "@/api/client";
import { clearOnboarding } from "@/lib/onboarding-storage";
import { useOnboarding } from "../../components/onboarding-provider";
import { onboardingService } from "../services";
import type { CompleteOnboardingDto } from "../types";

export function useCompleteOnboarding() {
  const router = useRouter();
  const { toast } = useToast();
  const { back, showErrors } = useOnboarding();

  return useMutation({
    mutationFn: (fields: CompleteOnboardingDto) =>
      onboardingService.complete(fields),
    onError: (error) => {
      const type = readProblemType(error);
      const fields = readFieldErrors(error);

      if (fields) {
        showErrors(error);
        if (fields.some(({ path }) => path.startsWith("organization/"))) back();
      } else {
        toast({
          message: extractErrorMessage(
            error,
            "Could not finish setting up your account",
          ),
          state: "error",
        });
      }

      // The form stays in session storage on an expired code, so logging back
      // in returns to it filled in, under the new challengeId.
      if (type === "challenge-expired") router.push("/login");

      if (type === "onboarding-completed") {
        clearOnboarding();
        router.push("/login");
      }
    },
  });
}
