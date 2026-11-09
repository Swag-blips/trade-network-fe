"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@repo/ui/brand-mark";
import { Button } from "@repo/ui/button";
import { Field } from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { saveLoginChallenge } from "@/lib/login-storage";
import { useLogin } from "../hooks/useLogin";
import { AuthCard } from "../../components/auth-card";

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
          saveLoginChallenge(response.challengeId);
          router.push(
            `/verify-email?flow=login&email=${encodeURIComponent(email)}&redirectTo=${encodeURIComponent("/home")}`,
          );
        },
      },
    );
  }

  return (
    <AuthCard width="md" className="items-center">
      <div className="flex w-full flex-col items-start gap-xl">
        <BrandMark className="h-8 w-[42.146px] text-evergreen-900" />

        <div className="flex w-full flex-col items-center gap-lg">
          <div className="flex w-full flex-col items-start gap-xs">
            {/* 32px is off the type scale (h2 is 36px) — matches the Figma comp verbatim. */}
            <p className="w-full font-brand text-[32px] leading-[1.15] font-medium text-grey-900">
              Login to TradeNetwork
            </p>
            <p className="w-full text-body text-grey-600">
              Welcome back, let&rsquo;s hop back in.
            </p>
          </div>

          <form
            className="flex w-full flex-col items-start gap-lg"
            onSubmit={handleSubmit}
          >
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
                placeholder="johnferguson@omnipay.com"
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
              Continue
            </Button>
          </form>
        </div>
      </div>
    </AuthCard>
  );
}
