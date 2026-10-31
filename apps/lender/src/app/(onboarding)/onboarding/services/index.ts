import { mutation } from "@/api/client";
import type {
  CompleteOnboardingData,
  CompleteOnboardingDto,
  CompleteOnboardingRequest,
} from "../types";
import { countryName } from "../utils/countries";

/** The allocation field is a formatted string; the service wants a number. */
const toAmount = (value: string) => Number(value.replace(/[^0-9]/g, ""));

function toRequest({ data }: CompleteOnboardingDto): CompleteOnboardingRequest {
  return {
    // Without it the business profile is saved untyped, and the lender
    // service rejects it as "not an active lender profile".
    accountType: "LENDER",
    companyName: data.companyName,
    countryName: countryName(data.countryCode),
    countryCode: data.countryCode,
    capitalAllocation: toAmount(data.capitalAllocation),
    tenor: data.tenor,
    fundingType: data.fundingType,
    fundingMin: data.fundingMin,
    fundingMax: data.fundingMax,
    businessSectors: data.sectors,
  };
}

export const onboardingService = {
  complete(fields: CompleteOnboardingDto) {
    return mutation<CompleteOnboardingData>(
      `/onboard/signup/complete/${fields.session.onboardUid}`,
      "post",
      toRequest(fields),
    );
  },
};
