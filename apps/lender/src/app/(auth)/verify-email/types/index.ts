export interface ValidateOtpRequest {
  onboardUid: string;
  onboardOTP: string;
}

export interface ValidateOtpDto {
  onboardUid: string;
  otp: string;
}

/** The success payload is unobserved — the envelope's status is the result. */
export type ValidateOtpData = unknown;
