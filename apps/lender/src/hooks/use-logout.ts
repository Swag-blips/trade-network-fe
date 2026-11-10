import { useMutation } from "@tanstack/react-query";
import { useToast } from "@repo/ui/toast";
import { extractErrorMessage, mutation } from "@/api/client";

export function useLogout() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => mutation("/auth/logout", "post"),
    // A hard navigation drops the cached profile, org and mandate with the session.
    onSuccess: () => window.location.assign("/login"),
    onError: (error) =>
      toast({
        message: extractErrorMessage(
          error,
          "We couldn't sign you out. Please try again.",
        ),
        state: "error",
      }),
  });
}
