"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { OnboardingShell } from "../../components/onboarding-shell";
import { roleLabel } from "../../components/roles";

const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Egypt",
  "United Kingdom",
  "United States",
];

export function OrganisationForm({ role }: { role: string }) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");

  const canSubmit = companyName.trim() !== "" && country !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    router.push(
      `/funding-mandate?role=${role}&org=${encodeURIComponent(companyName)}`,
    );
  }

  return (
    <OnboardingShell
      step={1}
      orgName={companyName.trim() || "Mycompany"}
      orgRole={roleLabel(role)}
    >
      <form
        className="flex w-full max-w-96.5 flex-col items-start gap-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-xs">
          <h1 className="font-sans text-h4 font-medium text-grey-900">
            Tell us about your organisation
          </h1>
          <p className="text-body-sm text-grey-600">
            Help us understand your organisation.
          </p>
        </div>

        <Field label="Company name" htmlFor="company-name" className="w-full">
          <Input
            id="company-name"
            placeholder="mycompany"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
          />
        </Field>

        <Field label="Country" htmlFor="country" className="w-full">
          <Select
            id="country"
            value={country}
            onValueChange={setCountry}
            placeholder="Select---"
            options={COUNTRIES}
          />
        </Field>

        <Button
          type="submit"
          variant="primary"
          size="form"
          disabled={!canSubmit}
        >
          Continue
        </Button>
      </form>
    </OnboardingShell>
  );
}
