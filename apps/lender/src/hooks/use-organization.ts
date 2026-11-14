import { useQuery } from "@tanstack/react-query";
import { query } from "@/api/client";
import type { Organization } from "@/types/organization";
import { useMe } from "./use-me";

export const ORGANIZATION_KEY = ["organizations", "current"] as const;

export function useOrganization() {
  const { data: me } = useMe();

  return useQuery({
    queryKey: ORGANIZATION_KEY,
    queryFn: () => query<Organization>("/organizations/current"),
    staleTime: Infinity,
    // Organisation routes answer 403 while the account is due for deletion.
    enabled: !me?.deleteAfter,
  });
}
