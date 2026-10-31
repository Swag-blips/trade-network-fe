export interface DashboardProfile {
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  profileUid: string;
  /** The organisation's name, e.g. "Brainbit Trading Ltd". */
  profileName: string;
  companyLogo: string | null;
  accountType: "LENDER";
}

/** `GET /dashboard/new-for-you` — counts of things waiting on the lender. */
export interface NewForYou {
  fundingOpportunities: number;
}
