import { useQuery } from "@tanstack/react-query";
import { homeService } from "../services";
import type { DateRange } from "../types";

export function useCapitalDeployed(range: DateRange = {}) {
  return useQuery({
    queryKey: ["dashboard", "capital-deployed", range],
    queryFn: () => homeService.capitalDeployed(range),
  });
}
