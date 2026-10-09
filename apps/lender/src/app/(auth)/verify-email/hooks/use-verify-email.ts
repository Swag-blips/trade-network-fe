import { useMutation } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, serverMessage } from "@/api/client";
import { verifyEmailService } from "../services";
import type { ValidateOtpDto } from "../types";

export function useVerifyEmail() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (fields: ValidateOtpDto) =>
      verifyEmailService.validateOtp(fields),
    onSuccess: (response) =>
      toast({
        message:
          serverMessage(response.message) ?? "Your email has been verified",
      }),
    onError: (error) =>
      toast({
        message: extractErrorMessage(error, "That code could not be verified"),
        state: "error",
      }),
  });
}
