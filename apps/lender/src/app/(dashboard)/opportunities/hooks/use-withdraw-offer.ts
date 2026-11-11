import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { offerService } from "../services";
import { CONVERSATIONS, settleNegotiationError } from "../utils/negotiation";

export function useWithdrawOffer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerId: string) => offerService.withdraw(offerId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONVERSATIONS });
      toast({ state: "success", message: "Offer withdrawn" });
    },
    onError: (error) => {
      settleNegotiationError(queryClient, error);
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't withdraw your offer. Please try again.",
        ),
      });
    },
  });
}
