import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, mutation } from "@/api/client";
import type { Invitation } from "@/types/team";
import { INVITATIONS_KEY } from "@/hooks/use-invitations";

export function useRevokeInvitation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitation: Invitation) =>
      mutation(`/invitations/${invitation.id}/revocation`, "post"),
    onSuccess: (_, invitation) =>
      toast({
        state: "success",
        message: `The invitation to “${invitation.email}” was removed`,
      }),
    onError: (error) =>
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't remove that invitation. Please try again.",
        ),
      }),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: INVITATIONS_KEY }),
  });
}
