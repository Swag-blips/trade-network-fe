import type { BorrowerCategory } from "../../types";

export type MatchLevel = "STRONG" | "MODERATE" | "WEAK";
export type OpportunityStatus = "OPEN" | "DISMISSED" | "WITHDRAWN" | "CLOSED";
export type DocumentKind = "INVOICE" | "PURCHASE_ORDER" | "DELIVERY_NOTE";

/** `GET /opportunities` query. Leave a filter out for "All". */
export interface OpportunityQuery {
  matchLevel?: MatchLevel;
  unread?: boolean;
  limit?: number;
  cursor?: string;
}

export interface OpportunitySummaryResponse {
  id: string;
  score: number;
  matchLevel: MatchLevel;
  unread: boolean;
  expiresAt: string;
  trade: {
    id: string;
    borrowerName: string;
    currency: "NGN";
    requestedAdvanceMinor: number;
  };
}

export interface OpportunityPageResponse {
  items: OpportunitySummaryResponse[];
  nextCursor: string | null;
}

export interface OpportunityResponse {
  id: string;
  score: number;
  matchLevel: MatchLevel;
  status: OpportunityStatus;
  unread: boolean;
  expiresAt: string;
  trade: {
    id: string;
    borrowerName: string;
    borrowerRole: BorrowerCategory;
    counterpartyName: string;
    sector: string;
    fundingType: string;
    financingPurpose: string;
    currency: "NGN";
    invoiceValueMinor: number;
    requestedAdvanceMinor: number;
    tenorDays: number;
    creditTermDays: number;
    paymentDueAt: string;
    documents: { kind: DocumentKind; fileName: string }[];
  };
}

/** A card in the list, in naira. */
export interface OpportunitySummary {
  id: string;
  name: string;
  match: MatchLevel;
  unread: boolean;
  advance: number;
  expiresAt: string;
}

export interface OpportunityPage {
  items: OpportunitySummary[];
  nextCursor: string | null;
}

/** One request in the detail panel, in naira and labels. */
export interface Opportunity extends OpportunitySummary {
  status: OpportunityStatus;
  kind: "Supplier" | "Distributor";
  buyer: string;
  industry: string;
  purpose: string;
  tradeValue: number;
  tenorDays: number;
  creditTermDays: number;
  documents: { label: string; file: string }[];
}
