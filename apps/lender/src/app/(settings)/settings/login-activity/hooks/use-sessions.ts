import { useInfiniteQuery } from "@tanstack/react-query";
import { query } from "@/api/client";
import type { SessionPage } from "../types/session";

export const SESSIONS_KEY = ["sessions"];

export function useSessions() {
  return useInfiniteQuery({
    queryKey: SESSIONS_KEY,
    queryFn: ({ pageParam }) =>
      query<SessionPage>("/users/me/sessions", { cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}
