import { useMutation } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { verifyEmailService } from "../services";

export interface ResendOtpDto {
  flow: "signup" | "login";
  challengeId: string;
}

export function useResendOtp() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ flow, challengeId }: ResendOtpDto) =>
      flow === "login"
        ? verifyEmailService.resendLoginOtp(challengeId)
        : verifyEmailService.resendSignupOtp(challengeId),
    onSuccess: () => toast({ message: "A new code is on its way" }),
    onError: (error) =>
      toast({
        message: extractErrorMessage(error, "Could not send a new code"),
        state: "error",
      }),
  });
}
