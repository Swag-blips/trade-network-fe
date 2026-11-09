import type { Opportunity, OpportunityDetail } from "./types/opportunity";

// Placeholder detail until the detail and trade-room endpoints are wired:
// the list is live, but what the modal shows is still generated from the card.

export function detailFor(item: Opportunity): OpportunityDetail {
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
