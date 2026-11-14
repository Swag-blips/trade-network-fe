import { mutation } from "@/api/client";
import type {
  Challenge,
  CodeDto,
  DeletionRequest,
  DeletionResult,
  EmailChangeDto,
} from "../types";

export const emailChangeService = {
  startStepUp() {
    return mutation<Challenge>("/auth/step-up", "post");
  },

  verifyStepUp(dto: CodeDto) {
    return mutation("/auth/step-up/verify", "post", dto);
  },

  resendStepUp(challengeId: string) {
    return mutation("/auth/step-up/resend", "post", { challengeId });
  },

  requestChange(dto: EmailChangeDto) {
    return mutation<Challenge>("/users/me/email-change", "post", dto);
  },

  confirmChange(dto: CodeDto) {
    return mutation("/users/me/email-change/confirm", "post", dto);
  },

  resendChange(challengeId: string) {
    return mutation("/users/me/email-change/resend", "post", { challengeId });
  },
};

export const accountDeletionService = {
  schedule(dto: DeletionRequest) {
    return mutation<DeletionResult>("/users/me/deletion", "post", dto);
  },

  cancel() {
    return mutation("/users/me/deletion/cancellation", "post");
  },
};
