import type { OnboardingSession } from "@/lib/onboarding-storage";
import type { OnboardingData } from "../../components/onboarding-provider";

/** What the step has to hand when the mandate is done. */
export interface CompleteOnboardingDto {
  session: OnboardingSession;
  data: OnboardingData;
}

/** The subset of `SignUpDto` this flow collects; the rest is already on the record. */
export interface CompleteOnboardingRequest {
  accountType: "LENDER";
  companyName: string;
  countryName: string;
  countryCode: string;
  capitalAllocation: number;
  tenor: string;
  fundingType: string;
  fundingMin: number;
  fundingMax: number;
  businessSectors: string[];
}

/** The new business profile; its uid is all we read. */
export interface CompleteOnboardingData {
  profileUid: string;
}
