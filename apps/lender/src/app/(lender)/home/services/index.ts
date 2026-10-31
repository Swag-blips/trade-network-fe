import { query } from "@/api/client";
import type { CapitalDeployed, DashboardOverview, DateRange } from "../types";

export const homeService = {
  overview() {
    return query<DashboardOverview>("/dashboard/overview", {
      service: "lender",
    });
  },

  capitalDeployed(range: DateRange = {}) {
    return query<CapitalDeployed>("/dashboard/capital-deployed", {
      service: "lender",
      params: { ...range },
    });
  },
};
