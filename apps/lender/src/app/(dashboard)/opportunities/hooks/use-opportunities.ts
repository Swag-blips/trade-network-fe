import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { opportunityService } from "../services";
import type { OpportunityQuery } from "../types/opportunity";

const PAGE_SIZE = 20;

type Filters = Pick<OpportunityQuery, "borrowerRole" | "matchLevel">;

export function useOpportunities(filters: Filters) {
  return useInfiniteQuery({
    queryKey: ["opportunities", filters],
    queryFn: ({ pageParam }) =>
      opportunityService.list({ ...filters, page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: ({ opportunities: { page, totalPages } }) =>
      page < totalPages ? page + 1 : undefined,
    // Switching tabs keeps the old counts on screen instead of blanking them.
    placeholderData: keepPreviousData,
  });
}
