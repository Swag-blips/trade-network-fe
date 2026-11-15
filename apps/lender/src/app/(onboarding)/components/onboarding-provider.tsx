"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useFieldErrors } from "@/hooks/use-field-errors";
import {
  readOnboardingProgress,
  saveOnboardingProgress,
} from "@/lib/onboarding-storage";
import {
  changedMandateFields,
  MANDATE_FIELD,
  MANDATE_FIELDS,
} from "@/utils/mandate-options";

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
  /** Held apart from `data`: a File can't survive the session-storage mirror. */
  logo: File | null;
  setLogo: (logo: File | null) => void;
  /** A 422's messages, keyed by pointer path (`organization/name`, `mandate/tenor`). */
  errors: Partial<Record<OnboardingField, string>>;
  showErrors: (error: unknown) => void;
}

const ORGANIZATION_FIELD = {
  companyName: "organization/name",
  countryCode: "organization/countryCode",
  state: "organization/state",
  streetAddress: "organization/streetAddress",
} as const;

const FIELDS = [
  ...Object.values(ORGANIZATION_FIELD),
  ...MANDATE_FIELDS.map((field) => `mandate/${field}` as const),
];

type OnboardingField = (typeof FIELDS)[number];

function changedFields(patch: Partial<OnboardingData>): OnboardingField[] {
  const organization = (
    Object.keys(patch) as (keyof typeof ORGANIZATION_FIELD)[]
  )
    .filter((key) => key in ORGANIZATION_FIELD)
    .map((key) => ORGANIZATION_FIELD[key]);
  const mandate = changedMandateFields(
    Object.fromEntries(
      Object.entries(patch).filter(([key]) => key in MANDATE_FIELD),
    ),
  ).map((field) => `mandate/${field}` as const);

  return [
    ...organization,
    ...mandate,
    ...("countryCode" in patch ? [ORGANIZATION_FIELD.state] : []),
  ];
}

const OnboardingContext = createContext<OnboardingValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL);
  const [logo, setLogo] = useState<File | null>(null);
  const [restored, setRestored] = useState(false);
  const fieldErrors = useFieldErrors(FIELDS);

  
  useEffect(() => {
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
    changedFields(patch).forEach(fieldErrors.clear);
  }

  return (
    <OnboardingContext.Provider
      value={{
        step,
        next,
        back,
        data,
        update,
        logo,
        setLogo,
        errors: fieldErrors.errors,
        showErrors: fieldErrors.show,
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
