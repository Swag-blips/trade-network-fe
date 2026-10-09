"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  readOnboardingProgress,
  saveOnboardingProgress,
} from "@/lib/onboarding-storage";

export const STEP_COUNT = 2;

export interface OnboardingData {
  companyName: string;
  countryCode: string;
  capitalAllocation: string;
  tenor: string;
  fundingType: string;
  fundingMin: number;
  fundingMax: number;
  sectors: string[];
}

const INITIAL: OnboardingData = {
  companyName: "",
  countryCode: "",
  capitalAllocation: "700,000,000",
  tenor: "30-90 days",
  fundingType: "Any",
  fundingMin: 8_000_000,
  fundingMax: 50_000_000,
  sectors: ["Manufacturing", "Agriculture", "Healthcare", "Technology"],
};

/** What session storage holds — everything optional, it is last session's shape. */
interface StoredProgress {
  step?: number;
  data?: Partial<OnboardingData>;
}

interface OnboardingValue {
  step: number;
  next: () => void;
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}

const OnboardingContext = createContext<OnboardingValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    // Merged over the defaults, never assigned wholesale: a record written
    // before a field existed would otherwise restore that field as undefined,
    // and the step would hand an uncontrolled value to its inputs.
    const saved = readOnboardingProgress<StoredProgress>();

    if (saved) {
      if (saved.step) {
        setStep(Math.min(Math.max(saved.step, 1), STEP_COUNT));
      }
      setData((current) => ({ ...current, ...saved.data }));
    }

    setRestored(true);
  }, []);

  useEffect(() => {
    console.log("DATA IN EFFECT", data);
    if (restored) saveOnboardingProgress({ step, data });
  }, [restored, step, data]);

  function next() {
    setStep((current) => Math.min(current + 1, STEP_COUNT));
  }

  function update(patch: Partial<OnboardingData>) {
    setData((current) => ({ ...current, ...patch }));
  }
  return (
    <OnboardingContext.Provider value={{ step, next, data, update }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used inside <OnboardingProvider>");
  }

  return context;
}
