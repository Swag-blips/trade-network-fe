import type { TradeRoomData } from "@/components/trade-room";

export type CustomerStatus = "outstanding" | "repaid" | "overdue" | "settled";
export type HealthLevel = "healthy" | "watch" | "at-risk" | "critical";

export interface FundedTrade {
  id: string;
  fundingType: string;
  outstanding: string;
  dueDate: string;
  status: CustomerStatus;
  paymentDue: string;
  summary: string;
  maturityDate: string;
  overdueExposure: string;
  tradeExceptions: string;
  amountFunded: string;
  fee: string;
  tenor: string;
  verified: boolean;
  duplicateFunding: string;
  tradeRoom: TradeRoomData;
}

export interface Repayment {
  id: string;
  date: string;
  tradeId: string;
  amount: string;
  remainingBalance: string;
  evidence?: string;
}

export interface Relationship {
  name: string;
  initials: string;
  kind: "business" | "capital-provider";
}

export interface CompanyAbout {
  businessNumber: string;
  address: string;
  industry: string;
  email: string;
  phone: string;
  relationships: Relationship[];
}

export interface Customer {
  id: string;
  name: string;
  kind: "Supplier" | "Distributor";
  initials: string;
  outstanding: string;
  repaymentDue: string;
  status: CustomerStatus;
  health: HealthLevel;
  unread?: boolean;
  totalFunded: string;
  obligorLimitLeft: string;
  about: CompanyAbout;
  activeTrades: number;
  summary: string;
  trades: FundedTrade[];
  repayments: Repayment[];
}

export const CUSTOMER_STATUS: Record<
  CustomerStatus,
  { label: string; className: string }
> = {
  outstanding: {
    label: "Outstanding",
    className: "bg-orange-100 text-orange-500",
  },
  repaid: { label: "Repaid", className: "bg-evergreen-50 text-green-500" },
  overdue: { label: "Overdue", className: "bg-cordovan-50 text-red-error-500" },
  settled: { label: "Settled", className: "bg-grey-100 text-grey-600" },
};

export const HEALTH: Record<
  HealthLevel,
  { label: string; filled: number; className: string }
> = {
  healthy: { label: "Healthy", filled: 4, className: "bg-green-500" },
  watch: { label: "Watch", filled: 3, className: "bg-ochre-600" },
  "at-risk": { label: "At risk", filled: 2, className: "bg-orange-500" },
  critical: { label: "Critical", filled: 1, className: "bg-red-error-500" },
};

export const PORTFOLIO_HEALTH: Record<
  HealthLevel,
  { label: string; className: string }
> = {
  healthy: { label: "On track", className: "text-green-500" },
  watch: { label: "Need attention", className: "text-orange-500" },
  "at-risk": { label: "At risk", className: "text-red-error-500" },
  critical: { label: "At risk", className: "text-red-error-500" },
};
