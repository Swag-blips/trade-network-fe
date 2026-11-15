import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, mutation } from "@/api/client";
import type { LoginSession } from "../types/session";
import { SESSIONS_KEY } from "./use-sessions";

export function useRevokeSession() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (session: LoginSession) =>
      mutation(`/users/me/sessions/${session.id}/revocation`, "post"),
    onSuccess: (_, session) => {
      if (session.current) {
        window.location.assign("/login");
        return;
      }
      toast({ state: "success", message: "That device was signed out" });
    },
    onError: (error) =>
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't sign that device out. Please try again.",
        ),
      }),
    onSettled: (_, __, session) => {
      if (!session.current) {
        void queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
      }
    },
  });
}
