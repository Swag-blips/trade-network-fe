import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import { mandateService } from "@/services/mandate";
import type { Mandate } from "@/types/mandate";
import { MANDATE_KEY } from "@/hooks/use-mandate";

export function useUpdateMandate() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mandate: Mandate) => mandateService.update(mandate),
    onSuccess: (saved) => {
      queryClient.setQueryData(MANDATE_KEY, saved);
      toast({ message: "Your financing preference was updated" });
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
