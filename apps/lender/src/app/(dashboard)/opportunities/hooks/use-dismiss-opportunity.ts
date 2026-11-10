import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, readStatus } from "@/api/client";
import { opportunityService } from "../services";
import { forgetOpportunity } from "../utils/opportunity-cache";

export function useDismissOpportunity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => opportunityService.dismiss(id),
    onSuccess: (_, id) => {
      forgetOpportunity(queryClient, id);
      void queryClient.invalidateQueries({
        queryKey: ["dashboard", "new-for-you"],
      });
      toast({
        state: "success",
        message: "Opportunity has been removed from your list",
      });
    },
    onError: (error, id) => {
      const status = readStatus(error);
      // 409: withdrawn or closed meanwhile, 404: gone. Either way the card goes.
      if (status === 409 || status === 404) forgetOpportunity(queryClient, id);
      if (status === 403) {
        void queryClient.invalidateQueries({
          queryKey: ["organizations", "current"],
        });
      }
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't update that opportunity. Please try again.",
        ),
      });
    },
  });
}
