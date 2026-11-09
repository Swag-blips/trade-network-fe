export interface VerifyCodeDto {
  challengeId: string;
  code: string;
}

/** A pending account still has onboarding to do, so it gets no session yet. */
export type VerifyLoginData =
  | { onboardingRequired: true; challengeId: string }
  | { onboardingRequired: false; expiresAt: string };
