import { useQuery } from "@tanstack/react-query";
import { portfolioService } from "../services";
import { fundingKey, retryServerErrors } from "../utils/queries";

export function useFunding(id: string) {
  return useQuery({
    queryKey: fundingKey(id),
    queryFn: () => portfolioService.funding(id),
    retry: retryServerErrors,
  });
}
