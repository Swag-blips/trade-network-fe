export type Currency = "NGN";

export interface MandateResponse {
  id: string;
  currency: Currency;
  capitalAllocationMinor: number;
  minTicketMinor: number;
  maxTicketMinor: number;
  annualInterestRateBps: number;
  tenor: string;
  fundingType: string;
  sectors: string[];
  /** When the mandate can change again; `null` means it can change now. */
  nextChangeAt: string | null;
}

/** `PUT /mandate` replaces the whole mandate, so every field goes back. */
export type MandateRequest = Omit<MandateResponse, "id" | "nextChangeAt">;

export interface Mandate {
  capitalAllocation: number;
  /** Annual, as a percentage: `8` is 8%. */
  interestRate: number;
  tenor: string;
  fundingType: string;
  fundingMin: number;
  fundingMax: number;
  businessSectors: string[];
  nextChangeAt: string | null;
}

export interface MandateDraft {
  capitalAllocation: string;
  interestRate: string;
  tenor: string;
  fundingMin: number;
  fundingMax: number;
  sectors: string[];
}
