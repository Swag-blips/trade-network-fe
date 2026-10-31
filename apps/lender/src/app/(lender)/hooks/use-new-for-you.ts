import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services";

/** Read by the home card's badge and the sidebar's Matched dot — one request. */
export function useNewForYou() {
  return useQuery({
    queryKey: ["dashboard", "new-for-you"],
    queryFn: dashboardService.newForYou,
  });
}
