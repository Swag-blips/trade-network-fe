import type { QueryClient } from "@tanstack/react-query";
import { readProblemType, readStatus } from "@/api/client";
import { forgetOpportunity } from "./opportunity-cache";
import { CAPITAL_KEY } from "@/hooks/use-capital";
import { ORGANIZATION_KEY } from "@/hooks/use-organization";

export const CONVERSATIONS = ["conversations"] as const;

export const conversationKey = (id: string) =>
  [...CONVERSATIONS, "detail", id] as const;

/** Every negotiation change can move the thread, the inbox and available capital. */
export function refreshNegotiations(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: CONVERSATIONS });
  void queryClient.invalidateQueries({ queryKey: CAPITAL_KEY });
}

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
  refreshNegotiations(queryClient);
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
  refreshNegotiations(queryClient);
}
