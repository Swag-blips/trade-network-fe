"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { useToast } from "@repo/ui/toast";
import { GoogleIcon } from "@repo/ui/icons/google-icon";
import { saveOnboarding } from "@/lib/onboarding-storage";
import { useCreateAccount } from "../hooks/use-create-account";

export function CreateAccountForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const { mutate: createAccount, isPending } = useCreateAccount();

  const fieldsFilled =
    firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "";

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (!consent) {
      setConsentError(true);
      toast({
        message:
          "Please consent to the TradeNetwork Ecosystem Participation Agreement to continue",
        state: "error",
      });
      return;
    }

    createAccount(
      { email, firstName, lastName },
      {
        onSuccess: ({ onboardUid }) => {
          saveOnboarding({ onboardUid, firstName });
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        },
      },
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-lg">
      <p className="w-full text-center font-brand text-[32px] leading-normal font-medium text-grey-900">
        Welcome to TradeNetwork
      </p>

      <Button
        variant="tertiary"
        size="auth"
        className="w-full"
        leadingIcon={<GoogleIcon className="size-5" />}
      >
        Continue with Google
      </Button>

      <p className="text-caption font-medium tracking-[0.24px] text-grey-500 uppercase">
        Or
      </p>

      <form
        className="flex w-full flex-col items-start gap-md"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full items-start gap-md">
          <Field label="First name" htmlFor="first-name" className="flex-1">
            <Input
              id="first-name"
              placeholder="John"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Field>
          <Field label="Last name" htmlFor="last-name" className="flex-1">
            <Input
              id="last-name"
              placeholder="Doe"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </Field>
        </div>

        <Field label="Company email" htmlFor="email" className="w-full">
          <Input
            id="email"
            type="email"
            placeholder="john@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <label className="flex w-full items-center gap-md">
          <span className="relative flex-none">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                if (event.target.checked) setConsentError(false);
              }}
              className="peer sr-only"
            />
            <span
              className={`flex size-4.5 items-center justify-center rounded-[3.6px] border transition-colors motion-reduce:transition-none ${
                consent
                  ? "border-evergreen-600 bg-evergreen-600 text-white"
                  : consentError
                    ? "border-red-error-500 text-transparent"
                    : "border-grey-400 bg-white text-transparent"
              } peer-focus-visible:outline-2 peer-focus-visible:outline-evergreen-600 peer-focus-visible:outline-offset-2`}
            >
              <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={3} />
            </span>
          </span>
          <span className="flex-1 text-body-sm/[1.5] text-grey-600">
            I consent to TradeNetwork&rsquo;s{" "}
            <a
              href="/ecosystem-participation-agreement"
              className="text-grey-800 underline decoration-solid underline-offset-2"
            >
              Ecosystem Participation Agreement.
            </a>
          </span>
        </label>

        <Button
          type="submit"
          variant="primary"
          size="auth"
          loading={isPending}
          disabled={!fieldsFilled}
          className="w-full"
        >
          Continue with email
        </Button>
      </form>
    </div>
  );
}
