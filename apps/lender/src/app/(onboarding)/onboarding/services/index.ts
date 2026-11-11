import { mutation } from "@/api/client";
import { toTermsRequest } from "@/services/mandate";
import { fromDraft } from "@/utils/mandate-options";
import type {
  CompleteOnboardingDto,
  CompleteOnboardingRequest,
} from "../types";

function toRequest({
  challengeId,
  data,
}: CompleteOnboardingDto): CompleteOnboardingRequest {
  return {
    challengeId,
    organization: {
      name: data.companyName,
      countryCode: data.countryCode,
      state: data.state,
      streetAddress: data.streetAddress,
    },
    mandate: toTermsRequest(fromDraft(data)),
  };
}

export const onboardingService = {
  complete(fields: CompleteOnboardingDto) {
    return mutation("/onboarding/lender", "post", toRequest(fields));
  },
};
