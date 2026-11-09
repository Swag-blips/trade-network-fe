import type { OnboardingData } from "../../components/onboarding-provider";

export interface CompleteOnboardingDto {
  challengeId: string;
  data: OnboardingData;
}

export interface CompleteOnboardingRequest {
  challengeId: string;
  organization: {
    name: string;
    countryCode: string;
    state: string;
    streetAddress: string;
  };
  mandate: {
    capitalAllocationKobo: number;
    minTicketKobo: number;
    maxTicketKobo: number;
    annualInterestRateBps: number;
    tenor: string;
    sectors: string[];
  };
}
