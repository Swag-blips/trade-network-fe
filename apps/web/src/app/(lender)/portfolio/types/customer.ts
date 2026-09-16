import type { TradeRoomData } from "@/components/trade-room";

export type CustomerStatus = "outstanding" | "repaid" | "overdue";
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
  amount: string;
  method: string;
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
