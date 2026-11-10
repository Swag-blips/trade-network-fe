import type { Opportunity } from "./opportunity";

export interface OfferTerms {
  amount: number;
  tenorDays: number;
  /** Flat, over the whole tenure. */
  ratePercent: number;
}

export type Message =
  | { id: string; kind: "documents"; sentAt: string; documents: string[] }
  | { id: string; kind: "offer"; sentAt: string; terms: OfferTerms };

export type InboxShow = "Active" | "Funded";

export interface Conversation {
  opportunity: Opportunity;
  startedAt: string;
  funded: boolean;
  messages: Message[];
}
