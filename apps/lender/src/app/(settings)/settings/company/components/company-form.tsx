"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CloudUploadIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { OrgAvatar } from "@repo/ui/avatars";
import { useOrganization } from "@/hooks/use-organization";
import { COUNTRIES } from "@/utils/countries";

export function CompanyForm() {
  const { data: organization } = useOrganization();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  useEffect(() => {
    if (!organization) return;
    setName(organization.name);
    setCountry(organization.countryCode);
    setState(organization.state);
    setStreetAddress(organization.streetAddress);
  }, [organization]);

  const dirty =
    !!organization &&
    (name !== organization.name ||
      country !== organization.countryCode ||
      state !== organization.state ||
      streetAddress !== organization.streetAddress);

  return (
    <div className="flex w-158 max-w-full flex-col rounded-xl border border-grey-200 bg-white px-lg py-md">
      <div className="flex flex-col gap-lg pb-md">
        <div className="flex items-center gap-md">
          <OrgAvatar name={name} size={80} shape="square" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-2.5">
              {/* No upload endpoint yet. */}
              <Button
                variant="ghost"
                size="inline"
                leadingIcon={<HugeiconsIcon icon={CloudUploadIcon} />}
              >
                Upload logo
              </Button>
              <Badge variant="pill">Optional</Badge>
            </div>
            <p className="text-caption/[normal] text-grey-600">
              Max. image size: 5MB (JPG or PNG)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-md gap-y-lg">
          <Field label="Company name" htmlFor="company-name" variant="auth">
            <Input
              id="company-name"
              variant="strong"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field label="Country" htmlFor="country" variant="auth">
            <Select
              id="country"
              variant="strong"
              value={country}
              onValueChange={setCountry}
              options={COUNTRIES}
            />
          </Field>
          <Field label="State" htmlFor="state" variant="auth">
            <Input
              id="state"
              variant="strong"
              value={state}
              onChange={(event) => setState(event.target.value)}
            />
          </Field>
          <Field label="Street address" htmlFor="street-address" variant="auth">
            <Input
              id="street-address"
              variant="strong"
              value={streetAddress}
              onChange={(event) => setStreetAddress(event.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="py-md">
        {/* No organisation update endpoint yet. */}
        <Button size="form" disabled={!dirty}>
          Save
        </Button>
      </div>
    </div>
  );
}
