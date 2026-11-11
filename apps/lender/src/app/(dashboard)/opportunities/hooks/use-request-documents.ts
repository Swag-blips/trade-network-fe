import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { opportunityService } from "../services";
import type { DocumentRequestResponse } from "../types/inbox";
import { afterNegotiation, settleNegotiationError } from "../utils/negotiation";

export function useRequestDocuments(
  opportunityId: string,
  onSent: (request: DocumentRequestResponse) => void,
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documents: string[]) =>
      opportunityService.requestDocuments(opportunityId, documents),
    onSuccess: (request) => {
      onSent(request);
      afterNegotiation(queryClient, opportunityId);
      toast({ state: "success", message: "Request for info sent" });
    },
    onError: (error) => {
      settleNegotiationError(queryClient, error, opportunityId);
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't send your request. Please try again.",
        ),
      });
    },
  });
}
