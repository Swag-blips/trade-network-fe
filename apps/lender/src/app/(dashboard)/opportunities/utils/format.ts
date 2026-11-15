import { compactAmount, formatAmount } from "@/utils/naira";
import type { MatchLevel } from "../types/opportunity";

export const fullNaira = (value: number) => `NGN ${formatAmount(value)}`;

export const compactNaira = (value: number) => `NGN ${compactAmount(value)}`;

export const nairaSuffix = (value: number) => `${formatAmount(value)} NGN`;

export const clockTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

/** "23h : 05m left". */
export function timeLeft(ms: number) {
  const minutes = Math.ceil(ms / 60_000);
  const hours = Math.floor(minutes / 60);
  return `${hours}h : ${String(minutes % 60).padStart(2, "0")}m left`;
}

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
