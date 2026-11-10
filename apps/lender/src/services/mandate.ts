import { mutation, query } from "@/api/client";
import type {
  Mandate,
  MandateRequest,
  MandateResponse,
} from "@/types/mandate";
import {
  fromBps,
  fromMinorUnits,
  fromSectorCode,
  fromTenorCode,
  toBps,
  toMinorUnits,
  toSectorCode,
  toTenorCode,
} from "@/utils/mandate-options";

const fromResponse = (mandate: MandateResponse): Mandate => ({
  capitalAllocation: fromMinorUnits(mandate.capitalAllocationMinor),
  interestRate: fromBps(mandate.annualInterestRateBps),
  tenor: fromTenorCode(mandate.tenor),
  fundingType: mandate.fundingType,
  fundingMin: fromMinorUnits(mandate.minTicketMinor),
  fundingMax: fromMinorUnits(mandate.maxTicketMinor),
  businessSectors: mandate.sectors.map(fromSectorCode),
  nextChangeAt: mandate.nextChangeAt,
});

const toRequest = (mandate: Mandate): MandateRequest => ({
  currency: "NGN",
  capitalAllocationMinor: toMinorUnits(mandate.capitalAllocation),
  minTicketMinor: toMinorUnits(mandate.fundingMin),
  maxTicketMinor: toMinorUnits(mandate.fundingMax),
  annualInterestRateBps: toBps(mandate.interestRate),
  tenor: toTenorCode(mandate.tenor),
  fundingType: mandate.fundingType,
  sectors: mandate.businessSectors.map(toSectorCode),
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
