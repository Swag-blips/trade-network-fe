import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ME_KEY } from "@/hooks/use-me";
import { emailChangeService } from "../services";

export function useStartStepUp() {
  return useMutation({ mutationFn: emailChangeService.startStepUp });
}

export function useVerifyStepUp() {
  return useMutation({ mutationFn: emailChangeService.verifyStepUp });
}

export function useResendStepUp() {
  return useMutation({ mutationFn: emailChangeService.resendStepUp });
}

export function useRequestEmailChange() {
  return useMutation({ mutationFn: emailChangeService.requestChange });
}

export function useResendEmailChange() {
  return useMutation({ mutationFn: emailChangeService.resendChange });
}

export function useConfirmEmailChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: emailChangeService.confirmChange,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ME_KEY });
      // Confirming ends every other session.
      void queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
