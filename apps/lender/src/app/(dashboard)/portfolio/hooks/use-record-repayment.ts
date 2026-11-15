import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, readStatus } from "@/api/client";
import { CAPITAL_KEY } from "@/hooks/use-capital";
import { ORGANIZATION_KEY } from "@/hooks/use-organization";
import { portfolioService } from "../services";
import { PORTFOLIO } from "../utils/queries";

export function useRecordRepayment() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: PORTFOLIO });
    void queryClient.invalidateQueries({ queryKey: CAPITAL_KEY });
  };

  return useMutation({
    mutationFn: portfolioService.recordRepayment,
    onSuccess: () => {
      refresh();
      toast({ state: "success", message: "Repayment recorded" });
    },
    onError: (error) => {
      if (readStatus(error) === 403) {
        void queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEY });
      }
      refresh();
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't record this repayment. Please try again.",
        ),
      });
    },
  });
}
