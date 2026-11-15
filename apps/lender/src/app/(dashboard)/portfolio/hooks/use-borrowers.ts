import { useEffect } from "react";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { readFieldErrors } from "@/api/client";
import { portfolioService } from "../services";
import { borrowersKey, retryServerErrors } from "../utils/queries";

const isStaleCursor = (error: unknown) =>
  readFieldErrors(error)?.some((field) => field.path === "cursor") ?? false;

export function useBorrowers(search: string) {
  const queryClient = useQueryClient();
  const borrowers = useInfiniteQuery({
    queryKey: borrowersKey(search),
    queryFn: ({ pageParam }) =>
      portfolioService.borrowers({
        search: search || undefined,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
    retry: retryServerErrors,
  });

  const { error } = borrowers;
  useEffect(() => {
    if (isStaleCursor(error)) {
      void queryClient.resetQueries({ queryKey: borrowersKey(search) });
    }
  }, [error, queryClient, search]);

  return borrowers;
}
