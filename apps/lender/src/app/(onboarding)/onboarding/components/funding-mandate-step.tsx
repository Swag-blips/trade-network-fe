"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/toast";
import { clearOnboarding, readChallengeId } from "@/lib/onboarding-storage";
import { MandateFields } from "@/components/mandate-fields";
import { isCompleteMandate, MANDATE_FIELDS } from "@/utils/mandate-options";
import { useOnboarding } from "../../components/onboarding-provider";
import { useCompleteOnboarding } from "../hooks/use-complete-onboarding";
import { StepFrame } from "./step-frame";

export function FundingMandateStep() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, update, back, errors } = useOnboarding();
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();
  // Stays loading until /home has loaded: a second submit would get a 409.
  const [navigating, startNavigation] = useTransition();
  const canSubmit = isCompleteMandate(data);

  function handleDone() {
    const challengeId = readChallengeId();

    if (!challengeId) {
      toast({
        message: "We've lost track of that sign-up. Please log in again.",
        state: "error",
      });
      router.push("/login");
      return;
    }

    completeOnboarding(
      { challengeId, data },
      {
        onSuccess: () => {
          clearOnboarding();
          startNavigation(() => router.push("/home"));
        },
      },
    );
  }

  return (
    <StepFrame
      title="Set your financing preference"
      submitLabel="Done"
      canSubmit={canSubmit}
      loading={isPending || navigating}
      onBack={back}
      onSubmit={handleDone}
      raisedFooter
    >
      <MandateFields
        value={data}
        onChange={update}
        errors={Object.fromEntries(
          MANDATE_FIELDS.map((field) => [field, errors[`mandate/${field}`]]),
        )}
      />
    </StepFrame>
  );
}
