import { naira } from "@/utils/naira";
import type { Opportunity, OpportunitySummary } from "../types/opportunity";

/** "Titan Suppliers" → "TI", as the comps draw it. */
const initials = (name: string) => name.trim().slice(0, 2).toUpperCase();

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export function toOpportunity(summary: OpportunitySummary): Opportunity {
  return {
    id: summary.opportunityUid,
    name: summary.borrowerName,
    kind: summary.borrowerRole === "DISTRIBUTOR" ? "Distributor" : "Supplier",
    initials: initials(summary.borrowerName),
    match: Math.round(summary.matchScore),
    advance: naira(summary.requestedAmount),
    counterparty: summary.counterpartyName,
    counterpartyInitials: initials(summary.counterpartyName),
    tenor: summary.tenor,
    expires: date(summary.expiryDate),
    expiresAt: summary.expiryDate,
  };
}
