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
        paymentDue: "Oct 02,2026",
        summary:
          "Repayment is on track with no exceptions raised. The buyer has confirmed delivery and the invoice is validated.",
        maturityDate: "October 3, 2026",
        overdueExposure: "None",
        tradeExceptions: "None",
        amountFunded: "₦8,400,000",
        fee: "₦80,000",
        tenor: "30 days",
        verified: true,
        duplicateFunding: "None",
        tradeRoom: {
          seller: "Titan Suppliers",
          sellerInitials: "TS",
          buyer: "Unilever",
          buyerInitials: "UN",
          rows: [
            { label: "Financing need", value: "Early payment" },
            { label: "Buyer credit terms", value: "30 days" },
            { label: "Total trade volume", value: "₦54,450,000" },
            { label: "Sector", value: "Manufacturing" },
            { label: "Payment due", value: "Sept, 25 2026" },
            { label: "Delivery status", value: "Verified", verified: true },
          ],
          evidence: [
            { id: "finance", label: "Finance", status: "verified" },
            {
              id: "payment-confirmation",
              label: "Payment confirmation",
              status: "verified",
            },
            {
              id: "invoice-validation",
              label: "Invoice validation",
              status: "verified",
            },
            {
              id: "order-confirmation",
              label: "Order confirmation",
              status: "verified",
            },
            { id: "delivery", label: "Delivery", status: "verified" },
            {
              id: "purchase-order",
              label: "Purchase order",
              status: "verified",
            },
          ],
          activity: [
            {
              id: "invoice-issued",
              kind: "invoice",
              title: "Invoice issued",
              at: "10:02 AM",
              description:
                "Titan Suppliers issued invoice “INV-2026-1121” to Unilever.",
            },
            {
              id: "delivery-confirmed",
              kind: "delivery",
              title: "Delivery confirmed",
              at: "12 Aug, 2026",
              description:
                "Unilever accepted and confirmed the delivery of the goods.",
            },
            {
              id: "goods-shipped",
              kind: "shipment",
              title: "Goods shipped",
              at: "12 Aug, 2026",
              description:
                "Titan Suppliers shipped the goods via GIG logistics.",
            },
          ],
        },
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
        paymentDue: "Oct 09,2025",
        summary:
          "Settled in full ahead of the maturity date. No exceptions across the evidence trail.",
        maturityDate: "October 9, 2025",
        overdueExposure: "None",
        tradeExceptions: "None",
        amountFunded: "₦6,000,000",
        fee: "₦72,000",
        tenor: "30 days",
        verified: true,
        duplicateFunding: "None",
        tradeRoom: {
          seller: "Greenline Logistics",
          sellerInitials: "GL",
          buyer: "Dangote Group",
          buyerInitials: "DG",
          rows: [
            { label: "Financing need", value: "Invoice discounting" },
            { label: "Buyer credit terms", value: "30 days" },
            { label: "Total trade volume", value: "₦31,200,000" },
            { label: "Sector", value: "Logistics" },
            { label: "Payment due", value: "Oct, 02 2025" },
            { label: "Delivery status", value: "Verified", verified: true },
          ],
          evidence: [
            { id: "finance", label: "Finance", status: "verified" },
            {
              id: "payment-confirmation",
              label: "Payment confirmation",
              status: "verified",
            },
            {
              id: "invoice-validation",
              label: "Invoice validation",
              status: "verified",
            },
            {
              id: "order-confirmation",
              label: "Order confirmation",
              status: "verified",
            },
            { id: "delivery", label: "Delivery", status: "verified" },
            {
              id: "purchase-order",
              label: "Purchase order",
              status: "verified",
            },
          ],
          activity: [
            {
              id: "invoice-issued",
              kind: "invoice",
              title: "Invoice issued",
              at: "10:02 AM",
              description:
                "Greenline Logistics issued invoice “INV-2026-1121” to Dangote Group.",
            },
            {
              id: "delivery-confirmed",
              kind: "delivery",
              title: "Delivery confirmed",
              at: "12 Aug, 2026",
              description:
                "Dangote Group accepted and confirmed the delivery of the goods.",
            },
            {
              id: "goods-shipped",
              kind: "shipment",
              title: "Goods shipped",
              at: "12 Aug, 2026",
              description:
                "Greenline Logistics shipped the goods via GIG logistics.",
            },
          ],
        },
      },
    ],
    repayments: [
      {
        id: "RP-0001",
        date: "Oct 02, 2025",
        tradeId: "FT-0002",
        amount: "₦6,072,000",
        remainingBalance: "₦0",
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
        paymentDue: "Aug 18,2025",
        summary:
          "Repayment is 21 days past due. Collections has been notified and the buyer has not confirmed a new date.",
        maturityDate: "August 18, 2025",
        overdueExposure: "₦4,120,000",
        tradeExceptions: "1 open",
        amountFunded: "₦7,200,000",
        fee: "₦86,400",
        tenor: "60 days",
        verified: false,
        duplicateFunding: "None",
        tradeRoom: {
          seller: "Harvest Mills",
          sellerInitials: "HM",
          buyer: "Shoprite",
          buyerInitials: "SH",
          rows: [
            { label: "Financing need", value: "Working capital" },
            { label: "Buyer credit terms", value: "60 days" },
            { label: "Total trade volume", value: "₦22,800,000" },
            { label: "Sector", value: "Agriculture" },
            { label: "Payment due", value: "Aug, 11 2025" },
            { label: "Delivery status", value: "Verified", verified: true },
          ],
          evidence: [
            { id: "finance", label: "Finance", status: "verified" },
            {
              id: "payment-confirmation",
              label: "Payment confirmation",
              status: "verified",
            },
            {
              id: "invoice-validation",
              label: "Invoice validation",
              status: "verified",
            },
            {
              id: "order-confirmation",
              label: "Order confirmation",
              status: "verified",
            },
            { id: "delivery", label: "Delivery", status: "verified" },
            {
              id: "purchase-order",
              label: "Purchase order",
              status: "verified",
            },
          ],
          activity: [
            {
              id: "invoice-issued",
              kind: "invoice",
              title: "Invoice issued",
              at: "10:02 AM",
              description:
                "Harvest Mills issued invoice “INV-2026-1121” to Shoprite.",
            },
            {
              id: "delivery-confirmed",
              kind: "delivery",
              title: "Delivery confirmed",
              at: "12 Aug, 2026",
              description:
                "Shoprite accepted and confirmed the delivery of the goods.",
            },
            {
              id: "goods-shipped",
              kind: "shipment",
              title: "Goods shipped",
              at: "12 Aug, 2026",
              description: "Harvest Mills shipped the goods via GIG logistics.",
            },
          ],
        },
      },
    ],
    repayments: [
      {
        id: "RP-0002",
        date: "Jul 18, 2025",
        tradeId: "FT-0003",
        amount: "₦3,166,400",
        remainingBalance: "₦4,120,000",
      },
    ],
  },
];
