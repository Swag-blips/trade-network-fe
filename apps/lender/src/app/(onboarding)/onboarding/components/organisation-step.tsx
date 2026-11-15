"use client";

import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { useOnboarding } from "../../components/onboarding-provider";
import {
  COUNTRIES,
  hasState,
  isNigerianState,
  NIGERIAN_STATES,
} from "@/utils/countries";
import { LogoUpload } from "./logo-upload";
import { StepFrame } from "./step-frame";

export function OrganisationStep() {
  const { data, update, next, errors } = useOnboarding();
  const withState = hasState(data.countryCode);

  const canSubmit =
    data.companyName.trim() !== "" &&
    data.countryCode !== "" &&
    (!withState || isNigerianState(data.state)) &&
    data.streetAddress.trim() !== "";

  return (
    <StepFrame
      title="Tell us about your organisation"
      submitLabel="Continue"
      canSubmit={canSubmit}
      onSubmit={next}
    >
      <LogoUpload />

      <div className="grid gap-x-md gap-y-5.5 sm:grid-cols-2">
        <Field
          label="Company name"
          htmlFor="company-name"
          variant="auth"
          error={errors["organization/name"]}
        >
          <Input
            id="company-name"
            variant="auth"
            placeholder="OmniPay"
            value={data.companyName}
            onChange={(event) => update({ companyName: event.target.value })}
          />
        </Field>
        <Field
          label="Country"
          htmlFor="country"
          variant="auth"
          error={errors["organization/countryCode"]}
        >
          <Select
            id="country"
            variant="auth"
            value={data.countryCode}
            onValueChange={(countryCode) => update({ countryCode })}
            placeholder="Select country"
            options={COUNTRIES}
          />
        </Field>
        {withState ? (
          <Field
            label="State"
            htmlFor="state"
            variant="auth"
            error={errors["organization/state"]}
          >
            <Select
              id="state"
              variant="auth"
              value={data.state}
              onValueChange={(state) => update({ state })}
              placeholder="Select state"
              options={NIGERIAN_STATES}
            />
          </Field>
        ) : null}
        <Field
          label="Street address"
          htmlFor="street-address"
          variant="auth"
          error={errors["organization/streetAddress"]}
        >
          <Input
            id="street-address"
            variant="auth"
            placeholder="Enter address"
            value={data.streetAddress}
            onChange={(event) => update({ streetAddress: event.target.value })}
          />
        </Field>
      </div>
    </StepFrame>
  );
}
