"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { BrandMark } from "@repo/ui/brand-mark";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { useToast } from "@repo/ui/toast";
import { saveOnboarding } from "@/lib/onboarding-storage";
import { useCreateAccount } from "../hooks/use-create-account";
import { AuthCard } from "../../components/auth-card";

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
        onSuccess: ({ challengeId }) => {
          saveOnboarding({ challengeId, firstName });
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        },
      },
    );
  }

  return (
    <AuthCard width="md" className="items-center">
      <div className="flex w-full flex-col items-start gap-xl">
        {/* 42.146px is a sub-pixel Figma export; 32px (h-8) is the clean side. */}
        <BrandMark className="h-8 w-[42.146px] text-evergreen-900" />

        <div className="flex w-full flex-col items-center gap-lg">
          <div className="flex w-full flex-col items-start gap-xs">
            {/* 32px is off the type scale (h2 is 36px) — matches the Figma comp verbatim. */}
            <p className="w-full font-brand text-[32px] leading-[1.15] font-medium text-grey-900">
              Create your account
            </p>
            <p className="w-full text-body text-grey-600">
              Welcome to TradeNetwork, let&rsquo;s get you started.
            </p>
          </div>

          <form
            className="flex w-full flex-col items-start gap-lg"
            onSubmit={handleSubmit}
          >
            <div className="flex w-full items-start gap-md">
              <Field
                label="First name"
                htmlFor="first-name"
                variant="auth"
                className="flex-1"
              >
                <Input
                  id="first-name"
                  variant="auth"
                  placeholder="John"
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
                  variant="auth"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </Field>
            </div>

            <Field
              label="Company email"
              htmlFor="email"
              variant="auth"
              className="w-full"
            >
              <Input
                id="email"
                type="email"
                variant="auth"
                placeholder="John@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>

            <div className="flex w-full flex-col items-start gap-md">
              <label className="flex w-full items-center gap-md">
                <span className="relative flex-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      if (event.target.checked) setConsentError(false);
                    }}
                    className="peer sr-only border border-grey-400"
                  />
                  <span
                    className={`flex size-4.5 items-center justify-center rounded-[3.6px] border-[1.35px] transition-colors motion-reduce:transition-none ${
                      consent
                        ? "border-evergreen-600 bg-evergreen-600 text-white"
                        : consentError
                          ? "border-red-error-500 text-transparent"
                          : "border-grey-400 bg-white text-transparent"
                    } peer-focus-visible:outline-2 peer-focus-visible:outline-evergreen-600 peer-focus-visible:outline-offset-2`}
                  >
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={12}
                      strokeWidth={3}
                    />
                  </span>
                </span>
                <span className="flex-1 text-body-sm/[1.5] text-grey-600">
                  I consent to TradeNetwork&rsquo;s{" "}
                  <a
                    href="/ecosystem-participation-agreement"
                    className="text-grey-800 underline decoration-from-font [text-underline-position:from-font]"
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
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthCard>
  );
}
