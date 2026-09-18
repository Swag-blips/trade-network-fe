"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { GoogleIcon } from "@repo/ui/icons/google-icon";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    router.push(
      `/verify-email?email=${encodeURIComponent(email)}&redirectTo=${encodeURIComponent("/home")}`,
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2xl">
      {/* 32px is off the type scale (h2 is 36px) — matches the Figma comp verbatim. */}
      <p className="w-full text-center font-brand text-[32px] leading-[1.5] font-medium text-grey-900">
        Login to TradeNetwork
      </p>

      <Button
        variant="secondary"
        size="md"
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
          size="lg"
          disabled={email.trim() === ""}
          className="w-full"
        >
          Continue with email
        </Button>
      </form>
    </div>
  );
}
