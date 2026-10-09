"use client";

import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { useOnboarding } from "../../components/onboarding-provider";
import { COUNTRIES } from "../utils/countries";

export function OrganisationStep() {
  const { data, update, next } = useOnboarding();

  const canSubmit = data.companyName.trim() !== "" && data.countryCode !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    next();
  }

  return (
    <>
      <div className="flex flex-col gap-xs">
        {/* 24px is off the type scale (h4 is 22px, h3 28px) — matches the comp verbatim. */}
        <h1 className="font-brand text-2xl/[1.24] font-medium text-grey-900">
          Tell us about your organisation
        </h1>
        <p className="text-body text-grey-800">
          Help us understand your organisation.
        </p>
      </div>

      <form
        className="flex w-full max-w-158 flex-col gap-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-md sm:flex-row">
          <Field label="Company name" htmlFor="company-name" className="flex-1">
            <Input
              id="company-name"
              placeholder="mycompany"
              value={data.companyName}
              onChange={(event) => update({ companyName: event.target.value })}
            />
          </Field>
          <Field label="Country" htmlFor="country" className="flex-1">
            <Select
              id="country"
              value={data.countryCode}
              onValueChange={(countryCode) => update({ countryCode })}
              placeholder="Select---"
              options={COUNTRIES}
            />
          </Field>
        </div>

        <div className="flex py-md">
          <Button
            type="submit"
            variant="primary"
            size="form"
            disabled={!canSubmit}
          >
            Continue
          </Button>
        </div>
      </form>
    </>
  );
}
