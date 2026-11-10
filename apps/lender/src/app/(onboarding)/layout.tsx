import type { ReactNode } from "react";
import { OnboardingProvider } from "./components/onboarding-provider";
import { OnboardingShell } from "./components/onboarding-shell";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <OnboardingProvider>
      <OnboardingShell>{children}</OnboardingShell>
    </OnboardingProvider>
  );
}
