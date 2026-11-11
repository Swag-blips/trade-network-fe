/** An `application/problem+json` failure. `detail` is safe to show a user. */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: { detail: string; pointer: string }[];
  [member: string]: unknown;
}
