/** `GET /dashboard/overview`. Amounts are naira, sent as numbers. */
export interface DashboardOverview {
  capitalAllocation: number;
  availableCapital: number;
  outstandingAmount: number;
}

/**
 * Who received the capital. Matches the lender service's `BorrowerCategory`
 * enum (published in its OpenAPI schema at /hoplender/q/openapi).
 */
export type BorrowerCategory = "DISTRIBUTOR" | "SUPPLIER";

/**
 * One slice of deployed capital. ASSUMED: every account so far returns
 * `categories: []` and the OpenAPI schema omits response bodies, so these
 * field names are a guess from the comp — confirm against a real response.
 */
export interface DeployedCategory {
  category: BorrowerCategory;
  amount: number;
}

/** `GET /dashboard/capital-deployed`. Dates are null for "all time". */
export interface CapitalDeployed {
  startDate: string | null;
  endDate: string | null;
  totalAmount: number;
  categories: DeployedCategory[];
}

/** Both optional, `yyyy-MM-dd`, inclusive. Omit both for all time. */
export interface DateRange {
  startDate?: string;
  endDate?: string;
}
