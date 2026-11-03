import type { BorrowerCategory } from "../../types";

export type BorrowerKind = "Supplier" | "Distributor";

/** What a card renders — built from an `OpportunitySummary` by `toOpportunity`. */
export interface Opportunity {
  id: string;
  name: string;
  kind: BorrowerKind;
  initials: string;
  match: number;
  advance: string;
  counterparty: string;
  counterpartyInitials: string;
  tenor: string;
  expires: string;
  /** ISO date, kept for the "Expiring soonest" sort. */
  expiresAt: string;
  unread?: boolean;
}

export type OpportunityFilter = "all" | "Supplier" | "Distributor";

export type EvidenceStatus = "requested" | "pending" | "verified";

export interface EvidenceStep {
  id: string;
  label: string;
  status: EvidenceStatus;
}

export interface TradeActivity {
  id: string;
  title: string;
  at: string;
  description: string;
}

export interface OpportunityDetail {
  metrics: { id: string; label: string; value: string }[];
  summary: { verdict: string; body: string };
  trade: {
    seller: string;
    buyer: string;
    buyerInitials: string;
    rows: { label: string; value: string; verified?: boolean }[];
  };
  evidence: EvidenceStep[];
  activity: TradeActivity[];
}

/** The lender service's `MatchLevel` enum. */
export type MatchLevel = "STRONG" | "MODERATE" | "WEAK";

/** `GET /opportunities` query. `page` is 1-based; omit a filter for "all". */
export interface OpportunityQuery {
  borrowerRole?: BorrowerCategory;
  matchLevel?: MatchLevel;
  page?: number;
  size?: number;
}

/**
 * One matched opportunity in the list. ASSUMED: every account so far returns
 * `payload: []` and the OpenAPI schema omits response bodies, so these field
 * names are a guess from the card — confirm against a real response, then fix
 * only this type and `toOpportunity`.
 */
export interface OpportunitySummary {
  opportunityUid: string;
  borrowerName: string;
  borrowerRole: BorrowerCategory;
  matchScore: number;
  matchLevel: MatchLevel;
  requestedAmount: number;
  counterpartyName: string;
  tenor: string;
  expiryDate: string;
}

/**
 * `GET /opportunities`. The three counts drive the tabs; whether they are
 * narrowed by `matchLevel` / `borrowerRole` is unverified (every account is
 * empty), so the tabs show whatever the latest response says.
 */
export interface OpportunityPage {
  allCount: number;
  supplierCount: number;
  distributorCount: number;
  opportunities: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    payload: OpportunitySummary[];
  };
}
