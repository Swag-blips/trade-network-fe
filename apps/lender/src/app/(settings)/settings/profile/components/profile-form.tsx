"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CloudUploadIcon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { UserAvatar } from "@repo/ui/avatars";
import { useMe } from "@/hooks/use-me";

const DIAL_CODES = ["+234"];
const DEFAULT_PHOTO = "/settings/profile-avatar.png";

export function ProfileForm() {
  const { data: me } = useMe();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dialCode, setDialCode] = useState(DIAL_CODES[0]!);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!me) return;
    setFirstName(me.firstName);
    setLastName(me.lastName);
  }, [me]);

  const dirty =
    !!me &&
    (firstName !== me.firstName || lastName !== me.lastName || phone !== "");

  return (
    <div className="flex w-158 max-w-full flex-col rounded-xl border border-grey-200 bg-white px-lg py-md">
      <div className="flex flex-col gap-lg pb-md">
        <div className="flex items-center gap-md py-xs">
          <UserAvatar
            src={DEFAULT_PHOTO}
            name={firstName}
            size={64}
          />
          <div className="flex min-w-0 flex-1 flex-col items-start">
            {/* No upload endpoint yet. */}
            <div className="py-1.5">
              <Button
                variant="ghost"
                size="inline"
                leadingIcon={<HugeiconsIcon icon={CloudUploadIcon} />}
              >
                Upload photo
              </Button>
            </div>
            <p className="text-body-sm/[normal] text-grey-600">
              Max. image size: 5MB (JPG or PNG)
            </p>
          </div>
        </div>

        <div className="flex gap-md">
          <Field
            label="First name"
            htmlFor="first-name"
            variant="auth"
            className="flex-1"
          >
            <Input
              id="first-name"
              variant="strong"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Field>
          <Field
            label="Last name"
            htmlFor="last-name"
            variant="auth"
            className="flex-1"
          >
            <Input
              id="last-name"
              variant="strong"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Phone number"
          optional
          htmlFor="phone"
          variant="auth"
          className="w-70.75"
        >
          <div className="flex gap-xs">
            <div className="w-25.75 flex-none">
              <Select
                variant="strong"
                aria-label="Country code"
                value={dialCode}
                onValueChange={setDialCode}
                options={DIAL_CODES}
              />
            </div>
            <Input
              id="phone"
              type="tel"
              variant="auth"
              placeholder="1234567890"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
        </Field>
      </div>

      <div className="py-md">
        {/* No profile update endpoint yet. */}
        <Button size="form" disabled={!dirty}>
          Save
        </Button>
      </div>
    </div>
  );
}
