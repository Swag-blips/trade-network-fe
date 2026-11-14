import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountDeletionService } from "../services";

export function useScheduleDeletion() {
  return useMutation({ mutationFn: accountDeletionService.schedule });
}

export function useCancelDeletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountDeletionService.cancel,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
