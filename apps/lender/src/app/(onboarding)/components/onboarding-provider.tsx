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
  state: string;
  streetAddress: string;
  capitalAllocation: string;
  interestRate: string;
  tenor: string;
  fundingMin: number;
  fundingMax: number;
  sectors: string[];
}

export type OnboardingErrors = Partial<Record<keyof OnboardingData, string>>;

const INITIAL: OnboardingData = {
  companyName: "",
  countryCode: "",
  state: "",
  streetAddress: "",
  capitalAllocation: "",
  interestRate: "",
  tenor: "",
  fundingMin: 0,
  fundingMax: 50_000_000,
  sectors: [],
};

/** What session storage holds — everything optional, it is last session's shape. */
interface StoredProgress {
  step?: number;
  data?: Partial<OnboardingData>;
}

interface OnboardingValue {
  step: number;
  next: () => void;
  back: () => void;
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  errors: OnboardingErrors;
  setErrors: (errors: OnboardingErrors) => void;
  /** Held apart from `data`: a File can't survive the session-storage mirror. */
  logo: File | null;
  setLogo: (logo: File | null) => void;
}

const OnboardingContext = createContext<OnboardingValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL);
  const [errors, setErrors] = useState<OnboardingErrors>({});
  const [logo, setLogo] = useState<File | null>(null);
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

  function back() {
    setStep((current) => Math.max(current - 1, 1));
  }

  function update(patch: Partial<OnboardingData>) {
    setData((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const remaining = { ...current };
      for (const field of Object.keys(patch)) {
        delete remaining[field as keyof OnboardingData];
      }
      return remaining;
    });
  }

  return (
    <OnboardingContext.Provider
      value={{
        step,
        next,
        back,
        data,
        update,
        errors,
        setErrors,
        logo,
        setLogo,
      }}
    >
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
