import { mutation, query } from "@/api/client";
import { fromBps, fromSectorCode } from "@/utils/mandate-options";
import { purposeLabel } from "@/utils/financing-purpose";
import { fromMinorUnits, toMinorUnits } from "@/utils/naira";
import type {
  Conversation,
  ConversationPage,
  ConversationPageResponse,
  ConversationQuery,
  ConversationResponse,
  DocumentRequestResponse,
  Funding,
  FundingResponse,
  Message,
  MessageResponse,
  Offer,
  OfferRequest,
  OfferResponse,
  OfferTerms,
} from "../types/inbox";
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
  purpose: purposeLabel(trade.financingPurpose),
  tradeValue: fromMinorUnits(trade.invoiceValueMinor),
  tenorDays: trade.tenorDays,
  creditTermDays: trade.creditTermDays,
  documents: trade.documents.map((document) => ({
    label: DOCUMENT_LABELS[document.kind] ?? document.kind,
    file: document.fileName,
  })),
});

const fromOffer = (offer: OfferResponse): Offer => ({
  id: offer.id,
  opportunityId: offer.opportunityId,
  conversationId: offer.conversationId,
  madeBy: offer.madeBy,
  status: offer.status,
  amount: fromMinorUnits(offer.amountMinor),
  tenorDays: offer.tenorDays,
  ratePercent: fromBps(offer.interestRateBps),
  interest: fromMinorUnits(offer.interestMinor),
  repayment: fromMinorUnits(offer.repaymentMinor),
});

const toOffer = (terms: OfferTerms): OfferRequest => ({
  amountMinor: toMinorUnits(terms.amount),
  tenorDays: terms.tenorDays,
});

const fromFunding = (funding: FundingResponse): Funding => ({
  id: funding.id,
  reference: funding.reference,
  offerId: funding.offerId,
  status: funding.status,
  amount: fromMinorUnits(funding.amountMinor),
  payBy: funding.payBy,
  confirmedAt: funding.confirmedAt,
});

const fromMessage = (message: MessageResponse): Message => {
  switch (message.kind) {
    case "OFFER":
      return {
        id: message.id,
        kind: "offer",
        outgoing: message.sender === "LENDER",
        sentAt: message.sentAt,
        offer: fromOffer(message.offer),
      };
    case "DOCUMENT_REQUEST":
      return {
        id: message.id,
        kind: "documents",
        outgoing: message.sender === "LENDER",
        sentAt: message.sentAt,
        documents: message.documents,
      };
    case "EXIT":
      return {
        id: message.id,
        kind: "exit",
        outgoing: true,
        sentAt: message.sentAt,
      };
  }
};

const MESSAGE_KIND: Record<MessageResponse["kind"], Message["kind"]> = {
  OFFER: "offer",
  DOCUMENT_REQUEST: "documents",
  EXIT: "exit",
};

const fromConversation = ({
  trade,
  ...conversation
}: ConversationResponse): Conversation => {
  const messages = conversation.messages.map(fromMessage);
  return {
    id: conversation.id,
    status: conversation.status,
    startedAt: conversation.startedAt,
    pendingOffer:
      messages.flatMap((message) =>
        message.kind === "offer" &&
        message.offer.id === conversation.pendingOfferId
          ? [message.offer]
          : [],
      )[0] ?? null,
    funding: conversation.funding ? fromFunding(conversation.funding) : null,
    opportunity: {
      id: conversation.opportunityId,
      name: trade.borrowerName,
      purpose: purposeLabel(trade.financingPurpose),
      advance: fromMinorUnits(trade.requestedAdvanceMinor),
      tenorDays: trade.tenorDays,
      expiresAt: trade.expiresAt,
    },
    messages,
  };
};

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

  async makeOffer(id: string, terms: OfferTerms): Promise<Offer> {
    return fromOffer(
      await mutation<OfferResponse>(
        `/opportunities/${id}/offers`,
        "post",
        toOffer(terms),
      ),
    );
  },

  requestDocuments(id: string, documents: string[]) {
    return mutation<DocumentRequestResponse>(
      `/opportunities/${id}/document-requests`,
      "post",
      { documents },
    );
  },
};

export const offerService = {
  withdraw(id: string) {
    return mutation(`/offers/${id}/withdrawal`, "post");
  },

  async accept(id: string): Promise<Funding> {
    return fromFunding(
      await mutation<FundingResponse>(`/offers/${id}/acceptance`, "post"),
    );
  },
};

export const fundingService = {
  async pay(id: string): Promise<Funding> {
    return fromFunding(
      await mutation<FundingResponse>(`/fundings/${id}/payment`, "post"),
    );
  },
};

export const conversationService = {
  async list(params: ConversationQuery): Promise<ConversationPage> {
    const page = await query<ConversationPageResponse>("/conversations", {
      ...params,
    });
    return {
      items: page.items.map((item) => ({
        id: item.id,
        opportunityId: item.opportunityId,
        status: item.status,
        name: item.borrowerName,
        lastMessage: item.lastMessage
          ? MESSAGE_KIND[item.lastMessage.kind]
          : null,
      })),
      nextCursor: page.nextCursor,
    };
  },

  async get(id: string): Promise<Conversation> {
    return fromConversation(
      await query<ConversationResponse>(`/conversations/${id}`),
    );
  },

  exit(id: string) {
    return mutation(`/conversations/${id}/exit`, "post");
  },
};
