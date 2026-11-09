import { useQuery } from "@tanstack/react-query";
import { homeService } from "../services";

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: homeService.overview,
  });
}
