"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@repo/ui/button";
import { Wordmark } from "@/components/wordmark";
import { BrandMark } from "@/components/brand-mark";
import { ROLE_OPTIONS } from "../../components/roles";
import { GuidelinesModal } from "./guidelines-modal";

export function RoleSelection() {
  const router = useRouter();
  const firstName = useSearchParams().get("firstName") ?? "";
  const [role, setRole] = useState<string | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);

  function goToWelcome() {
    router.push(
      `/welcome?name=${encodeURIComponent(firstName)}&role=${role}`,
    );
  }

  function handleContinue() {
    if (!role) return;
    if (role === "capital-provider") {
      setShowGuidelines(true);
      return;
    }
    goToWelcome();
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
      <div className="relative flex min-w-0 flex-1 flex-col">
        <Wordmark className="absolute top-6 left-6 h-4 w-[149px] text-evergreen-900" />

        <div className="flex flex-1 items-center justify-center px-6 py-2xl sm:px-10 lg:px-[62px]">
          <div className="flex w-full max-w-[690px] flex-col gap-xl">
            <div className="flex flex-col gap-xs">
              <h1 className="font-brand text-[32px] leading-[1.24] font-medium text-grey-900">
                How will you use TradeNetwork?
              </h1>
              <p className="text-body text-grey-800">
                Choose the role that best describes how your organisation
                participates in trade.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
              {ROLE_OPTIONS.map((option) => {
                const selected = role === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    aria-pressed={selected}
                    className={`flex flex-col items-start gap-sm rounded-lg border p-lg text-left transition-colors ${
                      selected
                        ? "border-evergreen-500 bg-evergreen-50"
                        : "border-grey-100 bg-white shadow-soft-section hover:bg-grey-50"
                    }`}
                  >
                    <div className="flex items-center gap-sm">
                      <HugeiconsIcon
                        icon={option.icon}
                        size={24}
                        className="text-grey-900"
                      />
                      <p className="font-sans text-body font-medium text-grey-900">
                        {option.label}
                      </p>
                    </div>
                    <p className="text-body-sm text-grey-600">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div>
              <Button
                variant="primary"
                size="form"
                disabled={!role}
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden h-[40vh] w-full flex-none overflow-hidden bg-evergreen-900 lg:block lg:h-screen lg:w-[437px]">
        <div className="absolute inset-x-0 top-0 h-[73%] overflow-hidden">
          <img
            src="/role-photo.png"
            alt=""
            className="size-full object-cover"
          />
        </div>
        <span
          aria-hidden
          className="absolute top-[46%] right-[-40px] h-[310px] w-[338px] bg-evergreen-300 opacity-50 [mask-image:url(/role-dot-mask.png)] [mask-position:44px_13px] [mask-repeat:no-repeat] [mask-size:286px_286px]"
        />
        <span
          aria-hidden
          className="absolute top-[75%] left-[10%] h-px w-[232px] -rotate-45 bg-linear-to-r from-transparent via-white/30 to-transparent"
        />
        <span
          aria-hidden
          className="absolute top-[60%] left-[32%] h-px w-[232px] -rotate-45 bg-linear-to-r from-transparent via-white/30 to-transparent"
        />
        <BrandMark className="absolute top-lg right-lg h-6 w-8 text-evergreen-50/90" />
        <p className="absolute bottom-2xl left-lg max-w-[280px] font-brand text-[28px] leading-[1.24] text-evergreen-50">
          One Network. Endless Trade Connections.
        </p>
      </div>

      {showGuidelines ? (
        <GuidelinesModal
          onClose={() => setShowGuidelines(false)}
          onAgree={goToWelcome}
        />
      ) : null}
    </div>
  );
}
