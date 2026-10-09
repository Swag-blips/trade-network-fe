export type BorrowerKind = "Supplier" | "Distributor";

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
  href: string;
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
