import { useQuery } from "@tanstack/react-query";
import { portfolioService } from "../services";
import { borrowerKey, retryServerErrors } from "../utils/queries";

export function useBorrower(id: string) {
  return useQuery({
    queryKey: borrowerKey(id),
    queryFn: () => portfolioService.borrower(id),
    retry: retryServerErrors,
  });
}
