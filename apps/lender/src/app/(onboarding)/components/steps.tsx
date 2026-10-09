"use client";

import { STEP_COUNT, useOnboarding } from "./onboarding-provider";

/** The only part of the shell that needs state, so the only part that ships. */
export function Steps() {
  const { step: current } = useOnboarding();

  return (
    <div className="flex items-center gap-xs">
      <p className="text-body text-grey-500">Steps:</p>
      {Array.from({ length: STEP_COUNT }, (_, index) => index + 1).map(
        (step) => (
          <span
            key={step}
            aria-current={step === current ? "step" : undefined}
            className={`flex min-w-7 items-center justify-center rounded-md border px-xs text-body ${
              step === current
                ? "border-evergreen-600 bg-evergreen-100 text-evergreen-600"
                : "border-grey-100 bg-white text-grey-800 shadow-small-thick"
            }`}
          >
            {step}
          </span>
        ),
      )}
    </div>
  );
}
