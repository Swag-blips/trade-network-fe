import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, mutation, readStatus } from "@/api/client";
import { ORGANIZATION_KEY } from "@/hooks/use-organization";
import type { Organization, OrganizationRequest } from "@/types/organization";

export function useUpdateOrganization() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: OrganizationRequest) =>
      mutation<Organization>("/organizations/current", "put", body),
    onSuccess: (organization) => {
      queryClient.setQueryData(ORGANIZATION_KEY, organization);
      // Inbox threads carry the organisation name.
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast({ state: "success", message: "Your company details were updated" });
    },
    onError: (error) => {
      if (readStatus(error) === 403) {
        void queryClient.invalidateQueries({ queryKey: ORGANIZATION_KEY });
      }
      toast({
        state: "error",
        message: extractErrorMessage(
          error,
          "We couldn't save your company details. Please try again.",
        ),
      });
    },
  });
}
