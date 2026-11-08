import { useQuery } from "@tanstack/react-query";
import { query } from "@/api/client";
import type { Role } from "@/types/team";

export const ROLES_KEY = ["roles"] as const;

export function useRoles() {
  return useQuery({
    queryKey: ROLES_KEY,
    queryFn: () => query<{ items: Role[] }>("/roles"),
    select: (data) => data.items,
    staleTime: Infinity,
  });
}
