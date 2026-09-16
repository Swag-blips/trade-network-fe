"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { UserAvatar } from "@/components/avatars";
import { SettingsPage, SectionHeading } from "../../components/settings-page";
import { UploadRow } from "../../components/upload-row";

export default function ProfileSettingsPage() {
  const [firstName, setFirstName] = useState("Shile");
  const [lastName, setLastName] = useState("Owoka");
  const [email, setEmail] = useState("ceo@hoptool.co");
  const dirty = false;

  return (
    <SettingsPage title="My profile">
      <div className="flex max-w-158 flex-col gap-lg">
        <SectionHeading
          title="Profile details"
          description="Edit your account profile details."
        />

        <UploadRow
          label="Profile photo"
          action="Upload photo"
          hint="Max. image size: 5MB (JPG or PNG)"
          preview={<UserAvatar name={firstName} size={64} />}
        />

        <div className="flex gap-md">
          <Field
            label="First name"
            required
            htmlFor="first-name"
            className="flex-1"
          >
            <Input
              id="first-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Field>
          <Field
            label="Last name"
            required
            htmlFor="last-name"
            className="flex-1"
          >
            <Input
              id="last-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Email address"
          required
          htmlFor="email"
          className="w-tour-card"
        >
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
