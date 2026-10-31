import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services";

/**
 * The banner, the profile menu and the sidebar footer all read this; the
 * shared key means one request between them. The names only change through
 * settings, so there is nothing to refetch for while the dashboard is open.
 */
export function useDashboardProfile() {
  return useQuery({
    queryKey: ["dashboard", "profile"],
    queryFn: dashboardService.profile,
    staleTime: Infinity,
  });
}
