"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";

const CODE_LENGTH = 6;

export function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "your email";
  const firstName = params.get("firstName") ?? "";
  const redirectTo = params.get("redirectTo");
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");
  const canSubmit = code.length === CODE_LENGTH;

  function setDigit(index: number, value: string) {
    const char = value.slice(-1).replace(/[^0-9]/g, "");
    setDigits((current) => {
      const next = [...current];
      next[index] = char;
      return next;
    });
    if (char && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-2xl">
      <div className="flex w-full flex-col items-start gap-xs text-center">
        <p className="w-full font-brand text-h4 font-medium text-grey-900">
          Verify your identity
        </p>
        <p className="w-full text-body text-grey-800">
          We&rsquo;ve sent an email with a verification code to {email}
        </p>
      </div>

      <div className="flex flex-col items-start gap-lg">
        <div className="flex flex-col items-start gap-md">
          <div className="flex w-[308px] items-start gap-xs">
            {digits.map((digit, index) => (
              <input
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                value={digit}
                onChange={(event) => setDigit(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                inputMode="numeric"
                maxLength={1}
                className="h-10 min-w-0 flex-1 rounded-md border border-grey-300 bg-white text-center font-sans text-body-sm text-grey-900 outline-none focus:border-evergreen-600"
              />
            ))}
          </div>
          <p className="flex items-center gap-xs text-body-sm text-grey-900">
            Didn&rsquo;t receive the code?{" "}
            <button
              type="button"
              className="font-medium text-evergreen-600"
              onClick={() => setDigits(Array(CODE_LENGTH).fill(""))}
            >
              Resend code
            </button>
          </p>
        </div>

        <div className="flex flex-col items-start gap-md">
          <Button
            variant="primary"
            size="lg"
            disabled={!canSubmit}
            className="w-[308px]"
            onClick={() =>
              router.push(
                redirectTo ??
                  `/role?firstName=${encodeURIComponent(firstName)}`,
              )
            }
          >
            Continue
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-[308px]"
            leadingIcon={<HugeiconsIcon icon={ArrowLeft01Icon} />}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
