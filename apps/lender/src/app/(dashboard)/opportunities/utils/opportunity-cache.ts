import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { OpportunityPage, OpportunitySummary } from "../types/opportunity";

export const OPPORTUNITY_LISTS = ["opportunities", "list"] as const;

export const opportunityKey = (id: string) =>
  ["opportunities", "detail", id] as const;

export function patchOpportunityLists(
  queryClient: QueryClient,
  update: (items: OpportunitySummary[]) => OpportunitySummary[],
) {
  queryClient.setQueriesData<InfiniteData<OpportunityPage>>(
    { queryKey: OPPORTUNITY_LISTS },
    (lists) =>
      lists && {
        ...lists,
        pages: lists.pages.map((page) => ({
          ...page,
          items: update(page.items),
        })),
      },
  );
}

/** Drops a request that is gone or dismissed, then refetches the lists. */
export function forgetOpportunity(queryClient: QueryClient, id: string) {
  patchOpportunityLists(queryClient, (items) =>
    items.filter((item) => item.id !== id),
  );
  queryClient.removeQueries({ queryKey: opportunityKey(id) });
  void queryClient.invalidateQueries({ queryKey: OPPORTUNITY_LISTS });
}
