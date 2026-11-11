import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { fundingService } from "../services";
import { CONVERSATIONS, settleNegotiationError } from "../utils/negotiation";

export function usePayFunding() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fundingId: string) => fundingService.pay(fundingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONVERSATIONS });
      toast({ state: "success", message: "Payment marked as sent" });
    },
    onError: (error) => {
      settleNegotiationError(queryClient, error);
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't confirm your payment. Please try again.",
        ),
      });
    },
  });
}
