import { useQuery } from "@tanstack/react-query";
import { mandateService } from "../services";

export const MANDATE_KEY = ["mandate"];

export function useMandate() {
  return useQuery({ queryKey: MANDATE_KEY, queryFn: mandateService.get });
}
