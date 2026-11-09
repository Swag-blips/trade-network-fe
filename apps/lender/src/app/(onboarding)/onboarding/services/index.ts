import { mutation } from "@/api/client";
import type {
  CompleteOnboardingDto,
  CompleteOnboardingRequest,
} from "../types";

const TENOR_CODES: Record<string, string> = {
  "Up to 30 days": "UP_TO_30_DAYS",
  "30-90 days": "DAYS_30_TO_90",
  "90-180 days": "DAYS_90_TO_180",
  Flexible: "FLEXIBLE",
};

const toKobo = (naira: number) => Math.round(naira * 100);

const parseNaira = (value: string) => Number(value.replace(/[^0-9.]/g, ""));

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
      capitalAllocationKobo: toKobo(parseNaira(data.capitalAllocation)),
      minTicketKobo: toKobo(data.fundingMin),
      maxTicketKobo: toKobo(data.fundingMax),
      annualInterestRateBps: Math.round(Number(data.interestRate) * 100),
      tenor: TENOR_CODES[data.tenor] ?? data.tenor,
      sectors: data.sectors.map((sector) => sector.toUpperCase()),
    },
  };
}

export const onboardingService = {
  complete(fields: CompleteOnboardingDto) {
    return mutation("/onboarding/lender", "post", toRequest(fields));
  },
};
