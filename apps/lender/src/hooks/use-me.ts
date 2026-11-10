import { useQuery } from "@tanstack/react-query";
import { query } from "@/api/client";
import type { Me } from "@/types/profile";

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => query<Me>("/auth/me"),
    staleTime: Infinity,
  });
}
