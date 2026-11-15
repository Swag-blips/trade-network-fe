export type TradeStatus =
  | "outstanding"
  | "overdue"
  | "repaid"
  | "awaiting-payment"
  | "awaiting-confirmation"
  | "expired";
export type InstallmentStatus = "paid" | "upcoming" | "overdue";
export type HealthLevel = "healthy" | "at-risk";

export interface PortfolioSummary {
  financed: number;
  outstanding: number;
  activeFundings: number;
  overdueFundings: number;
}

export interface BorrowerSummary {
  id: string;
  name: string;
  industry: string;
  activeFundings: number;
  outstanding: number;
  nextRepaymentAt: string | null;
  overdue: boolean;
  health: HealthLevel;
}

export interface BorrowerPage {
  items: BorrowerSummary[];
  nextCursor: string | null;
}

export interface Borrower {
  id: string;
  name: string;
  industry: string;
  health: HealthLevel;
  description: string | null;
  contact: { name: string; email: string; phone: string } | null;
  counterparties: { name: string; trades: number }[];
  financed: number;
  outstanding: number;
  fundings: { active: number; dueSoon: number; overdue: number };
}

export interface FundingSummary {
  id: string;
  reference: string;
  status: TradeStatus;
  amount: number;
  outstanding: number;
  nextRepaymentAt: string | null;
}

export interface Installment {
  id: string;
  sequence: number;
  dueAt: string;
  amount: number;
  status: InstallmentStatus;
}

export interface Funding {
  id: string;
  reference: string;
  status: TradeStatus;
  overdue: boolean;
  amount: number;
  interestRate: number;
  interest: number;
  repayment: number;
  outstanding: number;
  nextRepaymentAt: string | null;
  tenorDays: number;
  confirmedAt: string | null;
  purpose: string;
  invoiceNumber: string | null;
  borrower: { id: string; name: string };
  installments: Installment[];
}

export const TRADE_STATUS: Record<
  TradeStatus,
  { label: string; className: string }
> = {
  outstanding: {
    label: "Outstanding",
    className: "bg-purple-100 text-purple-500",
  },
  overdue: { label: "Overdue", className: "bg-red-error-100 text-red-error-500" },
  repaid: { label: "Repaid", className: "bg-green-50 text-green-500" },
  "awaiting-payment": {
    label: "Awaiting payment",
    className: "bg-grey-100 text-grey-700",
  },
  "awaiting-confirmation": {
    label: "Awaiting confirmation",
    className: "bg-grey-100 text-grey-700",
  },
  expired: { label: "Expired", className: "bg-grey-100 text-grey-500" },
};

export const INSTALLMENT_STATUS: Record<
  InstallmentStatus,
  { label: string; className: string }
> = {
  paid: { label: "Paid", className: "text-green-500" },
  upcoming: { label: "Upcoming", className: "text-grey-900" },
  overdue: { label: "Overdue", className: "text-red-error-500" },
};

export const PORTFOLIO_HEALTH: Record<
  HealthLevel,
  { label: string; className: string }
> = {
  healthy: { label: "On track", className: "text-green-500" },
  "at-risk": { label: "At risk", className: "text-red-error-500" },
};
