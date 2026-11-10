import { mutation, query } from "@/api/client";
import { fromMinorUnits, fromSectorCode } from "@/utils/mandate-options";
import type {
  DocumentKind,
  Opportunity,
  OpportunityPage,
  OpportunityPageResponse,
  OpportunityQuery,
  OpportunityResponse,
  OpportunitySummary,
  OpportunitySummaryResponse,
} from "../types/opportunity";

const DOCUMENT_LABELS: Record<DocumentKind, string> = {
  INVOICE: "Invoice",
  PURCHASE_ORDER: "Purchase order",
  DELIVERY_NOTE: "Delivery note",
};

const fromSummary = (
  summary: OpportunitySummaryResponse,
): OpportunitySummary => ({
  id: summary.id,
  name: summary.trade.borrowerName,
  match: summary.matchLevel,
  unread: summary.unread,
  advance: fromMinorUnits(summary.trade.requestedAdvanceMinor),
  expiresAt: summary.expiresAt,
});

const fromResponse = ({
  trade,
  ...opportunity
}: OpportunityResponse): Opportunity => ({
  id: opportunity.id,
  name: trade.borrowerName,
  match: opportunity.matchLevel,
  unread: opportunity.unread,
  advance: fromMinorUnits(trade.requestedAdvanceMinor),
  expiresAt: opportunity.expiresAt,
  status: opportunity.status,
  kind: trade.borrowerRole === "DISTRIBUTOR" ? "Distributor" : "Supplier",
  buyer: trade.counterpartyName,
  industry: fromSectorCode(trade.sector),
  purpose: trade.financingPurpose,
  tradeValue: fromMinorUnits(trade.invoiceValueMinor),
  tenorDays: trade.tenorDays,
  creditTermDays: trade.creditTermDays,
  documents: trade.documents.map((document) => ({
    label: DOCUMENT_LABELS[document.kind] ?? document.kind,
    file: document.fileName,
  })),
});

export const opportunityService = {
  async list(params: OpportunityQuery): Promise<OpportunityPage> {
    const page = await query<OpportunityPageResponse>("/opportunities", {
      ...params,
    });
    return { items: page.items.map(fromSummary), nextCursor: page.nextCursor };
  },

  async get(id: string): Promise<Opportunity> {
    return fromResponse(
      await query<OpportunityResponse>(`/opportunities/${id}`),
    );
  },

  view(id: string) {
    return mutation(`/opportunities/${id}/view`, "post");
  },

  dismiss(id: string) {
    return mutation(`/opportunities/${id}/dismissal`, "post");
  },
};
