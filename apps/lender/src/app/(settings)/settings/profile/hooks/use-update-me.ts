import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, mutation } from "@/api/client";
import { ME_KEY } from "@/hooks/use-me";
import type { User, UserRequest } from "@/types/user";

export function useUpdateMe() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UserRequest) => mutation<User>("/users/me", "put", body),
    onSuccess: (user) => {
      queryClient.setQueryData(ME_KEY, user);
      toast({
        state: "success",
        message: "Your personal details were updated",
      });
    },
    onError: (error) =>
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't save your details. Please try again.",
        ),
      }),
  });
}
