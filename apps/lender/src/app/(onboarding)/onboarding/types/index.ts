import type { MandateTermsRequest } from "@/types/mandate";
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
    state?: string;
    streetAddress: string;
  };
  mandate: MandateTermsRequest;
}
