import type { FinancingPurpose } from "./opportunity";

export type OfferStatus =
  "PENDING" | "WITHDRAWN" | "ACCEPTED" | "REJECTED" | "LAPSED" | "COUNTERED";
export type ConversationStatus = "ACTIVE" | "CLOSED" | "FUNDED";
export type MessageKind = "OFFER" | "DOCUMENT_REQUEST" | "EXIT";
export type Sender = "LENDER" | "BORROWER";
export type FundingStatus =
  "AWAITING_PAYMENT" | "AWAITING_CONFIRMATION" | "ACTIVE" | "EXPIRED";

/** `GET /conversations` query. */
export interface ConversationQuery {
  show?: "all" | "active" | "funded";
  limit?: number;
  cursor?: string;
}

export interface OfferRequest {
  amountMinor: number;
  tenorDays: number;
}

export interface OfferResponse {
  id: string;
  opportunityId: string;
  conversationId: string;
  madeBy: Sender;
  status: OfferStatus;
  amountMinor: number;
  tenorDays: number;
  interestRateBps: number;
  interestMinor: number;
  repaymentMinor: number;
  expiresAt: string;
  createdAt: string;
}

export interface FundingResponse {
  id: string;
  offerId: string;
  status: FundingStatus;
  currency: "NGN";
  amountMinor: number;
  interestMinor: number;
  repaymentMinor: number;
  tenorDays: number;
  payBy: string;
  paidAt: string | null;
  confirmedAt: string | null;
  maturesAt: string | null;
}

export interface DocumentRequestResponse {
  id: string;
  conversationId: string;
  documents: string[];
  sentAt: string;
}

export interface ConversationSummaryResponse {
  id: string;
  opportunityId: string;
  status: ConversationStatus;
  borrowerName: string;
  lastMessage: { kind: MessageKind; sentAt: string } | null;
  lastMessageAt: string;
}

export interface ConversationPageResponse {
  items: ConversationSummaryResponse[];
  nextCursor: string | null;
}

export type MessageResponse =
  | {
      id: string;
      kind: "DOCUMENT_REQUEST";
      sender: Sender;
      sentAt: string;
      documents: string[];
    }
  | {
      id: string;
      kind: "OFFER";
      sender: Sender;
      sentAt: string;
      offer: OfferResponse;
    }
  | { id: string; kind: "EXIT"; sender: "LENDER"; sentAt: string };

export interface ConversationResponse {
  id: string;
  opportunityId: string;
  status: ConversationStatus;
  startedAt: string;
  lastMessageAt: string;
  pendingOfferId: string | null;
  funding: FundingResponse | null;
  trade: {
    id: string;
    borrowerName: string;
    financingPurpose: FinancingPurpose;
    currency: "NGN";
    requestedAdvanceMinor: number;
    tenorDays: number;
    expiresAt: string;
  };
  messages: MessageResponse[];
}

/** What the lender types into the offer modal, in naira and percent. */
export interface OfferTerms {
  amount: number;
  tenorDays: number;
  /** Flat, over the whole tenure. */
  ratePercent: number;
}

export interface Offer extends OfferTerms {
  id: string;
  opportunityId: string;
  conversationId: string;
  madeBy: Sender;
  status: OfferStatus;
  interest: number;
  repayment: number;
}

/** An accepted offer, in naira. */
export interface Funding {
  id: string;
  status: FundingStatus;
  amount: number;
  payBy: string;
}

export type Message =
  | {
      id: string;
      kind: "documents";
      outgoing: boolean;
      sentAt: string;
      documents: string[];
    }
  | {
      id: string;
      kind: "offer";
      outgoing: boolean;
      sentAt: string;
      offer: Offer;
    }
  | { id: string; kind: "exit"; outgoing: true; sentAt: string };

export type InboxShow = "All" | "On-going" | "Funded";

export interface ConversationSummary {
  id: string;
  opportunityId: string;
  status: ConversationStatus;
  name: string;
  lastMessage: Message["kind"] | null;
}

export interface ConversationPage {
  items: ConversationSummary[];
  nextCursor: string | null;
}

/** The request being negotiated, in naira. */
export interface OfferTarget {
  id: string;
  name: string;
  advance: number;
  tenorDays: number;
  expiresAt: string;
}

export interface Conversation {
  id: string;
  status: ConversationStatus;
  startedAt: string;
  /** The lender's offer or the enterprise's counter. */
  pendingOffer: Offer | null;
  funding: Funding | null;
  opportunity: OfferTarget & { purpose: string };
  messages: Message[];
}
