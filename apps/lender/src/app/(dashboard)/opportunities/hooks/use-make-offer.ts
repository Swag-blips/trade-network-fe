import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, readFieldErrors } from "@/api/client";
import { opportunityService } from "../services";
import type { Offer, OfferTarget, OfferTerms } from "../types/inbox";
import { afterNegotiation, settleNegotiationError } from "../utils/negotiation";

/** `onSent` is an option, not a `mutate` callback: sending unmounts the Requests detail panel. */
export function useMakeOffer(
  opportunity: OfferTarget,
  onSent: (offer: Offer) => void,
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (terms: OfferTerms) =>
      opportunityService.makeOffer(opportunity.id, terms),
    onSuccess: (offer) => {
      onSent(offer);
      afterNegotiation(queryClient, opportunity.id);
      toast({ state: "success", message: `Offer sent to ${opportunity.name}` });
    },
    onError: (error) => {
      settleNegotiationError(queryClient, error, opportunity.id);
      if (readFieldErrors(error)) return;
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't send your offer. Please try again.",
        ),
      });
    },
  });
}
