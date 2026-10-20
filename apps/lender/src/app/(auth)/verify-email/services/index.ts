import { mutationResponse, queryResponse } from "@/api/client";
import type {
  LoginSessionData,
  ValidateLoginOtpDto,
  ValidateOtpData,
  ValidateOtpDto,
  ValidateOtpRequest,
} from "../types";

export const verifyEmailService = {
  validateOtp({ onboardUid, otp }: ValidateOtpDto) {
    const body: ValidateOtpRequest = { onboardUid, onboardOTP: otp };

    return mutationResponse<ValidateOtpData>(
      "/onboard/signup/validate/otp",
      "post",
      body,
    );
  },

  validateLoginOtp(fields: ValidateLoginOtpDto) {
    return mutationResponse<LoginSessionData>(
      "/access/login/validate/otp",
      "post",
      fields,
    );
  },

  /** Re-issues the sign-up code; the onboardUid survives, so nothing is restored. */
  resendSignupOtp(onboardUid: string) {
    return queryResponse<null>(`/onboard/signup/resend/otp/${onboardUid}`);
  },

  /** Throttled to one a minute by the service. */
  resendLoginOtp(sessionToken: string) {
    return mutationResponse<null>(`/access/otp/resend/${sessionToken}`, "post");
  },
};
