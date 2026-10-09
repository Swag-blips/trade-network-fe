"use client";

import { useOnboarding } from "../components/onboarding-provider";
import { OrganisationStep } from "./components/organisation-step";
import { FundingMandateStep } from "./components/funding-mandate-step";

export default function OnboardingPage() {
  const { step } = useOnboarding();

  return step === 1 ? <OrganisationStep /> : <FundingMandateStep />;
}
