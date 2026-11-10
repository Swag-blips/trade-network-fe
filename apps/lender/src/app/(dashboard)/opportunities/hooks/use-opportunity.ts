import { useQuery } from "@tanstack/react-query";
import { readStatus } from "@/api/client";
import { opportunityService } from "../services";
import { opportunityKey } from "../utils/opportunity-cache";

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: opportunityKey(id),
    queryFn: () => opportunityService.get(id),
    retry: (failures, error) => readStatus(error) !== 404 && failures < 3,
  });
}
