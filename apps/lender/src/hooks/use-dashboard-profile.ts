import { useQuery } from "@tanstack/react-query";
import { query } from "@/api/client";
import type { DashboardProfile } from "@/types/profile";

/**
 * The welcome banner, the account menu and the settings sidebar read this; the
 * shared key means one request between them. The names only change through
 * settings, so there is nothing to refetch for while the dashboard is open.
 */
export function useDashboardProfile() {
  return useQuery({
    queryKey: ["dashboard", "profile"],
    queryFn: () => query<DashboardProfile>("/dashboard/profile"),
    staleTime: Infinity,
  });
}
