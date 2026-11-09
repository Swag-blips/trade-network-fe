/** `GET /mandate` returns this, and `PUT /mandate` takes the same shape back. */
export interface Mandate {
  capitalAllocation: number;
  /** Annual, as a percentage: `8` is 8%. */
  interestRate: number;
  tenor: string;
  fundingType: string;
  fundingMin: number;
  fundingMax: number;
  businessSectors: string[];
}
