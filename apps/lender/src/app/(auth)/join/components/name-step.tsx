"use client";

import { useState } from "react";
import { BrandMark } from "@repo/ui/brand-mark";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { useFieldErrors } from "@/hooks/use-field-errors";
import { AuthCard } from "../../components/auth-card";
import { useJoinAsMember } from "../hooks/use-join";
import type { InvitationChallenge, InvitationPreview } from "../types";

const MAX_NAME = 100;

export function NameStep({
  preview,
  challenge,
  onJoined,
  onError,
}: {
  preview: InvitationPreview;
  challenge: InvitationChallenge;
  onJoined: () => void;
  onError: (error: unknown) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { mutate: join, isPending } = useJoinAsMember();
  const fieldErrors = useFieldErrors(["firstName", "lastName"]);
  const ready = firstName.trim() !== "" && lastName.trim() !== "";
  const inviter = preview.invitedByName;

  return (
    <AuthCard width="lg" className="items-center">
      <div className="flex w-full flex-col items-start gap-xl">
        <BrandMark className="h-8 w-[42.146px] text-evergreen-900" />

        <div className="flex w-full flex-col items-center gap-lg">
          <div className="flex w-full flex-col items-start gap-xs">
            <h1 className="w-full font-brand text-[32px] leading-[1.15] font-medium text-grey-900">
              {inviter ? `${inviter} invited you!` : "You've been invited!"}
            </h1>
            <p className="w-full text-body/[1.5] text-grey-800">
              Create an account to start working
              {inviter ? ` with ${inviter}` : ""} on{" "}
              <span className="font-medium">{preview.organizationName}</span>
            </p>
          </div>

          <form
            className="flex w-full flex-col items-start gap-lg"
            onSubmit={(event) => {
              event.preventDefault();
              if (!ready || isPending) return;
              fieldErrors.reset();
              join(
                {
                  ...challenge,
                  firstName: firstName.trim(),
                  lastName: lastName.trim(),
                },
                {
                  onSuccess: onJoined,
                  onError: (error) => {
                    fieldErrors.show(error);
                    onError(error);
                  },
                },
              );
            }}
          >
            <div className="flex w-full items-start gap-md">
              <Field
                label="First name"
                htmlFor="first-name"
                variant="auth"
                className="flex-1"
                error={fieldErrors.errors.firstName}
              >
                <Input
                  id="first-name"
                  variant="auth"
                  placeholder="John"
                  autoComplete="given-name"
                  maxLength={MAX_NAME}
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    fieldErrors.clear("firstName");
                  }}
                  autoFocus
                />
              </Field>
              <Field
                label="Last name"
                htmlFor="last-name"
                variant="auth"
                className="flex-1"
                error={fieldErrors.errors.lastName}
              >
                <Input
                  id="last-name"
                  variant="auth"
                  placeholder="Doe"
                  autoComplete="family-name"
                  maxLength={MAX_NAME}
                  value={lastName}
                  onChange={(event) => {
                    setLastName(event.target.value);
                    fieldErrors.clear("lastName");
                  }}
                />
              </Field>
            </div>
            <Button
              type="submit"
              size="auth"
              loading={isPending}
              disabled={!ready || isPending}
              className="w-full"
            >
              Create account
            </Button>
          </form>
        </div>
      </div>
    </AuthCard>
  );
}
