export interface Organization {
  id: string;
  kind: "LENDER" | "BUSINESS";
  name: string;
  /** ISO 3166-1 alpha-2, e.g. "NG". */
  countryCode: string;
  state: string;
  streetAddress: string;
  /** What the user's role may do in this organization, e.g. `opportunities:dismiss`. */
  permissions: string[];
}
