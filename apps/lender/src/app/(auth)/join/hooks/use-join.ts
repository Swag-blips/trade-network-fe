import { useMutation, useQuery } from "@tanstack/react-query";
import { mutation } from "@/api/client";
import type {
  InvitationChallenge,
  InvitationPreview,
  VerifyInvitationResult,
} from "../types";

export function useInvitationPreview(token: string | null) {
  return useQuery({
    queryKey: ["join", "preview"],
    queryFn: () =>
      mutation<InvitationPreview>("/auth/invitation/preview", "post", {
        token,
      }),
    enabled: token !== null,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useStartInvitation() {
  return useMutation({
    mutationFn: (token: string) =>
      mutation<{ challengeId: string }>("/auth/invitation", "post", { token }),
  });
}

export function useResendInvitationCode() {
  return useMutation({
    mutationFn: (challengeId: string) =>
      mutation("/auth/invitation/resend", "post", { challengeId }),
  });
}

export function useVerifyInvitation() {
  return useMutation({
    mutationFn: (fields: InvitationChallenge & { code: string }) =>
      mutation<VerifyInvitationResult>(
        "/auth/invitation/verify",
        "post",
        fields,
      ),
  });
}

export function useJoinAsMember() {
  return useMutation({
    mutationFn: (
      fields: InvitationChallenge & { firstName: string; lastName: string },
    ) => mutation("/onboarding/member", "post", fields),
  });
}
