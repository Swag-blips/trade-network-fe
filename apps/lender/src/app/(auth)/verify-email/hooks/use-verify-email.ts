import { useMutation } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { verifyEmailService } from "../services";
import type { VerifyCodeDto } from "../types";

export function useVerifyEmail() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (fields: VerifyCodeDto) =>
      verifyEmailService.verifySignup(fields),
    onSuccess: () => toast({ message: "OTP verified successfully" }),
    onError: (error) =>
      toast({
        message: extractErrorMessage(error, "That code could not be verified"),
        state: "error",
      }),
  });
}
