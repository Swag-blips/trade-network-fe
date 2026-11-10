import { query } from "@/api/client";
import type { CapitalDeployed, DateRange } from "../types";

export const homeService = {
  capitalDeployed(range: DateRange = {}) {
    return query<CapitalDeployed>("/dashboard/capital-deployed", { ...range });
  },
};
