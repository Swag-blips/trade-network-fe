import type { Opportunity, OpportunityDetail } from "./types/opportunity";

// Placeholder content matching the Figma frames. Replace once the API exists.

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "titan",
    name: "Titan Suppliers",
    kind: "Supplier",
    initials: "TI",
    match: 92,
    advance: "₦8,500,000",
    counterparty: "Unilever",
    counterpartyInitials: "UN",
    tenor: "30 days",
    expires: "Sept 16, 2026",
    href: "/matched/titan",
    unread: true,
  },
  {
    id: "northline",
    name: "Northline Stores",
    kind: "Distributor",
    initials: "NL",
    match: 86,
    advance: "₦6,250,000",
    counterparty: "Emzor Pharmaceuticals",
    counterpartyInitials: "EM",
    tenor: "30 days",
    expires: "Sept 16, 2026",
    href: "/matched/northline",
    unread: true,
  },
  {
    id: "averra",
    name: "Averra Limited",
    kind: "Supplier",
    initials: "AV",
    match: 65,
    advance: "₦12,400,000",
    counterparty: "AgroTrade Co.",
    counterpartyInitials: "AG",
    tenor: "45 days",
    expires: "Oct 12, 2026",
    href: "/matched/averra",
  },
  {
    id: "riverview",
    name: "Riverview Logistics",
    kind: "Supplier",
    initials: "RI",
    match: 42,
    advance: "₦5,200,000",
    counterparty: "Delta Foods",
    counterpartyInitials: "DE",
    tenor: "21 days",
    expires: "Oct 28, 2026",
    href: "/matched/riverview",
  },
];

function detailFor(item: Opportunity): OpportunityDetail {
  return {
    metrics: [
      { id: "advance", label: "Requested advance", value: item.advance },
      { id: "invoice", label: "Invoice value", value: "₦10,680,000" },
      { id: "obligor", label: "Obligor exposure", value: item.advance },
      { id: "tenor", label: "Tenor", value: item.tenor },
    ],
    summary: {
      verdict: `Eligible for consideration (${item.match}% match)`,
      body: "This opportunity meets your key funding criteria and the underlying trade has been verified. Based on your mandate, it looks like a strong fit for consideration.",
    },
    trade: {
      seller: item.name,
      buyer: item.counterparty,
      buyerInitials: item.counterpartyInitials,
      rows: [
        { label: "Financing need", value: "Early payment" },
        { label: "Buyer credit terms", value: item.tenor },
        { label: "Total trade volume", value: "₦54,450,000" },
        { label: "Sector", value: "Manufacturing" },
        { label: "Payment due", value: "Sept, 25 2026" },
        { label: "Delivery status", value: "Verified", verified: true },
      ],
    },
    evidence: [
      { id: "finance", label: "Finance", status: "requested" },
      { id: "payment", label: "Payment confirmation", status: "pending" },
      { id: "invoice", label: "Invoice validation", status: "verified" },
      { id: "order", label: "Order confirmation", status: "verified" },
      { id: "delivery", label: "Delivery", status: "verified" },
      { id: "po", label: "Purchase order", status: "verified" },
    ],
    activity: [
      {
        id: "invoice-issued",
        title: "Invoice issued",
        at: "10:02 AM",
        description: `${item.name} issued invoice "INV-2026-1121" to ${item.counterparty}.`,
      },
      {
        id: "delivery-confirmed",
        title: "Delivery confirmed",
        at: "12 Aug, 2026",
        description: `${item.counterparty} accepted and confirmed the delivery of the goods.`,
      },
      {
        id: "goods-shipped",
        title: "Goods shipped",
        at: "12 Aug, 2026",
        description: `${item.name} shipped the goods via GIG logistics`,
      },
      {
        id: "po-confirmed",
        title: "Purchase order confirmed",
        at: "12 Aug, 2026",
        description: `${item.name} confirmed and accepted purchase order "PO-2026-7781".`,
      },
      {
        id: "po-submitted",
        title: "Purchase order submitted",
        at: "Aug 12, 2026",
        description: `${item.counterparty} submitted purchase order "PO-2026-7781"`,
      },
    ],
  };
}

export const OPPORTUNITY_DETAILS: Record<string, OpportunityDetail> =
  Object.fromEntries(OPPORTUNITIES.map((item) => [item.id, detailFor(item)]));
