/** Every JSON response from the access service arrives in this envelope. */
export interface ApplicationResponse<T> {
  /** `ERROR` is the 500 path; anything but `SUCCESSFUL` is a failure. */
  status: "SUCCESSFUL" | "FAILED" | "ERROR";
  statusCode: string;
  statusMessage: string;
  message: string | null;
  data: T;
}

/** What list endpoints put in `data`. `page` is 1-based. */
export interface Page<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  payload: T[];
}
