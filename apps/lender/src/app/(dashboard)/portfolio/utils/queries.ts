import { readStatus } from "@/api/client";

export const PORTFOLIO = ["portfolio"] as const;
export const SUMMARY_KEY = [...PORTFOLIO, "summary"] as const;
export const borrowersKey = (search: string) =>
  [...PORTFOLIO, "borrowers", search] as const;
export const borrowerKey = (id: string) =>
  [...PORTFOLIO, "borrower", id] as const;
export const fundingsKey = (borrowerId: string) =>
  [...PORTFOLIO, "fundings", borrowerId] as const;
export const fundingKey = (id: string) => [...PORTFOLIO, "funding", id] as const;

/** A 4xx won't change on a retry: no mandate, no permission, not found. */
export function retryServerErrors(failures: number, error: unknown) {
  const status = readStatus(error);
  return (status === undefined || status >= 500) && failures < 3;
}
