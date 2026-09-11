import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export type OfferStatus =
  "in-review" | "action-required" | "accepted" | "countered" | "declined";

export interface OfferTerms {
  advance: string;
  fee: string;
  feeRate: string;
  tenor: string;
  expires: string;
}

export interface TimelineEntry {
  id: string;
  kind: "offer-sent" | "counter-offer" | "terms-agreed";
  title: string;
  by: string;
  day: string;
  /** Tai's read on a counter offer. `text` marks emphasis with `**…**`. */
  recommendation?: { text: string; proposal: OfferTerms };
  terms: OfferTerms;
}

export interface Offer {
  id: string;
  applicant: string;
  kind: "Supplier" | "Distributor";
  initials: string;
  sentOn: string;
  expires: string;
  status: OfferStatus;
  unread?: boolean;
  invoiceValue: string;
  requestedAdvance: string;
  tenor: string;
  timeline: TimelineEntry[];
}

export const OFFER_STATUS: Record<
  OfferStatus,
  { label: string; className: string; icon?: IconSvgElement }
> = {
  "in-review": { label: "In review", className: "bg-blue-50 text-blue-500" },
  "action-required": {
    label: "Action required",
    className: "bg-orange-50 text-orange-500",
    icon: AlertCircleIcon,
  },
  countered: { label: "Countered", className: "bg-ochre-50 text-ochre-700" },
  accepted: { label: "Accepted", className: "bg-evergreen-50 text-green-500" },
  declined: {
    label: "Declined",
    className: "bg-cordovan-50 text-red-error-500",
  },
};
