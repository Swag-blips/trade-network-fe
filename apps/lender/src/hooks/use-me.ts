import { useQuery } from "@tanstack/react-query";
import { query } from "@/api/client";
import type { User } from "@/types/user";

export const ME_KEY = ["users", "me"] as const;

export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: () => query<User>("/users/me"),
    staleTime: Infinity,
  });
}
