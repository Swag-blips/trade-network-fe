/** `GET /capital`, in kobo. */
export interface CapitalResponse {
  currency: "NGN";
  allocationMinor: number;
  availableMinor: number;
  deployedMinor: number;
  outstandingMinor: number;
}

/** The home figures, in naira. */
export interface Capital {
  allocation: number;
  available: number;
  deployed: number;
  outstanding: number;
}
