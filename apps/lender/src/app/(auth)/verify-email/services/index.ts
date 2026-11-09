import { mutation } from "@/api/client";
import type { VerifyCodeDto, VerifyLoginData } from "../types";

export const verifyEmailService = {
  verifySignup({ challengeId, code }: VerifyCodeDto) {
    return mutation("/auth/signup/verify", "post", { challengeId, code });
  },

  verifyLogin({ challengeId, code }: VerifyCodeDto) {
    return mutation<VerifyLoginData>("/auth/login/verify", "post", {
      challengeId,
      code,
    });
  },

  /** Re-issues the sign-up code; the challengeId survives, so nothing is restored. */
  resendSignupOtp(challengeId: string) {
    return mutation("/auth/signup/resend", "post", { challengeId });
  },

  resendLoginOtp(challengeId: string) {
    return mutation("/auth/login/resend", "post", { challengeId });
  },
};
