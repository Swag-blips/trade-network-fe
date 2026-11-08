import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, mutation, readFieldErrors } from "@/api/client";
import type { InviteRequest } from "@/types/team";
import { INVITATIONS_KEY } from "./use-invitations";

export function useInviteMembers(onSent: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitations: InviteRequest[]) =>
      mutation("/invitations", "post", { invitations }),
    onSuccess: (_, invitations) => {
      toast({
        state: "success",
        message:
          invitations.length === 1
            ? `Invitation was sent to “${invitations[0]!.email}”`
            : `Invitations were sent to ${invitations.length} people`,
      });
      onSent();
    },
    onError: (error) => {
      if (readFieldErrors(error)) return;
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't send those invitations. Please try again.",
        ),
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: INVITATIONS_KEY }),
  });
}
