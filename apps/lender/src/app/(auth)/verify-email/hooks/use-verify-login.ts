import { useMutation } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { verifyEmailService } from "../services";
import type { ValidateLoginOtpDto } from "../types";

export function useVerifyLogin() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (fields: ValidateLoginOtpDto) =>
      verifyEmailService.validateLoginOtp(fields),
    onError: (error) =>
      toast({
        message: extractErrorMessage(error, "That code could not be verified"),
        state: "error",
      }),
  });
}
