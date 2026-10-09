import { mutationResponse } from "@/api/client";
import type {
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
};
