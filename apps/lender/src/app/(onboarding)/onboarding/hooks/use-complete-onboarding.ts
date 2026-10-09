import { useMutation } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { onboardingService } from "../services";
import type { CompleteOnboardingDto } from "../types";

export function useCompleteOnboarding() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (fields: CompleteOnboardingDto) =>
      onboardingService.complete(fields),
    onError: (error) =>
      toast({
        message: extractErrorMessage(
          error,
          "Could not finish setting up your account",
        ),
        state: "error",
      }),
  });
}
