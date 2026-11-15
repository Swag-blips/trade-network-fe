import { useQuery } from "@tanstack/react-query";
import { portfolioService } from "../services";
import { retryServerErrors, SUMMARY_KEY } from "../utils/queries";

export function usePortfolioSummary() {
  return useQuery({
    queryKey: SUMMARY_KEY,
    queryFn: portfolioService.summary,
    retry: retryServerErrors,
  });
}
