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
