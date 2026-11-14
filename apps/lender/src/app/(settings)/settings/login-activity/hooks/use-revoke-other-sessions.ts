import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, mutation } from "@/api/client";
import { SESSIONS_KEY } from "./use-sessions";

export function useRevokeOtherSessions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => mutation("/users/me/sessions/revocation", "post"),
    onSuccess: () =>
      toast({
        state: "success",
        message: "Your other devices were signed out",
      }),
    onError: (error) =>
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't sign your other devices out. Please try again.",
        ),
      }),
    onSettled: () =>
      void queryClient.invalidateQueries({ queryKey: SESSIONS_KEY }),
  });
}
