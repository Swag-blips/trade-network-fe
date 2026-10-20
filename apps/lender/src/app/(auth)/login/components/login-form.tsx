"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { GoogleIcon } from "@repo/ui/icons/google-icon";
import { saveLoginSession } from "@/lib/login-storage";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const { mutate: login, isPending } = useLogin();

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();

    login(
      { email },
      {
        onSuccess: (response) => {
          saveLoginSession(response.data.sessionToken);
          router.push(
            `/verify-email?flow=login&email=${encodeURIComponent(email)}&redirectTo=${encodeURIComponent("/home")}`,
          );
        },
      },
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2xl">
      {/* 32px is off the type scale (h2 is 36px) — matches the Figma comp verbatim. */}
      <p className="w-full text-center font-brand text-[32px] leading-normal font-medium text-grey-900">
        Login to TradeNetwork
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
        <Field label="Company email" htmlFor="email" className="w-full">
          <Input
            id="email"
            type="email"
            placeholder="john@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Button
          type="submit"
          variant="primary"
          size="auth"
          loading={isPending}
          disabled={email.trim() === "" || isPending}
          className="w-full"
        >
          Continue with email
        </Button>
      </form>
    </div>
  );
}
