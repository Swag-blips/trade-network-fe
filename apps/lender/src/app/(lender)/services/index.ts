import { query } from "@/api/client";
import type { DashboardProfile } from "../types";

export const dashboardService = {
  profile() {
    return query<DashboardProfile>("/dashboard/profile", {
      service: "lender",
    });
  },
};
