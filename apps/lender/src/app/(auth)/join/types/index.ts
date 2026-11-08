export interface InvitationPreview {
  email: string;
  organizationName: string;
  roleName: string;
  /** Null once the inviter's account is gone. */
  invitedByName: string | null;
  expiresAt: string;
}

export type VerifyInvitationResult =
  | { onboardingRequired: false; expiresAt: string }
  | { onboardingRequired: true };

export interface InvitationChallenge {
  token: string;
  challengeId: string;
}
