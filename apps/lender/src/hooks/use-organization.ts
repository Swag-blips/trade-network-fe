import { useQuery } from "@tanstack/react-query";
import { query } from "@/api/client";
import type { Organization } from "@/types/organization";

export function useOrganization() {
  return useQuery({
    queryKey: ["organizations", "current"],
    queryFn: () => query<Organization>("/organizations/current"),
    staleTime: Infinity,
  });
}
