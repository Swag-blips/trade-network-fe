import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { offerService } from "../services";
import {
  refreshNegotiations,
  settleNegotiationError,
} from "../utils/negotiation";

export function useAcceptOffer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerId: string) => offerService.accept(offerId),
    onSuccess: () => {
      refreshNegotiations(queryClient);
      toast({ state: "success", message: "Counter offer accepted" });
    },
    onError: (error) => {
      settleNegotiationError(queryClient, error);
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't accept this offer. Please try again.",
        ),
      });
    },
  });
}
