import { query } from "@/api/client";
import type { DashboardProfile, NewForYou } from "../types";

export const dashboardService = {
  profile() {
    return query<DashboardProfile>("/dashboard/profile", {
      service: "lender",
    });
  },

  newForYou() {
    return query<NewForYou>("/dashboard/new-for-you", { service: "lender" });
  },
};
