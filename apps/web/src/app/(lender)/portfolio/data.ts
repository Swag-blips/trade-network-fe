import type { Customer } from "./types/customer";

export const PORTFOLIO_SUMMARY = {
  availableCapital: "₦700,000,000",
  outstanding: "₦8,500,000",
  suppliersFunded: 1,
  distributorsFunded: 0,
};

export const CUSTOMERS: Customer[] = [
  {
    id: "titan-suppliers",
    name: "Titan suppliers",
    kind: "Supplier",
    initials: "TS",
    outstanding: "₦8,500,000",
    repaymentDue: "Sept 02, 2026",
    status: "outstanding",
    health: "healthy",
    unread: true,
    totalFunded: "₦8,400,000",
    obligorLimitLeft: "₦42,500,000",
    activeTrades: 1,
    summary: "This is a summary of what's going on with this customer...",
    trades: [
      {
        id: "FT-0001",
        fundingType: "Working capital",
        outstanding: "₦8,480,000",
        dueDate: "Sept 02, 2026",
        status: "outstanding",
      },
    ],
    repayments: [],
  },
  {
    id: "greenline-logistics",
    name: "Greenline logistics",
    kind: "Supplier",
    initials: "GL",
    outstanding: "₦0",
    repaymentDue: "Oct 09, 2025",
    status: "repaid",
    health: "healthy",
    totalFunded: "₦6,000,000",
    obligorLimitLeft: "₦24,000,000",
    activeTrades: 0,
    summary:
      "Repaid in full and ahead of schedule. A good candidate for a larger limit.",
    trades: [
      {
        id: "FT-0002",
        fundingType: "Invoice discounting",
        outstanding: "₦0",
        dueDate: "Oct 09, 2025",
        status: "repaid",
      },
    ],
    repayments: [
      {
        id: "RP-0001",
        date: "Oct 02, 2025",
        amount: "₦6,072,000",
        method: "Bank transfer",
      },
    ],
  },
  {
    id: "harvest-mills",
    name: "Harvest mills",
    kind: "Distributor",
    initials: "HM",
    outstanding: "₦4,120,000",
    repaymentDue: "Aug 18, 2025",
    status: "overdue",
    health: "at-risk",
    totalFunded: "₦7,200,000",
    obligorLimitLeft: "₦12,800,000",
    activeTrades: 1,
    summary:
      "One repayment is 21 days past due. Collections has been notified.",
    trades: [
      {
        id: "FT-0003",
        fundingType: "Working capital",
        outstanding: "₦4,120,000",
        dueDate: "Aug 18, 2025",
        status: "overdue",
      },
    ],
    repayments: [
      {
        id: "RP-0002",
        date: "Jul 18, 2025",
        amount: "₦3,166,400",
        method: "Direct debit",
      },
    ],
  },
];
