import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services";

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: dashboardService.overview,
  });
}
