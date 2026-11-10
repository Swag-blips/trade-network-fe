import { query } from "@/api/client";
import type { DashboardOverview, NewForYou } from "../types";

export const dashboardService = {
  newForYou() {
    return query<NewForYou>("/dashboard/new-for-you");
  },

  overview() {
    return query<DashboardOverview>("/dashboard/overview");
  },
};
