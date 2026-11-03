export interface DashboardProfile {
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  profileUid: string;
  /** The organisation's name, e.g. "Brainbit Trading Ltd". */
  profileName: string;
  companyLogo: string | null;
  accountType: "LENDER";
}

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
