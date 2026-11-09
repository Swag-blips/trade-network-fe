import { query } from "@/api/client";
import type { NewForYou } from "../types";

export const dashboardService = {
  newForYou() {
    return query<NewForYou>("/dashboard/new-for-you");
  },
};
