"use client";

import { STEP_COUNT, useOnboarding } from "./onboarding-provider";

export function StepCount() {
  const { step } = useOnboarding();

  return (
    <p className="text-body-sm whitespace-nowrap text-grey-600">
      Step <span className="text-grey-800">{step}</span> of {STEP_COUNT}
    </p>
  );
}

export function StepProgress() {
  const { step } = useOnboarding();

  return (
    <div
      role="progressbar"
      aria-label="Onboarding progress"
      aria-valuemin={0}
      aria-valuemax={STEP_COUNT}
      aria-valuenow={step}
      className="h-1 flex-none bg-evergreen-100"
    >
      <div
        className="h-full bg-evergreen-500"
        style={{ width: `${(step / STEP_COUNT) * 100}%` }}
      />
    </div>
  );
}
