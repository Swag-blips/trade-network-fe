import { useQuery } from "@tanstack/react-query";
import { readStatus } from "@/api/client";
import { capitalService } from "@/services/capital";

export const CAPITAL_KEY = ["capital"];

export function useCapital() {
  return useQuery({
    queryKey: CAPITAL_KEY,
    queryFn: capitalService.get,
    retry: (failures, error) => {
      const status = readStatus(error);
      return status !== 404 && status !== 403 && failures < 3;
    },
  });
}
