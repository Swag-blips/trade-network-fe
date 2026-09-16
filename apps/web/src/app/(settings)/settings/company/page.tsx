"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { OrgAvatar } from "@/components/avatars";
import { SettingsPage, SectionHeading } from "../../components/settings-page";
import { UploadRow } from "../../components/upload-row";

const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
];

export default function CompanySettingsPage() {
  const [name, setName] = useState("Owoka Investment Limited");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const dirty = false;

  return (
    <SettingsPage title="Company details">
      <div className="flex max-w-158 flex-col gap-lg">
        <SectionHeading
          title="About details"
          description="Edit your company details."
        />

        <UploadRow
          label="Company Logo"
          action="Upload logo"
          hint="Max. image size: 5MB (JPG or PNG)"
          preview={<OrgAvatar name={name} size={64} />}
        />

        <div className="flex gap-md">
          <Field
            label="Company name"
            required
            htmlFor="company-name"
            className="flex-1"
          >
            <Input
              id="company-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field label="Website" htmlFor="website" className="flex-1">
            <Input
              id="website"
              placeholder="https:// www.company.com"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Country"
          required
          htmlFor="country"
          className="w-tour-card"
        >
          <Select
            id="country"
            value={country}
            onValueChange={setCountry}
            options={COUNTRIES}
          />
        </Field>

        <div>
          <Button size="form" disabled={!dirty}>
            Save
          </Button>
        </div>
      </div>
    </SettingsPage>
  );
}
