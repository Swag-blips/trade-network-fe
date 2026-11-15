import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { conversationService } from "../services";
import {
  refreshNegotiations,
  settleNegotiationError,
} from "../utils/negotiation";

export function useExitConversation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      conversationService.exit(conversationId),
    onSuccess: () => {
      refreshNegotiations(queryClient);
      toast({ state: "success", message: "You left the negotiation" });
    },
    onError: (error) => {
      settleNegotiationError(queryClient, error);
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't leave this negotiation. Please try again.",
        ),
      });
    },
  });
}
