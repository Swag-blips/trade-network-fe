import { useQuery } from "@tanstack/react-query";
import { portfolioService } from "../services";
import { fundingsKey, retryServerErrors } from "../utils/queries";

export function useFundings(borrowerId: string) {
  return useQuery({
    queryKey: fundingsKey(borrowerId),
    queryFn: () => portfolioService.fundings(borrowerId),
    retry: retryServerErrors,
  });
}
