export interface ValidateOtpRequest {
  onboardUid: string;
  onboardOTP: string;
}

export interface ValidateOtpDto {
  onboardUid: string;
  otp: string;
}

/** Login step 2: the code, plus the handle step 1 returned. */
export interface ValidateLoginOtpDto {
  sessionToken: string;
  otp: string;
}

/** The session itself arrives as cookies; the body only dates it. */
export interface LoginSessionData {
  expires: string;
}

/** The success payload is unobserved — the envelope's status is the result. */
export type ValidateOtpData = unknown;
