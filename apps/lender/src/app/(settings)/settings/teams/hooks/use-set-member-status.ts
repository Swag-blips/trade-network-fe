import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage } from "@/api/client";
import type { Member } from "@/types/team";
import { MEMBERS_KEY } from "@/hooks/use-members";

type Change = { member: Member; status: "Active" | "Deactivated" };

// STUB: trade-network-be has no member activation endpoints yet. Replace with
// the real `mutation(…)` call and invalidate MEMBERS_KEY instead of writing it.
async function setStatus(change: Change): Promise<Change> {
  return change;
}

export function useSetMemberStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setStatus,
    onSuccess: ({ member, status }) => {
      queryClient.setQueryData<Member[]>(MEMBERS_KEY, (current = []) =>
        current.map((item) =>
          item.id === member.id ? { ...item, status } : item,
        ),
      );
      toast({
        state: "success",
        message: `${member.name || member.email} was ${status === "Active" ? "activated" : "deactivated"}`,
      });
    },
    onError: (error, { status }) =>
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          `We couldn't ${status === "Active" ? "activate" : "deactivate"} that member. Please try again.`,
        ),
      }),
  });
}
