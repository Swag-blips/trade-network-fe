import { mutation, query } from "@/api/client";
import type {
  Mandate,
  MandateRequest,
  MandateResponse,
  MandateTerms,
  MandateTermsRequest,
} from "@/types/mandate";
import {
  fromBps,
  fromSectorCode,
  fromTenorCode,
  toBps,
  toSectorCode,
  toTenorCode,
} from "@/utils/mandate-options";
import { fromMinorUnits, toMinorUnits } from "@/utils/naira";

const fromResponse = (mandate: MandateResponse): Mandate => ({
  capitalAllocation: fromMinorUnits(mandate.capitalAllocationMinor),
  interestRate: fromBps(mandate.interestRateBps),
  tenor: fromTenorCode(mandate.tenor),
  fundingType: mandate.fundingType,
  fundingMin: fromMinorUnits(mandate.minTicketMinor),
  fundingMax: fromMinorUnits(mandate.maxTicketMinor),
  businessSectors: mandate.sectors.map(fromSectorCode),
  nextChangeAt: mandate.nextChangeAt,
});

/** Onboarding posts these too, inside `POST /onboarding/lender`. */
export const toTermsRequest = (terms: MandateTerms): MandateTermsRequest => ({
  currency: "NGN",
  capitalAllocationMinor: toMinorUnits(terms.capitalAllocation),
  minTicketMinor: toMinorUnits(terms.fundingMin),
  maxTicketMinor: toMinorUnits(terms.fundingMax),
  interestRateBps: toBps(terms.interestRate),
  tenor: toTenorCode(terms.tenor),
  sectors: terms.businessSectors.map(toSectorCode),
});

const toRequest = (mandate: Mandate): MandateRequest => ({
  ...toTermsRequest(mandate),
  fundingType: mandate.fundingType,
});

export const mandateService = {
  async get() {
    return fromResponse(await query<MandateResponse>("/mandate"));
  },

  async update(mandate: Mandate) {
    return fromResponse(
      await mutation<MandateResponse>("/mandate", "put", toRequest(mandate)),
    );
  },
};
