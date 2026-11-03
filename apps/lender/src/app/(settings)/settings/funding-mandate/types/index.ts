/** `GET /mandate` returns this, and `PUT /mandate` takes the same shape back. */
export interface Mandate {
  capitalAllocation: number;
  tenor: string;
  fundingType: string;
  fundingMin: number;
  fundingMax: number;
  businessSectors: string[];
}
