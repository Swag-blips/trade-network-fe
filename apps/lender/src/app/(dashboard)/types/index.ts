export interface NewForYou {
  fundingOpportunities: number;
}

/** `GET /dashboard/overview`. Amounts are naira, sent as numbers. */
export interface DashboardOverview {
  capitalAllocation: number;
  availableCapital: number;
  outstandingAmount: number;
}

/** The lender service's `BorrowerCategory` enum (OpenAPI at /hoplender/q/openapi). */
export type BorrowerCategory = "DISTRIBUTOR" | "SUPPLIER";
