import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services";

export function useNewForYou() {
  return useQuery({
    queryKey: ["dashboard", "new-for-you"],
    queryFn: dashboardService.newForYou,
  });
}
