import { useMutation } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, readFieldErrors } from "@/api/client";
import { createAccountService } from "../services";
import type { CreateAccountDto } from "../types";

export function useCreateAccount() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (fields: CreateAccountDto) =>
      createAccountService.createAccount(fields),
    onError: (error) => {
      if (readFieldErrors(error)) return;
      toast({
        message: extractErrorMessage(error, "Could not create your account"),
        state: "error",
      });
    },
  });
}
