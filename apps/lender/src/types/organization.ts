export interface Organization {
  id: string;
  kind: "LENDER" | "ENTERPRISE";
  name: string;
  /** ISO 3166-1 alpha-2, e.g. "NG". */
  countryCode: string;
  state: string | null;
  streetAddress: string | null;
  /** What the user's role may do in this organization, e.g. `opportunities:dismiss`. */
  permissions: string[];
}

/** `state` only for Nigeria. */
export interface OrganizationRequest {
  name: string;
  countryCode: string;
  state?: string;
  streetAddress: string;
}
