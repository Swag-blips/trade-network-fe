export type AccountType = "LENDER" | "BORROWER";

export interface CreateAccountDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface SignUpRequest {
  emailAddress: string;
  firstName: string;
  lastName: string;
  companyEmailAddress: string;
  accountType?: AccountType;
}

/** The endpoint returns the whole pending profile back; the uid is all we need from it. */
export interface CreateAccountData {
  onboardUid: string;
}
