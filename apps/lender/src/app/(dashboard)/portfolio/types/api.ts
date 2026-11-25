import type { FinancingPurpose } from "@/utils/financing-purpose";

export type FundingStatus =
  | "AWAITING_PAYMENT"
  | "AWAITING_CONFIRMATION"
  | "ACTIVE"
  | "REPAID"
  | "EXPIRED";
export type InstallmentStatusCode = "RECEIVED" | "UPCOMING" | "OVERDUE";

export interface PortfolioResponse {
  currency: "NGN";
  financedMinor: number;
  outstandingMinor: number;
  activeFundings: number;
  overdueFundings: number;
}

/** `GET /portfolio/borrowers` query. */
export type BorrowerQuery = {
  search?: string;
  limit?: number;
  cursor?: string;
};

export interface BorrowerSummaryResponse {
  id: string;
  name: string;
  sector: string;
  lastFundedAt: string;
  activeFundings: number;
  outstandingMinor: number;
  nextRepaymentAt: string | null;
  overdue: boolean;
}

export interface BorrowerPageResponse {
  items: BorrowerSummaryResponse[];
  nextCursor: string | null;
}

export interface BorrowerResponse {
  id: string;
  name: string;
  sector: string;
  description: string | null;
  countryCode: string;
  state: string | null;
  streetAddress: string | null;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
  counterparties: { name: string; trades: number }[];
  financedMinor: number;
  outstandingMinor: number;
  fundings: { active: number; dueSoon: number; overdue: number };
}

export interface FundingSummaryResponse {
  id: string;
  reference: string;
  status: FundingStatus;
  overdue: boolean;
  amountMinor: number;
  outstandingMinor: number;
  nextRepaymentAt: string | null;
  confirmedAt: string | null;
}

export interface InstallmentResponse {
  id: string;
  fundingId: string;
  sequence: number;
  dueAt: string;
  amountMinor: number;
  status: InstallmentStatusCode;
  receivedAt: string | null;
}

export interface FundingResponse {
  id: string;
  reference: string;
  status: FundingStatus;
  overdue: boolean;
  currency: "NGN";
  amountMinor: number;
  interestRateBps: number;
  interestMinor: number;
  repaymentMinor: number;
  outstandingMinor: number;
  nextRepaymentAt: string | null;
  tenorDays: number;
  confirmedAt: string | null;
  maturesAt: string | null;
  repaidAt: string | null;
  trade: {
    id: string;
    financingPurpose: FinancingPurpose;
    invoiceNumber: string | null;
    counterpartyName: string;
  };
  borrower: { id: string; name: string };
  installments: InstallmentResponse[];
}
