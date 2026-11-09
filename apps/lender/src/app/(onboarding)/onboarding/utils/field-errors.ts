import type { ProblemDetails } from "@/api/types";
import type {
  OnboardingData,
  OnboardingErrors,
} from "../../components/onboarding-provider";

const FIELD_BY_POINTER: Record<string, keyof OnboardingData> = {
  "#/organization/name": "companyName",
  "#/organization/countryCode": "countryCode",
  "#/organization/state": "state",
  "#/organization/streetAddress": "streetAddress",
  "#/mandate/capitalAllocationKobo": "capitalAllocation",
  "#/mandate/minTicketKobo": "fundingMin",
  "#/mandate/maxTicketKobo": "fundingMax",
  "#/mandate/annualInterestRateBps": "interestRate",
  "#/mandate/tenor": "tenor",
  "#/mandate/sectors": "sectors",
};

const FIRST_STEP_FIELDS: (keyof OnboardingData)[] = [
  "companyName",
  "countryCode",
  "state",
  "streetAddress",
];

export function toFieldErrors(errors: ProblemDetails["errors"] = []) {
  const fields: OnboardingErrors = {};
  let unplaced = false;

  for (const { pointer, detail } of errors) {
    const field = FIELD_BY_POINTER[pointer];

    if (field) fields[field] ??= detail;
    else unplaced = true;
  }

  return { fields, unplaced };
}

export const hasFirstStepError = (fields: OnboardingErrors) =>
  FIRST_STEP_FIELDS.some((field) => fields[field]);
