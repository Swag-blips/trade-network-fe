import { useMutation } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, serverMessage } from "@/api/client";
import { verifyEmailService } from "../services";

export interface ResendOtpDto {
  flow: "signup" | "login";
  /** The onboardUid when signing up, the sessionToken when logging in. */
  handle: string;
}

export function useResendOtp() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ flow, handle }: ResendOtpDto) =>
      flow === "login"
        ? verifyEmailService.resendLoginOtp(handle)
        : verifyEmailService.resendSignupOtp(handle),
    onSuccess: (response) =>
      toast({
        message: serverMessage(response.message) ?? "A new code is on its way",
      }),
    onError: (error) =>
      toast({
        message: extractErrorMessage(error, "Could not send a new code"),
        state: "error",
      }),
  });
}
