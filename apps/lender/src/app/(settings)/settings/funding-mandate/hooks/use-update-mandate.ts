import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { mandateService } from "../services";
import type { Mandate } from "../types";
import { MANDATE_KEY } from "./use-mandate";

export function useUpdateMandate() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mandate: Mandate) => mandateService.update(mandate),
    onSuccess: (saved) => {
      // The response echoes what was stored, so it becomes the new baseline
      // the form compares against — no refetch needed.
      queryClient.setQueryData(MANDATE_KEY, saved);
      // Available capital follows the allocation, and what counts as a match
      // follows the rest of the mandate.
      void queryClient.invalidateQueries({
        queryKey: ["dashboard", "overview"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["dashboard", "new-for-you"],
      });
      toast({ message: "Funding mandate updated." });
    },
    onError: (error) =>
      toast({
        message: extractErrorMessage(
          error,
          "We couldn't update your mandate. Please try again.",
        ),
        state: "error",
      }),
  });
}
