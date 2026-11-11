import { useQuery } from "@tanstack/react-query";
import { query } from "@/api/client";
import type { Organization } from "@/types/organization";

export const ORGANIZATION_KEY = ["organizations", "current"] as const;

export function useOrganization() {
  return useQuery({
    queryKey: ORGANIZATION_KEY,
    queryFn: () => query<Organization>("/organizations/current"),
    staleTime: Infinity,
  });
}
