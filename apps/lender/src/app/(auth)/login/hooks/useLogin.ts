import { useMutation } from "@tanstack/react-query";
import { loginService } from "../services";
import { LoginDto } from "../types";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, serverMessage } from "@/api/client";

export const useLogin = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (field: LoginDto) => loginService.validateOtp(field),
    onSuccess: (response) =>
      toast({
        message: serverMessage(response.message) ?? "Otp sent.",
      }),
    onError: (error) =>
      toast({
        message: extractErrorMessage(
          error,
          "An error occured please try again",
        ),
        state: "error",
      }),
  });
};
