import type { QueryClient } from "@tanstack/react-query";
import { readProblemType, readStatus } from "@/api/client";
import { forgetOpportunity } from "./opportunity-cache";
import { ORGANIZATION_KEY } from "@/hooks/use-organization";

export const CONVERSATIONS = ["conversations"] as const;

export const conversationKey = (id: string) =>
  [...CONVERSATIONS, "detail", id] as const;

/** Errors the dialog stays open for, so the terms can be corrected and resent. */
export function isFormError(error: unknown) {
  const type = readProblemType(error);
  return type === "validation-failed" || type === "capital-exceeded";
}

/** The first offer or document request moves the request out of Requests. */
export function afterNegotiation(
  queryClient: QueryClient,
  opportunityId: string,
) {
  forgetOpportunity(queryClient, opportunityId);
  void queryClient.invalidateQueries({ queryKey: CONVERSATIONS });
}

export function settleNegotiationError(
  queryClient: QueryClient,
  error: unknown,
  opportunityId?: string,
) {
  const status = readStatus(error);
  if (
    opportunityId &&
    (status === 404 || readProblemType(error) === "opportunity-not-open")
  ) {
    forgetOpportunity(queryClient, opportunityId);
  }
  if (status === 403) {
    void queryClient.invalidateQueries({
      queryKey: ORGANIZATION_KEY,
    });
  }
  void queryClient.invalidateQueries({ queryKey: CONVERSATIONS });
}
