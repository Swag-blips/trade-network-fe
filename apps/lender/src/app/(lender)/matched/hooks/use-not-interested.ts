import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { opportunityService } from "../services";

export function useNotInterested() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (opportunityUid: string) =>
      opportunityService.notInterested(opportunityUid),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      void queryClient.invalidateQueries({
        queryKey: ["dashboard", "new-for-you"],
      });
      toast({
        state: "success",
        message: "Opportunity has been removed from your list",
      });
    },
    onError: (error) =>
      toast({
        message: extractErrorMessage(
          error,
          "We couldn't update that opportunity. Please try again.",
        ),
        state: "error",
      }),
  });
}
