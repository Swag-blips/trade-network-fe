import { mutation } from "@/api/client";
import {
  parseAllocation,
  toBps,
  toMinorUnits,
  toSectorCode,
  toTenorCode,
} from "@/utils/mandate-options";
import type {
  CompleteOnboardingDto,
  CompleteOnboardingRequest,
} from "../types";

function toRequest({
  challengeId,
  data,
}: CompleteOnboardingDto): CompleteOnboardingRequest {
  return {
    challengeId,
    organization: {
      name: data.companyName,
      countryCode: data.countryCode,
      state: data.state,
      streetAddress: data.streetAddress,
    },
    mandate: {
      currency: "NGN",
      capitalAllocationMinor: toMinorUnits(parseAllocation(data.capitalAllocation)),
      minTicketMinor: toMinorUnits(data.fundingMin),
      maxTicketMinor: toMinorUnits(data.fundingMax),
      annualInterestRateBps: toBps(Number(data.interestRate)),
      tenor: toTenorCode(data.tenor),
      sectors: data.sectors.map(toSectorCode),
    },
  };
}

export const onboardingService = {
  complete(fields: CompleteOnboardingDto) {
    return mutation("/onboarding/lender", "post", toRequest(fields));
  },
};
