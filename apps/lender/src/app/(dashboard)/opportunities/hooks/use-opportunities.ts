import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { opportunityService } from "../services";
import type { OpportunityQuery } from "../types/opportunity";
import { OPPORTUNITY_LISTS } from "../utils/opportunity-cache";

type Filters = Pick<OpportunityQuery, "matchLevel" | "unread">;

export function useOpportunities(filters: Filters) {
  return useInfiniteQuery({
    queryKey: [...OPPORTUNITY_LISTS, filters],
    queryFn: ({ pageParam }) =>
      opportunityService.list({ ...filters, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
  });
}
