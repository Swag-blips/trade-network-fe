import { compactAmount } from "@/utils/naira";
import type { OfferTerms } from "../types/inbox";
import type { MatchLevel } from "../types/opportunity";

export const fullNaira = (value: number) =>
  `NGN ${Math.round(value).toLocaleString("en-NG")}`;

export const compactNaira = (value: number) => `NGN ${compactAmount(value)}`;

export const nairaSuffix = (value: number) =>
  `${Math.round(value).toLocaleString("en-NG")} NGN`;

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export const clockTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

export const interestOf = ({ amount, ratePercent }: OfferTerms) =>
  (amount * ratePercent) / 100;

export const MATCH: Record<
  MatchLevel,
  { label: string; chip: string; text: string }
> = {
  STRONG: {
    label: "Strong match",
    chip: "bg-green-400",
    text: "text-green-500",
  },
  MODERATE: {
    label: "Moderate match",
    chip: "bg-ochre-700",
    text: "text-ochre-800",
  },
  WEAK: {
    label: "Weak match",
    chip: "bg-red-error-400",
    text: "text-red-error-500",
  },
};
