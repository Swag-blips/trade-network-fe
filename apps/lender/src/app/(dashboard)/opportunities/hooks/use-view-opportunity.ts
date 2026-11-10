import { useMutation, useQueryClient } from "@tanstack/react-query";
import { readStatus } from "@/api/client";
import { opportunityService } from "../services";
import type { Opportunity } from "../types/opportunity";
import {
  forgetOpportunity,
  opportunityKey,
  patchOpportunityLists,
} from "../utils/opportunity-cache";

export function useViewOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => opportunityService.view(id),
    onMutate: (id) => {
      patchOpportunityLists(queryClient, (items) =>
        items.map((item) =>
          item.id === id ? { ...item, unread: false } : item,
        ),
      );
      queryClient.setQueryData<Opportunity>(
        opportunityKey(id),
        (opportunity) => opportunity && { ...opportunity, unread: false },
      );
    },
    onError: (error, id) => {
      if (readStatus(error) === 404) forgetOpportunity(queryClient, id);
    },
  });
}
