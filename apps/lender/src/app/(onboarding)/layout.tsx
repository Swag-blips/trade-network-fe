import type { ReactNode } from "react";
import { OnboardingProvider } from "./components/onboarding-provider";
import { OnboardingShell } from "./components/onboarding-shell";

/**
 * Stays a server component: the shell sits in the provider's `children` slot,
 * so its chrome renders on the server even though the provider is a client
 * component. Only the step pills and the forms ship to the browser.
 */
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
