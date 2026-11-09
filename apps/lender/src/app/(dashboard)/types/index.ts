/** `GET /dashboard/new-for-you` — counts of things waiting on the lender. */
export interface NewForYou {
  fundingOpportunities: number;
}

/**
 * A borrower's role. Matches the lender service's `BorrowerCategory` enum
 * (published in its OpenAPI schema at /hoplender/q/openapi). Used by the
 * capital-deployed breakdown and the matched-opportunities filter.
 */
export type BorrowerCategory = "DISTRIBUTOR" | "SUPPLIER";
