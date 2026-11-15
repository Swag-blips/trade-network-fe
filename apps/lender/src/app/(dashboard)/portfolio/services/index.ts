import { mutation, query } from "@/api/client";
import { purposeLabel } from "@/utils/financing-purpose";
import { fromSectorCode } from "@/utils/mandate-options";
import { fromMinorUnits } from "@/utils/naira";
import type {
  BorrowerPageResponse,
  BorrowerQuery,
  BorrowerResponse,
  FundingResponse,
  FundingStatus,
  FundingSummaryResponse,
  InstallmentResponse,
  InstallmentStatusCode,
  PortfolioResponse,
} from "../types/api";
import type {
  Borrower,
  BorrowerPage,
  Funding,
  FundingSummary,
  InstallmentStatus,
  PortfolioSummary,
  TradeStatus,
} from "../types/portfolio";

const FUNDING_STATUS: Record<Exclude<FundingStatus, "ACTIVE">, TradeStatus> = {
  AWAITING_PAYMENT: "awaiting-payment",
  AWAITING_CONFIRMATION: "awaiting-confirmation",
  REPAID: "repaid",
  EXPIRED: "expired",
};

const tradeStatus = (status: FundingStatus, overdue: boolean): TradeStatus =>
  status === "ACTIVE"
    ? overdue
      ? "overdue"
      : "outstanding"
    : FUNDING_STATUS[status];

const INSTALLMENT_STATUS: Record<InstallmentStatusCode, InstallmentStatus> = {
  RECEIVED: "paid",
  UPCOMING: "upcoming",
  OVERDUE: "overdue",
};

const fromFundingSummary = (
  funding: FundingSummaryResponse,
): FundingSummary => ({
  id: funding.id,
  reference: funding.reference,
  status: tradeStatus(funding.status, funding.overdue),
  amount: fromMinorUnits(funding.amountMinor),
  outstanding: fromMinorUnits(funding.outstandingMinor),
  nextRepaymentAt: funding.nextRepaymentAt,
});

export const portfolioService = {
  async summary(): Promise<PortfolioSummary> {
    const portfolio = await query<PortfolioResponse>("/portfolio");
    return {
      financed: fromMinorUnits(portfolio.financedMinor),
      outstanding: fromMinorUnits(portfolio.outstandingMinor),
      activeFundings: portfolio.activeFundings,
      overdueFundings: portfolio.overdueFundings,
    };
  },

  async borrowers(params: BorrowerQuery): Promise<BorrowerPage> {
    const page = await query<BorrowerPageResponse>(
      "/portfolio/borrowers",
      params,
    );
    return {
      nextCursor: page.nextCursor,
      items: page.items.map((borrower) => ({
        id: borrower.id,
        name: borrower.name,
        industry: fromSectorCode(borrower.sector),
        activeFundings: borrower.activeFundings,
        outstanding: fromMinorUnits(borrower.outstandingMinor),
        nextRepaymentAt: borrower.nextRepaymentAt,
        overdue: borrower.overdue,
        health: borrower.overdue ? "at-risk" : "healthy",
      })),
    };
  },

  async borrower(id: string): Promise<Borrower> {
    const borrower = await query<BorrowerResponse>(
      `/portfolio/borrowers/${id}`,
    );
    const { contact } = borrower;
    return {
      id: borrower.id,
      name: borrower.name,
      industry: fromSectorCode(borrower.sector),
      health: borrower.fundings.overdue > 0 ? "at-risk" : "healthy",
      description: borrower.description,
      contact: contact
        ? {
            name: `${contact.firstName} ${contact.lastName}`.trim(),
            email: contact.email,
            phone: contact.phone,
          }
        : null,
      counterparties: [...borrower.counterparties].sort(
        (a, b) => b.trades - a.trades,
      ),
      financed: fromMinorUnits(borrower.financedMinor),
      outstanding: fromMinorUnits(borrower.outstandingMinor),
      fundings: borrower.fundings,
    };
  },

  async fundings(borrowerId: string): Promise<FundingSummary[]> {
    const { items } = await query<{ items: FundingSummaryResponse[] }>(
      "/fundings",
      { borrowerId },
    );
    return items.map(fromFundingSummary);
  },

  async funding(id: string): Promise<Funding> {
    const funding = await query<FundingResponse>(`/fundings/${id}`);
    return {
      id: funding.id,
      reference: funding.reference,
      status: tradeStatus(funding.status, funding.overdue),
      overdue: funding.overdue,
      amount: fromMinorUnits(funding.amountMinor),
      interestRate: funding.interestRateBps / 100,
      interest: fromMinorUnits(funding.interestMinor),
      repayment: fromMinorUnits(funding.repaymentMinor),
      outstanding: fromMinorUnits(funding.outstandingMinor),
      nextRepaymentAt: funding.nextRepaymentAt,
      tenorDays: funding.tenorDays,
      confirmedAt: funding.confirmedAt,
      purpose: purposeLabel(funding.trade.financingPurpose),
      invoiceNumber: funding.trade.invoiceNumber,
      borrower: funding.borrower,
      installments: [...funding.installments]
        .sort((a, b) => a.sequence - b.sequence)
        .map((installment) => ({
          id: installment.id,
          sequence: installment.sequence,
          dueAt: installment.dueAt,
          amount: fromMinorUnits(installment.amountMinor),
          status: INSTALLMENT_STATUS[installment.status],
        })),
    };
  },

  recordRepayment: (installmentId: string) =>
    mutation<InstallmentResponse>(
      `/installments/${installmentId}/receipt`,
      "post",
    ),
};
